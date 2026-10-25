// Extraction fidèle du PER (portail.ciip.ch / per.ciip.ch API publique) → JSON par discipline et par cycle.
// Usage : node extract.mjs ../out
import { DOMParser } from 'linkedom';
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://per.ciip.ch/api/bdper';
const PORTAIL = 'https://portail.ciip.ch/per';
const OUT = process.argv[2] || '../out';
fs.mkdirSync(OUT, { recursive: true });

// Ordre demandé : discipline → cycle 3, 2, 1
const DISCIPLINES = [
  { id: 5, dom: 2, nom: 'Mathématiques', slug: 'mathematiques' },
  { id: 6, dom: 2, nom: 'Sciences de la nature', slug: 'sciences-nature' },
  { id: 1, dom: 1, nom: 'Français', slug: 'francais' },
  { id: 3, dom: 1, nom: 'Allemand', slug: 'allemand' },
  { id: 4, dom: 1, nom: 'Anglais', slug: 'anglais' },
  { id: 7, dom: 3, nom: 'Géographie', slug: 'geographie' },
  { id: 8, dom: 3, nom: 'Histoire', slug: 'histoire' },
  { id: 9, dom: 3, nom: 'Citoyenneté', slug: 'citoyennete' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
// Mode hors ligne si un fichier brut est fourni (3e argument), sinon téléchargement direct de l'API publique.
const RAW_PATH = process.argv[3];
const RAW = RAW_PATH && fs.existsSync(RAW_PATH) ? JSON.parse(fs.readFileSync(RAW_PATH, 'utf8')) : null;
const RAW_OUT = { domaines: {}, objectifs: {}, extrait_le: new Date().toISOString(), source: API };
async function getJSON(url) {
  if (!RAW) {
    const j = await getJSONnet(url);
    let mm;
    if ((mm = url.match(/domaines\/(\d+)$/))) RAW_OUT.domaines[mm[1]] = j;
    if ((mm = url.match(/objectifs-apprentissage\/(\d+)\/tableau$/))) RAW_OUT.objectifs[mm[1]] = j;
    await sleep(150);
    return j;
  }
  let m;
  if ((m = url.match(/domaines\/(\d+)$/))) return RAW.domaines[m[1]];
  if ((m = url.match(/objectifs-apprentissage\/(\d+)\/tableau$/))) return RAW.objectifs[m[1]];
  throw new Error('absent du fichier brut : ' + url);
}
async function getJSONnet(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
      if (r.ok) return await r.json();
      throw new Error('HTTP ' + r.status);
    } catch (e) { if (i === tries - 1) throw e; await sleep(800 * (i + 1)); }
  }
}

// ---------- HTML/MathML → texte (identique au parseur validé dans le navigateur) ----------
function mathLin(el) {
  const t = el.tagName.toLowerCase(), k = [...el.children];
  const L = e => mathLin(e);
  const wrap = s => (/^[\w,.%]+$/.test(s) || /^\(.*\)$/.test(s)) ? s : '(' + s + ')';
  if (t === 'mfrac') return wrap(L(k[0])) + '/' + wrap(L(k[1]));
  if (t === 'msqrt') return '√' + wrap(k.map(L).join(''));
  if (t === 'mroot') return '[' + L(k[1]) + ']√' + wrap(L(k[0]));
  if (t === 'msup') return L(k[0]) + '^' + wrap(L(k[1]));
  if (t === 'msub') return L(k[0]) + '_' + wrap(L(k[1]));
  if (t === 'msubsup') return L(k[0]) + '_' + wrap(L(k[1])) + '^' + wrap(L(k[2]));
  if (t === 'mover') return L(k[0]) + L(k[1]);
  if (t === 'mfenced') { const o = el.getAttribute('open') ?? '(', c = el.getAttribute('close') ?? ')'; return o + k.map(L).join(el.getAttribute('separators') ?? ',') + c; }
  if (t === 'mtable') return k.map(L).join(' ; ');
  if (t === 'mtr') return k.map(L).join(' ');
  if (t === 'br') return '\n';
  if (!k.length) return el.textContent.trim();
  // Garde aussi les nœuds texte (MathML mal fermé dans la source : le texte qui suit reste dans <math>)
  let s = '';
  el.childNodes.forEach(c => {
    if (c.nodeType === 3) { if (/\S/.test(c.textContent)) s += c.textContent.replace(/\s+/g, ' '); }
    else if (c.nodeType === 1) s += L(c);
  });
  return s;
}
const clean = s => s.replace(/ /g, ' ').replace(/[ \t\r]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();

function html2items(html) {
  html = html.replace(/<sup>([^<]*)<\/sup>/g, (m, v) => { v = v.trim(); if (/^(e|er|re|ème|ères?)$/i.test(v)) return v; return /^[\w+\-−]$|^\d+$|^-?\d+$/.test(v) ? '^' + v : '^(' + v + ')'; });
  const doc = new DOMParser().parseFromString('<html><body><div id="r">' + html + '</div></body></html>', 'text/html');
  const root = doc.getElementById('r');
  root.querySelectorAll('math').forEach(m => m.replaceWith(doc.createTextNode(' ' + mathLin(m) + ' ')));
  root.querySelectorAll('sup').forEach(s => { const v = s.textContent.trim(); s.replaceWith(doc.createTextNode(/^(e|er|re|ème|ères?)$/i.test(v) ? v : '^' + v)); });
  root.querySelectorAll('sub').forEach(s => s.replaceWith(doc.createTextNode('_' + s.textContent.trim())));
  root.querySelectorAll('br').forEach(b => b.replaceWith(doc.createTextNode('\n')));
  const BLOCK = /^(P|DIV|UL|OL|LI|H\d|TABLE|TR|TD|TH|BLOCKQUOTE)$/;
  const items = [];
  const inlineText = n => { let s = ''; n.childNodes.forEach(c => { if (c.nodeType === 3) s += c.textContent; else if (c.nodeType === 1 && !/^(UL|OL)$/.test(c.tagName)) s += inlineText(c); }); return s; };
  const walk = (node, depth, prefix) => {
    let buf = '';
    const flush = () => { const s = clean(buf).replace(/\( /g, '(').replace(/ \)/g, ')').replace(/ ,/g, ','); if (s) items.push(prefix + s); buf = ''; prefix = prefix.replace(/– $/, '  '); };
    node.childNodes.forEach(c => {
      if (c.nodeType === 3) { buf += c.textContent; return; }
      if (c.nodeType !== 1) return;
      if (!BLOCK.test(c.tagName)) { buf += inlineText(c); return; }
      flush();
      if (/^(UL|OL)$/.test(c.tagName)) { [...c.children].forEach(li => walk(li, depth + 1, '  '.repeat(depth) + '– ')); return; }
      walk(c, depth, '');
    });
    flush();
  };
  walk(root, 0, '');
  return items.map(s => s.replace(/^(\s*)– \s*/, '$1– '));
}

// "9e année" → [9] ; "1re–2es années" → [1,2]
const yearsOf = label => (label || '').replace(/<[^>]+>/g, '').match(/\d+/g)?.map(Number) || [];
const fmtY = n => n === 1 ? '1re' : n + 'e';
const fmtRange = (a, b) => a === b ? fmtY(a) : fmtY(a) + '-' + fmtY(b);

function parse(j) {
  const rows = j.tableau?.rows || [];
  const yearCols = [];
  let attHeader = '';
  const occ = [];
  let notionStack = [];
  const progressions = [], attentes = [], indicAnnees = [], reperes = [];
  rows.forEach((r, ri) => {
    occ[ri] = occ[ri] || [];
    let col = 0;
    r.cellules.forEach(c => {
      while (occ[ri][col]) col++;
      const start = col, end = col + c.colspan - 1;
      for (let rr = ri; rr < ri + c.rowspan; rr++) { occ[rr] = occ[rr] || []; for (let cc = start; cc <= end; cc++) occ[rr][cc] = true; }
      col = end + 1;
      const raw = c.contenus.map(x => x.texte).join('\n');
      if (c.type === 'en-tête') {
        const plain = raw.replace(/<[^>]+>/g, '').trim();
        if (/ann[ée]e|^\d/.test(plain) && !/Progression/.test(plain)) yearCols[start] = yearsOf(plain);
        if (/fin|l'élève/i.test(plain)) attHeader = plain;
        return;
      }
      if (c.type === 'titre') {
        const t = clean(raw.replace(/<sup>\s*([^<]*?)\s*<\/sup>/g, '$1').replace(/<[^>]+>/g, ' '));
        const nYear = yearCols.filter(Boolean).length;
        const multi = r.cellules.filter(x => x.type === 'titre').length > 1;
        // Titre limité à une partie des colonnes d'années (ex. périodes historiques par année) : repère par année
        if (multi && nYear && c.colspan < nYear && start < nYear) {
          const ys = yearCols[start] || [], ye = yearCols[end] || [];
          if (t) reperes.push({ annee: ys.length && ye.length ? fmtRange(ys[0], ye[ye.length - 1]) : 'INTROUVABLE', texte: t });
          return;
        }
        const lvl = parseInt(c.niveau || '1', 10);
        notionStack = notionStack.slice(0, lvl - 1); notionStack[lvl - 1] = t; return;
      }
      if (!c.contenus.length) return;
      const items = c.contenus.flatMap(x => html2items(x.texte));
      if (!items.length) return;
      const notion = notionStack.filter(Boolean).join(' › ');
      if (c.type === 'progression') {
        const ys = (yearCols[start] || []), ye = (yearCols[end] || []);
        const annee = ys.length && ye.length ? fmtRange(ys[0], ye[ye.length - 1]) : 'INTROUVABLE';
        progressions.push({ annee, notion, contenu: items });
      } else if (c.type === 'attente') {
        items.forEach(t => attentes.push({ notion, texte: t }));
      } else if (c.type === 'indication') {
        items.filter(t => /\b\d{1,2}\s?(e|re|ème)\b|\bann[ée]e\b/i.test(t)).forEach(t => indicAnnees.push({ notion, texte: t }));
      }
    });
  });
  const lastYear = j.cycle.annees[j.cycle.annees.length - 1].annee;
  const m = attHeader.match(/fin de la (\d+)/i);
  const fin = m ? fmtY(+m[1]) : fmtY(lastYear);
  const out = {
    code: j.code,
    axe: (j.thematiques || []).map(t => t.nom).join(', '),
    titre: j.nom,
    composantes: (j.composantes || []).map(c => c.code + '. ' + clean(c.titre)),
    progressions,
    attentes_fondamentales: attentes.map(a => ({ fin, notion: a.notion, texte: a.texte })),
  };
  if (reperes.length) out.reperes_par_annee = reperes;
  if (indicAnnees.length) out.indications_annee = indicAnnees;
  return out;
}

// ---------- run ----------
const index = [];
for (const D of DISCIPLINES) {
  const dom = await getJSON(`${API}/domaines/${D.dom}`);
  const disc = dom.disciplines.find(x => x.bdperId === D.id);
  const byCycle = { 1: [], 2: [], 3: [] };
  for (const o of disc.objectifsApprentissage) {
    const j = await getJSON(`${API}/objectifs-apprentissage/${o.bdperId}/tableau`);
    const p = parse(j);
    byCycle[o.cycle.cycle].push({ source: `${PORTAIL}/learning-objectives/${o.bdperId}`, ...p });
  }
  for (const cyc of [3, 2, 1]) {
    const data = { discipline: D.nom, cycle: cyc, source: `${PORTAIL}/disciplines/${D.id}`, objectifs: byCycle[cyc] };
    const file = `PER_${D.slug}_cycle${cyc}.json`;
    fs.writeFileSync(path.join(OUT, file), JSON.stringify(data, null, 2));
    index.push({ discipline: D.nom, cycle: cyc, fichier: file, objectifs: byCycle[cyc].map(o => o.code), progressions: byCycle[cyc].reduce((s, o) => s + o.progressions.length, 0) });
    console.log(`${D.nom} c${cyc}: ${byCycle[cyc].length} objectifs`);
  }
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ extrait_le: RAW ? RAW.extrait_le : RAW_OUT.extrait_le, source: PORTAIL, fichiers: index }, null, 2));

// ---------- précisions cantonales rattachées aux notions (ressources de type « can ») ----------
const src = RAW || RAW_OUT;
if (!RAW) fs.writeFileSync(path.join(OUT, 'PER_brut_api.json'), JSON.stringify(RAW_OUT));
const can = [];
const seen = new Map();
for (const [oid, j] of Object.entries(src.objectifs)) {
  for (const r of j.tableau?.rows || []) for (const c of r.cellules) for (const x of c.ressourceTypeRessourceInfos || []) {
    if (x.type !== 'can') continue;
    if (!seen.has(x.bdperId)) {
      try { seen.set(x.bdperId, await getJSONnet(`https://bdper.plandetudes.ch/api/v1/ressources/${x.bdperId}`, 2)); } catch { seen.set(x.bdperId, null); }
    }
    const res = seen.get(x.bdperId);
    can.push({ objectif: j.code, ressource: x.bdperId, titre: x.titre || res?.Titre || 'INTROUVABLE', canton: res?.cantons || 'INTROUVABLE', url: res?.URL || 'INTROUVABLE' });
  }
}
const uniq = [...new Map(can.map(c => [c.objectif + c.ressource, c])).values()];
fs.writeFileSync(path.join(OUT, 'PER_precisions_cantonales.json'), JSON.stringify(uniq, null, 2));
console.log('précisions cantonales :', uniq.length);
