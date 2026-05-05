'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { callDeepSeek } from '@/src/lib/deepseek';
import { EXPERIENCE_MATCH_SYSTEM_PROMPT } from '@/src/lib/prompts';
import { getApiKey, saveExperienceResult, saveArchiveItem } from '@/src/lib/storage';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import ResultCard from '@/src/components/ResultCard';
import ScoreBar from '@/src/components/ScoreBar';
import GrowthArchive from '@/src/components/GrowthArchive';

export default function ExperienceMatchPage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsed, setParsed] = useState(null);

  const handleSubmit = async () => {
    if (!jobTitle.trim() || !experience.trim()) return;

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
        EXPERIENCE_MATCH_SYSTEM_PROMPT,
        `目标岗位：${jobTitle}\n\n个人经历：\n${experience}`,
        apiKey
      );

      let data;
      try {
        const cleaned = raw.replace(/```json|```/g, '').trim();
        data = JSON.parse(cleaned);
      } catch {
        setResult(raw);
        return;
      }

      setParsed(data);
      saveExperienceResult(data);

      // Save to archive
      const scores = {};
      if (data.matchedAbilities) {
        data.matchedAbilities.forEach((a) => {
          scores[a.name] = `${a.score}/5`;
        });
      }
      saveArchiveItem({
        type: '经历匹配',
        jobTitle: data.jobTitle || jobTitle,
        shortcomings: data.matchedAbilities?.filter(a => a.score < 3).map(a => a.name).join('、') || '',
        scores,
      });
    } catch (err) {
      setError(err.message || '分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const goToInterview = () => {
    const params = new URLSearchParams();
    params.set('job', parsed?.jobTitle || jobTitle);
    params.set('exp', experience);
    router.push(`/interview?${params.toString()}`);
  };

  return (
    <div className="page-section">
      <div className="page-intro">
        <h1>📊 经历匹配</h1>
        <p>输入个人经历，AI 判断与目标岗位的匹配程度</p>
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
          <label className="form-label">个人经历</label>
          <textarea
            className="form-textarea"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="描述你的项目经历、竞赛经历、社团经历或实习经历..."
            rows={8}
          />
          <p className="form-hint">建议用"目标—行动—结果"的结构来描述你的经历</p>
        </div>
        <div className="form-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={loading || !jobTitle.trim() || !experience.trim()}
          >
            {loading ? '分析中...' : '开始匹配'}
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
      {loading && <LoadingSpinner text="正在分析经历匹配度..." />}

      {/* Raw Text Result */}
      {result && !parsed && (
        <ResultCard title="匹配分析结果">
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.8 }}>
            {result}
          </div>
        </ResultCard>
      )}

      {/* Structured Result */}
      {parsed && (
        <>
          <ResultCard title={`📋 ${parsed.jobTitle || jobTitle} — 匹配分析结果`}>
            {parsed.matchedAbilities?.map((ability, idx) => (
              <div key={idx}>
                <ScoreBar name={ability.name} score={ability.score} />
                <div style={{ paddingLeft: 4, marginBottom: 20 }}>
                  <p className="ability-detail">
                    <strong>已有证据：</strong>{ability.evidence}
                  </p>
                  <p className="ability-detail">
                    <strong>证据不足：</strong>{ability.gap || '暂无'}
                  </p>
                  <p className="ability-detail">
                    <strong>简历建议：</strong>{ability.resumeAdvice}
                  </p>
                  <p className="ability-detail">
                    <strong>面试建议：</strong>{ability.interviewAdvice}
                  </p>
                </div>
              </div>
            ))}
          </ResultCard>

          {parsed.overallMatch && (
            <ResultCard title="📌 整体匹配度评估">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{parsed.overallMatch}</p>
            </ResultCard>
          )}

          {parsed.nextSteps && (
            <ResultCard title="🎯 下一步补强建议">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{parsed.nextSteps}</p>
            </ResultCard>
          )}

          <div className="form-actions" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={goToInterview}>
              🎤 去面试追问
            </button>
          </div>
        </>
      )}

      <GrowthArchive />
    </div>
  );
}
