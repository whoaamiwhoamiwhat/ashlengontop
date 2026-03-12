const express = require('express');
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const { prompt, system } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: system },
          { role: 'user',   content: prompt }
        ],
        max_tokens: 600
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{"error":"no response"}';
    res.json({ content: [{ text }] });

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);
