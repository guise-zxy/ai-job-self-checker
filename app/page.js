'use client';

import Link from 'next/link';
import GrowthArchive from '@/src/components/GrowthArchive';

export default function HomePage() {
  const features = [
    {
      title: 'JD 解析',
      desc: '看不懂岗位 JD？粘贴过来，AI 帮你拆解核心能力要求，告诉你每项能力的真实含义和面试官判断方式。',
      icon: '🔍',
      href: '/jd-parser',
      color: '#2563eb',
    },
    {
      title: '经历匹配',
      desc: '不确定自己的项目经历是否匹配岗位？AI 帮你诊断能力差距，给出简历和面试表达建议。',
      icon: '📊',
      href: '/experience-match',
      color: '#7c3aed',
    },
    {
      title: '面试追问',
      desc: '准备面试但不知道会被问什么？AI 面试官基于你的经历生成追问，帮你提前发现表达漏洞。',
      icon: '🎤',
      href: '/interview',
      color: '#0891b2',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="page-intro" style={{ marginTop: 40, marginBottom: 48 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>
          AI 求职自检官
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
          面向大学生的岗位能力诊断与面试陪练工具
        </p>
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          marginTop: 16,
          flexWrap: 'wrap',
        }}>
          <span style={pillStyle}>看懂岗位</span>
          <span style={pillStyle}>匹配经历</span>
          <span style={pillStyle}>诊断差距</span>
          <span style={pillStyle}>训练面试</span>
          <span style={pillStyle}>持续复盘</span>
        </div>
      </section>

      {/* Value Proposition */}
      <section style={{ maxWidth: 800, margin: '0 auto 48px', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: 16,
          padding: '32px 24px',
          border: '1px solid #bae6fd',
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 16, color: '#0369a1' }}>
            🎯 把模糊的求职焦虑，变成可训练、可复盘的成长路径
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
          }}>
            {[
              { title: 'JD 拆解', desc: '把抽象要求转化为具体能力模型' },
              { title: '经历匹配', desc: '把零散经历转化为能力证据' },
              { title: '能力评分', desc: '结构化诊断你的能力短板' },
              { title: '面试训练', desc: '随时获得 AI 面试官追问反馈' },
              { title: '成长档案', desc: '长期记录你的能力变化轨迹' },
            ].map((item) => (
              <div key={item.title} style={{
                background: 'white',
                borderRadius: 12,
                padding: '16px 12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{ maxWidth: 800, margin: '0 auto 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '24px 20px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                height: '100%',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: 8,
                  color: 'var(--text-main)',
                }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testing Sample */}
      <section style={{ maxWidth: 800, margin: '0 auto 48px' }}>
        <div className="result-card">
          <h3 className="result-card-title">🧪 快速体验</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.9rem' }}>
            复制以下测试样例，粘贴到各功能页面体验效果：
          </p>
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 16,
            fontSize: '0.85rem',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
          }}>
{`【JD 解析测试】
目标岗位：产品经理实习生

岗位 JD：
工作主动，具有较好的人际沟通技巧，协调能力，擅于合作。
掌握日常办公软件及办公设备的使用方法。
理解力好，具有较好的沟通与协调能力，责任心与执行力强。

【经历匹配测试】
我在嵌入式睡眠辅助系统项目中担任负责人，负责整体方案设计、
任务拆解、每周看板推进、与队友分工，并向指导老师同步项目进展。`}
          </div>
        </div>
      </section>

      {/* Resume Download */}
      <section style={{ maxWidth: 800, margin: '0 auto 48px' }}>
        <div className="result-card" style={{
          background: 'linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%)',
          borderColor: '#e0e7ff',
          textAlign: 'center',
        }}>
          <h3 className="result-card-title">👤 关于作者</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.95rem', lineHeight: 1.8 }}>
            张馨怡 · 深圳技术大学物联网工程专业 · 目标腾讯 S3 职能线 AI-HR 培训生岗
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.88rem' }}>
            技术栈：Next.js / TypeScript / C++ / 嵌入式开发 · 拥有个人作品集与 AI 项目实战经验
          </p>
          <a
            href="/简历.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
            style={{ textDecoration: 'none', display: 'inline-flex' }}
          >
            📄 查看简历
          </a>
        </div>
      </section>

      {/* Growth Archive */}
      <section style={{ maxWidth: 800, margin: '0 auto' }}>
        <GrowthArchive />
      </section>
    </div>
  );
}

const pillStyle = {
  background: '#e0e7ff',
  color: '#4338ca',
  padding: '4px 14px',
  borderRadius: 99,
  fontSize: '0.85rem',
  fontWeight: 500,
};
