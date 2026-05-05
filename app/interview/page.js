'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { callDeepSeek } from '@/src/lib/deepseek';
import { INTERVIEW_QUESTIONS_SYSTEM_PROMPT } from '@/src/lib/prompts';
import { getApiKey, saveArchiveItem } from '@/src/lib/storage';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import ResultCard from '@/src/components/ResultCard';
import GrowthArchive from '@/src/components/GrowthArchive';

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [overallAdvice, setOverallAdvice] = useState('');

  // Auto-fill from URL params
  useEffect(() => {
    const job = searchParams.get('job');
    const exp = searchParams.get('exp');
    if (job) setJobTitle(job);
    if (exp) setExperience(exp);
  }, [searchParams]);

  const handleGenerateQuestions = async () => {
    if (!jobTitle.trim() || !experience.trim()) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setError('请先点击右上角 ⚙️ 设置你的 DeepSeek API Key');
      return;
    }

    setLoading(true);
    setError('');
    setQuestions([]);
    setCurrentQ(0);
    setFeedback('');
    setShowFeedback(false);

    try {
      const raw = await callDeepSeek(
        INTERVIEW_QUESTIONS_SYSTEM_PROMPT,
        `目标岗位：${jobTitle}\n\n个人经历：\n${experience}`,
        apiKey
      );

      let data;
      try {
        const cleaned = raw.replace(/```json|```/g, '').trim();
        data = JSON.parse(cleaned);
      } catch {
        // If not valid JSON, treat as error
        throw new Error('AI 返回格式异常，请重试');
      }

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setOverallAdvice(data.overallAdvice || '');
      } else {
        throw new Error('未能生成追问问题，请重试');
      }
    } catch (err) {
      setError(err.message || '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !questions[currentQ]) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setError('请先设置 API Key');
      return;
    }

    setFeedbackLoading(true);
    setShowFeedback(true);

    try {
      const feedbackPrompt = `你是一位严格的面试官。用户正在回答面试追问问题。

原始问题：${questions[currentQ].question}
考察能力：${questions[currentQ].abilityTested}
优秀回答应包含：${questions[currentQ].goodAnswerIncludes}
常见扣分点：${questions[currentQ].commonPitfalls}

用户的回答：${userAnswer}

请给出简短反馈（200字以内），指出：
1. 回答中的亮点
2. 可以改进的地方
3. 如果重新回答，建议往哪个方向优化`;

      const raw = await callDeepSeek(
        '你是一位专业的面试官，给出简洁、具体的回答反馈。',
        feedbackPrompt,
        apiKey
      );

      setFeedback(raw);
    } catch (err) {
      setFeedback('反馈生成失败，但你可以参考上面的评分标准自己评估回答质量。');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setUserAnswer('');
      setFeedback('');
      setShowFeedback(false);
    }
  };

  const isFromExperienceMatch = !!searchParams.get('job');

  return (
    <div className="page-section">
      <div className="page-intro">
        <h1>🎤 AI 面试追问</h1>
        <p>基于你的岗位和经历，AI 面试官生成针对性追问</p>
      </div>

      {/* Input Form */}
      <div className="result-card">
        <div className="form-group">
          <label className="form-label">目标岗位</label>
          <input
            className="form-input"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="例如：产品经理实习生"
          />
        </div>
        <div className="form-group">
          <label className="form-label">个人经历</label>
          <textarea
            className="form-textarea"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="描述你的项目经历、竞赛经历..."
            rows={6}
          />
        </div>
        <div className="form-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleGenerateQuestions}
            disabled={loading || !jobTitle.trim() || !experience.trim()}
          >
            {loading ? '生成中...' : questions.length > 0 ? '重新生成' : '生成面试追问'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="result-card" style={{ borderColor: '#fecaca', background: '#fef2f2' }}>
          <p style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner text="正在生成面试追问..." />}

      {/* Questions */}
      {questions.length > 0 && (
        <>
          {/* Progress */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 20,
          }}>
            {questions.map((_, idx) => (
              <div key={idx} style={{
                width: 32,
                height: 6,
                borderRadius: 3,
                background: idx === currentQ ? 'var(--primary)' : idx < currentQ ? 'var(--success)' : 'var(--border)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>

          {/* Current Question */}
          <ResultCard title={`追问 ${currentQ + 1} / ${questions.length}`}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 16, lineHeight: 1.6 }}>
              {questions[currentQ].question}
            </div>

            {/* Question Details */}
            <div style={{ marginBottom: 20 }}>
              <div className="ability-detail">
                <strong>🎯 考察能力：</strong>{questions[currentQ].abilityTested}
              </div>
              <div className="ability-detail">
                <strong>✅ 优秀回答应包含：</strong>{questions[currentQ].goodAnswerIncludes}
              </div>
              <div className="ability-detail">
                <strong>⚠️ 常见扣分点：</strong>{questions[currentQ].commonPitfalls}
              </div>
              <div className="ability-detail">
                <strong>📌 建议准备方向：</strong>{questions[currentQ].preparationAdvice}
              </div>
            </div>

            {/* Your Answer */}
            <div className="form-group">
              <label className="form-label">你的回答</label>
              <textarea
                className="form-textarea"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="输入你的回答，AI 会给出反馈..."
                rows={4}
              />
            </div>

            <div className="form-actions">
              {!showFeedback ? (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitAnswer}
                  disabled={feedbackLoading || !userAnswer.trim()}
                >
                  {feedbackLoading ? '反馈中...' : '提交回答 · 获取反馈'}
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleNextQuestion}>
                  {currentQ < questions.length - 1 ? '下一题 →' : '全部完成 ✓'}
                </button>
              )}
            </div>
          </ResultCard>

          {/* Feedback */}
          {showFeedback && feedback && (
            <ResultCard title="💡 AI 面试官反馈">
              <div style={{
                whiteSpace: 'pre-wrap',
                fontSize: '0.9rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                background: '#f0fdf4',
                padding: 16,
                borderRadius: 8,
                border: '1px solid #bbf7d0',
              }}>
                {feedback}
              </div>
            </ResultCard>
          )}

          {feedbackLoading && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto' }}></div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 10, fontSize: '0.9rem' }}>
                面试官正在分析你的回答...
              </p>
            </div>
          )}

          {/* Complete Message */}
          {currentQ === questions.length - 1 && showFeedback && (
            <div className="result-card" style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}>
              <h3 className="result-card-title" style={{ borderColor: '#bbf7d0' }}>🎉 全部追问训练完成！</h3>
              {overallAdvice && (
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
                  <strong>整体面试备战建议：</strong><br />
                  {overallAdvice}
                </div>
              )}
              <button
                className="btn btn-primary"
                onClick={() => {
                  saveArchiveItem({
                    type: '面试追问',
                    jobTitle,
                    shortcomings: '已练习面试追问',
                  });
                  alert('已保存到成长档案！');
                }}
              >
                📋 保存训练记录
              </button>
            </div>
          )}
        </>
      )}

      <GrowthArchive />
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="加载中..." />}>
      <InterviewContent />
    </Suspense>
  );
}
