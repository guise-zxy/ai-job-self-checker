import './globals.css';
import Layout from '@/src/components/Layout';

export const metadata = {
  title: 'AI 求职自检官 — 岗位能力诊断与面试陪练工具',
  description: '面向大学生的岗位能力诊断与面试陪练工具，帮助你看懂岗位JD、匹配个人经历、诊断能力差距，并生成面试官追问与提升建议。',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
