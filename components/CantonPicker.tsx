"use client";
import { CANTONS, PLANS, cantonByCode } from "@/lib/cantons";
import { img } from "@/lib/icons";

/** Choix du canton : décide du plan d'études mis en avant. */
export function CantonPicker({ value, onChange, note }: { value: string; onChange: (c: string) => void; note?: string }) {
  const c = cantonByCode(value);
  return (
    <div className="daily canton">
      <div className="left">
        <img className="ico" src={img("pin")} alt="" />
        <div>
          <h3>Ton canton</h3>
          <p className="small">{c ? c.plans.map((p) => PLANS[p].nom).join(" · ") : note ?? "Choisis-le pour voir d’abord les parcours de ton plan d’études."}</p>
        </div>
      </div>
      <div className="field">
        <label htmlFor="canton" className="sr">Canton</label>
        <select id="canton" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choisir…</option>
          {[...CANTONS].sort((a, b) => a.nom.localeCompare(b.nom, "fr")).map((x) => <option key={x.code} value={x.code}>{x.nom} ({x.code})</option>)}
        </select>
      </div>
    </div>
  );
}
