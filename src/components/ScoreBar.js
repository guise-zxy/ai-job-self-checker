export default function ScoreBar({ name, score, maxScore = 5 }) {
  const percentage = (score / maxScore) * 100;
  const getColor = (s) => {
    if (s >= 4) return '#10b981';
    if (s >= 3) return '#f59e0b';
    return '#ef4444';
  };

  const getLabel = (s) => {
    if (s >= 4) return '优秀';
    if (s >= 3) return '一般';
    return '待加强';
  };

  return (
    <div className="score-bar">
      <div className="score-bar-header">
        <span className="score-bar-name">{name}</span>
        <span className="score-bar-value" style={{ color: getColor(score) }}>
          {score} / {maxScore} <span className="score-label">{getLabel(score)}</span>
        </span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor(score),
          }}
        ></div>
      </div>
    </div>
  );
}
