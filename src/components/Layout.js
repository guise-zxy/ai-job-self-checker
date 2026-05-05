'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ApiKeyInput from './ApiKeyInput';
import { useEffect, useState } from 'react';
import { getApiKey } from '@/src/lib/storage';

export default function Layout({ children }) {
  const pathname = usePathname();
  const [hasKey, setHasKey] = useState(false);
  const [showKeyWarning, setShowKeyWarning] = useState(false);

  useEffect(() => {
    const key = getApiKey();
    setHasKey(!!key);
  }, []);

  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/jd-parser', label: 'JD 解析' },
    { href: '/experience-match', label: '经历匹配' },
    { href: '/interview', label: '面试追问' },
  ];

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-inner">
          <Link href="/" className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">AI 求职自检官</span>
          </Link>
          <nav className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            {!hasKey && (
              <button
                className="key-warning-btn"
                onClick={() => setShowKeyWarning(true)}
                title="请先设置 API Key"
              >
                ⚠️
              </button>
            )}
            <ApiKeyInput />
          </div>
        </div>
      </header>

      <main className="main-content">
        {!hasKey && (
          <div className="no-key-banner">
            <p>
              请先点击右上角 ⚙️ 设置你的 DeepSeek API Key，才能使用 AI 分析功能。
            </p>
          </div>
        )}
        {children}
      </main>

      <footer className="app-footer">
        <p>AI 求职自检官 — 面向大学生的岗位能力诊断与面试陪练工具</p>
      </footer>
    </div>
  );
}
