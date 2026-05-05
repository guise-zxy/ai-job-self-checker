'use client';

import { useState, useEffect } from 'react';
import { getArchives } from '@/src/lib/storage';

export default function GrowthArchive() {
  const [archives, setArchives] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setArchives(getArchives());
  }, []);

  if (archives.length === 0) {
    return null;
  }

  const displayArchives = expanded ? archives : archives.slice(0, 3);

  return (
    <div className="growth-archive">
      <h3 className="archive-title">📋 成长档案</h3>
      <p className="archive-desc">你最近 {archives.length} 次自检记录</p>
      <div className="archive-list">
        {displayArchives.map((item) => (
          <div key={item.id} className="archive-item">
            <div className="archive-item-header">
              <span className="archive-date">{item.date}</span>
              <span className="archive-job">{item.jobTitle || '未填写岗位'}</span>
              <span className="archive-type">{item.type || '自检'}</span>
            </div>
            {item.shortcomings && (
              <p className="archive-shortcomings">
                <strong>主要短板：</strong>{item.shortcomings}
              </p>
            )}
            {item.scores && (
              <div className="archive-scores">
                {Object.entries(item.scores).map(([key, val]) => (
                  <span key={key} className="archive-score-tag">
                    {key}：{val}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {archives.length > 3 && (
        <button className="btn btn-text" onClick={() => setExpanded(!expanded)}>
          {expanded ? '收起' : `查看全部 ${archives.length} 条记录`}
        </button>
      )}
    </div>
  );
}
