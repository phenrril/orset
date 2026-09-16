# Diagnóstico de madurez IA & automatización — spec

## Objetivo
Página `/diagnostico` estilo quiz (inspirada en el enfoque de Olmond Consulting, sin copiar contenido) que capta leads calificados para orset. Mide madurez en IA y automatización de procesos, devuelve nivel + 3 prioridades al instante, y manda copia por mail y WhatsApp.

## Quiz — contenido
10 preguntas, opción múltiple (4 opciones cada una, puntaje 0-3):
1. Horas semanales en tareas repetitivas
2. Cómo gestionan atención al cliente (WhatsApp/Instagram)
3. Cómo gestionan cobros y turnos
4. Cómo generan reportes del negocio
5. Uso actual de herramientas de IA
6. Datos del negocio: ordenados y accesibles
7. Procesos documentados
8. Responsable de mejora con tecnología
9. Facturación mensual aproximada (opcional, no puntúa, solo para calibrar)
10. Principal freno para avanzar (no puntúa, define mensaje de prioridad)

Más: nombre, mail, WhatsApp (obligatorios), empresa (opcional).

## Scoring
- Suma puntos de preguntas 1-8 (max 24, la opcional de facturación y freno no suman).
- Rangos → nivel:
  - 0-6: **Manual**
  - 7-13: **Semi-automatizado**
  - 14-19: **Automatizado**
  - 20-24: **Aumentado con IA**
- 3 prioridades: las 3 preguntas (de 1-8) con menor puntaje individual mapean a un texto de prioridad predefinido (diccionario fijo por pregunta+opción elegida). Sin IA generativa: determinístico, instantáneo, gratis.
- La respuesta de "freno principal" (pregunta 10) agrega una línea de prioridad extra fija según la opción elegida.

## Frontend (`diagnostico.html`)
- Mismo layout base que `orset.html` (nav, footer, tokens de color, tipografías, WhatsApp flotante).
- Una pregunta visible a la vez, barra de progreso, botones anterior/siguiente.
- Última pantalla: datos de contacto.
- Al enviar: `POST /api/diagnostico`, loading, luego pantalla de resultado con nivel + 3 prioridades + botón "Mandar por WhatsApp" (`wa.me/5493416620117?text=...` con resumen prellenado) + aviso "también te lo mandamos por mail".
- Sin JS framework, vanilla JS igual que el resto del sitio.

## Backend (`api/`)
- Node + Express, container nuevo `orset_api`, sin puerto publicado al host (solo red `edge_net`, como pide la regla de docker-compose del usuario).
- SQLite en volumen (`orset_api_data`), tabla `leads` (id, created_at, name, email, whatsapp, company, answers JSON, score, level, priorities JSON).
- `POST /api/diagnostico`:
  1. Valida body (campos requeridos).
  2. Calcula score/nivel/prioridades (función pura en `scoring.js`, testeada).
  3. Guarda lead en SQLite.
  4. Dispara mail vía Resend (async, no bloquea la respuesta; si falla, se loguea y el lead ya quedó guardado).
  5. Responde `{ level, priorities, whatsappText }`.
- Env vars (`.env`, no versionado): `RESEND_API_KEY`, `FROM_EMAIL`, `NOTIFY_WHATSAPP` (tu número, para el link).

## Infraestructura
- `Caddyfile`: agrega `reverse_proxy /api/* orset_api:3000`.
- `docker-compose.yml`: nuevo servicio `orset_api` (build `api/Dockerfile`), red `edge_net`, volumen `orset_api_data:/data`, sin `ports:`. `orset_web` sigue siendo el único con puerto publicado (es el edge).
- `Dockerfile` (api): Node alpine, copia `api/`, `npm ci`, `CMD node server.js`.

## Errores
- Falla de red al mandar mail → se loguea, no afecta respuesta al usuario (lead ya guardado, resultado ya mostrado).
- Falla de validación → 400 con mensaje de campo faltante.

## Test
- `api/test_scoring.js`: script con `assert` sobre `scoring.js` (casos: score mínimo, máximo, límites de cada rango, prioridades correctas). Corre con `node test_scoring.js`.

## Fuera de alcance
- No se toca el formulario de contacto existente (`#form` en `orset.html`), sigue con su placeholder.
- No se implementa WhatsApp Business API (solo link `wa.me`).
- No hay panel admin para ver leads (se consultan directo en SQLite si hace falta).
