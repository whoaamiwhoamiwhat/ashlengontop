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
          { role: 'system', content: system || 'You are a helpful assistant.' },
          { role: 'user', content: prompt || 'Hello' }
        ],
        max_tokens: 600,
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data)); // for debugging
    const text = data.choices?.[0]?.message?.content || '{"error":"no response"}';
    res.json({ content: [{ text }] });

  } catch(e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);
