const { QUESTIONS } = require("./questions");

const LEVELS = [
  { max: 6, name: "Manual" },
  { max: 13, name: "Semi-automatizado" },
  { max: 19, name: "Automatizado" },
  { max: 24, name: "Aumentado con IA" },
];

function levelFor(score) {
  return LEVELS.find((l) => score <= l.max).name;
}

// answers: array paralelo a QUESTIONS, cada elemento es el índice de opción elegido (number)
function computeResult(answers) {
  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) {
    throw new Error("answers debe tener " + QUESTIONS.length + " elementos");
  }

  let score = 0;
  const scoredEntries = []; // { qIndex, points }

  QUESTIONS.forEach((q, i) => {
    const optIndex = answers[i];
    if (q.scored) {
      if (
        typeof optIndex !== "number" ||
        optIndex < 0 ||
        optIndex >= q.options.length
      ) {
        throw new Error(`respuesta inválida para "${q.id}"`);
      }
      score += optIndex;
      scoredEntries.push({ qIndex: i, points: optIndex });
    }
  });

  const level = levelFor(score);

  const priorities = scoredEntries
    .slice()
    .sort((a, b) => a.points - b.points)
    .slice(0, 3)
    .map((e) => QUESTIONS[e.qIndex].priority);

  const frenoIndex = QUESTIONS.findIndex((q) => q.id === "freno");
  const frenoAnswer = answers[frenoIndex];
  if (
    typeof frenoAnswer === "number" &&
    QUESTIONS[frenoIndex].priorityByOption[frenoAnswer]
  ) {
    priorities.push(QUESTIONS[frenoIndex].priorityByOption[frenoAnswer]);
  }

  return { score, maxScore: 24, level, priorities };
}

module.exports = { computeResult, levelFor, LEVELS };
