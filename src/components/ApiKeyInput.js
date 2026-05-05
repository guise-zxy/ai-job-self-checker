'use client';

import { useState, useEffect } from 'react';
import { getApiKey, setApiKey, clearApiKey } from '@/src/lib/storage';

export default function ApiKeyInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
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
        title="设置 DeepSeek API Key"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span className="nav-label">API Key</span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>设置 DeepSeek API Key</h3>
            <p className="modal-desc">
              请输入你的 DeepSeek API Key。Key 仅保存在你浏览器本地，不会上传到任何服务器。
            </p>
            <p className="modal-desc">
              还没有 Key？前往{' '}
              <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer">
                DeepSeek 开放平台
              </a>{' '}
              注册获取。
            </p>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="api-key-input"
            />
            {saved && maskedKey && (
              <p className="key-status">当前已配置：{maskedKey}</p>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>
                取消
              </button>
              {saved && (
                <button className="btn btn-danger" onClick={handleClear}>
                  清除
                </button>
              )}
              <button className="btn btn-primary" onClick={handleSave} disabled={!key.trim()}>
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
