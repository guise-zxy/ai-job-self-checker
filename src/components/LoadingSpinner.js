export default function LoadingSpinner({ text = 'AI 分析中...' }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="spinner-text">{text}</p>
      <p className="spinner-sub">正在调用 DeepSeek API，请稍候</p>
    </div>
  );
}
