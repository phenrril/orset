const assert = require("assert");
const { computeResult, levelFor } = require("./scoring");
const { QUESTIONS } = require("./questions");

const N = QUESTIONS.length; // 10

function answersWith(scoredValue, facturacion = 0, freno = 0) {
  return QUESTIONS.map((q) => {
    if (q.id === "facturacion") return facturacion;
    if (q.id === "freno") return freno;
    return scoredValue;
  });
}

// Score mínimo (todo 0) -> Manual
let r = computeResult(answersWith(0));
assert.strictEqual(r.score, 0);
assert.strictEqual(r.level, "Manual");
assert.strictEqual(levelFor(0), "Manual");

// Score máximo (todo 3) -> Aumentado con IA
r = computeResult(answersWith(3));
assert.strictEqual(r.score, 24);
assert.strictEqual(r.level, "Aumentado con IA");
assert.strictEqual(levelFor(24), "Aumentado con IA");

// Límites de rango
assert.strictEqual(levelFor(6), "Manual");
assert.strictEqual(levelFor(7), "Semi-automatizado");
assert.strictEqual(levelFor(13), "Semi-automatizado");
assert.strictEqual(levelFor(14), "Automatizado");
assert.strictEqual(levelFor(19), "Automatizado");
assert.strictEqual(levelFor(20), "Aumentado con IA");

// Prioridades: las 3 preguntas con menor puntaje deben aparecer
const mixed = QUESTIONS.map((q, i) => {
  if (q.id === "facturacion") return 0;
  if (q.id === "freno") return 1; // "Falta de tiempo"
  return i < 3 ? 0 : 3; // primeras 3 puntuadas en 0, resto en 3
});
r = computeResult(mixed);
assert.strictEqual(r.priorities.length, 4); // 3 prioridades + 1 de freno
assert.strictEqual(r.priorities[0], QUESTIONS[0].priority);
assert.strictEqual(r.priorities[1], QUESTIONS[1].priority);
assert.strictEqual(r.priorities[2], QUESTIONS[2].priority);
assert.strictEqual(
  r.priorities[3],
  QUESTIONS.find((q) => q.id === "freno").priorityByOption[1]
);

// answers con longitud incorrecta -> error
assert.throws(() => computeResult([0, 1]));

// respuesta fuera de rango en pregunta puntuada -> error
const bad = answersWith(0);
bad[0] = 9;
assert.throws(() => computeResult(bad));

console.log("scoring: todos los tests pasaron (" + N + " preguntas)");
