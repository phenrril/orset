// Preguntas del diagnóstico. Índices 0-7 puntúan (0-3 pts por opción, max 24).
// Índice 8 (facturación) no puntúa, solo se guarda. Índice 9 (freno) no puntúa,
// agrega una línea de prioridad fija según la opción elegida.

const QUESTIONS = [
  {
    id: "horas_repetitivas",
    text: "¿Cuántas horas semanales dedica tu equipo a tareas repetitivas?",
    options: [
      "Más de 20 horas",
      "Entre 10 y 20 horas",
      "Entre 5 y 10 horas",
      "Menos de 5 horas",
    ],
    scored: true,
    priority:
      "Mapear y automatizar las tareas que más horas consumen (cargas, respuestas repetidas, seguimientos).",
  },
  {
    id: "atencion_whatsapp",
    text: "¿Cómo gestionás hoy la atención por WhatsApp o Instagram?",
    options: [
      "Todo manual, mensaje por mensaje",
      "Con plantillas o respuestas guardadas",
      "Bot básico o FAQ automatizada",
      "Agente con IA que resuelve la mayoría",
    ],
    scored: true,
    priority:
      "Sumar un agente que responda las consultas frecuentes en WhatsApp/Instagram sin perder el tono humano.",
  },
  {
    id: "cobros_turnos",
    text: "¿Cómo gestionan cobros y turnos?",
    options: [
      "Todo manual (transferencia, agenda en papel o Excel)",
      "Cobro digital pero turnos a mano",
      "Turnos online, cobro manual",
      "Cobro y turnos automáticos e integrados",
    ],
    scored: true,
    priority:
      "Integrar cobros (Mercado Pago) y turnos en un solo flujo, sin ida y vuelta manual.",
  },
  {
    id: "reportes",
    text: "¿Cómo generan los reportes del negocio?",
    options: [
      "Planillas armadas a mano cada vez",
      "Planillas con fórmulas que alguien actualiza",
      "Dashboards que se actualizan solos",
      "Dashboards con alertas automáticas",
    ],
    scored: true,
    priority:
      "Armar un dashboard que se actualice solo, para dejar de perseguir números a mano.",
  },
  {
    id: "uso_ia",
    text: "¿Usan herramientas de IA en el día a día?",
    options: [
      "No, ninguna",
      "Alguien usa ChatGPT por su cuenta",
      "IA en algunos procesos definidos",
      "IA integrada en procesos clave",
    ],
    scored: true,
    priority:
      "Definir 1 o 2 procesos concretos donde meter IA, en vez de uso suelto y sin objetivo.",
  },
  {
    id: "datos_ordenados",
    text: "¿Los datos del negocio están ordenados y accesibles?",
    options: [
      "Dispersos en papeles, mails y planillas",
      "En planillas, pero desordenados",
      "Centralizados en un sistema",
      "Centralizados y los usamos para decidir",
    ],
    scored: true,
    priority:
      "Centralizar los datos en un solo lugar (Sheets, Notion, CRM) antes de automatizar arriba de eso.",
  },
  {
    id: "procesos_documentados",
    text: "¿Qué tan documentados están los procesos principales de la empresa?",
    options: [
      "No están documentados, cada uno trabaja a su manera",
      "Algunos están claros, pero no escritos",
      "Documentados parcialmente",
      "La mayoría están documentados y se siguen",
    ],
    scored: true,
    priority:
      "Documentar el proceso principal antes de automatizarlo, para no automatizar el caos.",
  },
  {
    id: "responsable_tech",
    text: "¿Hay un responsable de mejorar procesos con tecnología?",
    options: [
      "Nadie",
      "Yo, cuando puedo",
      "Alguien lo tiene como tarea secundaria",
      "Hay un responsable claro",
    ],
    scored: true,
    priority:
      "Asignar un responsable, aunque sea part-time, para que la automatización no dependa de encontrar tiempo suelto.",
  },
  {
    id: "facturacion",
    text: "¿Facturación mensual aproximada? (opcional, solo para calibrar recomendaciones)",
    options: [
      "Menos de USD 5.000",
      "USD 5.000 a 20.000",
      "USD 20.000 a 100.000",
      "Más de USD 100.000",
      "Prefiero no decirlo",
    ],
    scored: false,
  },
  {
    id: "freno",
    text: "¿Cuál es tu principal freno para avanzar con IA y automatización?",
    options: [
      "No sé por dónde empezar",
      "Falta de tiempo",
      "Presupuesto",
      "Resistencia del equipo al cambio",
      "Ya avanzamos, quiero escalar",
    ],
    scored: false,
    priorityByOption: [
      "Arrancar con un diagnóstico concreto (como este) en vez de esperar el momento ideal.",
      "Delegar el primer tramo (relevar el proceso) para no depender de tu propio tiempo.",
      "Empezar por la automatización de menor costo y mayor impacto, no por todo junto.",
      "Meter la automatización en un proceso chico primero, para mostrar resultado antes de pedir un cambio grande.",
      "Pasar de automatizaciones sueltas a un sistema conectado entre WhatsApp, cobros y datos.",
    ],
  },
];

module.exports = { QUESTIONS };
