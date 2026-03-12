const express = require('express');
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const { messages, system } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: system || 'You are ARIA, a helpful AI assistant in a Roblox game.' },
          ...messages
        ],
        max_tokens: 800,
        temperature: 0.8
      })
    });

    const data = await response.json();
    console.log('Groq:', JSON.stringify(data));
    const text = data.choices?.[0]?.message?.content || '{"error":"no response"}';
    res.json({ content: [{ text }] });

  } catch(e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);
