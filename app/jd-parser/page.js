'use client';

import { useState } from 'react';
import { callDeepSeek } from '@/src/lib/deepseek';
import { JD_PARSE_SYSTEM_PROMPT } from '@/src/lib/prompts';
import { getApiKey, saveJdResult, saveArchiveItem } from '@/src/lib/storage';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import ResultCard from '@/src/components/ResultCard';
import GrowthArchive from '@/src/components/GrowthArchive';

export default function JdParserPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [jdContent, setJdContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsed, setParsed] = useState(null);

  const handleSubmit = async () => {
    if (!jobTitle.trim() || !jdContent.trim()) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setError('请先点击右上角 ⚙️ 设置你的 DeepSeek API Key');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setParsed(null);

    try {
      const raw = await callDeepSeek(
        JD_PARSE_SYSTEM_PROMPT,
        `目标岗位：${jobTitle}\n\n岗位 JD：\n${jdContent}`,
        apiKey
      );

      // Try to parse JSON from response
      let data;
      try {
        // Remove any markdown code block markers
        const cleaned = raw.replace(/```json|```/g, '').trim();
        data = JSON.parse(cleaned);
      } catch {
        // If JSON parsing fails, show raw text
        setResult(raw);
        return;
      }

      setParsed(data);
      saveJdResult(data);

      // Save to archive
      const scores = {};
      if (data.coreAbilities) {
        data.coreAbilities.forEach((a) => {
          scores[a.name] = a.priority === 'high' ? '需补强' : a.priority === 'medium' ? '一般' : '良好';
        });
      }
      saveArchiveItem({
        type: 'JD 解析',
        jobTitle: data.jobTitle || jobTitle,
        shortcomings: data.priorityFocus || '',
        scores,
      });
    } catch (err) {
      setError(err.message || '分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div className="page-intro">
        <h1>🔍 JD 解析</h1>
        <p>粘贴岗位 JD，AI 自动拆解核心能力要求</p>
      </div>

      {/* Input Form */}
      <div className="result-card">
        <div className="form-group">
          <label className="form-label">目标岗位</label>
          <input
            className="form-input"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="例如：产品经理实习生、后台开发实习生"
          />
        </div>
        <div className="form-group">
          <label className="form-label">岗位 JD 正文</label>
          <textarea
            className="form-textarea"
            value={jdContent}
            onChange={(e) => setJdContent(e.target.value)}
            placeholder="请粘贴岗位描述/岗位要求正文..."
            rows={8}
          />
          <p className="form-hint">支持粘贴岗位职责和岗位要求的完整文本</p>
        </div>
        <div className="form-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={loading || !jobTitle.trim() || !jdContent.trim()}
          >
            {loading ? '分析中...' : '开始解析'}
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
      {loading && <LoadingSpinner text="正在解析岗位 JD..." />}

      {/* Raw Text Result */}
      {result && !parsed && (
        <ResultCard title="分析结果">
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.8 }}>
            {result}
          </div>
        </ResultCard>
      )}

      {/* Structured Result */}
      {parsed && (
        <>
          <ResultCard title={`📋 ${parsed.jobTitle || jobTitle} — 岗位能力拆解`}>
            {parsed.coreAbilities?.map((ability, idx) => (
              <div key={idx} className="ability-card">
                <div className="ability-card-header">
                  <span className="ability-name">{ability.name}</span>
                  <span className={`ability-badge badge-${ability.priority || 'medium'}`}>
                    {ability.priority === 'high' ? '优先补强' : ability.priority === 'medium' ? '中等优先' : '基础项'}
                  </span>
                </div>
                <p className="ability-detail">
                  <strong>真实含义：</strong>{ability.realMeaning}
                </p>
                <p className="ability-detail">
                  <strong>面试官判断方式：</strong>{ability.interviewerJudge}
                </p>
                <p className="ability-detail">
                  <strong>需要准备的证据：</strong>{ability.evidenceNeeded}
                </p>
              </div>
            ))}
          </ResultCard>

          {parsed.priorityFocus && (
            <ResultCard title="🎯 建议优先补强">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{parsed.priorityFocus}</p>
            </ResultCard>
          )}

          {parsed.nextSteps && (
            <ResultCard title="📌 下一步建议">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{parsed.nextSteps}</p>
            </ResultCard>
          )}
        </>
      )}

      <GrowthArchive />
    </div>
  );
}
