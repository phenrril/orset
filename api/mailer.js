const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "orset <diagnostico@orset.ar>";

// No bloquea al caller: loguea y sigue si falla. El lead ya está guardado
// en SQLite antes de llamar a esto, así que un fallo de mail no pierde nada.
async function sendResultEmail({ to, name, level, priorities }) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY no configurada, salteo envío de mail");
    return;
  }

  const priorityList = priorities.map((p) => `<li>${p}</li>`).join("");
  const html = `
    <h2>Tu diagnóstico de madurez en IA y automatización</h2>
    <p>Hola ${name}, así quedó tu resultado:</p>
    <p><b>Nivel: ${level}</b></p>
    <p>Tus prioridades:</p>
    <ul>${priorityList}</ul>
    <p>Si querés avanzar, respondé este mail o escribinos por WhatsApp: https://wa.me/5493416620117</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject: "Tu diagnóstico de madurez en IA y automatización",
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend respondió", res.status, await res.text());
    }
  } catch (err) {
    console.error("Fallo al enviar mail de diagnóstico:", err.message);
  }
}

module.exports = { sendResultEmail };
