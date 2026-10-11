/* ============================================================
   SITUATION PLAYBOOKS — step-by-step guides, not just listings.
   Each step links hand-verified resource names from the dataset.
   Bilingual: every string has en + es.
   ============================================================ */
const PLAYBOOKS = [
  {
    id: "lost-job", icon: "💼",
    title: { en: "I just lost my job", es: "Perdí mi trabajo" },
    sub: { en: "What to do in the first two weeks", es: "Qué hacer en las primeras dos semanas" },
    steps: [
      { h: { en: "File for unemployment right away", es: "Solicita el desempleo de inmediato" },
        p: { en: "New Mexico pays unemployment through the Department of Workforce Solutions. File online as soon as you can — benefits start after you apply, not before.",
             es: "Nuevo México paga el desempleo a través del Department of Workforce Solutions. Solicita en línea lo antes posible — los beneficios empiezan cuando solicitas, no antes." },
        names: ["NM Dept. of Workforce Solutions (DWS)"] },
      { h: { en: "Get food this week", es: "Consigue comida esta semana" },
        p: { en: "Don't wait until the pantry is empty. Food banks serve anyone who shows up.",
             es: "No esperes a quedarte sin nada. Los bancos de comida atienden a quien llegue." },
        names: ["Roadrunner Food Bank", "Storehouse New Mexico"] },
      { h: { en: "Cover rent and utilities", es: "Cubre la renta y los servicios" },
        p: { en: "If money will be tight, ask for help before you fall behind — help comes faster when you apply early.",
             es: "Si el dinero va a faltar, pide ayuda antes de atrasarte — la ayuda llega más rápido cuando solicitas temprano." },
        names: ["New Mexico Home Fund", "PNM Good Neighbor Fund + PNM CARES", "HEAT New Mexico"] },
      { h: { en: "Find your next job", es: "Encuentra tu próximo trabajo" },
        p: { en: "Free job search help, resume workshops, and career counseling.",
             es: "Ayuda gratuita para buscar trabajo, talleres de currículum y orientación profesional." },
        names: ["NM Dept. of Workforce Solutions (DWS)", "Library Job & Career Guide — 'Working It Out!'"] }
    ]
  },
  {
    id: "safe-tonight", icon: "🏠",
    title: { en: "I need a safe place tonight", es: "Necesito un lugar seguro esta noche" },
    sub: { en: "Right now, not tomorrow", es: "Ahora mismo, no mañana" },
    steps: [
      { h: { en: "Call right now", es: "Llama ahora mismo" },
        p: { en: "These lines are answered by people, not machines. If you are in danger, call 911 first.",
             es: "Estas líneas las contestan personas, no máquinas. Si estás en peligro, llama al 911 primero." },
        names: ["New Mexico Crisis and Access Line", "Albuquerque Heading Home"] },
      { h: { en: "Emergency shelters", es: "Refugios de emergencia" },
        p: { en: "Walk-in shelters with beds tonight. Call ahead if you can — beds fill up.",
             es: "Refugios con camas para esta noche. Llama antes si puedes — las camas se llenan." },
        names: ["Good Shepherd Center", "Joy Junction", "Barrett House / ABQ Rescue Mission Women's Center of Hope"] },
      { h: { en: "Tomorrow: a longer plan", es: "Mañana: un plan más largo" },
        p: { en: "Case managers can help with housing, ID, benefits, and next steps.",
             es: "Los trabajadores de casos pueden ayudar con vivienda, identificación, beneficios y próximos pasos." },
        names: ["Albuquerque Heading Home", "Agora Crisis Center"] }
    ]
  },
  {
    id: "no-papers", icon: "🤝",
    title: { en: "I don't have papers", es: "No tengo papeles" },
    sub: { en: "Help exists regardless of status", es: "Hay ayuda sin importar tu estatus" },
    steps: [
      { h: { en: "Know your rights", es: "Conoce tus derechos" },
        p: { en: "Free and low-cost immigration legal help. Never pay a notario for legal advice.",
             es: "Ayuda legal migratoria gratuita o de bajo costo. Nunca pagues a un notario por asesoría legal." },
        names: ["New Mexico Immigrant Law Center (NMILC)", "Enlace Comunitario"] },
      { h: { en: "Get an ITIN", es: "Saca tu ITIN" },
        p: { en: "An ITIN lets you file taxes, open bank accounts, and qualify for tax credits — no SSN needed.",
             es: "El ITIN te permite declarar impuestos, abrir cuentas de banco y calificar para créditos — sin SSN." },
        names: ["UNM ITIN Application Guidance"] },
      { h: { en: "Healthcare without an SSN", es: "Salud sin SSN" },
        p: { en: "Emergency care and low-cost clinics serve everyone, regardless of immigration status.",
             es: "La atención de emergencia y las clínicas de bajo costo atienden a todos, sin importar el estatus migratorio." },
        names: ["Emergency Medicaid Coverage for Undocumented Residents", "First Choice Community Healthcare"] },
      { h: { en: "Food and family support", es: "Comida y apoyo familiar" },
        p: { en: "Food banks and community organizations don't ask about immigration status.",
             es: "Los bancos de comida y las organizaciones comunitarias no preguntan tu estatus migratorio." },
        names: ["Roadrunner Food Bank", "Enlace Comunitario"] }
    ]
  },
  {
    id: "behind-rent", icon: "🧾",
    title: { en: "I can't pay rent", es: "No puedo pagar la renta" },
    sub: { en: "Before the eviction notice arrives", es: "Antes de que llegue el aviso de desalojo" },
    steps: [
      { h: { en: "Ask for rent help now", es: "Pide ayuda con la renta ya" },
        p: { en: "Help goes fastest to people who apply before they're months behind.",
             es: "La ayuda llega más rápido a quienes solicitan antes de atrasarse por meses." },
        names: ["New Mexico Home Fund", "Housing Choice Voucher Program (Section 8)"] },
      { h: { en: "Know your rights as a renter", es: "Conoce tus derechos como inquilino" },
        p: { en: "In New Mexico a landlord can't just change the locks or shut off your utilities — that's illegal. Free legal help can stop an illegal eviction.",
             es: "En Nuevo México el dueño no puede simplemente cambiar las chapas o cortarte los servicios — eso es ilegal. Hay ayuda legal gratuita." },
        names: ["New Mexico Legal Aid"] },
      { h: { en: "Keep the lights on", es: "Mantén la luz encendida" },
        p: { en: "Utility assistance is separate from rent help — apply for both.",
             es: "La ayuda para servicios es separada de la ayuda de renta — solicita ambas." },
        names: ["LIHEAP (Low Income Home Energy Assistance)", "PNM Good Neighbor Fund + PNM CARES"] }
    ]
  },
  {
    id: "health-no-insurance", icon: "🏥",
    title: { en: "I need healthcare, no insurance", es: "Necesito atención médica, sin seguro" },
    sub: { en: "Care you can actually afford", es: "Atención que sí puedes pagar" },
    steps: [
      { h: { en: "Low-cost clinics", es: "Clínicas de bajo costo" },
        p: { en: "Sliding-scale clinics — you pay based on what you earn. No insurance needed.",
             es: "Clínicas de escala móvil — pagas según lo que ganas. Sin seguro." },
        names: ["First Choice Community Healthcare", "La Familia Medical Center"] },
      { h: { en: "Coverage you might qualify for", es: "Cobertura para la que podrías calificar" },
        p: { en: "New Mexico has programs for low-income residents, including emergency coverage regardless of immigration status.",
             es: "Nuevo México tiene programas para residentes de bajos ingresos, incluyendo cobertura de emergencia sin importar el estatus." },
        names: ["UNM Care and Out of County Care", "Medicaid (federal/state)", "Emergency Medicaid Coverage for Undocumented Residents"] },
      { h: { en: "Hospital bills", es: "Facturas de hospital" },
        p: { en: "Hospitals must offer financial assistance — ask for the financial assistance office before you pay a bill.",
             es: "Los hospitales deben ofrecer ayuda financiera — pregunta por la oficina de ayuda financiera antes de pagar." },
        names: ["Presbyterian Healthcare Services — Financial Assistance"] }
    ]
  }
];
