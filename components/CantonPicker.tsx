"use client";
import { CANTONS, PLANS, cantonByCode } from "@/lib/cantons";
import { img } from "@/lib/icons";
import { CANTON_AUCUN } from "@/lib/useCatalogue";

/** Choix du canton : décide du plan d'études mis en avant. */
export function CantonPicker({ value, onChange, note }: { value: string; onChange: (c: string) => void; note?: string }) {
  const c = cantonByCode(value);
  const desc = c ? c.plans.map((p) => PLANS[p].nom).join(" · ") : value === CANTON_AUCUN ? "Tout le catalogue, sans plan d’études mis en avant." : note ?? "Choisis-le pour voir d’abord les parcours de ton plan d’études.";
  return (
    <div className="daily canton">
      <div className="left">
        <img className="ico" src={img("pin")} alt="" />
        <div>
          <h3>Ton canton</h3>
          <p className="small">{desc}</p>
        </div>
      </div>
      <div className="field">
        <label htmlFor="canton" className="sr">Canton</label>
        <select id="canton" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choisir…</option>
          {[...CANTONS].sort((a, b) => a.nom.localeCompare(b.nom, "fr")).map((x) => <option key={x.code} value={x.code}>{x.nom} ({x.code})</option>)}
          <option value={CANTON_AUCUN}>Hors de Suisse / je ne sais pas</option>
        </select>
      </div>
    </div>
  );
}
