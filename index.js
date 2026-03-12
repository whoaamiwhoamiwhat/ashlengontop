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
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: system },
          ...messages
        ],
        max_tokens: 1024,
        temperature: 0.85
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data));
    const text = data.choices?.[0]?.message?.content || 'Sorry, I could not respond right now.';
    res.json({ content: [{ text }] });

  } catch(e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);
