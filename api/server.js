const express = require("express");
const { QUESTIONS } = require("./questions");
const { computeResult } = require("./scoring");
const { saveLead } = require("./db");
const { sendResultEmail } = require("./mailer");

const app = express();
app.use(express.json());

const NOTIFY_WHATSAPP = process.env.NOTIFY_WHATSAPP || "5493416620117";

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Preguntas publicas del quiz (sin el texto de prioridad, no hace falta en el front)
app.get("/api/questions", (req, res) => {
  res.json(QUESTIONS.map((q) => ({ id: q.id, text: q.text, options: q.options })));
});

app.post("/api/diagnostico", (req, res) => {
  const { name, email, whatsapp, company, answers } = req.body || {};

  if (!name || !email || !whatsapp) {
    return res.status(400).json({ error: "Falta nombre, mail o WhatsApp." });
  }

  let result;
  try {
    result = computeResult(answers);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  saveLead({
    created_at: new Date().toISOString(),
    name,
    email,
    whatsapp,
    company: company || null,
    answers: JSON.stringify(answers),
    score: result.score,
    level: result.level,
    priorities: JSON.stringify(result.priorities),
  });

  sendResultEmail({ to: email, name, level: result.level, priorities: result.priorities });

  const summary = `Hola! Hice el diagnóstico y mi nivel dio "${result.level}". Quiero avanzar con orset.`;
  const whatsappText = encodeURIComponent(summary);

  res.json({ level: result.level, priorities: result.priorities, whatsappText, notifyWhatsapp: NOTIFY_WHATSAPP });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`orset_api escuchando en :${PORT}`));

module.exports = app;
