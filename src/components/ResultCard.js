export default function ResultCard({ title, children, className = '' }) {
  return (
    <div className={`result-card ${className}`}>
      {title && <h3 className="result-card-title">{title}</h3>}
      <div className="result-card-content">{children}</div>
    </div>
  );
}
