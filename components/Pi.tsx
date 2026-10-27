import { FACES, type Mood } from "@/lib/pi-faces";
import { PI_BODY } from "@/lib/icons";

/** Pi, la mascotte : le corps en verre (blob.webp) et un visage SVG superposé. */
export function Pi({ mood = "idle", className = "", w, h }: { mood?: Mood; className?: string; w?: number; h?: number }) {
  return (
    <span className={`pi ${className}`.trim()} data-pi={mood} style={w ? { width: w, height: h } : undefined}>
      <img src={PI_BODY} alt="Pi, la mascotte" />
      <svg viewBox="0 0 320 219" aria-hidden="true">
        <g transform="translate(160 88) scale(1.45) translate(-160 -88)" dangerouslySetInnerHTML={{ __html: FACES[mood] ?? FACES.idle }} />
      </svg>
    </span>
  );
}
