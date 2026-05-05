const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function callDeepSeek(systemPrompt, userMessage, apiKey) {
  if (!apiKey) {
    throw new Error('请先设置 DeepSeek API Key');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API 调用失败 (${response.status}): ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('API 返回结果为空，请重试');
  }

  return content;
}
