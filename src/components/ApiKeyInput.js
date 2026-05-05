'use client';

import { useState, useEffect } from 'react';
import { getApiKey, setApiKey, clearApiKey, hasFixedKey } from '@/src/lib/storage';

export default function ApiKeyInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [showOverride, setShowOverride] = useState(false);

  useEffect(() => {
    setFixed(hasFixedKey());
    const stored = getApiKey();
    if (stored) {
      setKey(stored);
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!key.trim()) return;
    setApiKey(key.trim());
    setSaved(true);
    setIsOpen(false);
  };

  const handleClear = () => {
    clearApiKey();
    setKey('');
    setSaved(false);
  };

  const maskedKey = key ? `${key.slice(0, 8)}...${key.slice(-4)}` : '';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="api-key-btn"
        title={fixed ? '已配置固定 API Key' : '设置 DeepSeek API Key'}
      >
        {fixed ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#10b981" fillOpacity="0.2"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        )}
        <span className="nav-label" style={fixed ? { color: '#10b981' } : {}}>
          {fixed ? '已配置' : 'API Key'}
        </span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {fixed && !showOverride ? (
              <>
                <h3>🔒 API Key 已配置</h3>
                <p className="modal-desc">
                  系统已配置固定 API Key，打开即可直接使用所有 AI 功能，无需手动填写。
                </p>
                <p className="modal-desc" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  如果你有自己的 API Key，也可以{' '}
                  <button
                    onClick={() => setShowOverride(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
                  >
                    点击这里
                  </button>
                  {' '}手动替换。
                </p>
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
                    知道了
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{fixed ? '自定义 API Key（可选）' : '设置 DeepSeek API Key'}</h3>
                {!fixed && (
                  <p className="modal-desc">
                    请输入你的 DeepSeek API Key。Key 仅保存在你浏览器本地，不会上传到任何服务器。
                  </p>
                )}
                {!fixed && (
                  <p className="modal-desc">
                    还没有 Key？前往{' '}
                    <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer">
                      DeepSeek 开放平台
                    </a>{' '}
                    注册获取。
                  </p>
                )}
                {fixed && (
                  <p className="modal-desc">
                    输入你自己的 API Key 以覆盖系统默认 Key。留空则使用系统配置的固定 Key。
                  </p>
                )}
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={fixed ? '留空则使用系统固定 Key' : 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
                  className="api-key-input"
                />
                {saved && maskedKey && !fixed && (
                  <p className="key-status">当前已配置：{maskedKey}</p>
                )}
                {fixed && (
                  <p className="key-status" style={{ color: '#94a3b8' }}>
                    系统默认 Key 已生效 {maskedKey ? `| 自定义 Key：${maskedKey}` : ''}
                  </p>
                )}
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => { setIsOpen(false); setShowOverride(false); }}>
                    {fixed ? '取消' : '取消'}
                  </button>
                  {saved && !fixed && (
                    <button className="btn btn-danger" onClick={handleClear}>
                      清除
                    </button>
                  )}
                  <button className="btn btn-primary" onClick={() => {
                    if (key.trim()) {
                      setApiKey(key.trim());
                    }
                    setSaved(true);
                    setIsOpen(false);
                    setShowOverride(false);
                  }} disabled={false}>
                    {fixed ? '使用自定义 Key' : '保存'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
