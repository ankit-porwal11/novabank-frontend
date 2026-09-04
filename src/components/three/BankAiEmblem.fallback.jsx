import "./BankAiEmblem.css";

export default function BankAiEmblemFallback() {
  return (
    <div className="bank-ai-emblem bank-ai-emblem__fallback" aria-hidden="true">
      <div className="bank-ai-emblem__mark">
        <span className="bank-ai-emblem__roof" />
        <span className="bank-ai-emblem__ring" />
        <span className="bank-ai-emblem__core" />
        <span className="bank-ai-emblem__building">
          <span className="bank-ai-emblem__columns">
            <span />
            <span />
            <span />
          </span>
        </span>
      </div>
    </div>
  );
}
