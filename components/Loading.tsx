import { Pi } from "./Pi";

export function Loading({ text }: { text?: string }) {
  return (
    <div className="loading">
      <div className="guide">
        {text && <div className="bubble">{text}</div>}
        <Pi className="bob pi-big" />
      </div>
    </div>
  );
}
