/* ============================================================
   DATA
   The dataset is embedded server-side (see scripts/generate_site.py)
   as a JSON blob in a <script id="data-blob"> tag, then parsed here.
   ============================================================ */
const DATA = JSON.parse(document.getElementById('data-blob').textContent);


/* Category identity: an SVG icon path + a CSS class (see css/styles.css
   for the actual --accent color each c-XXX class sets) per bucket. */
const ICONS = {
  "Housing": '<path d="M3 11L12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  "Food": '<path d="M6 3v7a3 3 0 0 0 6 0V3"/><path d="M9 10v11"/><path d="M17 3c-1.5 2-2 4-2 7 0 2 1 3 2 3s2-1 2-3c0-3-.5-5-2-7z"/><path d="M17 13v8"/>',
  "Financial & Banking": '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 10h18"/><circle cx="12" cy="15" r="2.2"/><path d="M7 8V6a5 5 0 0 1 10 0v2"/>',
  "Healthcare": '<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/><path d="M9 11h6M12 8v6"/>',
  "Employment & Workforce": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  "Education & Academic Support": '<path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/>',
  "Legal & Civic": '<path d="M12 3v18"/><path d="M5 8l-3 5a3 3 0 0 0 6 0l-3-5z"/><path d="M19 8l-3 5a3 3 0 0 0 6 0l-3-5z"/><path d="M5 8h14M8 21h8"/>',
  "Identity & Cultural": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18a13 13 0 0 1 0-18z"/>',
  "Senior & Disability": '<circle cx="17" cy="6" r="2.3"/><path d="M9 21l2.5-7 3-2-2-4-4 2-1-3H4"/><path d="M9 14l3 1 3 6"/>',
  "Family & Childcare": '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2"/><path d="M15 21v-1.5a4 4 0 0 1 4-4h.5a3 3 0 0 1 3 3V21"/>',
  "Utilities": '<path d="M13 2L4 14h6l-1 8 10-13h-6l1-7z"/>',
  "Veterans": '<path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8-6.2-3.7-6.2 3.7 1.6-6.8-5.2-4.6 6.9-.7z"/>',
  "General Hub / Directory": '<circle cx="12" cy="12" r="9"/><polygon points="12,7 14,12 12,17 10,12"/>',
  "Immigrant & ITIN Resources": '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2.5"/><path d="M14 9h5M14 12h5M14 15h3"/>'
};
const CAT_CLASS = {
  "Housing":"c-Housing","Food":"c-Food","Financial & Banking":"c-FinancialBanking","Healthcare":"c-Healthcare",
  "Employment & Workforce":"c-EmploymentWorkforce","Education & Academic Support":"c-EducationAcademicSupport",
  "Legal & Civic":"c-LegalCivic","Identity & Cultural":"c-IdentityCultural","Senior & Disability":"c-SeniorDisability",
  "Family & Childcare":"c-FamilyChildcare","Utilities":"c-Utilities","Veterans":"c-Veterans",
  "General Hub / Directory":"c-GeneralHubDirectory","Immigrant & ITIN Resources":"c-ImmigrantITINResources"
};


/* ============================================================
   APP STATE
   `path` = current category (empty array = home). `detailStack` =
   the currently-open resource, if any. `mapView` toggles the map.
   `lang` drives which I18N dict `t()` reads from.
   ============================================================ */
let path = [];
let filters = { immigrant:false, hidden:false, search:"" };
let mapView = false;
let leafletMapInstance = null;
let lang = 'en';


/* ============================================================
   TRANSLATIONS
   Full English/Spanish dictionaries for all UI chrome (nav, buttons,
   FAQ, footer, etc.). Individual resource descriptions are NOT
   translated — only the navigation/framing around them. Access via
   the t(key) helper below, which reads from whichever `lang` is active.
   ============================================================ */
const I18N = {
  en: {
    catNames: { "Housing":"Housing","Food":"Food","Financial & Banking":"Financial & Banking","Healthcare":"Healthcare",
      "Employment & Workforce":"Employment & Workforce","Education & Academic Support":"Education & Academic Support",
      "Legal & Civic":"Legal & Civic","Identity & Cultural":"Identity & Cultural","Senior & Disability":"Senior & Disability",
      "Family & Childcare":"Family & Childcare","Utilities":"Utilities","Veterans":"Veterans",
      "General Hub / Directory":"General Hub / Directory","Immigrant & ITIN Resources":"Immigrant & ITIN Resources" },
    heroEyebrow:"Federal · State · County & City · University · Community",
    heroH1_pre:"Find real help across ", heroH1_em:"New Mexico", heroH1_post:".",
    heroP:"Housing, food, financial aid, healthcare, and more — gathered from public agencies and community organizations, from Gallup to Santa Fe to Albuquerque.",
    heroBigNumLabel:"Resources catalogued",
    searchPlaceholder:"Search resources, organizations, keywords...",
    toggleImm:"ITIN / Immigrant-related", toggleHidden:"Hidden gems", toggleMap:"📍 Map view",
    home:"Home",
    qsTitle:"What's going on?", qsSub:"Skip browsing — tell us the situation",
    qs:[
      {label:"I need a place to stay tonight"},{label:"I'm behind on rent or a bill"},{label:"I need food"},
      {label:"I don't have a Social Security Number"},{label:"I'm a student and need money fast"},
      {label:"I need healthcare but no insurance"}
    ],
    browseByCategory:"Browse by category", totalResources:"total resources",
    searchResults:"Search results", found:"found",
    filteredResults:"Filtered results",
    relatedResources:"Related resources", curatedSub:"Hand-verified connections, not just same-category matches",
    directlyConnected:"directly connected", hiddenGem:"hidden gem", unverified:"unverified",
    itinBadge:"ITIN/immigrant", curatedResourcesFor:"curated resources for this situation",
    backToList:"Back to list", backToCategories:"Back to categories", copyLink:"Copy link", copied:"✓ Copied",
    fldOrg:"Organization", fldWhat:"What it offers", fldHow:"How to access it", fldElig:"Eligibility Checklist",
    fldContact:"Contact", fldSource:"Source",
    mapViewTitle:"Map view", mapKnownLoc:"resources with a known location",
    mapDisclaimerTitle:"Pin locations come from address geocoding.",
    mapDisclaimerBody:"Pins were placed by geocoding each resource's street address (October 2026 pass) — far more accurate than the old street-grid estimates, but still confirm the exact address on the resource's page before traveling somewhere unfamiliar, especially for shelters and clinics.",
    howRibbon:[
      {n:"01",h:"Search or browse",p:"Type what you need, or click a category to see everything in it."},
      {n:"02",h:"Check the badges",p:"Region tags, plus \"hidden gem\" and \"unverified\" flags where relevant."},
      {n:"03",h:"Open the page",p:"What it offers, how to access it, eligibility, and a direct contact."},
      {n:"04",h:"Call ahead",p:"Programs change — treat this as a strong starting point, not the final word."}
    ],
    faqTitle:"Frequently asked",
    faqs:[
      { q:"Is this an official government website?", a:"No. This is a community-compiled directory. The underlying resources are real, but this navigator itself is not an official service of any city, county, state, or federal agency." },
      { q:"How current is this information?", a:"Hours, eligibility, and contact details change over time. Entries marked \"Needs Verification\" haven't been independently confirmed — double-check before relying on them." },
      { q:"What does \"hidden gem\" mean?", a:"It flags resources that are real but genuinely under-advertised — things most people never hear about unless someone tells them directly." },
      { q:"What does the ITIN / immigrant filter show?", a:"Resources relevant regardless of immigration status, or that specifically serve immigrant communities — banking without an SSN, in-state tuition policy, legal aid, and similar." },
      { q:"Are there reviews or ratings?", a:"No, intentionally. Fabricated testimonials on a tool people use for real decisions would be misleading, so this sticks to what's independently verifiable." }
    ],
    aboutTitle:"About this project",
    aboutP1:"This navigator started as a resource-mapping project to identify services available to newcomers, students, and residents across New Mexico — food, housing, healthcare, education, employment, legal and civic services, financial services, and more.",
    aboutP2:"It grew into a tree spanning five levels — federal, state, county/city, university, and community — with attention to resources that are genuinely under-advertised.",
    aboutList:["Sourced from public agency pages and official organization sites","Uncertain entries are flagged \"Needs Verification,\" not presented as fact","No fabricated testimonials, reviews, or endorsements"],
    footerTitle:"New Mexico Resource Navigator",
    footerAbout:"A community-compiled directory of resources across New Mexico. Not an official government website — verify details before relying on them.",
    footerBrowse:"Browse", footerRegions:"Regions", footerGoodKnow:"Good to Know",
    regions:["Albuquerque / Bernalillo","Santa Fe area","Rio Rancho / Sandoval","Los Lunas / Valencia","Gallup & Los Alamos","Statewide & Tribal-direct"],
    goodKnow:["Programs and hours change — call ahead","No fabricated reviews"],
    footerBottom1:"Data compiled from public agency and organization sources.", footerBottom2:"Not a substitute for calling ahead.",
    officialBanner:"A compiled community resource for New Mexico residents — not an official government website. Data sourced from public agencies and organizations; verify details before relying on them.",
    noMatch:"No resources match the current filters.",
    langToggle:"Español",
    navHome:"Home", navSearch:"Search", navMap:"Map", navHelp:"Help now",
    asstTitle:"What's going on?",
    asstSub:"Describe your situation in your own words — English or Spanish",
    asstPlaceholder:"e.g. I lost my job and can't pay rent...",
    asstBtn:"Find help",
    asstAiBtn:"✨ Ask AI", aiThinking:"Thinking…",
    aiError:"The AI helper is unavailable right now — try the keyword search instead.",
    asstNote:"Keyword matching, not AI — it finds resources by the words you use.",
    tryLabel:"Try:",
    actCall:"Call", actWeb:"Website", actDir:"Directions",
    sitChips:[
      {label:"I need food", q:"i need food"},
      {label:"Can't pay rent", q:"i can't pay rent"},
      {label:"Need a place tonight", q:"i need a place to stay tonight"},
      {label:"Lost my job", q:"i lost my job"},
      {label:"No insurance", q:"no health insurance"},
      {label:"No papers", q:"i don't have papers"}
    ],
    playbooksTitle:"Step-by-step guides", playbooksSub:"Not just listings — what to do first, second, third",
    mySaved:"My saved resources", savedEmpty:"Nothing saved yet — tap 🔖 on any resource to keep it here.",
    fbQ:"Was this helpful?", fbThanks:"Thanks — your feedback helps others.", fbUp:"👍 Yes", fbDown:"👎 No",
    shareBtn:"Share", saveBtn:"Save", savedBtn:"Saved ✓",
    footerReviewed:"Directory last reviewed October 2026.",
  },
  es: {
    catNames: { "Housing":"Vivienda","Food":"Alimentos","Financial & Banking":"Finanzas y Banca","Healthcare":"Salud",
      "Employment & Workforce":"Empleo y Fuerza Laboral","Education & Academic Support":"Educación y Apoyo Académico",
      "Legal & Civic":"Legal y Cívico","Identity & Cultural":"Identidad y Cultura","Senior & Disability":"Adultos Mayores y Discapacidad",
      "Family & Childcare":"Familia y Cuidado Infantil","Utilities":"Servicios Públicos","Veterans":"Veteranos",
      "General Hub / Directory":"Directorio General","Immigrant & ITIN Resources":"Recursos para Inmigrantes / ITIN" },
    heroEyebrow:"Federal · Estatal · Condado y Ciudad · Universidad · Comunidad",
    heroH1_pre:"Encuentra ayuda real en ", heroH1_em:"Nuevo México", heroH1_post:".",
    heroP:"Vivienda, alimentos, ayuda financiera, salud y más — reunidos de agencias públicas y organizaciones comunitarias, desde Gallup hasta Santa Fe y Albuquerque.",
    heroBigNumLabel:"Recursos catalogados",
    searchPlaceholder:"Busca recursos, organizaciones, palabras clave...",
    toggleImm:"ITIN / Relacionado con inmigrantes", toggleHidden:"Recursos poco conocidos", toggleMap:"📍 Ver mapa",
    home:"Inicio",
    qsTitle:"¿Qué está pasando?", qsSub:"Sin necesidad de buscar — dinos tu situación",
    qs:[
      {label:"Necesito un lugar para quedarme esta noche"},{label:"Estoy atrasado con la renta o una factura"},{label:"Necesito comida"},
      {label:"No tengo número de Seguro Social"},{label:"Soy estudiante y necesito dinero rápido"},
      {label:"Necesito atención médica pero no tengo seguro"}
    ],
    browseByCategory:"Explorar por categoría", totalResources:"recursos en total",
    searchResults:"Resultados de búsqueda", found:"encontrados",
    filteredResults:"Resultados filtrados",
    relatedResources:"Recursos relacionados", curatedSub:"Conexiones verificadas a mano, no solo coincidencias de categoría",
    directlyConnected:"conectado directamente", hiddenGem:"poco conocido", unverified:"sin verificar",
    itinBadge:"ITIN/inmigrante", curatedResourcesFor:"recursos seleccionados para esta situación",
    backToList:"Volver a la lista", backToCategories:"Volver a categorías", copyLink:"Copiar enlace", copied:"✓ Copiado",
    fldOrg:"Organización", fldWhat:"Qué ofrece", fldHow:"Cómo acceder", fldElig:"Lista de Requisitos",
    fldContact:"Contacto", fldSource:"Fuente",
    mapViewTitle:"Vista de mapa", mapKnownLoc:"recursos con ubicación conocida",
    mapDisclaimerTitle:"Las ubicaciones provienen de geocodificación de direcciones.",
    mapDisclaimerBody:"Los pines se colocaron geocodificando la dirección de cada recurso (revisión de octubre de 2026) — mucho más preciso que las estimaciones anteriores, pero confirma la dirección exacta en la página del recurso antes de viajar a un lugar desconocido, especialmente para refugios y clínicas.",
    howRibbon:[
      {n:"01",h:"Busca o explora",p:"Escribe lo que necesitas, o haz clic en una categoría para ver todo lo que contiene."},
      {n:"02",h:"Revisa las etiquetas",p:"Etiquetas de región, además de \"poco conocido\" y \"sin verificar\" cuando aplique."},
      {n:"03",h:"Abre la página",p:"Qué ofrece, cómo acceder, requisitos y un contacto directo."},
      {n:"04",h:"Llama antes de ir",p:"Los programas cambian — trata esto como un buen punto de partida, no la última palabra."}
    ],
    faqTitle:"Preguntas frecuentes",
    faqs:[
      { q:"¿Es este un sitio web oficial del gobierno?", a:"No. Este es un directorio compilado por la comunidad. Los recursos son reales, pero este sitio no es un servicio oficial de ninguna agencia municipal, estatal o federal." },
      { q:"¿Qué tan actualizada está esta información?", a:"Los horarios, requisitos y datos de contacto cambian con el tiempo. Las entradas marcadas \"Sin verificar\" no han sido confirmadas de forma independiente — verifica antes de confiar en ellas." },
      { q:"¿Qué significa \"poco conocido\"?", a:"Indica recursos que son reales pero genuinamente poco publicitados — cosas que la mayoría de la gente nunca conoce a menos que alguien se lo diga directamente." },
      { q:"¿Qué muestra el filtro de ITIN / inmigrante?", a:"Recursos relevantes sin importar el estatus migratorio, o que sirven específicamente a comunidades inmigrantes — banca sin SSN, política de matrícula estatal, ayuda legal y similares." },
      { q:"¿Hay reseñas o calificaciones?", a:"No, intencionalmente. Testimonios inventados en una herramienta que la gente usa para decisiones reales serían engañosos, así que esto se limita a lo verificable de forma independiente." }
    ],
    aboutTitle:"Sobre este proyecto",
    aboutP1:"Este navegador comenzó como un proyecto de mapeo de recursos para identificar servicios disponibles para recién llegados, estudiantes y residentes en Nuevo México — comida, vivienda, salud, educación, empleo, servicios legales y cívicos, servicios financieros y más.",
    aboutP2:"Se convirtió en un árbol de cinco niveles — federal, estatal, condado/ciudad, universidad y comunidad — con atención a recursos genuinamente poco publicitados.",
    aboutList:["Obtenido de páginas de agencias públicas y sitios oficiales de organizaciones","Las entradas inciertas se marcan como \"Sin verificar\", no se presentan como hechos","Sin testimonios, reseñas o respaldos inventados"],
    footerTitle:"Navegador de Recursos de Nuevo México",
    footerAbout:"Un directorio de recursos en Nuevo México compilado por la comunidad. No es un sitio web oficial del gobierno — verifica los detalles antes de confiar en ellos.",
    footerBrowse:"Explorar", footerRegions:"Regiones", footerGoodKnow:"Bueno Saber",
    regions:["Albuquerque / Bernalillo","Área de Santa Fe","Rio Rancho / Sandoval","Los Lunas / Valencia","Gallup y Los Alamos","Estatal y directo con tribus"],
    goodKnow:["Los programas y horarios cambian — llama antes","Sin reseñas inventadas"],
    footerBottom1:"Datos recopilados de agencias públicas y organizaciones comunitarias.", footerBottom2:"No sustituye llamar antes de ir.",
    officialBanner:"Un recurso comunitario compilado para residentes de Nuevo México — no es un sitio web oficial del gobierno. Datos de agencias públicas y organizaciones; verifica los detalles antes de confiar en ellos.",
    noMatch:"Ningún recurso coincide con los filtros actuales.",
    langToggle:"English",
    navHome:"Inicio", navSearch:"Buscar", navMap:"Mapa", navHelp:"Ayuda ya",
    asstTitle:"¿Qué está pasando?",
    asstSub:"Describe tu situación con tus palabras — inglés o español",
    asstPlaceholder:"Ej: perdí mi trabajo y no puedo pagar la renta...",
    asstBtn:"Buscar ayuda",
    asstAiBtn:"✨ Preguntar a la IA", aiThinking:"Pensando…",
    aiError:"La IA no está disponible ahora — prueba la búsqueda de palabras clave.",
    asstNote:"Búsqueda por palabras clave, no IA — encuentra recursos según tus palabras.",
    tryLabel:"Prueba:",
    actCall:"Llamar", actWeb:"Sitio web", actDir:"Cómo llegar",
    sitChips:[
      {label:"Necesito comida", q:"necesito comida"},
      {label:"No puedo pagar la renta", q:"no puedo pagar la renta"},
      {label:"Dónde dormir esta noche", q:"donde puedo dormir esta noche"},
      {label:"Perdí mi trabajo", q:"perdi mi trabajo"},
      {label:"Sin seguro médico", q:"no tengo seguro medico"},
      {label:"Sin papeles", q:"no tengo papeles"}
    ],
    playbooksTitle:"Guías paso a paso", playbooksSub:"No solo listados — qué hacer primero, segundo, tercero",
    mySaved:"Mis recursos guardados", savedEmpty:"Nada guardado aún — toca 🔖 en cualquier recurso para guardarlo aquí.",
    fbQ:"¿Te fue útil?", fbThanks:"Gracias — tu opinión ayuda a otros.", fbUp:"👍 Sí", fbDown:"👎 No",
    shareBtn:"Compartir", saveBtn:"Guardar", savedBtn:"Guardado ✓",
    footerReviewed:"Directorio revisado por última vez en octubre de 2026.",
  }
};
function t(key){ return I18N[lang][key]; }
let detailStack = [];


/* ============================================================
   SMALL UTILITIES
   geoTag() turns a raw dataset "level" string into a friendly region
   label. copyToClipboard()/legacyCopy() handle the share-link button
   with a fallback for non-secure contexts (e.g. local file:// previews,
   where the modern Clipboard API isn't available). makeInteractive()
   makes a clickable <div> keyboard-accessible (Tab + Enter/Space).
   ============================================================ */
function geoTag(level){
  if(level.startsWith("University (UNM) — Branch")) return level.replace("University (UNM) — Branch: ","UNM ");
  if(level.startsWith("Institution — CNM")) return "CNM";
  if(level.startsWith("Institution — SFCC")) return "Santa Fe CC";
  if(level.startsWith("Institution — IAIA")) return "IAIA (Santa Fe)";
  if(level.startsWith("Institution — NM Highlands")) return "NM Highlands";
  if(level.startsWith("Institution — NM Tech")) return "NM Tech";
  if(level.startsWith("Institution — WNMU")) return "Western NMU";
  if(level.startsWith("Institution — ENMU")) return "ENMU-Roswell";
  if(level.startsWith("Institution — Diné")) return "Diné College";
  if(level.startsWith("Institution — NMSU")) return "NMSU";
  if(level.startsWith("Institution — UNM Gallup")) return "UNM Gallup";
  if(level.startsWith("Tribal")) return level.replace("Tribal — ","");
  if(level.includes("Santa Fe")) return "Santa Fe area";
  if(level.includes("Rio Rancho") || level.includes("Sandoval")) return "Rio Rancho / Sandoval";
  if(level.includes("Los Lunas") || level.includes("Valencia")) return "Los Lunas / Valencia";
  if(level.includes("Gallup")) return "Gallup";
  if(level.includes("Los Alamos")) return "Los Alamos";
  if(level.startsWith("University (UNM)")) return "UNM (main campus)";
  if(level==="Federal") return "Federal";
  if(level==="State (NM)") return "Statewide (NM)";
  if(level.startsWith("City") || level.startsWith("County")) return "Albuquerque / Bernalillo";
  return level;
}

function copyToClipboard(text){
  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(text).catch(()=>{ legacyCopy(text); });
  } else {
    legacyCopy(text);
  }
}
function legacyCopy(text){
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try{ document.execCommand('copy'); }catch(e){}
  document.body.removeChild(ta);
}

function makeInteractive(el, handler){
  el.setAttribute('tabindex', '0');
  el.setAttribute('role', 'button');
  el.onclick = handler;
  el.onkeydown = (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); handler(); } };
}


/* ============================================================
   ROUTER
   Real pushState-based navigation so the browser's back/forward
   buttons behave like a real website, not just a single page that
   silently swaps content. URL scheme:
     #/                    home
     #/category/<Bucket>   a category's resource list
     #/resource/<id>       a single resource's detail page
     #/map                 the interactive map
     #/crisis              the crisis fast-path panel
     #/situation/<index>   a quick-start situational result set
   Always navigate via navigate(hash) — never mutate path/detailStack/
   mapView directly, or the URL and the on-screen state will drift apart.
   ============================================================ */
function safePushState(hash){
  try{ history.pushState(null, '', hash); }catch(e){ /* sandboxed preview contexts (e.g. about:srcdoc) don't allow URL changes — fail silently */ }
}

// Central navigation function — every click that changes what's on screen should call this
// instead of mutating state + render() directly, so back/forward work like a real site.
function navigate(hash){
  safePushState(hash);
  applyRoute(hash, false);
}

// Reads a #/... path and sets app state to match it, then renders.
// `fromPop` is true when called from a back/forward button (popstate) — in that case
// we must NOT push a new history entry, just reflect the state the browser already moved to.
function applyRoute(hash, fromPop){
  mapView = false; detailStack = []; path = []; filters.search = '';
  document.getElementById('search').value = '';

  if(hash.startsWith('#/resource/')){
    const id = parseInt(hash.split('/')[2]);
    const found = DATA.find(x=>x.id===id);
    if(found){ path=[found.bucket]; detailStack=[found]; }
  } else if(hash.startsWith('#/category/')){
    const bucket = decodeURIComponent(hash.split('/')[2]);
    if(ICONS[bucket]) path=[bucket];
  } else if(hash === '#/map'){
    mapView = true;
  } else if(hash === '#/crisis'){
    renderCrisisRoute();
    return;
  } else if(hash === '#/saved'){
    renderSavedRoute();
    return;
  } else if(hash.startsWith('#/playbook/')){
    const pid = decodeURIComponent(hash.split('/')[2]);
    renderPlaybookRoute(pid);
    return;
  } else if(hash.startsWith('#/situation/')){
    const idx = parseInt(hash.split('/')[2]);
    if(QUICK_START[idx]) { renderSituationRoute(idx); return; }
  }
  // any other/unknown hash (including '#/' or '#') falls through to home
  render();
}

window.addEventListener('popstate', ()=>{ applyRoute(location.hash || '#/', true); });

function icon(name, size=20){
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`;
}


/* ============================================================
   SMART SEARCH
   Deterministic scoring shared by the main search box and the
   keyword-matching assistant. Handles:
     - synonym expansion (EN + ES): "rent"->housing, "comida"->food
     - common multi-word phrases: "food stamps", "sin papeles"
     - typo tolerance: small Levenshtein distance per word
     - accent normalization: "medico" matches "médico"
   This is still plain keyword scoring over the dataset, NOT a
   real AI — don't oversell it in comments or UI.
   ============================================================ */
function normStr(s){ return (s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""); }

var SEARCH_SYNONYMS = {
  /* --- English --- */
  "rent":["housing","rental","apartment","eviction","landlord"],
  "rental":["housing","rent","apartment"],"apartment":["housing","rent","rental"],
  "eviction":["housing","rent","legal"],"homeless":["shelter","housing"],"shelter":["housing"],
  "food":["pantry","meal","groceries","snap","ebt"],"hungry":["food","pantry","meal"],
  "snap":["food","ebt","pantry","benefits"],"ebt":["food","snap","pantry"],
  "stamps":["food","snap","ebt"],"groceries":["food","pantry"],
  "job":["employment","work","career","workforce","hiring"],"jobs":["employment","work","career"],
  "work":["employment","job","career"],"unemployed":["employment","job","benefits"],
  "hiring":["employment","job","workforce"],
  "doctor":["healthcare","health","clinic","medical"],"clinic":["healthcare","health","medical"],
  "medical":["healthcare","health","clinic"],"hospital":["healthcare","medical","clinic"],
  "dental":["healthcare","dentist"],"dentist":["healthcare","dental"],
  "mental":["health","counseling","crisis","behavioral"],"therapy":["health","counseling"],
  "counseling":["health","mental","crisis"],"crisis":["hotline","mental","counseling","shelter"],
  "lawyer":["legal","attorney","rights"],"legal":["lawyer","attorney","rights","court"],
  "attorney":["legal","lawyer"],"court":["legal","lawyer"],
  "immigration":["immigrant","itin","undocumented","citizenship"],
  "immigrant":["immigration","itin","undocumented"],"undocumented":["immigrant","itin","immigration"],
  "itin":["immigrant","tax","undocumented"],"citizenship":["immigrant","immigration","legal"],
  "security":["social","ssi","ssdi","benefits"],"benefits":["assistance","financial","snap","ssi"],
  "bill":["utilities","utility","financial","assistance"],"bills":["utilities","financial","assistance"],
  "utilities":["utility","bill","financial"],"electric":["utilities","utility","pnm"],
  "water":["utilities","utility"],"gas":["utilities","utility"],
  "school":["education","academic","student","college"],"college":["education","unm","student","academic"],
  "student":["education","unm","college","academic"],"scholarship":["education","financial","student"],
  "childcare":["child","family","daycare","youth"],"daycare":["childcare","child","family"],
  "youth":["child","family","teen"],"senior":["aging","elderly","disability"],
  "elderly":["senior","aging","disability"],"disabled":["disability","senior","benefits"],
  "veteran":["veterans","military","va"],"military":["veteran","veterans"],
  "abuse":["crisis","domestic","violence","shelter"],"domestic":["abuse","violence","crisis","shelter"],
  "violence":["abuse","crisis","shelter"],"suicide":["crisis","hotline","mental"],
  "money":["financial","assistance","cash"],"cash":["financial","assistance"],
  "loan":["financial","credit","lending"],"credit":["financial","loan"],
  "tax":["itin","financial","free"],"bus":["transportation","transit","ride"],
  "transportation":["bus","transit","ride"],"internet":["digital","computer","wifi"],
  "computer":["digital","internet","technology"],"phone":["digital","lifeline","communication"],
  /* --- Spanish --- */
  "renta":["housing","rent","apartment"],"alquiler":["housing","rent"],
  "comida":["food","pantry","meal"],"comer":["food","pantry"],"despensa":["food","pantry"],
  "hambre":["food","pantry","meal"],
  "trabajo":["employment","job","work"],"empleo":["employment","job"],
  "desempleado":["employment","unemployed","job"],"contratando":["employment","hiring"],
  "salud":["healthcare","health","clinic"],"medico":["healthcare","doctor","clinic"],
  "clinica":["healthcare","clinic","medical"],
  "dentista":["dental","healthcare"],
  "terapia":["therapy","health","counseling"],"consejeria":["counseling","health"],
  "abogado":["legal","lawyer"],"ley":["legal","lawyer","rights"],"corte":["legal","court"],
  "papeles":["immigrant","itin","legal"],"indocumentado":["immigrant","undocumented","itin"],
  "inmigrante":["immigrant","immigration"],"inmigracion":["immigration","immigrant"],
  "ciudadania":["citizenship","immigrant"],
  "cuentas":["bills","utilities","financial"],"factura":["bill","utilities"],
  "luz":["utilities","electric","utility"],"electricidad":["utilities","electric"],
  "escuela":["school","education"],"universidad":["college","education","unm"],
  "estudiante":["student","education"],"beca":["scholarship","education"],
  "colegio":["school","education"],
  "ninos":["child","family","childcare"],"familia":["family","child","youth"],
  "cuidado":["childcare","care"],"anciano":["senior","aging","elderly"],
  "discapacitado":["disabled","disability"],"veterano":["veteran","veterans"],
  "refugio":["shelter","housing"],"albergue":["shelter","housing"],
  "ayuda":["assistance","help","financial"],"dinero":["financial","money","assistance"],
  "casa":["housing","home","shelter"],"hogar":["housing","home"],
  "autobus":["bus","transportation"],"transporte":["transportation","bus"],
  "computadora":["computer","digital"]
};

var SEARCH_PHRASES = {
  "food stamps":["food","snap","ebt","pantry"],
  "sin papeles":["immigrant","itin","undocumented","legal"],
  "no social":["immigrant","itin","undocumented"],
  "social security":["social","ssi","benefits"],
  "need help":["assistance","help"],
  "perdi mi trabajo":["employment","unemployed","job"],
  "no puedo pagar":["financial","assistance","bill"],
  "can't pay":["financial","assistance","bill"],
  "lugar para quedarse":["shelter","housing"],
  "place to stay":["shelter","housing"]
};

function levDist(a,b){
  var m=a.length,n=b.length;
  if(!m) return n; if(!n) return m;
  var prev=[],cur=[];
  for(var j=0;j<=n;j++) prev[j]=j;
  for(var i=1;i<=m;i++){
    cur[0]=i;
    for(var k=1;k<=n;k++){
      cur[k]=Math.min(prev[k]+1, cur[k-1]+1, prev[k-1]+(a[i-1]===b[k-1]?0:1));
    }
    var tmp=prev; prev=cur; cur=tmp;
  }
  return prev[n];
}

function fuzzyThreshold(w){ return w.length<5 ? 1 : 2; }

/* Returns 2 for exact/substring match, 1 for fuzzy match, 0 for no match */
function matchWordInTokens(qw, tokens){
  var i, t;
  for(i=0;i<tokens.length;i++){
    t=tokens[i];
    if(t.indexOf(qw)!==-1 || (qw.length>3 && qw.indexOf(t)!==-1 && t.length>3)) return 2;
  }
  if(qw.length>=4){
    var thr=fuzzyThreshold(qw);
    for(i=0;i<tokens.length;i++){
      t=tokens[i];
      if(t[0]!==qw[0]) continue;              /* first-letter gate kills most false positives */
      if(Math.abs(t.length-qw.length)>thr) continue;
      if(levDist(qw,t)<=thr) return 1;
    }
  }
  return 0;
}

function expandQuery(query){
  var q=normStr(query), out=[], seen={};
  function add(w){ if(w && w.length>=3 && !seen[w]){ seen[w]=1; out.push(w); } }
  var pq;
  for(pq in SEARCH_PHRASES){
    if(q.indexOf(pq)!==-1){
      SEARCH_PHRASES[pq].forEach(add);
    }
  }
  q.split(/\s+/).forEach(function(w){
    add(w);
    var syn=SEARCH_SYNONYMS[w];
    if(syn) syn.forEach(add);
  });
  return out;
}

function resourceBlob(r){
  return normStr(r.name+" "+r.org+" "+r.what+" "+r.domain+" "+r.elig);
}

/* Score a resource against a query; 0 = no match */
function scoreResource(r, query){
  var words=expandQuery(query);
  if(!words.length) return 0;
  var tokens=resourceBlob(r).split(/\s+/), score=0;
  words.forEach(function(w){ score+=matchWordInTokens(w,tokens); });
  return score;
}

/* ============================================================
   PHRASE BANK — real phrases people type when they need help
   (EN + ES). phraseSuggest() returns the hand-mapped resources for
   a query; keywordMatch() shows those first, then fills with scored
   keyword results. Still deterministic matching, not AI.
   ============================================================ */
// PHRASE_SUGGESTIONS: ~1000 real-world EN/ES phrases hand-mapped to dataset resources.
// Generated 2026-10-11. Every resource name validated against the 241-row dataset.
// PHRASE_SUGGESTIONS: ~1000 real-world EN/ES phrases hand-mapped to dataset resources.
// Generated 2026-10-11 (v3: 4-worker draft + v1 core phrases restored). Every name validated.
const PHRASE_SUGGESTIONS = [
  { match: ["internet assistance"], names: ["EveryoneOn", "Lifeline"] },
  { match: ["need childcare", "can't afford daycare", "childcare assistance", "necesito cuidado de ninos", "guarderia"], names: ["NM Child Care Assistance Program"] },
  { match: ["scholarship", "scholarships for college", "becas", "beca", "necesito una beca", "becas universitarias"], names: ["NM Opportunity Scholarship", "NM Legislative Lottery Scholarship", "El Centro External Scholarship Hub"] },
  { match: ["i'm a student and need money", "broke college student", "estudiante sin dinero"], names: ["Dean of Students Emergency Scholarship", "UNM Short-Term Emergency Loan", "ASUNM Emergency Scholarship & Advocacy Scholarship"] },
  { match: ["maltrato"], names: ["Rape Crisis Center of Central New Mexico", "Barrett House / ABQ Rescue Mission Women's Center of Hope", "New Mexico Crisis and Access Line"] },
  { match: ["i need help right now", "help me now", "it's an emergency", "necesito ayuda ahora mismo", "emergencia", "ayuda urgente", "es una emergencia"], names: ["New Mexico Crisis and Access Line", "Agora Crisis Center", "Good Shepherd Center"] },
  { match: ["help paying rent or bills", "need help paying", "necesito ayuda para pagar"], names: ["Salvation Army Bill Pay Assistance", "PNM Good Neighbor Fund + PNM CARES", "New Mexico Home Fund"] },
  { match: ["behind on bills", "help with bills", "atrasado en las cuentas", "no puedo pagar las cuentas", "atrasado en pagos"], names: ["PNM Good Neighbor Fund + PNM CARES", "HEAT New Mexico", "Salvation Army Bill Pay Assistance"] },
  { match: ["can't pay electric bill", "electric bill help", "power shut off", "lights shut off", "no puedo pagar la luz", "me van a cortar la luz", "ayuda con la luz"], names: ["PNM Good Neighbor Fund + PNM CARES", "LIHEAP (Low Income Home Energy Assistance)", "HEAT New Mexico"] },
  { match: ["immigration lawyer", "immigration attorney", "need an immigration lawyer", "abogado de inmigracion", "necesito abogado de inmigracion", "abogado migratorio"], names: ["New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["itin", "itin number", "tax id number", "individual taxpayer", "numero itin", "sacar el itin"], names: ["UNM ITIN Application Guidance", "NM Working Families Tax Credit — ITIN Filers Included", "Homewise ITIN Mortgage Loans"] },
  { match: ["i don't have papers", "no social security number", "don't have a social security", "no tengo papeles", "sin papeles", "no tengo seguro social", "no ssn"], names: ["New Mexico Immigrant Law Center (NMILC)", "Enlace Comunitario", "Undocumented UNM (undocumented.unm.edu)"] },
  { match: ["i want to die", "thinking of suicide", "kill myself", "suicidal", "quiero morirme", "quiero quitarme la vida"], names: ["New Mexico Crisis and Access Line", "Agora Crisis Center"] },
  { match: ["mental health", "feeling depressed", "depression", "anxiety help", "salud mental", "depresion", "me siento deprimido", "ansiedad"], names: ["Agora Crisis Center", "New Mexico Crisis and Access Line"] },
  { match: ["tooth hurts", "toothache", "need a dentist", "dental care", "cheap dentist", "me duele un diente", "dolor de muela", "necesito un dentista", "dentista barato"], names: ["First Choice Community Healthcare", "La Familia Medical Center"] },
  { match: ["no health insurance", "don't have insurance", "can't afford insurance", "sin seguro medico", "no tengo seguro", "no tengo seguro medico"], names: ["UNM Care and Out of County Care", "First Choice Community Healthcare", "Presbyterian Healthcare Services — Financial Assistance"] },
  { match: ["i need a doctor", "need to see a doctor", "find a doctor", "necesito un doctor", "necesito ver un medico", "buscar un doctor"], names: ["First Choice Community Healthcare", "UNM Care and Out of County Care", "La Familia Medical Center"] },
  { match: ["unemployment", "file for unemployment", "desempleo"], names: ["NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["i need a job", "looking for work", "need work", "find a job", "necesito trabajo", "busco trabajo", "necesito empleo", "busco empleo"], names: ["NM Dept. of Workforce Solutions (DWS)", "Library Job & Career Guide — 'Working It Out!'"] },
  { match: ["i lost my job", "just lost my job", "got fired", "i was laid off", "perdi mi trabajo", "me despidieron", "me quede sin trabajo", "perdi el trabajo"], names: ["NM Dept. of Workforce Solutions (DWS)", "Library Job & Career Guide — 'Working It Out!'"] },
  { match: ["women infants children"], names: ["WIC (Women, Infants & Children)"] },
  { match: ["free groceries", "free food distribution", "despensa gratis", "comida gratis", "distribucion de comida"], names: ["Roadrunner Food Bank", "Storehouse New Mexico", "The Food Depot"] },
  { match: ["beneficios snap"], names: ["SNAP (federally funded, state-administered)"] },
  { match: ["i'm hungry", "my kids are hungry", "we're hungry", "tengo hambre", "mis hijos tienen hambre", "tenemos hambre"], names: ["Roadrunner Food Bank", "Storehouse New Mexico", "Noon Day Ministry"] },
  { match: ["i need food", "need food", "we need food", "need groceries", "necesito comida", "necesitamos comida", "necesito alimentos"], names: ["Roadrunner Food Bank", "Storehouse New Mexico", "Rio Grande Food Project", "Lobo Food Pantry"] },
  { match: ["looking for a cheap apartment", "affordable apartment", "cheap rent", "cheap apartments near me", "busco apartamento barato", "apartamento barato", "renta barata", "apartamentos baratos"], names: ["Manzano Vista", "Bluewater Village", "Sandia Vista", "Aztec Village"] },
  { match: ["i can't pay rent", "can't pay my rent", "no tengo para la renta"], names: ["New Mexico Home Fund", "Albuquerque Housing Authority", "Housing Choice Voucher Program (Section 8)"] },
  { match: ["i'm homeless", "we are homeless", "my family is homeless", "estoy sin hogar", "no tengo hogar", "estamos sin hogar", "persona sin hogar"], names: ["Albuquerque Heading Home", "Good Shepherd Center", "Joy Junction", "Family Promise of Albuquerque"] },
  { match: ["i'm being evicted", "getting evicted", "eviction notice", "landlord is kicking me out", "aviso de desalojo", "desalojo", "el dueno me quiere sacar"], names: ["New Mexico Legal Aid", "Albuquerque Housing Authority", "HUD Albuquerque Field Office"] },
  { match: ["i need a place to stay tonight", "need somewhere to stay tonight", "where can i sleep tonight", "need shelter tonight", "necesito un lugar donde quedarme esta noche", "donde puedo dormir esta noche", "no tengo donde dormir", "necesito refugio esta noche"], names: ["Albuquerque Heading Home", "Good Shepherd Center", "Joy Junction", "Barrett House / ABQ Rescue Mission Women's Center of Hope"] },
  { match: ["fafsa", "apply for fafsa", "fafsa application", "llenar fafsa", "solicitar fafsa"], names: ["FAFSA / Federal Pell Grant", "UNM-Gallup Office of Financial Aid"] },
  { match: ["pell grant", "federal pell grant", "beca pell", "pell grant eligibility"], names: ["FAFSA / Federal Pell Grant", "NM Opportunity Scholarship"] },
  { match: ["financial aid for college", "how to pay for college", "ayuda financiera para la universidad", "como pagar la universidad"], names: ["FAFSA / Federal Pell Grant", "NM Opportunity Scholarship", "NM Legislative Lottery Scholarship"] },
  { match: ["free money for school", "grants for college", "dinero gratis para estudiar", "becas del gobierno federal"], names: ["FAFSA / Federal Pell Grant", "Federal Work-Study"] },
  { match: ["fafsa help", "help filling out fafsa", "ayuda con fafsa"], names: ["FAFSA / Federal Pell Grant", "American Indian Student Services (AISS)", "Center for Financial Capability (CFC)"] },
  { match: ["wic", "wic benefits", "apply for wic"], names: ["WIC (Women, Infants & Children)"] },
  { match: ["baby formula", "formula for baby", "infant formula", "formula para bebe", "leche de formula"], names: ["WIC (Women, Infants & Children)", "SFCC Campus Cupboard + Student Emergency Assistance Fund (SEAF)"] },
  { match: ["i'm pregnant and need help", "pregnant no insurance", "estoy embarazada y necesito ayuda", "embarazada sin seguro"], names: ["WIC (Women, Infants & Children)", "First Choice Community Healthcare", "La Familia Medical Center"] },
  { match: ["food for my kids", "my children need food", "comida para mis hijos", "mis ninos necesitan comer"], names: ["WIC (Women, Infants & Children)", "Roadrunner Food Bank", "SNAP (federally funded, state-administered)"] },
  { match: ["postpartum help", "just had a baby need help", "acabo de tener un bebe", "ayuda posparto"], names: ["WIC (Women, Infants & Children)", "NM Child Care Assistance Program"] },
  { match: ["apply for snap", "food stamps application", "solicitar estampillas", "snap application"], names: ["SNAP (federally funded, state-administered)", "NM Human Services / Health Care Authority — ISD Programs"] },
  { match: ["tanf", "cash assistance", "welfare", "asistencia en efectivo", "ayuda en efectivo", "tanf benefits"], names: ["NM Human Services / Health Care Authority — ISD Programs", "211 New Mexico / United Way of Central NM"] },
  { match: ["isd office", "human services office", "oficina de human services", "income support division"], names: ["NM Human Services / Health Care Authority — ISD Programs", "NM Health Care Authority Field Offices — Rio Rancho & Los Lunas"] },
  { match: ["apply for benefits", "government benefits", "solicitar beneficios del gobierno", "beneficios estatales"], names: ["NM Human Services / Health Care Authority — ISD Programs", "211 New Mexico / United Way of Central NM"] },
  { match: ["teaching scholarship", "scholarship for teachers", "beca para maestros", "quiero ser maestro"], names: ["Grow Your Own Teachers Scholarship", "NM Opportunity Scholarship"] },
  { match: ["funding for education degree", "pay for teaching degree", "quiero estudiar para maestro"], names: ["Grow Your Own Teachers Scholarship", "El Centro External Scholarship Hub"] },
  { match: ["teacher shortage scholarship", "become a teacher new mexico", "ser maestro en nuevo mexico"], names: ["Grow Your Own Teachers Scholarship"] },
  { match: ["education major scholarships", "becas para educacion"], names: ["Grow Your Own Teachers Scholarship", "NM Legislative Lottery Scholarship"] },
  { match: ["211", "call 211", "marcar 211"], names: ["211 New Mexico / United Way of Central NM"] },
  { match: ["don't know where to start", "where do i get help", "no se por donde empezar", "no se donde buscar ayuda", "what help is available"], names: ["211 New Mexico / United Way of Central NM", "City of Albuquerque 311", "HELP New Mexico, Inc. (HELPNM)"] },
  { match: ["need referrals", "refer me to help", "necesito referencias", "referencias de ayuda"], names: ["211 New Mexico / United Way of Central NM"] },
  { match: ["crisis helpline", "helpline", "linea de ayuda"], names: ["211 New Mexico / United Way of Central NM", "New Mexico Crisis and Access Line"] },
  { match: ["public housing", "apply for public housing", "vivienda publica", "solicitar vivienda publica", "housing authority"], names: ["Albuquerque Housing Authority", "HUD Albuquerque Field Office"] },
  { match: ["section 8 voucher", "housing choice voucher", "voucher de seccion 8", "section 8 application"], names: ["Housing Choice Voucher Program (Section 8)", "Albuquerque Housing Authority"] },
  { match: ["low income housing", "affordable housing list", "vivienda de bajos ingresos", "lista de vivienda economica"], names: ["Albuquerque Housing Authority", "Manzano Vista", "Bluewater Village"] },
  { match: ["rent based on income", "pay 30 percent of income rent", "renta basada en ingresos", "pago 30 por ciento de ingreso"], names: ["Albuquerque Housing Authority", "Housing Choice Voucher Program (Section 8)", "Sandia Vista", "Aztec Village", "Manzano Vista", "Bluewater Village"] },
  { match: ["budgeting help", "help with budget", "ayuda con presupuesto", "no se manejar mi dinero"], names: ["Center for Financial Capability (CFC)", "Prosperity Works"] },
  { match: ["free tax prep", "free tax filing", "taxes gratis", "preparacion de impuestos gratis"], names: ["Center for Financial Capability (CFC)", "AARP Tax-Aide", "Earned Income Tax Credit (EITC) & Child Tax Credit", "UNM ITIN Application Guidance", "Federal Tax Credits Still Available to ITIN Filers"] },
  { match: ["credit help", "build my credit", "fix my credit", "ayuda con credito", "mejorar mi credito"], names: ["Center for Financial Capability (CFC)"] },
  { match: ["money management", "financial coaching", "manejo de dinero", "consejeria financiera"], names: ["Center for Financial Capability (CFC)", "Guadalupe Credit Union"] },
  { match: ["scholarship search help", "help finding scholarships", "ayuda para buscar becas"], names: ["Center for Financial Capability (CFC)", "El Centro External Scholarship Hub", "Center for Financial Capability Scholarship Index"] },
  { match: ["native american student", "indigenous student help", "estudiante nativo americano", "estudiante indigena"], names: ["American Indian Student Services (AISS)", "Albuquerque Indian Center (AIC)"] },
  { match: ["native student scholarship", "tribal scholarship", "beca tribal", "beca para nativos"], names: ["American Indian Student Services (AISS)", "El Centro External Scholarship Hub"] },
  { match: ["native american center", "urban indian center", "centro indigena urbano"], names: ["Albuquerque Indian Center (AIC)", "American Indian Student Services (AISS)"] },
  { match: ["first nations student", "pueblo student"], names: ["American Indian Student Services (AISS)", "Five Sandoval Indian Pueblos, Inc. (FSIP) — Behavioral Health Services"] },
  { match: ["veteran student", "student veteran help", "estudiante veterano", "veterano en la universidad"], names: ["Veteran & Military Resource Center", "NM Dept. of Veterans' Services (NMDVS) — Benefits Overview"] },
  { match: ["gi bill", "gi bill help", "va education benefits", "beneficios gi bill"], names: ["Veteran & Military Resource Center", "NM Veterans' Dependents Tuition Waiver", "VA Albuquerque Regional Benefit Office"] },
  { match: ["military affiliated student", "military family student", "familia militar estudiante"], names: ["Veteran & Military Resource Center"] },
  { match: ["va benefits help", "veteran benefits assistance", "ayuda con beneficios de veterano"], names: ["Veteran & Military Resource Center", "VA Albuquerque Regional Benefit Office"] },
  { match: ["student health center", "unm health center", "centro de salud estudiantil"], names: ["Student Health and Counseling (SHAC)"] },
  { match: ["need counseling", "i need therapy", "student counseling", "necesito terapia", "consejeria estudiantil"], names: ["Student Health and Counseling (SHAC)", "Manzanita Counseling Training Clinic", "Wellness CNM — Case Management & Free Counseling"] },
  { match: ["women's health clinic", "clinica de salud para mujeres"], names: ["Student Health and Counseling (SHAC)", "First Choice Community Healthcare", "Women's Resource Center (WRC)"] },
  { match: ["student doctor", "doctor on campus", "doctor en el campus"], names: ["Student Health and Counseling (SHAC)", "First Choice Community Healthcare"] },
  { match: ["small business help", "free business consulting", "ayuda para pequeno negocio", "consultoria gratis negocio"], names: ["Anderson School of Management — Small Business Institute", "U.S. Small Business Administration (SBA) — New Mexico District Office"] },
  { match: ["business student resume", "resume building business", "experiencia para resume negocios"], names: ["Anderson School of Management — Small Business Institute", "Career Services Center"] },
  { match: ["help my small business", "my business needs help", "mi negocio necesita ayuda"], names: ["Anderson School of Management — Small Business Institute", "U.S. Small Business Administration (SBA) — New Mexico District Office"] },
  { match: ["start a business", "how to start a business", "quiero poner un negocio", "como abrir un negocio"], names: ["U.S. Small Business Administration (SBA) — New Mexico District Office", "NM Business Registration Without an SSN"] },
  { match: ["goldwater scholarship", "barry goldwater", "beca goldwater"], names: ["Barry M. Goldwater Scholarship"] },
  { match: ["stem scholarship", "science scholarship", "beca stem", "beca de ciencias"], names: ["Barry M. Goldwater Scholarship", "El Centro External Scholarship Hub"] },
  { match: ["phd track funding", "undergrad research funding", "quiero hacer doctorado"], names: ["Barry M. Goldwater Scholarship", "SAAP Graduate Assistantships"] },
  { match: ["prestigious scholarship", "national scholarship"], names: ["Barry M. Goldwater Scholarship"] },
  { match: ["looking for roommate", "need a roommate", "busco roommate", "busco companero de cuarto"], names: ["UNM Off-Campus Housing Board"] },
  { match: ["off campus housing", "apartments near unm", "vivienda fuera del campus", "apartamentos cerca de unm"], names: ["UNM Off-Campus Housing Board", "Manzano Vista", "Bluewater Village"] },
  { match: ["room for rent", "rent a room", "busco cuarto", "cuarto de renta"], names: ["UNM Off-Campus Housing Board"] },
  { match: ["student housing", "housing for students", "vivienda estudiantil"], names: ["UNM Off-Campus Housing Board", "Lobo Food Pantry"] },
  { match: ["academic advising help", "need an advisor coehs", "consejeria academica"], names: ["COEHS Pathways for Academic Support and Success", "Office of Advising Strategies / LoboTrax", "Arts & Sciences Center for Academic Success (ASCAS)", "University College Advising"] },
  { match: ["zoom advising", "online advising", "asesoria por zoom", "consejeria en linea"], names: ["COEHS Pathways for Academic Support and Success"] },
  { match: ["education college advising", "consejeria facultad de educacion"], names: ["COEHS Pathways for Academic Support and Success", "University College Advising"] },
  { match: ["off campus student advising", "nontraditional student help"], names: ["COEHS Pathways for Academic Support and Success"] },
  { match: ["international student", "f1 student help", "estudiante internacional", "soy estudiante internacional"], names: ["Global Education Office (GEO) / International Student & Scholar Services (ISSS)"] },
  { match: ["visa help", "student visa", "visa de estudiante", "ayuda con visa"], names: ["Global Education Office (GEO) / International Student & Scholar Services (ISSS)", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["opt", "stem opt", "work authorization student", "permiso de trabajo estudiante", "opt application"], names: ["Global Education Office (GEO) / International Student & Scholar Services (ISSS)"] },
  { match: ["study in the us", "come study new mexico", "estudiar en estados unidos"], names: ["Global Education Office (GEO) / International Student & Scholar Services (ISSS)", "CELAC (Intensive English Program)"] },
  { match: ["law student emergency", "law school emergency money", "estudiante de leyes emergencia"], names: ["School of Law Emergency Financial Aid Fund", "Dean of Students Emergency Scholarship"] },
  { match: ["emergency financial aid", "emergency grant student", "ayuda financiera de emergencia"], names: ["School of Law Emergency Financial Aid Fund", "Rust Opportunity Assistance Fund", "Student Success Access Grant"] },
  { match: ["displaced by fire", "lost housing fire", "fire displaced me", "me quede sin casa por incendio"], names: ["School of Law Emergency Financial Aid Fund", "FEMA Individual Assistance", "211 New Mexico / United Way of Central NM"] },
  { match: ["up to 1000 emergency", "1000 dollars emergency help", "mil dolares emergencia"], names: ["School of Law Emergency Financial Aid Fund", "Dean of Students Emergency Scholarship"] },
  { match: ["graduate assistantship", "grad assistant", "asistente graduado", "asistente de posgrado"], names: ["SAAP Graduate Assistantships", "Grad Studies Funding Database (Pivot)"] },
  { match: ["funding for grad school", "pay for masters degree", "como pagar la maestria", "fondos para posgrado"], names: ["SAAP Graduate Assistantships", "Grad Studies Funding Database (Pivot)", "FAFSA / Federal Pell Grant"] },
  { match: ["tuition waiver grad", "stipend graduate student", "estipendio estudiante graduado"], names: ["SAAP Graduate Assistantships"] },
  { match: ["work for tuition", "job at university grad", "trabajo en la universidad posgrado"], names: ["SAAP Graduate Assistantships", "Federal Work-Study"] },
  { match: ["volunteer", "volunteering", "voluntariado", "quiero ser voluntario", "donde ser voluntario"], names: ["Community Engagement Center"] },
  { match: ["service learning", "community service hours", "horas de servicio comunitario", "aprendizaje servicio"], names: ["Community Engagement Center"] },
  { match: ["community projects", "get involved community", "involucrarme en la comunidad", "proyectos comunitarios"], names: ["Community Engagement Center", "HELP New Mexico, Inc. (HELPNM)"] },
  { match: ["volunteer abq", "volunteer albuquerque", "voluntariado albuquerque"], names: ["Community Engagement Center", "211 New Mexico / United Way of Central NM"] },
  { match: ["gallup financial aid", "unm gallup fafsa", "ayuda financiera gallup"], names: ["UNM-Gallup Office of Financial Aid", "FAFSA / Federal Pell Grant"] },
  { match: ["financial aid gallup campus", "unm gallup grants"], names: ["UNM-Gallup Office of Financial Aid"] },
  { match: ["work study gallup", "student loans gallup"], names: ["UNM-Gallup Office of Financial Aid", "Federal Work-Study"] },
  { match: ["student emergency money", "emergency scholarship", "soy estudiante y necesito dinero", "dinero de emergencia estudiante"], names: ["Dean of Students Emergency Scholarship", "UNM Short-Term Emergency Loan", "ASUNM Emergency Scholarship & Advocacy Scholarship"] },
  { match: ["emergency cash student", "urgent money college", "dinero urgente universidad"], names: ["Dean of Students Emergency Scholarship", "Rust Opportunity Assistance Fund"] },
  { match: ["help with rent student", "can't pay rent student", "no puedo pagar la renta estudiante"], names: ["Dean of Students Emergency Scholarship", "New Mexico Home Fund"] },
  { match: ["emergency groceries student", "no food student emergency", "sin comida estudiante emergencia"], names: ["Dean of Students Emergency Scholarship", "Lobo Food Pantry"] },
  { match: ["up to 1000 dollars student", "thousand dollar emergency grant"], names: ["Dean of Students Emergency Scholarship", "School of Law Emergency Financial Aid Fund"] },
  { match: ["medical student emergency", "med school emergency fund", "estudiante de medicina emergencia"], names: ["Diane J. Klepper, MD Student Affairs Endowment", "School of Law Emergency Financial Aid Fund"] },
  { match: ["board review course help", "usmle prep help", "ayuda para examen medico"], names: ["Diane J. Klepper, MD Student Affairs Endowment"] },
  { match: ["peer tutoring", "need a tutor medical", "tutoria"], names: ["Diane J. Klepper, MD Student Affairs Endowment", "Center for Academic Program Support (CAPS)", "Arts & Sciences Center for Academic Success (ASCAS)"] },
  { match: ["student family emergency", "family crisis student", "emergencia familiar estudiante"], names: ["Diane J. Klepper, MD Student Affairs Endowment", "Dean of Students Emergency Scholarship"] },
  { match: ["population health scholarship", "public health scholarship", "beca salud publica", "beca salud poblacional"], names: ["College of Population Health Scholarships", "El Centro External Scholarship Hub"] },
  { match: ["scholarship health major", "funding public health degree"], names: ["College of Population Health Scholarships", "NM Opportunity Scholarship"] },
  { match: ["undergrad health scholarship", "graduate health scholarship"], names: ["College of Population Health Scholarships"] },
  { match: ["help new mexico", "helpnm", "help nm"], names: ["HELP New Mexico, Inc. (HELPNM)", "211 New Mexico / United Way of Central NM"] },
  { match: ["multi service help", "need lots of help", "necesito mucha ayuda", "ayuda integral"], names: ["HELP New Mexico, Inc. (HELPNM)", "Dept. of Family & Community Services"] },
  { match: ["employment help new mexico", "job help bernalillo", "ayuda de empleo nuevo mexico"], names: ["HELP New Mexico, Inc. (HELPNM)", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["housing help new mexico", "ayuda de vivienda nuevo mexico"], names: ["HELP New Mexico, Inc. (HELPNM)", "New Mexico Home Fund"] },
  { match: ["behavioral health help", "ayuda salud mental nuevo mexico"], names: ["HELP New Mexico, Inc. (HELPNM)", "Agora Crisis Center"] },
  { match: ["domestic violence", "my partner hits me", "violencia domestica", "mi pareja me pega", "violencia en el hogar"], names: ["Enlace Comunitario", "Rape Crisis Center of Central New Mexico", "New Mexico Crisis and Access Line"] },
  { match: ["protective order", "order of protection", "orden de proteccion", "orden de restriccion", "necesito orden de proteccion"], names: ["Enlace Comunitario", "Albuquerque Family Advocacy Center (AFAC)", "New Mexico Legal Aid"] },
  { match: ["abusive relationship", "being abused", "relacion abusiva", "me maltratan"], names: ["Enlace Comunitario", "Barrett House / ABQ Rescue Mission Women's Center of Hope"] },
  { match: ["bilingual domestic violence help", "ayuda bilingue violencia domestica"], names: ["Enlace Comunitario"] },
  { match: ["therapy for abuse victims", "terapia para victimas", "counseling domestic violence"], names: ["Enlace Comunitario", "Agora Crisis Center"] },
  { match: ["jewish student", "jewish life unm", "estudiante judio"], names: ["Hillel at UNM", "Jewish Community Center (JCC) of Greater Albuquerque"] },
  { match: ["shabbat", "shabbat dinner", "kosher meals", "comida kosher"], names: ["Hillel at UNM"] },
  { match: ["synagogue", "sinagoga", "jewish community"], names: ["Jewish Community Center (JCC) of Greater Albuquerque", "Hillel at UNM"] },
  { match: ["hebrew classes", "clases de hebreo"], names: ["Hillel at UNM"] },
  { match: ["urban indian help", "native american services abq", "ayuda nativo americano albuquerque"], names: ["Albuquerque Indian Center (AIC)", "First Nations Community HealthSource"] },
  { match: ["aa meetings native", "substance abuse counseling native", "consejeria adicciones nativos"], names: ["Albuquerque Indian Center (AIC)", "First Choice Community Healthcare"] },
  { match: ["food box native", "hygiene help", "caja de comida"], names: ["Albuquerque Indian Center (AIC)", "Roadrunner Food Bank"] },
  { match: ["dv counseling native", "native domestic violence help"], names: ["Albuquerque Indian Center (AIC)", "Enlace Comunitario"] },
  { match: ["native resume help", "job help native american"], names: ["Albuquerque Indian Center (AIC)", "National Indian Youth Council / Native Professional Advancement Center"] },
  { match: ["disability services", "services for disabled adults", "servicios para discapacitados", "ayuda discapacidad"], names: ["ARCA (Albuquerque Resource Center for the Advancement of the Disabled)", "Adelante Development Center"] },
  { match: ["supported living", "residential services disability", "vivienda con apoyo discapacidad"], names: ["ARCA (Albuquerque Resource Center for the Advancement of the Disabled)"] },
  { match: ["job training disabled", "vocational training disability", "entrenamiento laboral discapacidad"], names: ["ARCA (Albuquerque Resource Center for the Advancement of the Disabled)", "NM Division of Vocational Rehabilitation (NMDVR)"] },
  { match: ["special needs adult care", "cuidado adulto necesidades especiales"], names: ["ARCA (Albuquerque Resource Center for the Advancement of the Disabled)", "Agua Azul"] },
  { match: ["veteran scholarship", "scholarship for veterans", "beca para veteranos", "beca veterano"], names: ["NM Vietnam Veterans' Scholarship", "Veteran & Military Resource Center"] },
  { match: ["free tuition veteran", "colegiatura gratis veterano"], names: ["NM Vietnam Veterans' Scholarship", "NM Veterans' Dependents Tuition Waiver"] },
  { match: ["veteran college funding", "funding for veteran student"], names: ["NM Vietnam Veterans' Scholarship", "NM Opportunity Scholarship"] },
  { match: ["books and fees veteran", "libros y colegiatura veterano"], names: ["NM Vietnam Veterans' Scholarship"] },
  { match: ["undocumented student", "dreamer unm", "estudiante indocumentado", "soy indocumentado estudiante"], names: ["Undocumented UNM (undocumented.unm.edu)", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["unm without papers", "college no ssn", "universidad sin papeles", "estudiar sin seguro social"], names: ["Undocumented UNM (undocumented.unm.edu)", "In-State Tuition & State Financial Aid for Undocumented Students"] },
  { match: ["daca student unm", "dreamer resources"], names: ["Undocumented UNM (undocumented.unm.edu)", "DACA Coverage Bridge (status uncertain as of Aug 2026)"] },
  { match: ["financial aid undocumented", "ayuda financiera indocumentados"], names: ["Undocumented UNM (undocumented.unm.edu)", "NM Opportunity Scholarship"] },
  { match: ["know your rights undocumented", "conozca sus derechos indocumentado"], names: ["Undocumented UNM (undocumented.unm.edu)", "Enlace Comunitario"] },
  { match: ["refugee help", "refugee services", "ayuda para refugiados", "refugiado"], names: ["Lutheran Family Services Rocky Mountains (LFS) — Refugee & Asylee Program", "Immigrant and Refugee Resource Village of Albuquerque (IRRVA)"] },
  { match: ["asylum seeker help", "seeking asylum", "pidiendo asilo", "solicitante de asilo"], names: ["Lutheran Family Services Rocky Mountains (LFS) — Refugee & Asylee Program", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["resettlement help", "just arrived refugee", "recien llegado refugiado", "reasentamiento"], names: ["Lutheran Family Services Rocky Mountains (LFS) — Refugee & Asylee Program"] },
  { match: ["esl classes refugee", "english for refugees", "ingles para refugiados"], names: ["Lutheran Family Services Rocky Mountains (LFS) — Refugee & Asylee Program", "CELAC (Intensive English Program)"] },
  { match: ["refugee job placement", "trabajo para refugiados"], names: ["Lutheran Family Services Rocky Mountains (LFS) — Refugee & Asylee Program", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["bank account itin", "open account with itin", "cuenta de banco con itin", "abrir cuenta con itin"], names: ["ITIN Banking — General Access Explainer", "Rio Grande Credit Union — Juntos Avanzamos Program", "Nusenda Credit Union — UNM Student Union Branch"] },
  { match: ["bank without ssn", "bank account no social security", "banco sin seguro social"], names: ["ITIN Banking — General Access Explainer", "Guadalupe Credit Union"] },
  { match: ["itin at bank", "do banks accept itin", "aceptan itin en el banco"], names: ["ITIN Banking — General Access Explainer"] },
  { match: ["credit union itin", "cooperativa de credito itin"], names: ["ITIN Banking — General Access Explainer", "Rio Grande Credit Union — Juntos Avanzamos Program"] },
  { match: ["refugee women help", "immigrant women sewing", "mujeres refugiadas", "mujeres inmigrantes ayuda"], names: ["Immigrant and Refugee Resource Village of Albuquerque (IRRVA)", "Lutheran Family Services Rocky Mountains (LFS) — Refugee & Asylee Program"] },
  { match: ["esl tutoring", "english tutoring immigrant", "tutoria de ingles"], names: ["Immigrant and Refugee Resource Village of Albuquerque (IRRVA)", "CELAC (Intensive English Program)"] },
  { match: ["learn to sew", "vocational training refugee", "aprender a coser"], names: ["Immigrant and Refugee Resource Village of Albuquerque (IRRVA)"] },
  { match: ["adult literacy", "learn to read english", "alfabetizacion adultos"], names: ["Immigrant and Refugee Resource Village of Albuquerque (IRRVA)"] },
  { match: ["how to get itin", "apply for itin", "como sacar el itin", "solicitar itin", "w7 form"], names: ["UNM ITIN Application Guidance", "ITIN Banking — General Access Explainer"] },
  { match: ["itin application help", "ayuda con solicitud itin", "form w7"], names: ["UNM ITIN Application Guidance"] },
  { match: ["what is itin", "que es el itin", "itin explained"], names: ["UNM ITIN Application Guidance", "ITIN Banking — General Access Explainer"] },
  { match: ["itin en espanol", "w7sp", "solicitar itin en espanol"], names: ["UNM ITIN Application Guidance"] },
  { match: ["emergency medicaid", "medicaid emergency", "medicaid de emergencia"], names: ["Emergency Medicaid Coverage for Undocumented Residents", "State-Funded Healthcare Access for Non-Citizens"] },
  { match: ["hospital emergency no papers", "er without insurance undocumented", "emergencia hospital sin papeles", "sala de emergencia sin seguro"], names: ["Emergency Medicaid Coverage for Undocumented Residents", "UNM Care and Out of County Care"] },
  { match: ["medicaid for undocumented", "health coverage no ssn", "cobertura medica indocumentados"], names: ["Emergency Medicaid Coverage for Undocumented Residents", "State-Funded Healthcare Access for Non-Citizens", "BeWell NM Marketplace — No SSN Required (but not ITIN either)"] },
  { match: ["emergency surgery no insurance", "cirugia de emergencia sin seguro"], names: ["Emergency Medicaid Coverage for Undocumented Residents"] },
  { match: ["cnm emergency money", "cnm student emergency", "estudiante cnm emergencia", "dinero emergencia cnm"], names: ["Rust Opportunity Assistance Fund", "CNM Foundation Fund Directory (Basic Needs Fund, Annual Fund, etc.)"] },
  { match: ["car repair help student", "my car broke down", "se me descompuso el carro", "reparacion de carro ayuda"], names: ["Rust Opportunity Assistance Fund", "Dean of Students Emergency Scholarship"] },
  { match: ["medical bill help student", "unexpected bill student", "cuenta medica inesperada estudiante"], names: ["Rust Opportunity Assistance Fund", "Wellness CNM — Case Management & Free Counseling"] },
  { match: ["cnm housing emergency", "cnm basic needs", "necesidades basicas cnm"], names: ["Rust Opportunity Assistance Fund", "CNM Foundation Fund Directory (Basic Needs Fund, Annual Fund, etc.)", "CNM Food Pantry (4 campus locations)", "Wellness CNM — Case Management & Free Counseling"] },
  { match: ["cnm basic needs fund", "cnm annual fund", "fondo necesidades basicas cnm"], names: ["CNM Foundation Fund Directory (Basic Needs Fund, Annual Fund, etc.)", "Rust Opportunity Assistance Fund"] },
  { match: ["cnm donor funds", "cnm scholarships fund"], names: ["CNM Foundation Fund Directory (Basic Needs Fund, Annual Fund, etc.)"] },
  { match: ["cnm student support fund", "fondo de apoyo cnm"], names: ["CNM Foundation Fund Directory (Basic Needs Fund, Annual Fund, etc.)", "Wellness CNM — Case Management & Free Counseling"] },
  { match: ["flexible student aid cnm", "ayuda flexible estudiante cnm"], names: ["CNM Foundation Fund Directory (Basic Needs Fund, Annual Fund, etc.)"] },
  { match: ["men's shelter", "shelter for men", "refugio para hombres", "hombre sin hogar"], names: ["St. Elizabeth Shelter & Supportive Housing", "Good Shepherd Center"] },
  { match: ["shelter santa fe", "refugio santa fe", "donde dormir santa fe"], names: ["St. Elizabeth Shelter & Supportive Housing", "The Food Depot"] },
  { match: ["supportive housing disabled", "permanent supportive housing", "vivienda de apoyo"], names: ["St. Elizabeth Shelter & Supportive Housing", "Saranam"] },
  { match: ["emergency shelter men", "refugio de emergencia hombres"], names: ["St. Elizabeth Shelter & Supportive Housing", "St. Martin's Hospitality Center (HopeWorks)"] },
  { match: ["senior center", "centro para mayores", "centro de ancianos", "senior center near me"], names: ["Meadowlark & Broadmoor Senior Centers", "NM Aging & Long-Term Services Dept. (ALTSD)"] },
  { match: ["senior meals", "free lunch seniors", "comida para ancianos", "almuerzo gratis mayores"], names: ["Meadowlark & Broadmoor Senior Centers"] },
  { match: ["senior fitness classes", "clases para mayores", "ejercicio para ancianos"], names: ["Meadowlark & Broadmoor Senior Centers"] },
  { match: ["senior social events", "actividades para mayores", "paseos para ancianos"], names: ["Meadowlark & Broadmoor Senior Centers"] },
  { match: ["volunteer senior center", "voluntariado centro de mayores"], names: ["Meadowlark & Broadmoor Senior Centers", "Community Engagement Center"] },
  { match: ["report child abuse", "child abuse hotline", "reportar abuso infantil", "maltrato infantil"], names: ["NM Children, Youth & Families Dept. (CYFD)", "Albuquerque Family Advocacy Center (AFAC)"] },
  { match: ["foster care", "become foster parent", "cuidado de crianza", "quiero ser padre de crianza", "hogar temporal"], names: ["NM Children, Youth & Families Dept. (CYFD)"] },
  { match: ["adoption", "adopt a child", "adopcion", "adoptar un nino"], names: ["NM Children, Youth & Families Dept. (CYFD)"] },
  { match: ["juvenile help", "youth in trouble", "joven en problemas"], names: ["NM Children, Youth & Families Dept. (CYFD)", "Youth & Family Resource Roundup"] },
  { match: ["first time home buyer", "buying my first home", "comprador por primera vez", "quiero comprar mi primera casa"], names: ["NM Mortgage Finance Authority (MFA) — Full Program Suite", "Homewise"] },
  { match: ["down payment assistance", "down payment help", "ayuda con el enganche", "enganche para casa", "asistencia enganche"], names: ["NM Mortgage Finance Authority (MFA) — Full Program Suite", "HomeLIFT-style down payment grants", "Homewise"] },
  { match: ["mfa", "new mexico mortgage finance", "hipoteca nuevo mexico"], names: ["NM Mortgage Finance Authority (MFA) — Full Program Suite"] },
  { match: ["low income mortgage", "affordable home loan", "hipoteca bajos ingresos", "prestamo hipotecario economico"], names: ["NM Mortgage Finance Authority (MFA) — Full Program Suite", "Homewise", "Homewise ITIN Mortgage Loans"] },
  { match: ["firsthome loan", "firstdown"], names: ["NM Mortgage Finance Authority (MFA) — Full Program Suite"] },
  { match: ["hud", "hud help", "hud albuquerque", "oficina hud"], names: ["HUD Albuquerque Field Office", "Albuquerque Housing Authority"] },
  { match: ["housing counseling", "free housing advice", "consejeria de vivienda", "asesoria de vivienda gratis"], names: ["HUD Albuquerque Field Office", "New Mexico Home Fund"] },
  { match: ["housing discrimination", "fair housing", "discriminacion de vivienda", "vivienda justa"], names: ["Fair Housing Act Protections for Applicants Without an SSN", "HUD Albuquerque Field Office", "New Mexico Legal Aid", "Office of Civil Rights"] },
  { match: ["home repair programs", "fix my house help", "reparar mi casa ayuda"], names: ["HUD Albuquerque Field Office", "NM Homeowner Assistance Fund"] },
  { match: ["upward bound", "trio program", "programa trio"], names: ["TRIO Upward Bound at UNM Gallup"] },
  { match: ["first generation college", "first gen student help", "primera generacion universitaria"], names: ["TRIO Upward Bound at UNM Gallup", "College Enrichment Program (CEP)", "Center for Academic Program Support (CAPS)", "Mentoring Institute"] },
  { match: ["college prep high school", "preparacion universitaria prepa", "high school college prep gallup"], names: ["TRIO Upward Bound at UNM Gallup"] },
  { match: ["low income high schooler help", "ayuda prepa bajos ingresos"], names: ["TRIO Upward Bound at UNM Gallup", "NM McKinney-Vento Homeless Education Program"] },
  { match: ["highlands food pantry", "highlands cafe", "despensa highlands"], names: ["Highlands CAFÉ (Caring About Food Equity) + Emergency Foods/Basic Needs Pantry", "Lobo Food Pantry"] },
  { match: ["emergency food student", "need food now student", "necesito comida ya estudiante"], names: ["Highlands CAFÉ (Caring About Food Equity) + Emergency Foods/Basic Needs Pantry", "Roadrunner Food Bank"] },
  { match: ["basic needs pantry", "despensa necesidades basicas"], names: ["Highlands CAFÉ (Caring About Food Equity) + Emergency Foods/Basic Needs Pantry", "CNM Food Pantry (4 campus locations)"] },
  { match: ["food pantry open to all", "despensa abierta a todos"], names: ["Highlands CAFÉ (Caring About Food Equity) + Emergency Foods/Basic Needs Pantry"] },
  { match: ["dine college food", "navajo college food", "comida dine college"], names: ["Diné College Food Security Initiative", "Community Food Pantry (Gallup)"] },
  { match: ["crownpoint food help", "ayuda comida crownpoint"], names: ["Diné College Food Security Initiative"] },
  { match: ["meal kits student", "healthy meals student", "kits de comida estudiante"], names: ["Diné College Food Security Initiative", "Lobo Food Pantry"] },
  { match: ["tribal college food", "comida universidad tribal"], names: ["Diné College Food Security Initiative"] },
  { match: ["credit union santa fe", "cooperativa de credito santa fe", "credit union northern new mexico"], names: ["Guadalupe Credit Union", "Rio Grande Credit Union — Juntos Avanzamos Program"] },
  { match: ["low income banking", "banco para bajos ingresos", "free checking account"], names: ["Guadalupe Credit Union", "Nusenda Credit Union — UNM Student Union Branch"] },
  { match: ["free financial education", "educacion financiera gratis", "entrenamiento financiero"], names: ["Guadalupe Credit Union", "Center for Financial Capability (CFC)"] },
  { match: ["small loan", "equipment loan", "prestamo pequeno"], names: ["Guadalupe Credit Union"] },
  { match: ["tribal behavioral health", "pueblo counseling", "consejeria pueblo", "salud mental tribal"], names: ["Five Sandoval Indian Pueblos, Inc. (FSIP) — Behavioral Health Services", "First Nations Community HealthSource"] },
  { match: ["sandoval pueblo health", "salud pueblo sandoval"], names: ["Five Sandoval Indian Pueblos, Inc. (FSIP) — Behavioral Health Services"] },
  { match: ["native behavioral health", "indigenous mental health", "salud mental indigena"], names: ["Five Sandoval Indian Pueblos, Inc. (FSIP) — Behavioral Health Services", "Albuquerque Indian Center (AIC)"] },
  { match: ["pueblo substance abuse help", "ayuda adicciones pueblo"], names: ["Five Sandoval Indian Pueblos, Inc. (FSIP) — Behavioral Health Services"] },
  { match: ["free lawyer", "need a lawyer", "legal aid", "necesito abogado", "abogado gratis", "ayuda legal gratis"], names: ["New Mexico Legal Aid", "UNM Law School Community Lawyering Clinic"] },
  { match: ["eviction help", "landlord tenant lawyer", "ayuda con desalojo", "abogado de vivienda"], names: ["New Mexico Legal Aid", "Albuquerque Housing Authority", "New Mexico Home Fund", "Albuquerque Heading Home"] },
  { match: ["family law help", "divorce help", "custody help", "derecho familiar", "divorcio", "custodia"], names: ["New Mexico Legal Aid", "Enlace Comunitario"] },
  { match: ["consumer rights", "debt help", "derechos del consumidor", "ayuda con deudas"], names: ["New Mexico Legal Aid", "NM Attorney General's Office — Consumer Protection & Victim Services"] },
  { match: ["migrant farmworker help", "farmworker rights", "derechos campesinos"], names: ["New Mexico Legal Aid", "El CENTRO de Igualdad y Derechos"] },
  { match: ["sexual assault", "i was raped", "rape help", "fui violada", "fui violado", "asalto sexual"], names: ["Rape Crisis Center of Central New Mexico", "Albuquerque Family Advocacy Center (AFAC)", "New Mexico Crisis and Access Line"] },
  { match: ["rape crisis hotline", "sexual abuse help", "linea de crisis violacion", "ayuda abuso sexual"], names: ["Rape Crisis Center of Central New Mexico"] },
  { match: ["child sexual abuse", "abuso sexual infantil"], names: ["Rape Crisis Center of Central New Mexico", "NM Children, Youth & Families Dept. (CYFD)"] },
  { match: ["support after assault", "counseling after rape", "terapia despues de violacion"], names: ["Rape Crisis Center of Central New Mexico", "Agora Crisis Center"] },
  { match: ["bus pass", "need a bus pass", "pase de autobus", "boleto de camion", "bus fare"], names: ["ABQ RIDE (Fixed Route + ART + Connect Microtransit)", "ABQ RIDE Sun Van (Paratransit)"] },
  { match: ["bus routes", "abq ride routes", "rutas de autobus", "horario de autobus"], names: ["ABQ RIDE (Fixed Route + ART + Connect Microtransit)"] },
  { match: ["art bus", "rapid transit", "transito rapido"], names: ["ABQ RIDE (Fixed Route + ART + Connect Microtransit)"] },
  { match: ["need a ride", "transportation help", "necesito transporte", "como me muevo"], names: ["ABQ RIDE (Fixed Route + ART + Connect Microtransit)", "New Mexico Rail Runner Express", "211 New Mexico / United Way of Central NM"] },
  { match: ["microtransit", "abq ride connect", "van service"], names: ["ABQ RIDE (Fixed Route + ART + Connect Microtransit)"] },
  { match: ["santa fe doctor", "doctor santa fe", "doctor en santa fe"], names: ["La Familia Medical Center", "Christus St. Vincent Regional Medical Center"] },
  { match: ["dental santa fe", "dentista santa fe", "dental care santa fe"], names: ["La Familia Medical Center"] },
  { match: ["teen clinic", "teen health santa fe", "clinica para adolescentes"], names: ["La Familia Medical Center", "First Choice Community Healthcare"] },
  { match: ["prenatal santa fe", "embarazada santa fe", "cuidado prenatal santa fe"], names: ["La Familia Medical Center", "WIC (Women, Infants & Children)"] },
  { match: ["sliding scale clinic", "clinica de escala movil", "clinica barata santa fe"], names: ["La Familia Medical Center", "Free/Income-Based Clinic Directories", "UNM Care and Out of County Care"] },
  { match: ["grant for my nonprofit", "nonprofit funding", "fondo para mi organizacion", "subvencion sin fines de lucro"], names: ["W.K. Kellogg Foundation NM — Small Orgs, Big Impact Fund", "Thornburg Foundation"] },
  { match: ["small nonprofit grant", "grassroots funding", "fondos para organizacion pequena"], names: ["W.K. Kellogg Foundation NM — Small Orgs, Big Impact Fund"] },
  { match: ["bipoc nonprofit funding", "fondos organizaciones bipoc"], names: ["W.K. Kellogg Foundation NM — Small Orgs, Big Impact Fund"] },
  { match: ["pueblo grant", "tribal grant funding", "fondos para pueblos"], names: ["W.K. Kellogg Foundation NM — Small Orgs, Big Impact Fund"] },
  { match: ["homeless shelter downtown", "refugio centro albuquerque"], names: ["Good Shepherd Center", "Albuquerque Heading Home"] },
  { match: ["housing advocate", "help finding permanent housing", "ayuda para vivienda permanente"], names: ["Good Shepherd Center", "Albuquerque Heading Home", "Dept. of Family & Community Services"] },
  { match: ["shelter and support services", "refugio y apoyo"], names: ["Good Shepherd Center", "Joy Junction"] },
  { match: ["catholic charities shelter", "caridades catolicas refugio", "catholic charities help"], names: ["Catholic Charities Emergency Shelter"] },
  { match: ["emergency shelter family", "refugio de emergencia familiar"], names: ["Catholic Charities Emergency Shelter", "Family Promise of Albuquerque", "Good Shepherd Center"] },
  { match: ["rapid rehousing", "rapid rehousing help", "realojamiento rapido"], names: ["Catholic Charities Emergency Shelter", "Albuquerque Heading Home"] },
  { match: ["rental assistance", "help with rent deposit", "asistencia de renta"], names: ["Catholic Charities Emergency Shelter", "New Mexico Home Fund"] },
  { match: ["bishops storehouse", "lds food help", "despensa obispo", "tienda del obispo"], names: ["LDS Bishops' Storehouse / Home Storage Center", "Roadrunner Food Bank"] },
  { match: ["food referral", "food assistance referral", "referencia de comida"], names: ["LDS Bishops' Storehouse / Home Storage Center", "211 New Mexico / United Way of Central NM"] },
  { match: ["household essentials free", "articulos del hogar gratis"], names: ["LDS Bishops' Storehouse / Home Storage Center"] },
  { match: ["food not mormon", "food help no church needed", "comida sin ser miembro"], names: ["LDS Bishops' Storehouse / Home Storage Center", "Storehouse New Mexico"] },
  { match: ["prescription discount", "rx discount card", "descuento en medicamentos", "tarjeta de descuento farmacia"], names: ["Roadrunner Food Bank Prescription Discount Card", "First Choice Community Healthcare", "Roadrunner Food Bank"] },
  { match: ["cheap prescriptions", "can't afford medicine", "medicamentos baratos", "no puedo pagar medicamentos"], names: ["Roadrunner Food Bank Prescription Discount Card", "Roadrunner Food Bank"] },
  { match: ["free prescription card", "tarjeta gratis medicamentos"], names: ["Roadrunner Food Bank Prescription Discount Card"] },
  { match: ["pharmacy discount", "descuento farmacia"], names: ["Roadrunner Food Bank Prescription Discount Card", "La Familia Medical Center"] },
  { match: ["free internet", "cheap internet", "internet gratis", "internet barato", "ayuda con internet"], names: ["EveryoneOn", "Lifeline"] },
  { match: ["affordable internet", "low cost internet", "internet economico"], names: ["EveryoneOn"] },
  { match: ["free computer", "cheap laptop", "computadora gratis", "laptop barata"], names: ["EveryoneOn", "Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search"] },
  { match: ["digital skills", "learn computer skills", "habilidades digitales", "aprender computacion"], names: ["EveryoneOn"] },
  { match: ["acp", "affordable connectivity program", "programa de conectividad economica"], names: ["Affordable Connectivity Program (ACP) — DISCONTINUED", "EveryoneOn", "Lifeline"] },
  { match: ["is acp still available", "acp ended", "se acabo el acp", "acp application"], names: ["Affordable Connectivity Program (ACP) — DISCONTINUED", "EveryoneOn"] },
  { match: ["internet discount program", "descuento de internet gobierno"], names: ["Affordable Connectivity Program (ACP) — DISCONTINUED", "EveryoneOn", "Lifeline"] },
  { match: ["fcc internet benefit", "beneficio de internet fcc"], names: ["Affordable Connectivity Program (ACP) — DISCONTINUED", "EveryoneOn"] },
  { match: ["bluewater village", "bluewater apartments", "apartamentos bluewater"], names: ["Bluewater Village", "Manzano Vista", "Sandia Vista"] },
  { match: ["cheap apartment westside", "apartamento barato westside", "renta barata 87121"], names: ["Bluewater Village", "Aztec Village"] },
  { match: ["610 rent", "apartment 600 dollars", "renta de 600"], names: ["Bluewater Village", "Hibernian House"] },
  { match: ["affordable program apartment", "city affordable housing", "programa de vivienda economica ciudad"], names: ["Bluewater Village", "Manzano Vista", "Los Altos Lofts"] },
  { match: ["sandia vista", "sandia vista apartments", "apartamentos sandia vista"], names: ["Sandia Vista", "Manzano Vista", "Aztec Village"] },
  { match: ["section 8 apartment", "subsidized apartment", "apartamento con seccion 8", "vivienda subsidiada"], names: ["Sandia Vista", "Casa Bonita", "Housing Choice Voucher Program (Section 8)"] },
  { match: ["30 percent income rent", "income based rent"], names: ["Sandia Vista", "Albuquerque Housing Authority", "Redlands", "Manzano Vista", "Bluewater Village", "Housing Choice Voucher Program (Section 8)"] },
  { match: ["tramway apartments cheap", "apartamentos tramway baratos"], names: ["Sandia Vista"] },
  { match: ["ceja vista", "ceja vista apartments", "apartamentos ceja vista"], names: ["Ceja Vista Senior Apartments", "La Serena Senior Apartments", "Luminaria Senior Community"] },
  { match: ["senior apartment southwest", "55 plus housing", "vivienda 55 anos", "apartamentos para mayores"], names: ["Ceja Vista Senior Apartments", "La Cantera Senior Apartments", "Hibernian House"] },
  { match: ["income restricted senior", "anciano bajos ingresos vivienda"], names: ["Ceja Vista Senior Apartments", "Luminaria Senior Community"] },
  { match: ["senior housing 87121", "vivienda mayores westside"], names: ["Ceja Vista Senior Apartments", "La Serena Senior Apartments"] },
  { match: ["la cantera", "la cantera apartments", "apartamentos la cantera"], names: ["La Cantera Senior Apartments", "Ceja Vista Senior Apartments", "Luminaria Senior Community"] },
  { match: ["senior housing northwest", "vivienda mayores noroeste", "apartamentos ancianos 87114"], names: ["La Cantera Senior Apartments", "Hibernian House"] },
  { match: ["55 apartment", "senior community apartment", "comunidad de mayores"], names: ["La Cantera Senior Apartments", "La Serena Senior Apartments"] },
  { match: ["income restricted 55", "renta restringida mayores"], names: ["La Cantera Senior Apartments", "Ceja Vista Senior Apartments"] },
  { match: ["work study jobs", "federal work study", "work-study", "trabajo de work study"], names: ["Federal Work-Study", "Career Services Center", "FAFSA / Federal Pell Grant"] },
  { match: ["part time job on campus", "campus job for students", "trabajo en el campus", "trabajo de medio tiempo en la universidad"], names: ["Federal Work-Study", "Career Services Center"] },
  { match: ["student jobs financial need", "jobs for students with financial aid", "trabajos para estudiantes con necesidad economica"], names: ["Federal Work-Study", "FAFSA / Federal Pell Grant"] },
  { match: ["earn money while in college", "work while studying", "ganar dinero mientras estudio"], names: ["Federal Work-Study", "Career Services Center"] },
  { match: ["discount on phone bill", "cheap phone service", "lifeline phone program", "descuento en telefono"], names: ["Lifeline", "EveryoneOn"] },
  { match: ["free government phone", "telefono gratis del gobierno", "free phone for low income"], names: ["Lifeline"] },
  { match: ["can't afford phone bill", "no puedo pagar el telefono", "help paying phone bill"], names: ["Lifeline", "Salvation Army Bill Pay Assistance"] },
  { match: ["internet discount low income", "descuento de internet", "cheap internet for seniors"], names: ["Lifeline", "EveryoneOn"] },
  { match: ["help paying heating bill", "liheap", "heating assistance", "ayuda para la calefaccion"], names: ["LIHEAP (Low Income Home Energy Assistance)", "HEAT New Mexico", "PNM Good Neighbor Fund + PNM CARES"] },
  { match: ["can't pay gas bill winter", "no puedo pagar el gas en invierno", "gas bill help"], names: ["LIHEAP (Low Income Home Energy Assistance)", "HEAT New Mexico"] },
  { match: ["cooling bill help summer", "ayuda con el aire acondicionado", "electric bill too high summer"], names: ["LIHEAP (Low Income Home Energy Assistance)", "PNM Good Neighbor Fund + PNM CARES"] },
  { match: ["utility assistance application", "where to apply for liheap", "donde solicito ayuda de utilidades"], names: ["LIHEAP (Low Income Home Energy Assistance)", "211 New Mexico / United Way of Central NM"] },
  { match: ["scholarship for fallen firefighter family", "firefighter survivor scholarship", "beca para hijos de bomberos"], names: ["Fire Fighters and Peace Officers Survivors Scholarship", "NM Opportunity Scholarship"] },
  { match: ["my parent was a police officer killed", "scholarship for police survivors", "beca para familias de policias caidos"], names: ["Fire Fighters and Peace Officers Survivors Scholarship"] },
  { match: ["first responder family tuition help", "ayuda de colegiatura para familias de socorristas"], names: ["Fire Fighters and Peace Officers Survivors Scholarship", "NM Legislative Lottery Scholarship"] },
  { match: ["dependent of fallen officer scholarship", "hijo de oficial caido beca"], names: ["Fire Fighters and Peace Officers Survivors Scholarship", "El Centro External Scholarship Hub"] },
  { match: ["abq 311", "city information line", "311 albuquerque", "numero de informacion de la ciudad"], names: ["City of Albuquerque 311", "211 New Mexico / United Way of Central NM"] },
  { match: ["who do i call for city services", "a quien llamo para servicios de la ciudad", "city services phone number"], names: ["City of Albuquerque 311"] },
  { match: ["report a problem to the city", "reportar un problema a la ciudad", "pothole report albuquerque"], names: ["City of Albuquerque 311"] },
  { match: ["city help line", "linea de ayuda de la ciudad"], names: ["City of Albuquerque 311", "Dept. of Family & Community Services"] },
  { match: ["discrimination complaint", "i was discriminated against at work", "me discriminaron en el trabajo", "civil rights complaint"], names: ["Office of Civil Rights", "New Mexico Legal Aid"] },
  { match: ["housing discrimination complaint", "landlord discriminated against me"], names: ["Office of Civil Rights", "Fair Housing Act Protections for Applicants Without an SSN"] },
  { match: ["discriminated at a store", "refused service discrimination", "me negaron servicio por discriminacion"], names: ["Office of Civil Rights"] },
  { match: ["workplace discrimination help", "derechos civiles", "queja de discriminacion"], names: ["Office of Civil Rights", "El CENTRO de Igualdad y Derechos"] },
  { match: ["free food for unm students", "lobo food pantry", "despensa de unm", "comida gratis para estudiantes unm"], names: ["Lobo Food Pantry", "Roadrunner Food Bank"] },
  { match: ["hungry college student", "no food at college", "estudiante con hambre"], names: ["Lobo Food Pantry", "CNM Food Pantry (4 campus locations)", "Cosmo's Cupboard / UFO Food Pantry", "HEERF / Federal Emergency Student Aid (historically CARES Act funds)"] },
  { match: ["groceries for students", "despensa para estudiantes"], names: ["Lobo Food Pantry", "\"The Stacks\" Food Pantry"] },
  { match: ["where is the food pantry on campus", "donde esta la despensa en unm"], names: ["Lobo Food Pantry"] },
  { match: ["black student resources unm", "afro student center", "recursos para estudiantes afroamericanos"], names: ["African American Student Services (Afro)", "Honors College Student Support Directory"] },
  { match: ["free printing for students", "impresion gratis para estudiantes", "where to print free on campus"], names: ["African American Student Services (Afro)", "Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search"] },
  { match: ["black mentorship program", "mentoria para estudiantes negros"], names: ["African American Student Services (Afro)", "Mentoring Institute"] },
  { match: ["african american advising unm", "consejeria para estudiantes afroamericanos"], names: ["African American Student Services (Afro)", "Office of Advising Strategies / LoboTrax"] },
  { match: ["disability accommodations college", "need accommodations for classes", "acomodaciones por discapacidad"], names: ["Accessibility Resource Center (ARC)", "Honors College Student Support Directory"] },
  { match: ["assistive technology for students", "tecnologia de asistencia"], names: ["Accessibility Resource Center (ARC)"] },
  { match: ["learning disability help college", "ayuda para discapacidad de aprendizaje"], names: ["Accessibility Resource Center (ARC)", "Center for Academic Program Support (CAPS)"] },
  { match: ["service animal on campus", "accessible dorm", "dormitorio accesible"], names: ["Accessibility Resource Center (ARC)"] },
  { match: ["free counseling albuquerque", "consejeria gratis albuquerque", "free therapy"], names: ["Manzanita Counseling Training Clinic", "Wellness CNM — Case Management & Free Counseling"] },
  { match: ["couples counseling free", "terapia de pareja gratis"], names: ["Manzanita Counseling Training Clinic", "LDS Family Services"] },
  { match: ["family counseling affordable", "consejeria familiar economica"], names: ["Manzanita Counseling Training Clinic"] },
  { match: ["need someone to talk to", "necesito hablar con alguien", "terapia barata"], names: ["Manzanita Counseling Training Clinic", "New Mexico Crisis and Access Line", "Agora Crisis Center"] },
  { match: ["where to print at unm", "printing beyond library quota", "donde imprimir en unm"], names: ["Anderson School Building — Printing Access", "African American Student Services (Afro)"] },
  { match: ["ran out of printing quota", "se me acabo la cuota de impresion"], names: ["Anderson School Building — Printing Access"] },
  { match: ["free printing anderson school", "impresion gratis anderson"], names: ["Anderson School Building — Printing Access", "Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search"] },
  { match: ["graduate scholarships", "becas para posgrado"], names: ["Grad Studies Funding Database (Pivot)", "SAAP Graduate Assistantships"] },
  { match: ["phd funding opportunities", "doctorate funding"], names: ["Grad Studies Funding Database (Pivot)"] },
  { match: ["postdoc funding", "fellowships for graduate students"], names: ["Grad Studies Funding Database (Pivot)", "SAAP Graduate Assistantships"] },
  { match: ["how to pay for masters degree"], names: ["Grad Studies Funding Database (Pivot)", "FAFSA / Federal Pell Grant"] },
  { match: ["career services unm", "resume review", "revision de curriculum"], names: ["Career Services Center", "Library Job & Career Guide — 'Working It Out!'"] },
  { match: ["job after graduation", "trabajo despues de graduarme", "find a job after college"], names: ["Career Services Center", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["career fair", "feria de empleo", "internship help"], names: ["Career Services Center"] },
  { match: ["help choosing a career", "ayuda para elegir carrera"], names: ["Career Services Center", "Office of Advising Strategies / LoboTrax"] },
  { match: ["fine arts advising", "consejeria de bellas artes", "art major advisor"], names: ["College of Fine Arts Student Success & Advisement"] },
  { match: ["music degree requirements", "requisitos de musica"], names: ["College of Fine Arts Student Success & Advisement"] },
  { match: ["art scholarships", "becas de arte"], names: ["College of Fine Arts Student Success & Advisement", "El Centro External Scholarship Hub"] },
  { match: ["fine arts degree help", "ayuda con carrera de arte"], names: ["College of Fine Arts Student Success & Advisement", "Center for Academic Program Support (CAPS)"] },
  { match: ["learn english intensive", "intensive english program", "ingles intensivo"], names: ["CELAC (Intensive English Program)"] },
  { match: ["english for international students", "ingles para estudiantes internacionales"], names: ["CELAC (Intensive English Program)", "Global Education Office (GEO) / International Student & Scholar Services (ISSS)"] },
  { match: ["academic english classes", "clases de ingles academico"], names: ["CELAC (Intensive English Program)"] },
  { match: ["improve my english for college", "mejorar mi ingles para la universidad"], names: ["CELAC (Intensive English Program)", "211 New Mexico / United Way of Central NM"] },
  { match: ["scholarship for law students", "beca para estudiantes de derecho"], names: ["Keller & Keller Scholarship", "School of Law Emergency Financial Aid Fund"] },
  { match: ["personal injury law scholarship", "quiero ser abogado de lesiones"], names: ["Keller & Keller Scholarship"] },
  { match: ["first year law student financial aid", "ayuda para primer ano de derecho"], names: ["Keller & Keller Scholarship", "Bar Exam Prep Scholarships (various NM State Bar sections)"] },
  { match: ["law school need based scholarship", "beca de derecho por necesidad"], names: ["Keller & Keller Scholarship"] },
  { match: ["honors college resources", "recursos de honors college"], names: ["Honors College Student Support Directory"] },
  { match: ["honors student help", "ayuda para estudiantes de honor"], names: ["Honors College Student Support Directory", "Office of Advising Strategies / LoboTrax"] },
  { match: ["one stop list unm resources", "lista de recursos unm"], names: ["Honors College Student Support Directory", "LoboRESPECT Advocacy Center"] },
  { match: ["emergency funds taos", "unm taos emergency help", "ayuda de emergencia taos"], names: ["UNM Taos Emergency Funds + Student Resource Navigator"] },
  { match: ["taos student needs help", "estudiante de taos necesita ayuda"], names: ["UNM Taos Emergency Funds + Student Resource Navigator", "211 New Mexico / United Way of Central NM"] },
  { match: ["snap for students taos", "food help taos"], names: ["UNM Taos Emergency Funds + Student Resource Navigator", "SNAP (federally funded, state-administered)"] },
  { match: ["single point of contact student help", "navegador de recursos estudiantiles"], names: ["UNM Taos Emergency Funds + Student Resource Navigator"] },
  { match: ["food pantry gallup", "despensa gallup", "comida gratis gallup"], names: ["Community Food Pantry (Gallup)", "Diné College Food Security Initiative"] },
  { match: ["hungry in gallup", "tengo hambre gallup"], names: ["Community Food Pantry (Gallup)"] },
  { match: ["free groceries gallup nm", "despensa gratis gallup"], names: ["Community Food Pantry (Gallup)", "Roadrunner Food Bank"] },
  { match: ["asunm scholarship", "beca asunm", "student government scholarship"], names: ["ASUNM Emergency Scholarship & Advocacy Scholarship", "Dean of Students Emergency Scholarship"] },
  { match: ["emergency scholarship unm", "beca de emergencia unm"], names: ["ASUNM Emergency Scholarship & Advocacy Scholarship", "UNM Short-Term Emergency Loan"] },
  { match: ["advocacy scholarship", "beca de defensa estudiantil"], names: ["ASUNM Emergency Scholarship & Advocacy Scholarship"] },
  { match: ["need money fast student", "necesito dinero rapido estudiante"], names: ["ASUNM Emergency Scholarship & Advocacy Scholarship", "Rust Opportunity Assistance Fund", "UNM Short-Term Emergency Loan", "Dean of Students Emergency Scholarship"] },
  { match: ["scholarship for medical students", "beca para estudiantes de medicina"], names: ["La Tierra Sagrada Society Scholarships"] },
  { match: ["med school financial aid nm", "ayuda para escuela de medicina"], names: ["La Tierra Sagrada Society Scholarships", "Diane J. Klepper, MD Student Affairs Endowment"] },
  { match: ["need based medical scholarship", "beca de medicina por necesidad"], names: ["La Tierra Sagrada Society Scholarships"] },
  { match: ["public administration scholarship", "beca de administracion publica"], names: ["School of Public Administration (SPA) Semester Awards", "Sandra B. Weeke Scholarship"] },
  { match: ["spa semester award", "premio semestral spa"], names: ["School of Public Administration (SPA) Semester Awards", "Center for Financial Capability Scholarship Index"] },
  { match: ["large semester scholarship", "big per semester award"], names: ["School of Public Administration (SPA) Semester Awards"] },
  { match: ["public policy student funding", "fondos para estudiante de politica publica"], names: ["School of Public Administration (SPA) Semester Awards", "Grad Studies Funding Database (Pivot)"] },
  { match: ["big food pantry albuquerque", "despensa grande albuquerque", "storehouse new mexico"], names: ["Storehouse New Mexico", "Roadrunner Food Bank"] },
  { match: ["shop like grocery store pantry", "client choice food pantry", "despensa donde escoges"], names: ["Storehouse New Mexico"] },
  { match: ["pet food pantry", "comida para mascotas gratis", "free pet food"], names: ["Storehouse New Mexico"] },
  { match: ["full cart of groceries free", "carro lleno de comida gratis"], names: ["Storehouse New Mexico", "Rio Grande Food Project"] },
  { match: ["family advocacy center", "centro de defensa familiar"], names: ["Albuquerque Family Advocacy Center (AFAC)", "Enlace Comunitario"] },
  { match: ["domestic violence help center", "child abuse help", "ayuda violencia domestica centro"], names: ["Albuquerque Family Advocacy Center (AFAC)", "Rape Crisis Center of Central New Mexico"] },
  { match: ["sexual assault advocacy", "victim advocacy albuquerque"], names: ["Albuquerque Family Advocacy Center (AFAC)", "New Mexico Crisis and Access Line"] },
  { match: ["one place for dv help", "todo en un lugar violencia"], names: ["Albuquerque Family Advocacy Center (AFAC)"] },
  { match: ["mosque albuquerque", "mezquita albuquerque"], names: ["Islamic Center of New Mexico (ICNM)", "MINARA Muslim Community Center"] },
  { match: ["friday prayer albuquerque", "jumuah prayer", "oracion del viernes"], names: ["Islamic Center of New Mexico (ICNM)"] },
  { match: ["muslim community events", "eventos musulmanes"], names: ["Islamic Center of New Mexico (ICNM)", "MINARA Muslim Community Center"] },
  { match: ["sunday school islamic", "escuela dominical islamica"], names: ["Islamic Center of New Mexico (ICNM)"] },
  { match: ["native american jobs", "trabajo para nativos americanos", "native employment help"], names: ["National Indian Youth Council / Native Professional Advancement Center", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["job help for tribal members", "ayuda de empleo tribal"], names: ["National Indian Youth Council / Native Professional Advancement Center"] },
  { match: ["workforce development native", "desarrollo laboral nativo"], names: ["National Indian Youth Council / Native Professional Advancement Center", "NM Division of Vocational Rehabilitation (NMDVR)"] },
  { match: ["native professional advancement", "avance profesional nativo"], names: ["National Indian Youth Council / Native Professional Advancement Center"] },
  { match: ["vocational rehabilitation", "rehabilitacion vocacional"], names: ["NM Division of Vocational Rehabilitation (NMDVR)", "Adelante Development Center"] },
  { match: ["job help with disability", "trabajo con discapacidad", "disability employment help"], names: ["NM Division of Vocational Rehabilitation (NMDVR)"] },
  { match: ["assistive technology for work", "tecnologia de asistencia para trabajar"], names: ["NM Division of Vocational Rehabilitation (NMDVR)", "ARCA (Albuquerque Resource Center for the Advancement of the Disabled)"] },
  { match: ["keep a job with disability", "mantener trabajo con discapacidad"], names: ["NM Division of Vocational Rehabilitation (NMDVR)"] },
  { match: ["in state tuition undocumented", "colegiatura estatal indocumentados"], names: ["In-State Tuition & State Financial Aid for Undocumented Students", "Undocumented UNM (undocumented.unm.edu)"] },
  { match: ["college for undocumented students nm", "universidad para indocumentados"], names: ["In-State Tuition & State Financial Aid for Undocumented Students"] },
  { match: ["financial aid without ssn college", "ayuda financiera sin seguro social universidad"], names: ["In-State Tuition & State Financial Aid for Undocumented Students", "NM Opportunity Scholarship"] },
  { match: ["daca college tuition", "colegiatura daca"], names: ["In-State Tuition & State Financial Aid for Undocumented Students", "DACA Coverage Bridge (status uncertain as of Aug 2026)"] },
  { match: ["immigration legal help", "ayuda legal de inmigracion"], names: ["New Mexico Immigrant Law Center (NMILC)", "Enlace Comunitario"] },
  { match: ["affordable immigration lawyer", "abogado de inmigracion barato"], names: ["New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["know your immigration rights", "conozca sus derechos migratorios"], names: ["New Mexico Immigrant Law Center (NMILC)", "El CENTRO de Igualdad y Derechos"] },
  { match: ["immigration process help", "ayuda con proceso migratorio"], names: ["New Mexico Immigrant Law Center (NMILC)", "Immigrant and Refugee Resource Village of Albuquerque (IRRVA)"] },
  { match: ["south valley community org", "organizacion del valle sur"], names: ["Partnership for Community Action (PCA)"] },
  { match: ["immigrant leadership development", "liderazgo inmigrante"], names: ["Partnership for Community Action (PCA)", "Somos Un Pueblo Unido", "El CENTRO de Igualdad y Derechos"] },
  { match: ["community wellness programs", "programas de bienestar comunitario"], names: ["Partnership for Community Action (PCA)", "Dept. of Family & Community Services"] },
  { match: ["education advocacy albuquerque", "defensa educativa"], names: ["Partnership for Community Action (PCA)"] },
  { match: ["bank on campus unm", "banco en el campus", "credit union near unm"], names: ["Nusenda Credit Union — UNM Student Union Branch", "Rio Grande Credit Union — Juntos Avanzamos Program"] },
  { match: ["open student bank account", "abrir cuenta de estudiante"], names: ["Nusenda Credit Union — UNM Student Union Branch"] },
  { match: ["sub credit union", "cooperativa en el sub"], names: ["Nusenda Credit Union — UNM Student Union Branch", "ITIN Banking — General Access Explainer"] },
  { match: ["newcomer health help", "ayuda de salud para recien llegados"], names: ["United Voices for Newcomer Rights (UVNR)", "Immigrant and Refugee Resource Village of Albuquerque (IRRVA)"] },
  { match: ["mentorship for immigrants", "mentoria para inmigrantes"], names: ["United Voices for Newcomer Rights (UVNR)"] },
  { match: ["newcomer youth program", "programa juvenil para recien llegados"], names: ["United Voices for Newcomer Rights (UVNR)", "Youth & Family Resource Roundup"] },
  { match: ["cultural health advocacy", "defensa de salud cultural"], names: ["United Voices for Newcomer Rights (UVNR)"] },
  { match: ["mortgage with itin", "hipoteca con itin"], names: ["Homewise ITIN Mortgage Loans", "Homewise"] },
  { match: ["buy house without ssn", "comprar casa sin seguro social"], names: ["Homewise ITIN Mortgage Loans", "NM Mortgage Finance Authority (MFA) — Full Program Suite"] },
  { match: ["itin home loan", "prestamo de casa con itin"], names: ["Homewise ITIN Mortgage Loans"] },
  { match: ["homeownership for immigrants", "casa propia para inmigrantes"], names: ["Homewise ITIN Mortgage Loans", "New Mexico Home Fund"] },
  { match: ["daca health insurance", "seguro medico daca"], names: ["DACA Coverage Bridge (status uncertain as of Aug 2026)", "State-Funded Healthcare Access for Non-Citizens"] },
  { match: ["daca lost marketplace coverage", "daca perdio cobertura"], names: ["DACA Coverage Bridge (status uncertain as of Aug 2026)", "Emergency Medicaid Coverage for Undocumented Residents"] },
  { match: ["health coverage daca recipient", "cobertura de salud daca"], names: ["DACA Coverage Bridge (status uncertain as of Aug 2026)"] },
  { match: ["what happened to daca health coverage", "que paso con seguro daca"], names: ["DACA Coverage Bridge (status uncertain as of Aug 2026)", "BeWell NM Marketplace — No SSN Required (but not ITIN either)"] },
  { match: ["free counseling cnm", "consejeria gratis cnm"], names: ["Wellness CNM — Case Management & Free Counseling", "Manzanita Counseling Training Clinic"] },
  { match: ["cnm case manager", "case management student"], names: ["Wellness CNM — Case Management & Free Counseling"] },
  { match: ["help navigating resources student", "ayuda navegando recursos"], names: ["Wellness CNM — Case Management & Free Counseling", "211 New Mexico / United Way of Central NM"] },
  { match: ["6 free therapy sessions", "6 sesiones gratis de terapia"], names: ["Wellness CNM — Case Management & Free Counseling"] },
  { match: ["free computer library", "computadora gratis biblioteca"], names: ["Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search"] },
  { match: ["free notary albuquerque", "notario gratis"], names: ["Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search"] },
  { match: ["free fax service", "fax gratis"], names: ["Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search"] },
  { match: ["job search help library", "ayuda buscando trabajo biblioteca", "resume help library"], names: ["Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search", "Library Job & Career Guide — 'Working It Out!'"] },
  { match: ["free wifi albuquerque", "wifi gratis"], names: ["Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search", "EveryoneOn"] },
  { match: ["food help santa fe", "ayuda de comida santa fe"], names: ["City of Santa Fe Food Benefits & Support + CONNECT Network", "The Food Depot"] },
  { match: ["santa fe food navigator", "navegador de comida santa fe"], names: ["City of Santa Fe Food Benefits & Support + CONNECT Network"] },
  { match: ["bilingual food help santa fe", "ayuda bilingue santa fe"], names: ["City of Santa Fe Food Benefits & Support + CONNECT Network"] },
  { match: ["connect network santa fe", "red connect santa fe"], names: ["City of Santa Fe Food Benefits & Support + CONNECT Network", "211 New Mexico / United Way of Central NM", "Santa Fe County Food Resources Hub"] },
  { match: ["dv shelter valencia county", "refugio violencia valencia"], names: ["Valencia Shelter Services (VSS)", "Haven House (Rio Rancho)"] },
  { match: ["domestic violence shelter near los lunas", "refugio los lunas"], names: ["Valencia Shelter Services (VSS)"] },
  { match: ["24 hour dv crisis line", "linea de crisis 24 horas"], names: ["Valencia Shelter Services (VSS)", "New Mexico Crisis and Access Line"] },
  { match: ["shelter for abuse victims valencia", "refugio para victimas"], names: ["Valencia Shelter Services (VSS)", "Rape Crisis Center of Central New Mexico"] },
  { match: ["transitional shelter dv", "vivienda transicional violencia"], names: ["Valencia Shelter Services (VSS)", "Saranam"] },
  { match: ["aging services nm", "servicios para ancianos nm"], names: ["NM Aging & Long-Term Services Dept. (ALTSD)", "Meadowlark & Broadmoor Senior Centers"] },
  { match: ["adult protective services", "servicios de proteccion para adultos", "elder abuse report"], names: ["NM Aging & Long-Term Services Dept. (ALTSD)"] },
  { match: ["meals for homebound seniors", "comida para ancianos en casa"], names: ["NM Aging & Long-Term Services Dept. (ALTSD)"] },
  { match: ["long term care ombudsman", "defensor de cuidado a largo plazo"], names: ["NM Aging & Long-Term Services Dept. (ALTSD)"] },
  { match: ["day shelter albuquerque", "refugio de dia"], names: ["St. Martin's Hospitality Center (HopeWorks)", "Good Shepherd Center"] },
  { match: ["free breakfast homeless", "desayuno gratis sin hogar", "free lunch homeless"], names: ["St. Martin's Hospitality Center (HopeWorks)", "Noon Day Ministry"] },
  { match: ["shower for homeless", "ducha para sin hogar", "clothes for homeless"], names: ["St. Martin's Hospitality Center (HopeWorks)"] },
  { match: ["hopeworks albuquerque", "st martins shelter"], names: ["St. Martin's Hospitality Center (HopeWorks)"] },
  { match: ["sba loan", "prestamo sba", "small business loan"], names: ["U.S. Small Business Administration (SBA) — New Mexico District Office"] },
  { match: ["free business mentoring", "mentoria de negocios gratis"], names: ["U.S. Small Business Administration (SBA) — New Mexico District Office", "Anderson School of Management — Small Business Institute"] },
  { match: ["federal contracting help", "contratos federales"], names: ["U.S. Small Business Administration (SBA) — New Mexico District Office"] },
  { match: ["disaster loan business", "prestamo por desastre negocio"], names: ["U.S. Small Business Administration (SBA) — New Mexico District Office", "FEMA Individual Assistance"] },
  { match: ["fema help", "ayuda de fema", "disaster assistance"], names: ["FEMA Individual Assistance", "211 New Mexico / United Way of Central NM"] },
  { match: ["home damaged by disaster", "casa danada por desastre", "flood damage help"], names: ["FEMA Individual Assistance"] },
  { match: ["fema grant not loan", "beca de fema"], names: ["FEMA Individual Assistance"] },
  { match: ["temporary housing after fire", "vivienda temporal despues de incendio"], names: ["FEMA Individual Assistance", "Albuquerque Heading Home"] },
  { match: ["stacks food pantry", "despensa stacks"], names: ["\"The Stacks\" Food Pantry", "Lobo Food Pantry"] },
  { match: ["library food pantry", "despensa en la biblioteca"], names: ["\"The Stacks\" Food Pantry"] },
  { match: ["engineering student food help", "ayuda de comida ingenieria"], names: ["\"The Stacks\" Food Pantry", "CNM Food Pantry (4 campus locations)"] },
  { match: ["aggie cupboard", "despensa aggie"], names: ["Aggie Cupboard Food Pantry + Aggie Career Closet"] },
  { match: ["free work clothes nmsu", "ropa de trabajo gratis"], names: ["Aggie Cupboard Food Pantry + Aggie Career Closet", "APS Community Clothing Bank and School Supply Barn"] },
  { match: ["infant supplies free", "panales y articulos de bebe gratis"], names: ["Aggie Cupboard Food Pantry + Aggie Career Closet", "WIC (Women, Infants & Children)"] },
  { match: ["career closet", "closet de carrera"], names: ["Aggie Cupboard Food Pantry + Aggie Career Closet"] },
  { match: ["thornburg foundation", "fundacion thornburg", "nonprofit funding nm"], names: ["Thornburg Foundation", "W.K. Kellogg Foundation NM — Small Orgs, Big Impact Fund"] },
  { match: ["grant for homeless nonprofit", "fondos para organizacion sin fines de lucro"], names: ["Thornburg Foundation"] },
  { match: ["food security grant nm", "fondos para seguridad alimentaria"], names: ["Thornburg Foundation", "W.K. Kellogg Foundation NM — Small Orgs, Big Impact Fund"] },
  { match: ["unm care", "unm hospital financial help", "ayuda financiera hospital unm"], names: ["UNM Care and Out of County Care", "First Choice Community Healthcare"] },
  { match: ["can't pay hospital bill", "no puedo pagar la cuenta del hospital"], names: ["UNM Care and Out of County Care", "Presbyterian Healthcare Services — Financial Assistance"] },
  { match: ["charity care hospital", "cuidado de caridad"], names: ["UNM Care and Out of County Care", "Lovelace Health System — Financial Assistance", "Presbyterian Healthcare Services — Financial Assistance", "Christus St. Vincent Regional Medical Center"] },
  { match: ["uninsured hospital discount", "descuento hospital sin seguro"], names: ["UNM Care and Out of County Care"] },
  { match: ["disability rights lawyer", "abogado de derechos de discapacidad"], names: ["Disability Rights New Mexico (Protection & Advocacy, Inc.)", "Native American Disability Law Center"] },
  { match: ["abuse in mental health facility", "abuso en centro de salud mental"], names: ["Disability Rights New Mexico (Protection & Advocacy, Inc.)"] },
  { match: ["special education rights", "derechos de educacion especial"], names: ["Disability Rights New Mexico (Protection & Advocacy, Inc.)", "Accessibility Resource Center (ARC)"] },
  { match: ["protection and advocacy", "proteccion y defensa discapacidad"], names: ["Disability Rights New Mexico (Protection & Advocacy, Inc.)"] },
  { match: ["crisis hotline nm", "linea de crisis nm"], names: ["New Mexico Crisis and Access Line", "Agora Crisis Center"] },
  { match: ["emotional crisis help", "crisis emocional ayuda"], names: ["New Mexico Crisis and Access Line"] },
  { match: ["peer warmline", "linea de apoyo"], names: ["New Mexico Crisis and Access Line"] },
  { match: ["substance use crisis", "crisis por drogas"], names: ["New Mexico Crisis and Access Line", "First Choice Community Healthcare"] },
  { match: ["rail runner", "tren rail runner"], names: ["New Mexico Rail Runner Express", "ABQ RIDE (Fixed Route + ART + Connect Microtransit)"] },
  { match: ["train from albuquerque to santa fe", "tren de albuquerque a santa fe"], names: ["New Mexico Rail Runner Express"] },
  { match: ["commuter train nm", "tren de cercanias"], names: ["New Mexico Rail Runner Express"] },
  { match: ["cheap way to get to santa fe", "forma barata de ir a santa fe"], names: ["New Mexico Rail Runner Express", "ABQ RIDE (Fixed Route + ART + Connect Microtransit)"] },
  { match: ["hospital santa fe", "hospital en santa fe"], names: ["Christus St. Vincent Regional Medical Center", "La Familia Medical Center"] },
  { match: ["st vincent charity care", "caridad st vincent"], names: ["Christus St. Vincent Regional Medical Center"] },
  { match: ["trauma center santa fe", "centro de trauma"], names: ["Christus St. Vincent Regional Medical Center"] },
  { match: ["urgent care santa fe", "atencion urgente santa fe"], names: ["Christus St. Vincent Regional Medical Center", "La Familia Medical Center"] },
  { match: ["isleta health center", "centro de salud isleta"], names: ["Pueblo of Isleta Health Center", "First Nations Community HealthSource"] },
  { match: ["tribal clinic isleta", "clinica tribal isleta"], names: ["Pueblo of Isleta Health Center"] },
  { match: ["head start isleta", "head start"], names: ["Pueblo of Isleta Health Center", "Cuidando Los Niños"] },
  { match: ["joy junction", "joy junction shelter"], names: ["Joy Junction", "Good Shepherd Center"] },
  { match: ["shelter that picks you up", "refugio con transporte"], names: ["Joy Junction", "Albuquerque Heading Home"] },
  { match: ["family emergency shelter abq", "refugio familiar emergencia"], names: ["Joy Junction", "Family Promise of Albuquerque"] },
  { match: ["no way to get to shelter", "no tengo como llegar al refugio"], names: ["Joy Junction"] },
  { match: ["saranam", "transitional housing program", "programa de vivienda transicional"], names: ["Saranam", "Albuquerque Heading Home"] },
  { match: ["help getting back on my feet", "ayuda para salir adelante"], names: ["Saranam", "Dept. of Family & Community Services"] },
  { match: ["long term shelter program", "programa de refugio largo plazo"], names: ["Saranam"] },
  { match: ["from homeless to housed", "de sin hogar a vivienda"], names: ["Saranam", "Housing Choice Voucher Program (Section 8)"] },
  { match: ["albuquerque heading home", "heading home abq"], names: ["Albuquerque Heading Home", "Good Shepherd Center"] },
  { match: ["coordinated entry homeless", "entrada coordinada"], names: ["Albuquerque Heading Home"] },
  { match: ["westside emergency housing", "vivienda de emergencia westside"], names: ["Albuquerque Heading Home", "Joy Junction"] },
  { match: ["shelter placement albuquerque", "colocacion en refugio"], names: ["Albuquerque Heading Home", "211 New Mexico / United Way of Central NM"] },
  { match: ["lds counseling", "consejeria sud", "mormon family services"], names: ["LDS Family Services", "Manzanita Counseling Training Clinic"] },
  { match: ["short term counseling", "consejeria a corto plazo"], names: ["LDS Family Services"] },
  { match: ["crisis emotional support", "apoyo emocional en crisis"], names: ["LDS Family Services", "New Mexico Crisis and Access Line"] },
  { match: ["family counseling lds", "consejeria familiar mormona"], names: ["LDS Family Services"] },
  { match: ["loborespect", "lobo respect"], names: ["LoboRESPECT Advocacy Center", "Honors College Student Support Directory"] },
  { match: ["master list of resources", "lista maestra de recursos"], names: ["LoboRESPECT Advocacy Center", "211 New Mexico / United Way of Central NM"] },
  { match: ["unm resource hub", "centro de recursos unm"], names: ["LoboRESPECT Advocacy Center"] },
  { match: ["where to find help unm", "donde buscar ayuda unm"], names: ["LoboRESPECT Advocacy Center", "City of Albuquerque 311"] },
  { match: ["community solar free", "solar comunitario gratis"], names: ["Prosperity Works Community Solar Program", "Prosperity Works Home Energy Assessments"] },
  { match: ["solar discount electric bill", "descuento solar en la luz"], names: ["Prosperity Works Community Solar Program"] },
  { match: ["shared solar farm", "granja solar compartida"], names: ["Prosperity Works Community Solar Program"] },
  { match: ["lower electric bill solar", "bajar la cuenta de luz con solar"], names: ["Prosperity Works Community Solar Program", "LIHEAP (Low Income Home Energy Assistance)"] },
  { match: ["los altos lofts", "lofts affordable albuquerque"], names: ["Los Altos Lofts", "Manzano Vista"] },
  { match: ["city owned apartments", "apartamentos de la ciudad"], names: ["Los Altos Lofts", "Bluewater Village"] },
  { match: ["studio apartment affordable", "estudio barato"], names: ["Los Altos Lofts", "Aztec Village"] },
  { match: ["1030 rent 1 bedroom", "renta de 1000 un cuarto"], names: ["Los Altos Lofts", "Sandia Vista"] },
  { match: ["redlands apartments", "apartamentos redlands"], names: ["Redlands", "Agua Azul"] },
  { match: ["housing for disabled adults", "vivienda para adultos discapacitados"], names: ["Redlands", "ARCA (Albuquerque Resource Center for the Advancement of the Disabled)"] },
  { match: ["30 percent of income rent", "renta del 30 por ciento del ingreso"], names: ["Redlands", "Sandia Vista"] },
  { match: ["hud 811 housing", "vivienda hud 811"], names: ["Redlands"] },
  { match: ["luminaria senior", "comunidad luminaria"], names: ["Luminaria Senior Community", "La Serena Senior Apartments"] },
  { match: ["income restricted senior apartments", "apartamentos para mayores con restriccion de ingresos"], names: ["Luminaria Senior Community", "Hibernian House"] },
  { match: ["senior apartments central ave", "apartamentos para ancianos central"], names: ["Luminaria Senior Community", "Ceja Vista Senior Apartments"] },
  { match: ["new senior housing abq", "nueva vivienda para mayores"], names: ["Luminaria Senior Community", "La Cantera Senior Apartments"] },
  { match: ["med student scholarship nm", "beca estudiante medicina nuevo mexico"], names: ["La Tierra Sagrada Society Scholarships", "Diane J. Klepper, MD Student Affairs Endowment"] },
  { match: ["print shop alternative unm", "alternativa de impresion unm"], names: ["Anderson School Building — Printing Access"] },
  { match: ["late night study snacks", "antojos estudiando de noche"], names: ["\"The Stacks\" Food Pantry", "Lobo Food Pantry"] },
  { match: ["foundation grants new mexico", "subvenciones para fundaciones nm"], names: ["Thornburg Foundation", "W.K. Kellogg Foundation NM — Small Orgs, Big Impact Fund"] },
  { match: ["law student emergency money", "dinero de emergencia estudiante de derecho"], names: ["Keller & Keller Scholarship", "School of Law Emergency Financial Aid Fund"] },
  { match: ["first generation law student help", "ayuda primera generacion derecho"], names: ["Keller & Keller Scholarship", "Bar Exam Prep Scholarships (various NM State Bar sections)"] },
  { match: ["unm taos food help", "comida para estudiantes taos"], names: ["UNM Taos Emergency Funds + Student Resource Navigator", "Community Food Pantry (Gallup)"] },
  { match: ["asunm funding help", "ayuda de fondos asunm"], names: ["ASUNM Emergency Scholarship & Advocacy Scholarship", "Student Success Access Grant"] },
  { match: ["section 8", "housing voucher", "how to get section 8", "aplicar seccion 8"], names: ["Housing Choice Voucher Program (Section 8)", "Albuquerque Housing Authority"] },
  { match: ["voucher program", "vale de vivienda", "programa de vales"], names: ["Housing Choice Voucher Program (Section 8)", "Albuquerque Housing Authority"] },
  { match: ["pay 30 percent of income for rent", "renta segun mis ingresos"], names: ["Housing Choice Voucher Program (Section 8)", "Aztec Village", "Sandia Vista"] },
  { match: ["section 8 waiting list", "lista de espera seccion 8", "waiting list voucher"], names: ["Housing Choice Voucher Program (Section 8)", "Albuquerque Housing Authority"] },
  { match: ["landlords that accept section 8", "apartments that take section 8", "apartamentos con seccion 8"], names: ["Aztec Village", "Housing Choice Voucher Program (Section 8)", "Sandia Vista"] },
  { match: ["eitc", "earned income tax credit", "credito por ingreso del trabajo"], names: ["Earned Income Tax Credit (EITC) & Child Tax Credit", "NM Working Families Tax Credit — ITIN Filers Included", "AARP Tax-Aide"] },
  { match: ["child tax credit", "tax credit for kids", "credito tributario por hijos", "tax credit for children", "credito por hijos"], names: ["Earned Income Tax Credit (EITC) & Child Tax Credit", "AARP Tax-Aide"] },
  { match: ["big tax refund", "tax refund", "reembolso grande de impuestos", "reembolso de impuestos"], names: ["Earned Income Tax Credit (EITC) & Child Tax Credit", "AARP Tax-Aide"] },
  { match: ["file my taxes free", "hacer mis taxes gratis", "declaracion gratis"], names: ["AARP Tax-Aide", "Earned Income Tax Credit (EITC) & Child Tax Credit", "UNM ITIN Application Guidance"] },
  { match: ["get more money back on taxes", "maximize tax refund", "mas dinero en el reembolso"], names: ["Earned Income Tax Credit (EITC) & Child Tax Credit", "NM Working Families Tax Credit — ITIN Filers Included"] },
  { match: ["lottery scholarship", "nm lottery scholarship", "beca de la loteria"], names: ["NM Legislative Lottery Scholarship", "NM Opportunity Scholarship"] },
  { match: ["scholarship for new mexico students", "beca para estudiantes de nuevo mexico", "nm student scholarship", "beca estudiantes nm"], names: ["NM Legislative Lottery Scholarship", "NM Opportunity Scholarship", "El Centro External Scholarship Hub"] },
  { match: ["help paying tuition", "ayuda con la colegiatura", "no puedo pagar la universidad"], names: ["NM Legislative Lottery Scholarship", "NM Opportunity Scholarship", "Dean of Students Emergency Scholarship"] },
  { match: ["tuition assistance", "asistencia para la matricula", "help with tuition", "ayuda matricula"], names: ["NM Legislative Lottery Scholarship", "NM Opportunity Scholarship"] },
  { match: ["homeowner assistance fund", "help for homeowners", "ayuda para duenos de casa"], names: ["NM Homeowner Assistance Fund", "Homewise"] },
  { match: ["behind on mortgage", "atrasado en la hipoteca", "can't pay mortgage"], names: ["NM Homeowner Assistance Fund", "Homewise"] },
  { match: ["foreclosure help", "avoid foreclosure", "evitar la ejecucion hipotecaria", "me van a quitar la casa"], names: ["NM Homeowner Assistance Fund", "New Mexico Legal Aid"] },
  { match: ["help with property tax", "can't pay property taxes", "no puedo pagar el predial"], names: ["NM Homeowner Assistance Fund", "211 New Mexico / United Way of Central NM"] },
  { match: ["family services", "city family help", "servicios para la familia", "ayuda familiar ciudad"], names: ["Dept. of Family & Community Services", "Youth & Family Resource Roundup"] },
  { match: ["city health and social services", "servicios sociales de la ciudad", "city social services", "servicios sociales ciudad"], names: ["Dept. of Family & Community Services", "211 New Mexico / United Way of Central NM"] },
  { match: ["community services albuquerque", "servicios comunitarios albuquerque", "abq community services", "servicios comunidad"], names: ["Dept. of Family & Community Services", "211 New Mexico / United Way of Central NM"] },
  { match: ["city recreation programs", "programas recreativos de la ciudad", "city rec programs", "recreacion ciudad"], names: ["Dept. of Family & Community Services", "Youth & Family Resource Roundup"] },
  { match: ["don't want to call police", "alternative to calling police", "no quiero llamar a la policia"], names: ["Albuquerque Community Safety (ACS)", "New Mexico Crisis and Access Line"] },
  { match: ["mental health crisis team", "crisis response team", "equipo de crisis de salud mental"], names: ["Albuquerque Community Safety (ACS)", "Agora Crisis Center"] },
  { match: ["homeless person needs help", "person in crisis on the street", "persona en crisis en la calle"], names: ["Albuquerque Community Safety (ACS)", "Albuquerque Heading Home"] },
  { match: ["non violent emergency help", "ayuda de emergencia no violenta", "nonviolent crisis help", "crisis no violenta ayuda"], names: ["Albuquerque Community Safety (ACS)", "City of Albuquerque 311"] },
  { match: ["el centro de la raza", "centro de la raza", "el centro unm"], names: ["El Centro de la Raza", "Transformar Fellowship Program"] },
  { match: ["latino student resources", "recursos para estudiantes latinos", "latinx student resources", "recursos estudiantes latinos unm"], names: ["El Centro de la Raza", "El Centro External Scholarship Hub"] },
  { match: ["chicano student center", "centro de estudiantes chicanos", "chicana student resources", "centro chicano unm"], names: ["El Centro de la Raza", "Transformar Fellowship Program"] },
  { match: ["scholarships for latino students", "becas para estudiantes latinos", "latino scholarships", "becas latinos universidad"], names: ["El Centro External Scholarship Hub", "Transformar Fellowship Program", "El Centro de la Raza"] },
  { match: ["women's center", "centro de mujeres", "women's resources unm"], names: ["Women's Resource Center (WRC)", "LoboRESPECT Advocacy Center"] },
  { match: ["free printing", "where can i print for free", "imprimir gratis", "impresion gratis"], names: ["Women's Resource Center (WRC)", "Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search"] },
  { match: ["title ix help", "report assault on campus", "reportar acoso en la universidad"], names: ["Women's Resource Center (WRC)", "LoboRESPECT Advocacy Center"] },
  { match: ["women's support group", "grupo de apoyo para mujeres", "support group for women", "grupo apoyo mujeres"], names: ["Women's Resource Center (WRC)", "LoboRESPECT Advocacy Center"] },
  { match: ["help applying for snap", "snap application help", "ayuda para solicitar snap"], names: ["Women's Resource Center (WRC)", "NM Human Services / Health Care Authority — ISD Programs", "Roadrunner Food Bank", "SNAP (federally funded, state-administered)"] },
  { match: ["aapi student center", "asian student resources unm", "centro de estudiantes asiaticos"], names: ["Asian American Pacific Islander Resource Center", "New Mexico Asian Family Center (NMAFC)"] },
  { match: ["asian community support", "comunidad asiatica apoyo", "asian support services", "apoyo comunidad asiatica"], names: ["New Mexico Asian Family Center (NMAFC)", "Asian American Pacific Islander Resource Center"] },
  { match: ["pacific islander student help", "ayuda para islenos del pacifico", "pacific islander resources", "recursos islenos pacifico"], names: ["Asian American Pacific Islander Resource Center", "New Mexico Asian Family Center (NMAFC)"] },
  { match: ["engineering tutoring", "tutoria de ingenieria", "help with engineering classes"], names: ["Engineering Student Services (ESS / ESSC)", "Center for Academic Program Support (CAPS)"] },
  { match: ["engineering advising", "consejeria de ingenieria", "engineering advisor"], names: ["Engineering Student Services (ESS / ESSC)", "Center for Academic Program Support (CAPS)"] },
  { match: ["engineering scholarships", "becas de ingenieria", "engineering scholarship", "beca ingenieria unm"], names: ["Engineering Student Services (ESS / ESSC)", "El Centro External Scholarship Hub", "Center for Financial Capability Scholarship Index", "Society of Women Engineers (SWE) — UNM Chapter"] },
  { match: ["math tutoring", "physics tutoring", "tutoria de matematicas", "tutoria de fisica"], names: ["Engineering Student Services (ESS / ESSC)", "Center for Academic Program Support (CAPS)"] },
  { match: ["study abroad scholarship", "beca para estudiar en el extranjero", "scholarship to study abroad", "beca intercambio"], names: ["APIConnect 'First Award' Scholarship", "AMIGO Scholarship"] },
  { match: ["apiconnect scholarship", "api study abroad", "first award scholarship", "beca first award"], names: ["APIConnect 'First Award' Scholarship", "AMIGO Scholarship"] },
  { match: ["scholarship for internship abroad", "beca para pasantia en el extranjero", "internship abroad funding", "fondos pasantia extranjero"], names: ["APIConnect 'First Award' Scholarship", "AMIGO Scholarship"] },
  { match: ["critical race scholarship", "beca de estudios de raza", "critical race studies funding", "beca estudios criticos"], names: ["Glenda Lewis Critical Race Scholar Award", "El Centro External Scholarship Hub"] },
  { match: ["research scholarship", "beca de investigacion", "funding for research"], names: ["Glenda Lewis Critical Race Scholar Award", "Grad Studies Funding Database (Pivot)"] },
  { match: ["graduate scholarship", "beca de posgrado", "grad school scholarship", "beca posgrado"], names: ["Glenda Lewis Critical Race Scholar Award", "SAAP Graduate Assistantships"] },
  { match: ["emergency grant for students", "beca de emergencia para estudiantes", "student emergency grant", "grant estudiantil emergencia"], names: ["Student Success Access Grant", "Rust Opportunity Assistance Fund", "Dean of Students Emergency Scholarship"] },
  { match: ["money for textbooks", "can't afford books", "no puedo pagar los libros"], names: ["Student Success Access Grant", "Dean of Students Emergency Scholarship"] },
  { match: ["need a laptop for school", "laptop para la escuela", "no tengo computadora para estudiar"], names: ["Student Success Access Grant", "Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search"] },
  { match: ["help paying bursar balance", "owe money to unm", "debo dinero a la universidad"], names: ["Student Success Access Grant", "UNM Short-Term Emergency Loan"] },
  { match: ["nursing student emergency", "emergency fund nursing", "fondo de emergencia enfermeria"], names: ["Nursing Emergency Fund", "Dean of Students Emergency Scholarship"] },
  { match: ["nursing student help", "ayuda para estudiante de enfermeria", "nursing school support", "apoyo enfermeria"], names: ["Nursing Emergency Fund", "Student Success Access Grant"] },
  { match: ["emergency money for nursing school", "dinero urgente escuela de enfermeria", "nursing student emergency funds", "fondos emergencia enfermeria"], names: ["Nursing Emergency Fund", "Student Success Access Grant"] },
  { match: ["dissertation help", "thesis help", "ayuda con la tesis", "ayuda con la disertacion"], names: ["CTL Graduate Support", "Mentoring Institute"] },
  { match: ["grad student support", "apoyo para estudiantes graduados", "graduate student help", "ayuda graduados"], names: ["CTL Graduate Support", "Mentoring Institute"] },
  { match: ["graduate teaching certificate", "certificado de ensenanza graduada", "grad teaching academy", "academia ensenanza graduados"], names: ["CTL Graduate Support", "SAAP Graduate Assistantships"] },
  { match: ["bar exam scholarship", "beca para el examen de abogacia", "new mexico bar scholarship", "beca bar nuevo mexico"], names: ["Bar Exam Prep Scholarships (various NM State Bar sections)", "Keller & Keller Scholarship"] },
  { match: ["bar prep financial help", "ayuda para preparar el bar exam", "bar study help", "ayuda estudio bar"], names: ["Bar Exam Prep Scholarships (various NM State Bar sections)", "Keller & Keller Scholarship"] },
  { match: ["law student scholarship", "beca para estudiante de derecho", "law school scholarship", "beca escuela de derecho"], names: ["Bar Exam Prep Scholarships (various NM State Bar sections)", "Keller & Keller Scholarship", "Center for Financial Capability Scholarship Index", "Society of Women Engineers (SWE) — UNM Chapter"] },
  { match: ["tutoring center", "need a tutor", "necesito un tutor", "centro de tutoria"], names: ["Center for Academic Program Support (CAPS)", "Arts & Sciences Center for Academic Success (ASCAS)"] },
  { match: ["writing help", "essay help", "ayuda para escribir ensayos", "ayuda con redaccion"], names: ["Center for Academic Program Support (CAPS)", "Arts & Sciences Center for Academic Success (ASCAS)"] },
  { match: ["online tutoring", "tutoria en linea", "tutor en linea"], names: ["Center for Academic Program Support (CAPS)", "Arts & Sciences Center for Academic Success (ASCAS)"] },
  { match: ["study help", "ayuda para estudiar", "study skills help"], names: ["Center for Academic Program Support (CAPS)", "College Enrichment Program (CEP)"] },
  { match: ["campus food pantry", "despensa de comida en el campus", "college pantry", "despensa colegial"], names: ["PASOS Resource Center Campus Food Pantry", "Lobo Food Pantry", "Cosmo's Cupboard / UFO Food Pantry", "CNM Food Pantry (4 campus locations)", "\"The Stacks\" Food Pantry"] },
  { match: ["free food on campus", "comida gratis en la universidad", "campus free food", "comida gratis campus"], names: ["PASOS Resource Center Campus Food Pantry", "Lobo Food Pantry", "CNM Food Pantry (4 campus locations)"] },
  { match: ["free hygiene products", "productos de higiene gratis", "free toiletries"], names: ["PASOS Resource Center Campus Food Pantry", "Lobo Food Pantry"] },
  { match: ["quick meals for students", "comida rapida para estudiantes", "student meals", "comidas estudiantes"], names: ["PASOS Resource Center Campus Food Pantry", "Highlands CAFÉ (Caring About Food Equity) + Emergency Foods/Basic Needs Pantry"] },
  { match: ["los alamos help", "ayuda en los alamos", "help in los alamos"], names: ["Self Help, Inc.", "211 New Mexico / United Way of Central NM"] },
  { match: ["food assistance los alamos", "comida en los alamos", "los alamos food help", "ayuda comida los alamos"], names: ["Self Help, Inc.", "Roadrunner Food Bank"] },
  { match: ["emergency help los alamos", "ayuda de emergencia los alamos", "los alamos emergency", "emergencia los alamos"], names: ["Self Help, Inc.", "211 New Mexico / United Way of Central NM"] },
  { match: ["scholarships for undocumented students", "becas para indocumentados", "dream us scholarship"], names: ["El Centro External Scholarship Hub", "In-State Tuition & State Financial Aid for Undocumented Students"] },
  { match: ["hispanic scholarship fund", "fondo de becas hispanas", "hsf scholarship"], names: ["El Centro External Scholarship Hub", "El Centro de la Raza"] },
  { match: ["external scholarships list", "lista de becas externas", "outside scholarships", "becas fuera de la universidad"], names: ["El Centro External Scholarship Hub", "Center for Financial Capability Scholarship Index"] },
  { match: ["immigrants rising scholarship", "beca immigrants rising", "immigrants rising", "beca para inmigrantes"], names: ["El Centro External Scholarship Hub", "In-State Tuition & State Financial Aid for Undocumented Students"] },
  { match: ["pharmacy scholarship", "beca de farmacia", "pharmacy school scholarship"], names: ["College of Pharmacy Scholarships", "El Centro External Scholarship Hub"] },
  { match: ["pharmd financial help", "ayuda financiera para farmacia", "pharmacy student aid", "ayuda estudiante farmacia"], names: ["College of Pharmacy Scholarships", "El Centro External Scholarship Hub"] },
  { match: ["pharmacy school money", "dinero para escuela de farmacia", "pharmd scholarship", "beca pharmd"], names: ["College of Pharmacy Scholarships", "El Centro External Scholarship Hub"] },
  { match: ["scholarship for single parents", "beca para madres solteras", "beca para padres solteros"], names: ["Sandra B. Weeke Scholarship", "El Centro External Scholarship Hub"] },
  { match: ["single mom scholarship", "madre soltera necesita beca", "single mother scholarship", "beca madre soltera"], names: ["Sandra B. Weeke Scholarship", "El Centro External Scholarship Hub"] },
  { match: ["mpa scholarship", "beca administracion publica"], names: ["Sandra B. Weeke Scholarship", "School of Public Administration (SPA) Semester Awards"] },
  { match: ["rio grande food project", "rio grande food", "rio grande food bank", "proyecto rio grande comida"], names: ["Rio Grande Food Project", "Roadrunner Food Bank"] },
  { match: ["groceries once a month", "despensa una vez al mes", "monthly food box", "caja de comida mensual"], names: ["Rio Grande Food Project", "Roadrunner Food Bank", "Storehouse West"] },
  { match: ["food pantry no id", "despensa sin identificacion", "food no id required"], names: ["Rio Grande Food Project", "Storehouse New Mexico"] },
  { match: ["help with water bill", "ayuda con la cuenta del agua", "water bill assistance", "asistencia cuenta agua"], names: ["Rio Grande Food Project", "Salvation Army Bill Pay Assistance"] },
  { match: ["asian family center", "centro familiar asiatico", "asian family help"], names: ["New Mexico Asian Family Center (NMAFC)", "Asian American Pacific Islander Resource Center"] },
  { match: ["asian domestic violence help", "ayuda violencia domestica para asiaticos", "asian dv support", "apoyo violencia asiatica"], names: ["New Mexico Asian Family Center (NMAFC)", "Enlace Comunitario"] },
  { match: ["pan-asian support", "apoyo para la comunidad asiatica", "asian community help", "ayuda comunidad asiatica"], names: ["New Mexico Asian Family Center (NMAFC)", "Asian American Pacific Islander Resource Center"] },
  { match: ["minara", "muslim community center", "centro comunitario musulman"], names: ["MINARA Muslim Community Center", "Islamic Center of New Mexico (ICNM)"] },
  { match: ["free meals homeless", "comida gratis para sin hogar", "free food homeless"], names: ["MINARA Muslim Community Center", "Noon Day Ministry"] },
  { match: ["mosques in albuquerque", "mezquitas albuquerque"], names: ["Islamic Center of New Mexico (ICNM)", "MINARA Muslim Community Center"] },
  { match: ["muslim youth programs", "programas juveniles musulmanes", "islamic youth group"], names: ["MINARA Muslim Community Center", "Islamic Center of New Mexico (ICNM)"] },
  { match: ["native american affairs", "asuntos de nativos americanos", "oficina de asuntos indigenas"], names: ["City of Albuquerque Office of Native American Affairs", "Albuquerque Indian Center (AIC)"] },
  { match: ["tribal government contacts", "contactos de gobiernos tribales", "tribal contacts nm", "contactos tribus nm"], names: ["City of Albuquerque Office of Native American Affairs", "Albuquerque Indian Center (AIC)"] },
  { match: ["pueblo directory", "directorio de pueblos de nuevo mexico", "nm pueblo list", "lista de pueblos"], names: ["City of Albuquerque Office of Native American Affairs", "Albuquerque Indian Center (AIC)"] },
  { match: ["veteran benefits", "beneficios de veterano", "beneficios para veteranos"], names: ["NM Dept. of Veterans' Services (NMDVS) — Benefits Overview", "VA Albuquerque Regional Benefit Office"] },
  { match: ["disabled veteran tax exemption", "exencion de impuestos para veteranos discapacitados", "veteran property tax break", "descuento impuestos veterano"], names: ["NM Dept. of Veterans' Services (NMDVS) — Benefits Overview", "VA Albuquerque Regional Benefit Office"] },
  { match: ["veteran service officer", "oficial de servicios para veteranos", "vso near me", "oficial veteranos cerca"], names: ["NM Dept. of Veterans' Services (NMDVS) — Benefits Overview", "VA Albuquerque Regional Benefit Office"] },
  { match: ["veteran help new mexico", "ayuda para veteranos en nuevo mexico", "nm veteran services", "servicios veteranos nm"], names: ["NM Dept. of Veterans' Services (NMDVS) — Benefits Overview", "Veteran & Military Resource Center"] },
  { match: ["driver's license without ssn", "licencia sin seguro social", "licencia de conducir sin papeles"], names: ["NM Standard Driver's License for Non-Citizens", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["undocumented driver's license", "licencia para indocumentados", "driver license undocumented", "licencia indocumentado"], names: ["NM Standard Driver's License for Non-Citizens", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["can i drive without papers", "puedo manejar sin papeles", "sacar licencia de manejar"], names: ["NM Standard Driver's License for Non-Citizens", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["fly with new mexico license", "volar con licencia de nuevo mexico", "volar con licencia nm"], names: ["NM Standard Driver's License for Non-Citizens", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["free immigration lawyer", "abogado de inmigracion gratis", "free immigration attorney"], names: ["UNM Law School Community Lawyering Clinic", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["daca application help", "ayuda con la aplicacion de daca", "daca help", "ayuda daca"], names: ["UNM Law School Community Lawyering Clinic", "DACA Coverage Bridge (status uncertain as of Aug 2026)"] },
  { match: ["u visa help", "ayuda con visa u", "visa u abogado"], names: ["UNM Law School Community Lawyering Clinic", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["work authorization help", "ayuda con permiso de trabajo", "work permit help"], names: ["UNM Law School Community Lawyering Clinic", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["free legal clinic", "clinica legal gratuita", "clinica de leyes gratis"], names: ["UNM Law School Community Lawyering Clinic", "New Mexico Legal Aid"] },
  { match: ["prosperity works", "prosperity works albuquerque", "prosperity works nm", "prosperityworks"], names: ["Prosperity Works", "Center for Financial Capability (CFC)"] },
  { match: ["financial education class", "clase de educacion financiera", "money class", "clase de dinero"], names: ["Prosperity Works", "Center for Financial Capability (CFC)"] },
  { match: ["learn to save money", "aprender a ahorrar dinero", "build savings"], names: ["Prosperity Works", "Center for Financial Capability (CFC)"] },
  { match: ["financial coaching low income", "consejeria financiera para bajos ingresos", "money coaching", "entrenador financiero"], names: ["Prosperity Works", "Center for Financial Capability (CFC)"] },
  { match: ["immigrant resources albuquerque", "recursos para inmigrantes en albuquerque", "immigrant help abq", "ayuda inmigrante abq"], names: ["City of Albuquerque Office of Immigrant & Refugee Affairs", "Immigrant and Refugee Resource Village of Albuquerque (IRRVA)"] },
  { match: ["refugee help albuquerque", "ayuda para refugiados en albuquerque", "refugee services abq", "servicios refugiados"], names: ["City of Albuquerque Office of Immigrant & Refugee Affairs", "Lutheran Family Services Rocky Mountains (LFS) — Refugee & Asylee Program"] },
  { match: ["translation services", "servicios de traduccion", "need an interpreter"], names: ["City of Albuquerque Office of Immigrant & Refugee Affairs", "Enlace Comunitario"] },
  { match: ["help in spanish albuquerque", "ayuda en espanol albuquerque", "hablan espanol"], names: ["City of Albuquerque Office of Immigrant & Refugee Affairs", "Enlace Comunitario"] },
  { match: ["working families tax credit", "credito tributario para familias trabajadoras", "nm working families credit", "credito familias trabajadoras nm"], names: ["NM Working Families Tax Credit — ITIN Filers Included", "Earned Income Tax Credit (EITC) & Child Tax Credit"] },
  { match: ["new mexico eitc", "eitc estatal de nuevo mexico", "state eitc nm", "eitc de nuevo mexico"], names: ["NM Working Families Tax Credit — ITIN Filers Included", "Earned Income Tax Credit (EITC) & Child Tax Credit"] },
  { match: ["tax credit with itin", "credito fiscal con itin", "itin tax credit", "credito itin"], names: ["NM Working Families Tax Credit — ITIN Filers Included", "UNM ITIN Application Guidance", "Federal Tax Credits Still Available to ITIN Filers"] },
  { match: ["new mexico state tax refund", "reembolso estatal de nuevo mexico", "nm tax refund", "reembolso nm"], names: ["NM Working Families Tax Credit — ITIN Filers Included", "AARP Tax-Aide"] },
  { match: ["landlord asking for social security", "dueno pide seguro social", "landlord wants my ssn"], names: ["Fair Housing Act Protections for Applicants Without an SSN", "New Mexico Legal Aid"] },
  { match: ["housing discrimination help", "ayuda discriminacion vivienda"], names: ["Fair Housing Act Protections for Applicants Without an SSN", "HUD Albuquerque Field Office"] },
  { match: ["denied housing because of immigration status", "me negaron vivienda por mis papeles", "housing denial immigration", "negacion vivienda inmigracion"], names: ["Fair Housing Act Protections for Applicants Without an SSN", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["rent apartment without ssn", "rentar apartamento sin seguro social", "apartment no social security", "apartamento sin seguro"], names: ["Fair Housing Act Protections for Applicants Without an SSN", "Albuquerque Housing Authority"] },
  { match: ["health insurance no social security", "seguro medico sin seguro social", "insurance without ssn", "seguro sin ssn"], names: ["BeWell NM Marketplace — No SSN Required (but not ITIN either)", "UNM Care and Out of County Care"] },
  { match: ["bewell nm", "bewell new mexico", "bewell marketplace", "mercado bewell"], names: ["BeWell NM Marketplace — No SSN Required (but not ITIN either)", "UNM Care and Out of County Care"] },
  { match: ["obamacare without papers", "obamacare sin papeles", "aca without ssn", "obamacare indocumentado"], names: ["BeWell NM Marketplace — No SSN Required (but not ITIN either)", "State-Funded Healthcare Access for Non-Citizens"] },
  { match: ["health insurance marketplace", "mercado de seguros de salud", "aca marketplace nm", "mercado aca"], names: ["BeWell NM Marketplace — No SSN Required (but not ITIN either)", "Medicaid (federal/state)"] },
  { match: ["foster youth help", "aged out of foster care", "ayuda para jovenes de crianza"], names: ["THRIVE Program", "NM Children, Youth & Families Dept. (CYFD)"] },
  { match: ["thrive program cnm", "programa thrive", "thrive cnm", "thrive"], names: ["THRIVE Program", "F.I.R.S.T. Program"] },
  { match: ["former foster student", "estudiante que estuvo en crianza", "ex foster youth", "ex joven de crianza"], names: ["THRIVE Program", "F.I.R.S.T. Program"] },
  { match: ["gas money for students", "grocery help for students", "dinero para gasolina estudiante", "ayuda con comida estudiante"], names: ["THRIVE Program", "Dean of Students Emergency Scholarship"] },
  { match: ["job search help", "ayuda para buscar trabajo", "job hunting help"], names: ["Library Job & Career Guide — 'Working It Out!'", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["resume writing help", "ayuda para escribir resume", "help making a resume"], names: ["Library Job & Career Guide — 'Working It Out!'", "Career Services Center"] },
  { match: ["free computer for job search", "computadora gratis para buscar trabajo", "computer for job hunting", "computadora buscar empleo"], names: ["Library Job & Career Guide — 'Working It Out!'", "Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search"] },
  { match: ["job listings albuquerque", "ofertas de trabajo albuquerque", "job postings"], names: ["Library Job & Career Guide — 'Working It Out!'", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["santa fe food help", "comida en santa fe", "food assistance santa fe"], names: ["Santa Fe County Food Resources Hub", "The Food Depot", "City of Santa Fe Food Benefits & Support + CONNECT Network"] },
  { match: ["food resources santa fe county", "recursos de comida condado de santa fe", "santa fe county food", "comida condado santa fe"], names: ["Santa Fe County Food Resources Hub", "The Food Depot"] },
  { match: ["food bank santa fe", "banco de comida santa fe", "santa fe food bank", "banco comida santa fe"], names: ["The Food Depot", "Santa Fe County Food Resources Hub", "City of Santa Fe Food Benefits & Support + CONNECT Network"] },
  { match: ["connect network santa fe food", "santa fe connect", "connect santa fe comida"], names: ["Santa Fe County Food Resources Hub", "City of Santa Fe Food Benefits & Support + CONNECT Network"] },
  { match: ["snap office rio rancho", "oficina de snap en rio rancho", "rio rancho snap", "snap rio rancho"], names: ["NM Health Care Authority Field Offices — Rio Rancho & Los Lunas", "NM Human Services / Health Care Authority — ISD Programs"] },
  { match: ["medicaid office los lunas", "oficina de medicaid en los lunas", "los lunas medicaid", "medicaid los lunas"], names: ["NM Health Care Authority Field Offices — Rio Rancho & Los Lunas", "NM Human Services / Health Care Authority — ISD Programs"] },
  { match: ["apply for snap in person", "aplicar para snap en persona", "snap in person", "snap en persona"], names: ["NM Health Care Authority Field Offices — Rio Rancho & Los Lunas", "NM Human Services / Health Care Authority — ISD Programs"] },
  { match: ["tanf office near me", "oficina de tanf cerca de mi", "tanf near me", "tanf cerca"], names: ["NM Health Care Authority Field Offices — Rio Rancho & Los Lunas", "NM Human Services / Health Care Authority — ISD Programs"] },
  { match: ["i got scammed", "fraud report", "me estafaron", "reportar fraude"], names: ["NM Attorney General's Office — Consumer Protection & Victim Services", "211 New Mexico / United Way of Central NM"] },
  { match: ["identity theft help", "robo de identidad ayuda", "id theft", "robo identidad"], names: ["NM Attorney General's Office — Consumer Protection & Victim Services", "New Mexico Legal Aid"] },
  { match: ["crime victim rights", "derechos de las victimas de crimen", "victim rights", "derechos victima"], names: ["NM Attorney General's Office — Consumer Protection & Victim Services", "Albuquerque Family Advocacy Center (AFAC)"] },
  { match: ["unfair business practices", "negocio injusto", "company ripped me off"], names: ["NM Attorney General's Office — Consumer Protection & Victim Services", "New Mexico Legal Aid"] },
  { match: ["missing person new mexico", "persona desaparecida nuevo mexico", "missing persons nm", "desaparecidos nm"], names: ["NM Attorney General's Office — Consumer Protection & Victim Services", "Albuquerque Family Advocacy Center (AFAC)"] },
  { match: ["free hot lunch", "almuerzo caliente gratis", "free lunch downtown"], names: ["Noon Day Ministry", "Roadrunner Food Bank"] },
  { match: ["free showers homeless", "duchas gratis para sin hogar", "where to shower homeless"], names: ["Noon Day Ministry", "St. Martin's Hospitality Center (HopeWorks)"] },
  { match: ["free laundry homeless", "lavanderia gratis sin hogar", "laundry for homeless", "lavanderia sin hogar"], names: ["Noon Day Ministry", "St. Martin's Hospitality Center (HopeWorks)"] },
  { match: ["noon day ministry", "noonday", "noon day", "ministerio noon day"], names: ["Noon Day Ministry", "Roadrunner Food Bank"] },
  { match: ["job corps", "job corps albuquerque", "centro job corps"], names: ["Albuquerque Job Corps Center", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["free job training for youth", "capacitacion laboral gratis para jovenes", "youth job training", "entrenamiento jovenes"], names: ["Albuquerque Job Corps Center", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["learn a trade free", "aprender un oficio gratis", "trade school free"], names: ["Albuquerque Job Corps Center", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["electrician training free", "plumbing training", "entrenamiento de electricista gratis"], names: ["Albuquerque Job Corps Center", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["live while job training", "housing while training", "vivir mientras me capacito"], names: ["Albuquerque Job Corps Center", "NM Dept. of Workforce Solutions (DWS)"] },
  { match: ["sfcc food pantry", "despensa de comida sfcc", "sfcc pantry", "despensa sfcc"], names: ["SFCC Campus Cupboard + Student Emergency Assistance Fund (SEAF)", "CNM Food Pantry (4 campus locations)"] },
  { match: ["baby food help", "baby formula help", "comida de bebe ayuda"], names: ["SFCC Campus Cupboard + Student Emergency Assistance Fund (SEAF)", "WIC (Women, Infants & Children)"] },
  { match: ["student parent help", "estudiante con hijos ayuda", "parenting student support"], names: ["SFCC Campus Cupboard + Student Emergency Assistance Fund (SEAF)", "WIC (Women, Infants & Children)"] },
  { match: ["student emergency assistance fund", "fondo de asistencia de emergencia estudiantil", "seaf fund", "fondo seaf"], names: ["SFCC Campus Cupboard + Student Emergency Assistance Fund (SEAF)", "Dean of Students Emergency Scholarship"] },
  { match: ["community garden", "huerto comunitario", "jardin comunitario"], names: ["Mustang Garden", "Roadrunner Food Bank"] },
  { match: ["grow my own vegetables", "cultivar mis vegetales", "grow food"], names: ["Mustang Garden", "SNAP (federally funded, state-administered)"] },
  { match: ["campus garden", "jardin del campus universitario", "college garden", "jardin colegial"], names: ["Mustang Garden", "Lobo Food Pantry"] },
  { match: ["pnm bill help", "ayuda con la cuenta de pnm", "pnm assistance"], names: ["PNM Good Neighbor Fund + PNM CARES", "LIHEAP (Low Income Home Energy Assistance)"] },
  { match: ["electric bill past due", "atrasado en la cuenta de luz", "behind on electric bill"], names: ["PNM Good Neighbor Fund + PNM CARES", "HEAT New Mexico"] },
  { match: ["good neighbor fund", "fondo del buen vecino pnm", "pnm good neighbor", "buen vecino pnm"], names: ["PNM Good Neighbor Fund + PNM CARES", "LIHEAP (Low Income Home Energy Assistance)"] },
  { match: ["pnm cares program", "programa pnm cares", "pnm cares", "cares pnm"], names: ["PNM Good Neighbor Fund + PNM CARES", "LIHEAP (Low Income Home Energy Assistance)"] },
  { match: ["navajo general assistance", "asistencia general navajo", "navajo assistance", "asistencia navajo"], names: ["Navajo Nation General Assistance / Department for Self-Reliance (DSR)", "Eight Northern Indian Pueblos Council, Inc. (ENIPC)"] },
  { match: ["tribal tanf", "tanf tribal", "tanf navajo"], names: ["Navajo Nation General Assistance / Department for Self-Reliance (DSR)", "NM Human Services / Health Care Authority — ISD Programs"] },
  { match: ["navajo help with rent", "ayuda navajo para la renta", "navajo utility help"], names: ["Navajo Nation General Assistance / Department for Self-Reliance (DSR)", "Eight Northern Indian Pueblos Council, Inc. (ENIPC)"] },
  { match: ["dsr navajo", "department for self reliance", "self reliance navajo", "autosuficiencia navajo"], names: ["Navajo Nation General Assistance / Department for Self-Reliance (DSR)", "Eight Northern Indian Pueblos Council, Inc. (ENIPC)"] },
  { match: ["hospital bill help", "ayuda con la cuenta del hospital", "hospital bills help", "ayuda cuentas hospital"], names: ["Presbyterian Healthcare Services — Financial Assistance", "Lovelace Health System — Financial Assistance", "UNM Care and Out of County Care"] },
  { match: ["presbyterian financial assistance", "asistencia financiera de presbyterian", "presbyterian hospital help", "ayuda hospital presbyterian"], names: ["Presbyterian Healthcare Services — Financial Assistance", "Lovelace Health System — Financial Assistance"] },
  { match: ["hospital bill can't pay", "cuenta hospital no puedo pagar"], names: ["Presbyterian Healthcare Services — Financial Assistance", "UNM Care and Out of County Care"] },
  { match: ["cuidado de caridad hospital", "free hospital care"], names: ["Presbyterian Healthcare Services — Financial Assistance", "Christus St. Vincent Regional Medical Center"] },
  { match: ["native american disability rights", "derechos de discapacidad para nativos", "native disability advocacy", "defensa discapacidad nativa"], names: ["Native American Disability Law Center", "Disability Rights New Mexico (Protection & Advocacy, Inc.)"] },
  { match: ["tribal disability legal help", "ayuda legal discapacidad tribal", "native disability lawyer"], names: ["Native American Disability Law Center", "Disability Rights New Mexico (Protection & Advocacy, Inc.)"] },
  { match: ["four corners disability rights", "derechos discapacidad four corners", "four corners disability help", "ayuda discapacidad four corners"], names: ["Native American Disability Law Center", "Disability Rights New Mexico (Protection & Advocacy, Inc.)"] },
  { match: ["transgender resources", "recursos para transgenero", "trans resources new mexico"], names: ["Transgender Resource Center of New Mexico (TGRCNM)", "LGBTQ Resource Center (Arcoíris)"] },
  { match: ["tgrcnm", "transgender resource center", "trans center nm", "centro trans nm"], names: ["Transgender Resource Center of New Mexico (TGRCNM)", "LGBTQ Resource Center (Arcoíris)"] },
  { match: ["gender diverse support", "apoyo para diversidad de genero", "gender diverse help", "ayuda diversidad genero"], names: ["Transgender Resource Center of New Mexico (TGRCNM)", "LGBTQ Resource Center (Arcoíris)"] },
  { match: ["trans support group", "grupo de apoyo trans", "transgender support group", "grupo apoyo transgenero"], names: ["Transgender Resource Center of New Mexico (TGRCNM)", "LGBTQ Resource Center (Arcoíris)"] },
  { match: ["dial a ride valencia", "transporte puerta a puerta valencia", "valencia dial a ride", "dial a ride"], names: ["Valencia County Dial-a-Ride", "New Mexico Rail Runner Express"] },
  { match: ["bus los lunas", "transporte en los lunas", "belen bus service"], names: ["Valencia County Dial-a-Ride", "New Mexico Rail Runner Express"] },
  { match: ["senior ride valencia county", "transporte para ancianos valencia", "valencia senior transport", "transporte mayores valencia"], names: ["Valencia County Dial-a-Ride", "ABQ RIDE Sun Van (Paratransit)"] },
  { match: ["bosque farms bus", "peralta bus", "tome bus"], names: ["Valencia County Dial-a-Ride", "New Mexico Rail Runner Express"] },
  { match: ["social security office", "oficina del seguro social", "ssa office"], names: ["Social Security Administration — NM Field Offices", "211 New Mexico / United Way of Central NM"] },
  { match: ["apply for ssi", "aplicar para ssi", "ssdi application", "apply for ssdi"], names: ["Social Security Administration — NM Field Offices", "Disability Rights New Mexico (Protection & Advocacy, Inc.)"] },
  { match: ["disability claim status", "estado de mi reclamo de discapacidad", "ssi claim status", "estado reclamo ssi"], names: ["Social Security Administration — NM Field Offices", "Disability Rights New Mexico (Protection & Advocacy, Inc.)"] },
  { match: ["benefit verification letter", "carta de verificacion de beneficios", "ssa benefit letter", "carta beneficios ssa"], names: ["Social Security Administration — NM Field Offices", "NM Human Services / Health Care Authority — ISD Programs"] },
  { match: ["appeal denied disability", "apelar discapacidad negada", "disability denied appeal"], names: ["Social Security Administration — NM Field Offices", "Disability Rights New Mexico (Protection & Advocacy, Inc.)"] },
  { match: ["homewise", "homewise albuquerque", "homewise nm", "home wise"], names: ["Homewise", "Homewise ITIN Mortgage Loans"] },
  { match: ["first time homebuyer class", "clase para compradores primerizos", "homebuyer class", "clase compradores"], names: ["Homewise", "NM Mortgage Finance Authority (MFA) — Full Program Suite"] },
  { match: ["low down payment mortgage", "hipoteca con poco enganche", "low downpayment loan", "prestamo poco enganche"], names: ["Homewise", "NM Mortgage Finance Authority (MFA) — Full Program Suite"] },
  { match: ["homebuyer education class", "educacion para compradores de casa", "homebuyer workshop", "taller compradores"], names: ["Homewise", "NM Mortgage Finance Authority (MFA) — Full Program Suite"] },
  { match: ["women's shelter albuquerque", "refugio para mujeres albuquerque", "womens shelter abq", "refugio mujeres abq"], names: ["Barrett House / ABQ Rescue Mission Women's Center of Hope", "Good Shepherd Center"] },
  { match: ["barrett house", "casa barrett", "barrett house shelter", "refugio barrett"], names: ["Barrett House / ABQ Rescue Mission Women's Center of Hope", "Good Shepherd Center"] },
  { match: ["homeless woman needs shelter", "mujer sin hogar necesita refugio", "woman needs shelter", "mujer necesita refugio"], names: ["Barrett House / ABQ Rescue Mission Women's Center of Hope", "Good Shepherd Center"] },
  { match: ["rescue mission women's center", "centro de esperanza para mujeres", "womens center of hope", "centro esperanza mujeres"], names: ["Barrett House / ABQ Rescue Mission Women's Center of Hope", "Good Shepherd Center"] },
  { match: ["haven house", "haven house rio rancho", "haven house shelter", "refugio haven"], names: ["Haven House (Rio Rancho)", "Sandoval County Community Services Department"] },
  { match: ["shelter in rio rancho", "refugio en rio rancho", "rio rancho shelter", "refugio rio rancho"], names: ["Haven House (Rio Rancho)", "Sandoval County Community Services Department"] },
  { match: ["domestic violence shelter rio rancho", "refugio de violencia domestica rio rancho", "dv shelter rio rancho", "refugio vd rio rancho"], names: ["Haven House (Rio Rancho)", "Valencia Shelter Services (VSS)"] },
  { match: ["emergency shelter sandoval county", "refugio de emergencia condado de sandoval", "sandoval shelter", "refugio sandoval"], names: ["Haven House (Rio Rancho)", "Sandoval County Community Services Department"] },
  { match: ["down payment grant", "grant for down payment", "subsidio para el enganche"], names: ["HomeLIFT-style down payment grants", "NM Mortgage Finance Authority (MFA) — Full Program Suite"] },
  { match: ["15000 down payment help", "15000 para el enganche", "15000 grant", "subsidio 15000"], names: ["HomeLIFT-style down payment grants", "NM Mortgage Finance Authority (MFA) — Full Program Suite"] },
  { match: ["homelift", "homelift grant", "home lift grant", "homelift program"], names: ["HomeLIFT-style down payment grants", "Homewise"] },
  { match: ["free money for down payment", "dinero gratis para el enganche", "downpayment grant", "grant enganche"], names: ["HomeLIFT-style down payment grants", "Homewise"] },
  { match: ["salvation army bill help", "ejercito de salvacion ayuda con cuentas", "salvation army assistance", "asistencia ejercito salvacion"], names: ["Salvation Army Bill Pay Assistance", "PNM Good Neighbor Fund + PNM CARES"] },
  { match: ["help paying utility bill", "ayuda para pagar los servicios", "utility bill help", "ayuda servicios publicos"], names: ["Salvation Army Bill Pay Assistance", "HEAT New Mexico"] },
  { match: ["emergency bill assistance", "asistencia de emergencia para cuentas", "bill assistance emergency", "asistencia cuentas emergencia"], names: ["Salvation Army Bill Pay Assistance", "LIHEAP (Low Income Home Energy Assistance)"] },
  { match: ["salvation army rent help", "ejercito de salvacion ayuda con renta", "salvation army housing help", "ejercito salvacion vivienda"], names: ["Salvation Army Bill Pay Assistance", "New Mexico Home Fund"] },
  { match: ["cuidando los ninos", "cuidando los ninos albuquerque", "cuidando los ninos program", "programa cuidando ninos"], names: ["Cuidando Los Niños", "Youth & Family Resource Roundup"] },
  { match: ["homeless families childcare", "cuidado de ninos para familias sin hogar", "childcare homeless families", "guarderia familias sin hogar"], names: ["Cuidando Los Niños", "Family Promise of Albuquerque"] },
  { match: ["early childhood education", "educacion de primera infancia", "early education", "educacion temprana"], names: ["Cuidando Los Niños", "NM Child Care Assistance Program"] },
  { match: ["therapeutic childcare", "cuidado infantil terapeutico", "special childcare"], names: ["Cuidando Los Niños", "Youth & Family Resource Roundup"] },
  { match: ["home energy assessment", "evaluacion de energia del hogar", "energy assessment", "evaluacion energetica"], names: ["Prosperity Works Home Energy Assessments", "Prosperity Works Community Solar Program"] },
  { match: ["free energy audit", "auditoria de energia gratis", "energy audit", "auditoria energetica"], names: ["Prosperity Works Home Energy Assessments", "Prosperity Works"] },
  { match: ["save money on energy bill", "ahorrar dinero en la cuenta de luz", "lower energy bill", "bajar cuenta de luz"], names: ["Prosperity Works Home Energy Assessments", "Prosperity Works Community Solar Program"] },
  { match: ["home energy retrofit", "mejoras de energia para el hogar", "energy retrofit", "retrofit energetico"], names: ["Prosperity Works Home Energy Assessments", "Prosperity Works"] },
  { match: ["aztec village", "aztec village apartments", "apartamentos aztec village"], names: ["Aztec Village", "Housing Choice Voucher Program (Section 8)"] },
  { match: ["cheap apartments montgomery", "apartamentos baratos en montgomery", "montgomery apartments cheap", "apartamentos montgomery baratos"], names: ["Aztec Village", "Manzano Vista"] },
  { match: ["lihtc apartments albuquerque", "apartamentos lihtc", "lihtc housing", "vivienda lihtc"], names: ["Aztec Village", "Casa Bonita", "The Artisan at Sawmill Village"] },
  { match: ["apartments that accept section 8", "apartamentos que aceptan seccion 8", "section 8 apartments", "apartamentos seccion 8"], names: ["Aztec Village", "Housing Choice Voucher Program (Section 8)", "Sandia Vista"] },
  { match: ["artisan at sawmill", "sawmill village apartments", "the artisan apartments"], names: ["The Artisan at Sawmill Village", "Aztec Village"] },
  { match: ["sawmill apartments", "apartamentos sawmill", "sawmill village", "villa sawmill"], names: ["The Artisan at Sawmill Village", "Aztec Village"] },
  { match: ["community land trust housing", "vivienda de fideicomiso comunitario", "land trust apartments", "apartamentos land trust"], names: ["The Artisan at Sawmill Village", "Aztec Village"] },
  { match: ["affordable apartments 87104", "apartamentos economicos 87104", "87104 apartments", "apartamentos 87104"], names: ["The Artisan at Sawmill Village", "Bluewater Village"] },
  { match: ["agua azul", "agua azul apartments", "apartamentos agua azul"], names: ["Agua Azul", "Redlands"] },
  { match: ["special needs housing", "vivienda para necesidades especiales", "special needs apartments", "apartamentos necesidades especiales"], names: ["Agua Azul", "Redlands", "ARCA (Albuquerque Resource Center for the Advancement of the Disabled)"] },
  { match: ["section 811 housing", "vivienda de seccion 811", "811 housing", "vivienda 811"], names: ["Agua Azul", "Redlands"] },
  { match: ["affordable apartments 87121", "apartamentos baratos 87121", "87121 apartments", "apartamentos 87121"], names: ["Agua Azul", "Bluewater Village", "Manzano Vista"] },
  { match: ["unm los alamos help", "ayuda unm los alamos", "los alamos student help"], names: ["Self Help, Inc.", "211 New Mexico / United Way of Central NM"] },
  { match: ["self help inc", "selfhelp los alamos", "self help incorporated"], names: ["Self Help, Inc.", "211 New Mexico / United Way of Central NM"] },
  { match: ["greenhouse vegetables", "invernadero vegetales", "fresh herbs free"], names: ["Mustang Garden", "Roadrunner Food Bank"] },
  { match: ["food security committee", "comite de seguridad alimentaria", "campus food security"], names: ["Mustang Garden", "Lobo Food Pantry"] },
  { match: ["thesis coaching", "coaching de tesis", "dissertation coach"], names: ["CTL Graduate Support", "Mentoring Institute"] },
  { match: ["graduate workshops", "talleres para graduados", "grad workshops"], names: ["CTL Graduate Support", "SAAP Graduate Assistantships"] },
  { match: ["new mexico bar exam help", "ayuda examen de abogacia nm", "fresh produce free"], names: ["Bar Exam Prep Scholarships (various NM State Bar sections)", "Keller & Keller Scholarship"] },
  { match: ["bar exam costs", "costo del bar exam", "bar exam fees help"], names: ["Bar Exam Prep Scholarships (various NM State Bar sections)", "Keller & Keller Scholarship"] },
  { match: ["disability lawyer tribal", "abogado discapacidad tribal", "thesis coach"], names: ["Native American Disability Law Center", "Disability Rights New Mexico (Protection & Advocacy, Inc.)"] },
  { match: ["independent living native", "vida independiente nativa", "talleres graduados"], names: ["Native American Disability Law Center", "ARCA (Albuquerque Resource Center for the Advancement of the Disabled)"] },
  { match: ["santa fe food distributions", "distribuciones de comida santa fe", "nm bar help"], names: ["Santa Fe County Food Resources Hub", "The Food Depot"] },
  { match: ["santa fe county help", "ayuda condado santa fe", "bar exam fees"], names: ["Santa Fe County Food Resources Hub", "211 New Mexico / United Way of Central NM"] },
  { match: ["latino mentorship", "mentoria latina", "tribal disability attorney"], names: ["El Centro de la Raza", "Transformar Fellowship Program"] },
  { match: ["cultural programming unm", "programacion cultural unm", "native independent living"], names: ["El Centro de la Raza", "El Centro External Scholarship Hub"] },
  { match: ["food stamps", "snap", "snap benefits", "estampillas de comida", "cupones de alimentos"], names: ["SNAP (federally funded, state-administered)", "Roadrunner Food Bank", "Storehouse New Mexico"] },
  { match: ["apply for food stamps", "how to get snap", "solicitar snap", "como aplicar para estampillas"], names: ["SNAP (federally funded, state-administered)", "NM Human Services / Health Care Authority — ISD Programs", "Roadrunner Food Bank"] },
  { match: ["ebt card", "tarjeta ebt", "my ebt", "beneficios ebt"], names: ["SNAP (federally funded, state-administered)", "Roadrunner Food Bank"] },
  { match: ["help buying groceries", "can't afford groceries", "no puedo comprar comida", "ayuda para comprar comida", "no me alcanza para el mandado"], names: ["SNAP (federally funded, state-administered)", "Storehouse New Mexico", "Rio Grande Food Project", "The Food Depot"] },
  { match: ["grocery money", "money for food", "dinero para comida", "dinero para el mandado"], names: ["SNAP (federally funded, state-administered)", "WIC (Women, Infants & Children)"] },
  { match: ["medicaid", "apply for medicaid", "medicaid application", "quiero medicaid", "solicitar medicaid"], names: ["Medicaid (federal/state)", "NM Human Services / Health Care Authority — ISD Programs"] },
  { match: ["free health insurance", "seguro medico gratis", "health coverage low income", "cobertura de salud gratis"], names: ["Medicaid (federal/state)", "BeWell NM Marketplace — No SSN Required (but not ITIN either)", "UNM Care and Out of County Care"] },
  { match: ["doctor without insurance", "doctor sin seguro", "sin seguro medico donde voy", "no insurance need doctor"], names: ["Medicaid (federal/state)", "First Choice Community Healthcare", "Free/Income-Based Clinic Directories"] },
  { match: ["centennial care", "turquoise care", "nm medicaid plan"], names: ["Medicaid (federal/state)", "NM Human Services / Health Care Authority — ISD Programs"] },
  { match: ["opportunity scholarship", "nm opportunity scholarship", "beca opportunity", "beca oportunidad nuevo mexico"], names: ["NM Opportunity Scholarship", "NM Legislative Lottery Scholarship", "El Centro External Scholarship Hub"] },
  { match: ["free college tuition nm", "colegiatura gratis nuevo mexico", "tuition covered new mexico", "universidad gratis nm"], names: ["NM Opportunity Scholarship", "NM Legislative Lottery Scholarship", "FAFSA / Federal Pell Grant"] },
  { match: ["scholarship for adults", "beca para adultos", "going back to school money", "quiero regresar a estudiar"], names: ["NM Opportunity Scholarship", "Center for Financial Capability Scholarship Index"] },
  { match: ["part time student aid", "ayuda para estudiantes de medio tiempo", "part time college help"], names: ["NM Opportunity Scholarship", "FAFSA / Federal Pell Grant"] },
  { match: ["rent assistance", "help with rent", "ayuda con la renta", "no puedo pagar la renta"], names: ["New Mexico Home Fund", "Albuquerque Housing Authority", "Housing Choice Voucher Program (Section 8)"] },
  { match: ["behind on rent", "atrasado en la renta", "past due rent", "debo renta"], names: ["New Mexico Home Fund", "Salvation Army Bill Pay Assistance"] },
  { match: ["me van a desalojar", "facing eviction", "eviction assistance"], names: ["New Mexico Home Fund", "New Mexico Legal Aid", "Albuquerque Heading Home"] },
  { match: ["help with utility bills", "ayuda con las cuentas", "can't pay bills", "bills piling up"], names: ["New Mexico Home Fund", "PNM Good Neighbor Fund + PNM CARES", "HEAT New Mexico", "LIHEAP (Low Income Home Energy Assistance)"] },
  { match: ["relocation help", "moving costs help", "ayuda para mudarme", "need help moving"], names: ["New Mexico Home Fund", "211 New Mexico / United Way of Central NM"] },
  { match: ["after school programs", "programas despues de escuela", "after school for kids", "actividades despues de clases"], names: ["Youth & Family Resource Roundup", "Cuidando Los Niños"] },
  { match: ["preschool help", "preescolar", "early head start", "head start program"], names: ["Youth & Family Resource Roundup", "NM Child Care Assistance Program"] },
  { match: ["programs for my kids", "actividades para ninos", "kids programs albuquerque", "programas para mis hijos"], names: ["Youth & Family Resource Roundup", "Dept. of Family & Community Services"] },
  { match: ["family resources", "recursos familiares", "family support programs"], names: ["Youth & Family Resource Roundup", "Albuquerque Family Advocacy Center (AFAC)"] },
  { match: ["emergency loan student", "prestamo de emergencia estudiante", "unm emergency cash"], names: ["UNM Short-Term Emergency Loan", "Dean of Students Emergency Scholarship", "ASUNM Emergency Scholarship & Advocacy Scholarship"] },
  { match: ["can't pay tuition", "no puedo pagar la colegiatura", "tuition emergency", "colegiatura atrasada"], names: ["UNM Short-Term Emergency Loan", "Rust Opportunity Assistance Fund", "Student Success Access Grant"] },
  { match: ["small loan students", "prestamo pequeno estudiantes", "borrow money student"], names: ["UNM Short-Term Emergency Loan", "Center for Financial Capability (CFC)"] },
  { match: ["short term loan unm", "lobo loan", "prestamo corto plazo unm"], names: ["UNM Short-Term Emergency Loan", "Dean of Students Emergency Scholarship"] },
  { match: ["transformar fellowship", "beca transformar", "transformar program"], names: ["Transformar Fellowship Program", "El Centro de la Raza", "El Centro External Scholarship Hub"] },
  { match: ["600 dollar scholarship", "beca de 600", "scholarship latino students", "becas para latinos"], names: ["Transformar Fellowship Program", "El Centro External Scholarship Hub"] },
  { match: ["study abroad mexico", "estudiar en mexico", "viaje a mexico estudiantes", "intercambio en mexico"], names: ["Transformar Fellowship Program", "APIConnect 'First Award' Scholarship", "AMIGO Scholarship"] },
  { match: ["latino student support", "apoyo estudiantes latinos", "chicano student help", "raza student resources"], names: ["Transformar Fellowship Program", "El Centro de la Raza"] },
  { match: ["lgbtq resources", "gay student resources", "lgbt help", "recursos lgbt"], names: ["LGBTQ Resource Center (Arcoíris)", "Transgender Resource Center of New Mexico (TGRCNM)"] },
  { match: ["safe space lgbt", "espacio seguro lgbt", "lgbtq safe zone"], names: ["LGBTQ Resource Center (Arcoíris)", "Transgender Resource Center of New Mexico (TGRCNM)"] },
  { match: ["hiv testing", "prueba de vih", "free hiv test", "donde hacen prueba de vih"], names: ["LGBTQ Resource Center (Arcoíris)", "First Choice Community Healthcare"] },
  { match: ["coming out support", "apoyo salir del closet", "lgbtq counseling"], names: ["LGBTQ Resource Center (Arcoíris)", "Agora Crisis Center"] },
  { match: ["primera generacion universidad", "first gen student", "soy primera generacion"], names: ["College Enrichment Program (CEP)", "Center for Academic Program Support (CAPS)", "Mentoring Institute"] },
  { match: ["college transition help", "ayuda transicion universidad", "new student support unm", "starting college help"], names: ["College Enrichment Program (CEP)", "University College Advising", "Office of Advising Strategies / LoboTrax"] },
  { match: ["academic support freshman", "apoyo academico primer ano", "freshman help"], names: ["College Enrichment Program (CEP)", "Arts & Sciences Center for Academic Success (ASCAS)"] },
  { match: ["women in engineering", "mujeres en ingenieria", "female engineer support", "ingeniera"], names: ["Society of Women Engineers (SWE) — UNM Chapter", "Career Services Center"] },
  { match: ["engineering scholarship women", "beca mujeres ingenieria", "scholarship women stem"], names: ["Society of Women Engineers (SWE) — UNM Chapter", "El Centro External Scholarship Hub"] },
  { match: ["women in stem", "mujeres en stem", "girls in tech"], names: ["Society of Women Engineers (SWE) — UNM Chapter", "Mentoring Institute"] },
  { match: ["engineering mentorship", "mentora ingenieria", "find engineering mentor"], names: ["Society of Women Engineers (SWE) — UNM Chapter", "Career Services Center"] },
  { match: ["diwc scholarship", "beca diwc", "scholarship women of color"], names: ["DIWC Scholarship", "El Centro External Scholarship Hub", "Center for Financial Capability Scholarship Index"] },
  { match: ["study abroad women", "mujeres estudiar extranjero", "women study abroad funding"], names: ["DIWC Scholarship", "APIConnect 'First Award' Scholarship", "AMIGO Scholarship"] },
  { match: ["500 dollar scholarship", "beca de 500 dolares", "500 scholarship"], names: ["DIWC Scholarship", "Rust Opportunity Assistance Fund"] },
  { match: ["emergency student aid", "ayuda de emergencia estudiante", "cares act student", "heerf"], names: ["HEERF / Federal Emergency Student Aid (historically CARES Act funds)", "Dean of Students Emergency Scholarship", "Rust Opportunity Assistance Fund"] },
  { match: ["emergency money for food", "dinero emergencia comida estudiante", "student emergency housing money"], names: ["HEERF / Federal Emergency Student Aid (historically CARES Act funds)", "Lobo Food Pantry", "UNM Short-Term Emergency Loan"] },
  { match: ["help with course materials", "ayuda con materiales", "can't afford textbooks emergency"], names: ["HEERF / Federal Emergency Student Aid (historically CARES Act funds)", "Center for Financial Capability (CFC)"] },
  { match: ["fafsa emergency", "emergencia fafsa", "emergency aid fafsa student"], names: ["HEERF / Federal Emergency Student Aid (historically CARES Act funds)", "FAFSA / Federal Pell Grant"] },
  { match: ["need advisor", "necesito consejero academico", "asesoria academica"], names: ["Arts & Sciences Center for Academic Success (ASCAS)", "Office of Advising Strategies / LoboTrax", "University College Advising"] },
  { match: ["failing classes help", "reprobando clases", "struggling in school", "me va mal en la escuela"], names: ["Arts & Sciences Center for Academic Success (ASCAS)", "Center for Academic Program Support (CAPS)"] },
  { match: ["returning student help", "regresando a estudiar", "adult student advising"], names: ["Arts & Sciences Center for Academic Success (ASCAS)", "University College Advising"] },
  { match: ["student success grant", "beca exito estudiantil", "success grant"], names: ["Arts & Sciences Center for Academic Success (ASCAS)", "Student Success Access Grant"] },
  { match: ["undecided major", "no se que estudiar", "haven't declared major", "sin carrera decidida"], names: ["University College Advising", "Office of Advising Strategies / LoboTrax", "Career Services Center"] },
  { match: ["explore majors", "explorar carreras", "choosing a major"], names: ["University College Advising", "Career Services Center"] },
  { match: ["change my major", "cambiar de carrera", "switch major"], names: ["University College Advising", "Office of Advising Strategies / LoboTrax"] },
  { match: ["degree audit", "lobotrax", "check my degree progress", "cuantas clases me faltan"], names: ["Office of Advising Strategies / LoboTrax", "University College Advising"] },
  { match: ["advising appointment", "cita con consejero", "need advising"], names: ["Office of Advising Strategies / LoboTrax", "Arts & Sciences Center for Academic Success (ASCAS)"] },
  { match: ["graduation requirements", "requisitos de graduacion", "what classes do i need"], names: ["Office of Advising Strategies / LoboTrax", "Arts & Sciences Center for Academic Success (ASCAS)"] },
  { match: ["native american architects", "aicae", "indigenous engineers"], names: ["Resource Center for Raza Planning (RCRP) & AICAE student chapter", "American Indian Student Services (AISS)"] },
  { match: ["raza planning", "community development students", "planificacion comunitaria"], names: ["Resource Center for Raza Planning (RCRP) & AICAE student chapter", "El Centro de la Raza"] },
  { match: ["architecture student support", "estudiante de arquitectura ayuda", "architecture help"], names: ["Resource Center for Raza Planning (RCRP) & AICAE student chapter", "Mentoring Institute"] },
  { match: ["find a mentor", "need a mentor", "necesito un mentor", "busco mentor"], names: ["Mentoring Institute", "Career Services Center"] },
  { match: ["mentoring programs", "programas de mentoria", "become a mentor"], names: ["Mentoring Institute", "Community Engagement Center"] },
  { match: ["peer mentor", "mentor estudiantil", "peer mentoring"], names: ["Mentoring Institute", "College Enrichment Program (CEP)"] },
  { match: ["valencia county resources", "recursos condado de valencia", "los lunas help", "belen nm help"], names: ["UNM-Valencia Community Resources Guide", "211 New Mexico / United Way of Central NM"] },
  { match: ["food pantry los lunas", "despensa belen", "comida los lunas"], names: ["UNM-Valencia Community Resources Guide", "Roadrunner Food Bank"] },
  { match: ["wic los lunas", "clinica belen", "wic valencia county"], names: ["UNM-Valencia Community Resources Guide", "WIC (Women, Infants & Children)"] },
  { match: ["holiday food bags", "holiday meal bags", "bolsas de comida navidad", "comida de thanksgiving"], names: ["Lobo Food Pantry — Pack a Luminaria / Holiday Meals in a Bag", "Lobo Food Pantry", "Roadrunner Food Bank"] },
  { match: ["thanksgiving dinner help", "cena de accion de gracias", "christmas food help"], names: ["Lobo Food Pantry — Pack a Luminaria / Holiday Meals in a Bag", "Storehouse New Mexico"] },
  { match: ["seasonal food drive", "donar comida navidad", "holiday food drive"], names: ["Lobo Food Pantry — Pack a Luminaria / Holiday Meals in a Bag", "Roadrunner Food Bank"] },
  { match: ["scholarship database", "find scholarships", "buscar becas", "donde hay becas"], names: ["Center for Financial Capability Scholarship Index", "El Centro External Scholarship Hub"] },
  { match: ["nursing scholarship", "beca de enfermeria", "scholarship nursing students"], names: ["Center for Financial Capability Scholarship Index", "NM Opportunity Scholarship"] },
  { match: ["beca derecho"], names: ["Center for Financial Capability Scholarship Index", "Society of Women Engineers (SWE) — UNM Chapter"] },
  { match: ["scholarship by college", "becas por facultad", "scholarships by department"], names: ["Center for Financial Capability Scholarship Index", "NM Opportunity Scholarship"] },
  { match: ["dental hygiene program", "higiene dental programa", "dental hygienist school", "escuela de higiene dental"], names: ["Division of Dental Hygiene (Dept. of Dental Medicine)", "Career Services Center"] },
  { match: ["study dental hygiene", "quiero ser higienista dental", "dental career"], names: ["Division of Dental Hygiene (Dept. of Dental Medicine)", "Career Services Center"] },
  { match: ["amigo scholarship", "beca amigo", "study abroad funding"], names: ["AMIGO Scholarship", "APIConnect 'First Award' Scholarship", "El Centro External Scholarship Hub"] },
  { match: ["money to study abroad", "dinero para intercambio", "funding international study"], names: ["AMIGO Scholarship", "Transformar Fellowship Program"] },
  { match: ["geo scholarship", "global education funding", "study abroad grant"], names: ["AMIGO Scholarship", "Global Education Office (GEO) / International Student & Scholar Services (ISSS)"] },
  { match: ["storehouse west", "despensa west", "storehouse west albuquerque"], names: ["Storehouse West", "Storehouse New Mexico", "Roadrunner Food Bank"] },
  { match: ["kids clothing closet", "ropa para ninos gratis", "kids clothes free", "closet de ropa ninos"], names: ["Storehouse West", "APS Community Clothing Bank and School Supply Barn"] },
  { match: ["monthly food package", "paquete de comida mensual"], names: ["Storehouse West", "Roadrunner Food Bank"] },
  { match: ["jcc albuquerque", "jewish community center", "centro comunitario judio"], names: ["Jewish Community Center (JCC) of Greater Albuquerque", "Hillel at UNM"] },
  { match: ["jewish family help", "ayuda familia judia", "jewish emergency assistance"], names: ["Jewish Community Center (JCC) of Greater Albuquerque", "211 New Mexico / United Way of Central NM"] },
  { match: ["senior outreach jewish", "jewish seniors", "jewish senior services"], names: ["Jewish Community Center (JCC) of Greater Albuquerque", "Meadowlark & Broadmoor Senior Centers"] },
  { match: ["day camp kids", "campamento de verano ninos", "summer camp"], names: ["Jewish Community Center (JCC) of Greater Albuquerque", "Youth & Family Resource Roundup"] },
  { match: ["native health clinic", "clinica nativa", "indian health center", "centro de salud indigena"], names: ["First Nations Community HealthSource", "Albuquerque Indian Center (AIC)", "Pueblo of Isleta Health Center"] },
  { match: ["native dental", "dental nativo", "native american dental care"], names: ["First Nations Community HealthSource", "La Familia Medical Center"] },
  { match: ["traditional healing", "medicina tradicional nativa", "traditional wellness"], names: ["First Nations Community HealthSource", "Eight Northern Indian Pueblos Council, Inc. (ENIPC)"] },
  { match: ["urban indian health", "salud indigena urbana", "native clinic albuquerque"], names: ["First Nations Community HealthSource", "Albuquerque Indian Center (AIC)"] },
  { match: ["senior day program", "programa de dia ancianos", "adult day care seniors"], names: ["Adelante Development Center", "Meadowlark & Broadmoor Senior Centers", "NM Aging & Long-Term Services Dept. (ALTSD)"] },
  { match: ["assisted living help", "ayuda assisted living", "cuidado ancianos vivienda"], names: ["Adelante Development Center", "NM Aging & Long-Term Services Dept. (ALTSD)"] },
  { match: ["disability employment", "empleo discapacitados", "work disability help"], names: ["Adelante Development Center", "NM Division of Vocational Rehabilitation (NMDVR)", "ARCA (Albuquerque Resource Center for the Advancement of the Disabled)"] },
  { match: ["free computers low income", "computadoras gratis bajos recursos", "diverseit"], names: ["Adelante Development Center", "Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search"] },
  { match: ["veteran dependent tuition", "hijos de veteranos colegiatura", "tuition waiver veteran child"], names: ["NM Veterans' Dependents Tuition Waiver", "NM Dept. of Veterans' Services (NMDVS) — Benefits Overview"] },
  { match: ["veteran killed in action benefits", "beneficios hijos veteranos caidos", "kia dependent benefits"], names: ["NM Veterans' Dependents Tuition Waiver", "VA Albuquerque Regional Benefit Office"] },
  { match: ["free college veterans family", "universidad gratis familia veterano", "veteran family tuition free"], names: ["NM Veterans' Dependents Tuition Waiver", "NM Opportunity Scholarship"] },
  { match: ["healthcare no papers", "salud sin papeles", "doctor undocumented", "doctor sin documentos"], names: ["State-Funded Healthcare Access for Non-Citizens", "Emergency Medicaid Coverage for Undocumented Residents", "First Choice Community Healthcare"] },
  { match: ["medical care immigrants", "atencion medica inmigrantes", "salud para indocumentados"], names: ["State-Funded Healthcare Access for Non-Citizens", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["free healthcare no ssn", "salud gratis sin seguro social", "healthcare no social security"], names: ["State-Funded Healthcare Access for Non-Citizens", "UNM Care and Out of County Care"] },
  { match: ["worker rights immigrant", "derechos laborales inmigrantes", "wage theft immigrant"], names: ["Somos Un Pueblo Unido", "El CENTRO de Igualdad y Derechos", "New Mexico Legal Aid"] },
  { match: ["know your rights", "conozca sus derechos", "mis derechos laborales"], names: ["Somos Un Pueblo Unido", "Enlace Comunitario"] },
  { match: ["tenant rights immigrant", "derechos inquilinos inmigrantes", "fair housing immigrant"], names: ["Somos Un Pueblo Unido", "Fair Housing Act Protections for Applicants Without an SSN"] },
  { match: ["organizing immigrant community", "organizacion comunitaria inmigrantes", "immigrant community organizing"], names: ["Somos Un Pueblo Unido", "El CENTRO de Igualdad y Derechos"] },
  { match: ["bank account no ssn", "cuenta de banco sin seguro social", "abrir cuenta sin ssn"], names: ["Rio Grande Credit Union — Juntos Avanzamos Program", "ITIN Banking — General Access Explainer", "Nusenda Credit Union — UNM Student Union Branch"] },
  { match: ["juntos avanzamos", "credit union inmigrantes", "avanzamos program"], names: ["Rio Grande Credit Union — Juntos Avanzamos Program", "Guadalupe Credit Union"] },
  { match: ["bank account with itin", "cuenta con itin", "itin bank account"], names: ["Rio Grande Credit Union — Juntos Avanzamos Program", "Guadalupe Credit Union"] },
  { match: ["latino credit union", "credit union espanol", "hispanic credit union"], names: ["Rio Grande Credit Union — Juntos Avanzamos Program", "Guadalupe Credit Union"] },
  { match: ["el centro igualdad", "immigrant organizing", "organizacion inmigrantes albuquerque"], names: ["El CENTRO de Igualdad y Derechos", "Somos Un Pueblo Unido"] },
  { match: ["voter engagement latino", "registrar votantes", "latino civic engagement"], names: ["El CENTRO de Igualdad y Derechos", "Partnership for Community Action (PCA)"] },
  { match: ["grassroots organizing", "organizacion comunitaria", "community organizing albuquerque"], names: ["El CENTRO de Igualdad y Derechos", "Community Engagement Center"] },
  { match: ["policy advocacy immigrants", "abogacia inmigrantes", "immigrant advocacy"], names: ["El CENTRO de Igualdad y Derechos", "New Mexico Immigrant Law Center (NMILC)"] },
  { match: ["itin tax credits", "creditos fiscales itin", "tax credit itin filer"], names: ["Federal Tax Credits Still Available to ITIN Filers", "NM Working Families Tax Credit — ITIN Filers Included", "AARP Tax-Aide"] },
  { match: ["child tax credit itin", "credito por hijos itin", "ctc itin"], names: ["Federal Tax Credits Still Available to ITIN Filers", "Earned Income Tax Credit (EITC) & Child Tax Credit"] },
  { match: ["dependent care credit", "credito cuidado dependientes", "childcare tax credit"], names: ["Federal Tax Credits Still Available to ITIN Filers", "NM Child Care Assistance Program"] },
  { match: ["start business no ssn", "abrir negocio sin seguro social", "business with itin", "negocio con itin"], names: ["NM Business Registration Without an SSN", "U.S. Small Business Administration (SBA) — New Mexico District Office"] },
  { match: ["register llc new mexico", "registrar negocio nuevo mexico", "como registro mi negocio"], names: ["NM Business Registration Without an SSN", "Anderson School of Management — Small Business Institute"] },
  { match: ["sole proprietor itin", "trabajo por cuenta propia itin", "self employed itin"], names: ["NM Business Registration Without an SSN", "U.S. Small Business Administration (SBA) — New Mexico District Office"] },
  { match: ["cnm food pantry", "despensa cnm", "comida cnm"], names: ["CNM Food Pantry (4 campus locations)", "Wellness CNM — Case Management & Free Counseling"] },
  { match: ["free fruits vegetables", "frutas y verduras gratis", "verduras gratis"], names: ["CNM Food Pantry (4 campus locations)", "Roadrunner Food Bank"] },
  { match: ["food pantry westside", "despensa westside", "westside food help"], names: ["CNM Food Pantry (4 campus locations)", "Storehouse West"] },
  { match: ["formerly incarcerated student", "estudiante ex encarcelado", "reentering school after prison", "sali de la carcel quiero estudiar"], names: ["F.I.R.S.T. Program", "College Enrichment Program (CEP)", "Center for Academic Program Support (CAPS)"] },
  { match: ["second chance education", "segunda oportunidad estudiar", "second chance college"], names: ["F.I.R.S.T. Program", "UNM Short-Term Emergency Loan"] },
  { match: ["reentry support", "apoyo reintegracion", "reentry programs"], names: ["F.I.R.S.T. Program", "Mentoring Institute"] },
  { match: ["food mobile", "comida movil santa fe", "santa fe mobile food"], names: ["The Food Depot", "Santa Fe County Food Resources Hub"] },
  { match: ["northern new mexico food", "comida norte de nuevo mexico", "rio arriba food"], names: ["The Food Depot", "Roadrunner Food Bank"] },
  { match: ["sandoval county help", "ayuda condado de sandoval", "rio rancho county services"], names: ["Sandoval County Community Services Department", "211 New Mexico / United Way of Central NM"] },
  { match: ["senior meals rio rancho", "comida ancianos rio rancho", "rio rancho senior food"], names: ["Sandoval County Community Services Department", "Meadowlark & Broadmoor Senior Centers"] },
  { match: ["behavioral health sandoval", "salud mental sandoval", "sandoval counseling"], names: ["Sandoval County Community Services Department", "Five Sandoval Indian Pueblos, Inc. (FSIP) — Behavioral Health Services"] },
  { match: ["unemployment benefits", "beneficios de desempleo", "file unemployment", "desempleo como aplico"], names: ["NM Dept. of Workforce Solutions (DWS)", "Library Job & Career Guide — 'Working It Out!'"] },
  { match: ["unemployment insurance", "seguro de desempleo", "jobless benefits"], names: ["NM Dept. of Workforce Solutions (DWS)", "Library Job & Career Guide — 'Working It Out!'"] },
  { match: ["apprenticeship", "aprendiz", "paid training program", "entrenamiento pagado"], names: ["NM Dept. of Workforce Solutions (DWS)", "Albuquerque Job Corps Center"] },
  { match: ["labor law help", "leyes laborales", "wage complaint"], names: ["NM Dept. of Workforce Solutions (DWS)", "El CENTRO de Igualdad y Derechos"] },
  { match: ["veteran employment help", "empleo veteranos", "jobs for vets"], names: ["NM Dept. of Workforce Solutions (DWS)", "Veteran & Military Resource Center"] },
  { match: ["african american resources", "recursos afroamericanos", "black community help"], names: ["NM Office of African American Affairs (OAAA)", "African American Student Services (Afro)"] },
  { match: ["black business help", "negocios afroamericanos", "african american business support"], names: ["NM Office of African American Affairs (OAAA)", "U.S. Small Business Administration (SBA) — New Mexico District Office"] },
  { match: ["african american health", "salud afroamericanos", "black health resources"], names: ["NM Office of African American Affairs (OAAA)", "First Choice Community Healthcare"] },
  { match: ["free clothes students", "ropa gratis estudiantes", "school clothes free", "ropa escolar gratis"], names: ["APS Community Clothing Bank and School Supply Barn", "Aggie Cupboard Food Pantry + Aggie Career Closet"] },
  { match: ["school supplies free", "utiles escolares gratis", "mochilas gratis", "free backpacks"], names: ["APS Community Clothing Bank and School Supply Barn", "Storehouse West"] },
  { match: ["coats for kids", "abrigos para ninos", "winter coats free", "zapatos gratis ninos"], names: ["APS Community Clothing Bank and School Supply Barn", "Storehouse West"] },
  { match: ["homeless student clothes", "estudiante sin hogar ropa", "homeless youth clothing"], names: ["APS Community Clothing Bank and School Supply Barn", "NM McKinney-Vento Homeless Education Program"] },
  { match: ["va benefits", "beneficios de veteranos", "veteran disability claim", "reclamo veterano"], names: ["VA Albuquerque Regional Benefit Office", "NM Dept. of Veterans' Services (NMDVS) — Benefits Overview"] },
  { match: ["gi bill benefits", "educacion veteranos"], names: ["VA Albuquerque Regional Benefit Office", "NM Veterans' Dependents Tuition Waiver"] },
  { match: ["veteran home loan", "prestamo casa veterano", "va loan"], names: ["VA Albuquerque Regional Benefit Office", "NM Dept. of Veterans' Services (NMDVS) — Benefits Overview"] },
  { match: ["veteran pension", "pension veterano", "veterans pension help"], names: ["VA Albuquerque Regional Benefit Office", "NM Dept. of Veterans' Services (NMDVS) — Benefits Overview"] },
  { match: ["iaia emergency aid", "ayuda emergencia iaia", "iaia student help"], names: ["IAIA Emergency Aid Program + Community Food/Clothing Pantry + Hunger-Free Campus Initiative", "Rust Opportunity Assistance Fund"] },
  { match: ["iaia food pantry", "despensa iaia", "iaia basic needs"], names: ["IAIA Emergency Aid Program + Community Food/Clothing Pantry + Hunger-Free Campus Initiative", "Roadrunner Food Bank"] },
  { match: ["native student emergency", "estudiante nativo emergencia", "indigenous student aid"], names: ["IAIA Emergency Aid Program + Community Food/Clothing Pantry + Hunger-Free Campus Initiative", "American Indian Student Services (AISS)"] },
  { match: ["meal prep classes", "clases de cocina economica", "iaia cooking classes"], names: ["IAIA Emergency Aid Program + Community Food/Clothing Pantry + Hunger-Free Campus Initiative", "CNM Food Pantry (4 campus locations)"] },
  { match: ["ufo food pantry", "cosmo's cupboard", "despensa ufo"], names: ["Cosmo's Cupboard / UFO Food Pantry", "Lobo Food Pantry"] },
  { match: ["despensa campus", "college campus pantry"], names: ["Cosmo's Cupboard / UFO Food Pantry", "CNM Food Pantry (4 campus locations)", "\"The Stacks\" Food Pantry"] },
  { match: ["student food insecurity", "estudiante sin comida"], names: ["Cosmo's Cupboard / UFO Food Pantry", "HEERF / Federal Emergency Student Aid (historically CARES Act funds)"] },
  { match: ["ayuda con el gas", "no puedo pagar el gas", "gas assistance"], names: ["HEAT New Mexico", "LIHEAP (Low Income Home Energy Assistance)"] },
  { match: ["nm gas crisis", "gas crisis assistance", "gas shut off help"], names: ["HEAT New Mexico", "Salvation Army Bill Pay Assistance"] },
  { match: ["natural gas payment plan", "plan de pago gas", "gas bill payment help"], names: ["HEAT New Mexico", "LIHEAP (Low Income Home Energy Assistance)"] },
  { match: ["pueblo services", "servicios pueblos", "northern pueblos help", "ayuda pueblos del norte"], names: ["Eight Northern Indian Pueblos Council, Inc. (ENIPC)", "Five Sandoval Indian Pueblos, Inc. (FSIP) — Behavioral Health Services"] },
  { match: ["tribal services", "servicios tribales", "tribe services nm"], names: ["Eight Northern Indian Pueblos Council, Inc. (ENIPC)", "Albuquerque Indian Center (AIC)"] },
  { match: ["pueblo education help", "educacion pueblos", "pueblo student support"], names: ["Eight Northern Indian Pueblos Council, Inc. (ENIPC)", "American Indian Student Services (AISS)"] },
  { match: ["sliding scale doctor", "doctor escala movil", "pay what i can doctor", "clinica barata"], names: ["First Choice Community Healthcare", "Free/Income-Based Clinic Directories", "La Familia Medical Center"] },
  { match: ["primary care low income", "doctor familiar barato", "affordable primary care"], names: ["First Choice Community Healthcare", "UNM Care and Out of County Care"] },
  { match: ["clinica salud mujer", "womens clinic"], names: ["First Choice Community Healthcare", "Women's Resource Center (WRC)"] },
  { match: ["clinica adolescentes", "adolescent health"], names: ["First Choice Community Healthcare", "La Familia Medical Center"] },
  { match: ["substance use treatment", "tratamiento adicciones", "drug treatment program"], names: ["First Choice Community Healthcare", "New Mexico Crisis and Access Line"] },
  { match: ["crisis hotline", "linea de crisis"], names: ["Agora Crisis Center", "New Mexico Crisis and Access Line"] },
  { match: ["suicide hotline", "linea de suicidio", "pensando en suicidarme"], names: ["Agora Crisis Center", "New Mexico Crisis and Access Line"] },
  { match: ["free counseling hotline", "consejeria gratis telefono", "talk to counselor free"], names: ["Agora Crisis Center", "Manzanita Counseling Training Clinic"] },
  { match: ["suicide prevention training", "capacitacion prevencion suicidio", "sail training"], names: ["Agora Crisis Center", "New Mexico Crisis and Access Line"] },
  { match: ["paratransit", "sun van", "disabled bus service", "transporte discapacitados puerta a puerta"], names: ["ABQ RIDE Sun Van (Paratransit)", "ABQ RIDE (Fixed Route + ART + Connect Microtransit)"] },
  { match: ["can't use regular bus", "no puedo usar el autobus", "wheelchair transport", "transporte silla de ruedas"], names: ["ABQ RIDE Sun Van (Paratransit)", "Valencia County Dial-a-Ride"] },
  { match: ["door to door transport", "transporte puerta a puerta", "door to door ride disabled"], names: ["ABQ RIDE Sun Van (Paratransit)", "Valencia County Dial-a-Ride"] },
  { match: ["hospital charity care", "no puedo pagar el hospital", "cuenta de hospital"], names: ["Lovelace Health System — Financial Assistance", "Presbyterian Healthcare Services — Financial Assistance", "UNM Care and Out of County Care"] },
  { match: ["lovelace financial help", "ayuda financiera lovelace", "lovelace charity care"], names: ["Lovelace Health System — Financial Assistance", "Presbyterian Healthcare Services — Financial Assistance"] },
  { match: ["hospital payment plan", "plan de pago hospital", "hospital bill payment plan"], names: ["Lovelace Health System — Financial Assistance", "UNM Care and Out of County Care"] },
  { match: ["homeless student rights", "estudiante sin hogar derechos", "school while homeless"], names: ["NM McKinney-Vento Homeless Education Program", "APS Community Clothing Bank and School Supply Barn"] },
  { match: ["enroll without documents school", "inscribir escuela sin documentos", "school enrollment homeless"], names: ["NM McKinney-Vento Homeless Education Program", "211 New Mexico / United Way of Central NM"] },
  { match: ["school transportation homeless", "transporte escolar sin hogar", "homeless student bus"], names: ["NM McKinney-Vento Homeless Education Program", "ABQ RIDE (Fixed Route + ART + Connect Microtransit)"] },
  { match: ["food finder", "find food near me", "donde hay comida cerca", "buscador de comida"], names: ["Roadrunner Food Bank", "211 New Mexico / United Way of Central NM"] },
  { match: ["ayuda aplicar snap", "help with snap"], names: ["Roadrunner Food Bank", "SNAP (federally funded, state-administered)", "NM Human Services / Health Care Authority — ISD Programs"] },
  { match: ["descuento medicamentos", "buzzrx"], names: ["Roadrunner Food Bank Prescription Discount Card", "Roadrunner Food Bank"] },
  { match: ["food distribution", "distribucion de alimentos", "food giveaway"], names: ["Roadrunner Food Bank", "The Food Depot"] },
  { match: ["family shelter", "refugio familiar", "homeless with kids", "sin hogar con ninos"], names: ["Family Promise of Albuquerque", "Good Shepherd Center", "Joy Junction"] },
  { match: ["keep family together shelter", "refugio no separar familia", "family unity shelter"], names: ["Family Promise of Albuquerque", "Albuquerque Heading Home"] },
  { match: ["families experiencing homelessness", "familias sin hogar", "homeless family help"], names: ["Family Promise of Albuquerque", "Albuquerque Heading Home"] },
  { match: ["salvation army food", "comida salvation army", "ejercito de salvacion comida"], names: ["Salvation Army Food Pantry", "Roadrunner Food Bank"] },
  { match: ["emergency clothing", "ropa de emergencia", "free clothes emergency"], names: ["Salvation Army Food Pantry", "APS Community Clothing Bank and School Supply Barn"] },
  { match: ["cheap bus pass", "pase de autobus barato", "discounted bus pass"], names: ["Salvation Army Food Pantry", "ABQ RIDE (Fixed Route + ART + Connect Microtransit)"] },
  { match: ["free clinics list", "lista de clinicas gratis", "clinicas baratas albuquerque"], names: ["Free/Income-Based Clinic Directories", "First Choice Community Healthcare"] },
  { match: ["clinica escala de ingresos", "income based clinic"], names: ["Free/Income-Based Clinic Directories", "UNM Care and Out of County Care"] },
  { match: ["free tax help", "ayuda gratis con impuestos", "declaracion de impuestos gratis"], names: ["AARP Tax-Aide", "UNM ITIN Application Guidance"] },
  { match: ["tax preparation seniors", "impuestos para ancianos", "senior tax help"], names: ["AARP Tax-Aide", "UNM ITIN Application Guidance"] },
  { match: ["file taxes free", "hacer taxes gratis"], names: ["AARP Tax-Aide", "Federal Tax Credits Still Available to ITIN Filers"] },
  { match: ["childcare help", "ayuda con guarderia", "can't afford childcare", "no puedo pagar la guarderia"], names: ["NM Child Care Assistance Program", "Cuidando Los Niños"] },
  { match: ["childcare subsidy", "subsidio guarderia", "daycare assistance"], names: ["NM Child Care Assistance Program", "Cuidando Los Niños"] },
  { match: ["working parent childcare", "padre trabajador guarderia", "childcare while working"], names: ["NM Child Care Assistance Program", "Youth & Family Resource Roundup"] },
  { match: ["childcare for students", "guarderia para estudiantes", "student parent childcare"], names: ["NM Child Care Assistance Program", "HEERF / Federal Emergency Student Aid (historically CARES Act funds)"] },
  { match: ["affordable apartment albuquerque", "apartamento barato albuquerque", "cheap 1 bedroom"], names: ["Manzano Vista", "Bluewater Village", "Sandia Vista", "Aztec Village"] },
  { match: ["renta segun ingresos"], names: ["Manzano Vista", "Bluewater Village", "Housing Choice Voucher Program (Section 8)"] },
  { match: ["pet friendly affordable housing", "vivienda barata acepta mascotas", "accepts pets housing"], names: ["Manzano Vista", "Bluewater Village"] },
  { match: ["utilities included apartment", "apartamento con servicios incluidos", "all bills paid apartment"], names: ["Manzano Vista", "La Serena Senior Apartments"] },
  { match: ["section 8 accepted", "aceptan section 8", "voucher accepted"], names: ["Casa Bonita", "Aztec Village", "Housing Choice Voucher Program (Section 8)"] },
  { match: ["low income apartments", "apartamentos bajos ingresos"], names: ["Casa Bonita", "Aztec Village", "The Artisan at Sawmill Village"] },
  { match: ["senior apartments 55 plus", "apartamentos para mayores de 55", "vivienda seniors"], names: ["La Serena Senior Apartments", "Luminaria Senior Community", "Hibernian House", "La Cantera Senior Apartments"] },
  { match: ["new senior housing", "apartamentos nuevos ancianos", "new 55 plus housing"], names: ["La Serena Senior Apartments", "Meadowlark & Broadmoor Senior Centers"] },
  { match: ["all utilities included senior", "todo incluido ancianos", "senior utilities paid"], names: ["La Serena Senior Apartments", "Hibernian House"] },
  { match: ["cheapest apartment seniors", "apartamento barato ancianos", "affordable senior rent"], names: ["Hibernian House", "Bluewater Village", "Luminaria Senior Community"] },
  { match: ["senior housing downtown", "vivienda ancianos centro", "downtown senior living"], names: ["Hibernian House", "Luminaria Senior Community"] },
  { match: ["women of color scholarship", "beca mujeres de color", "scholarship latina"], names: ["DIWC Scholarship", "Transformar Fellowship Program"] },
  { match: ["unm cares funds", "fondos cares unm", "cares act unm"], names: ["HEERF / Federal Emergency Student Aid (historically CARES Act funds)", "Dean of Students Emergency Scholarship"] },
  { match: ["ascas", "arts and sciences advising", "as advising"], names: ["Arts & Sciences Center for Academic Success (ASCAS)", "College Enrichment Program (CEP)"] },
  { match: ["exploratory student", "estudiante exploratorio", "undecided student help"], names: ["University College Advising", "Mentoring Institute"] },
  { match: ["advising help unm", "ayuda consejeria unm", "unm advisor help"], names: ["Office of Advising Strategies / LoboTrax", "College Enrichment Program (CEP)"] },
  { match: ["rcrp", "raza planning center", "chicano planning"], names: ["Resource Center for Raza Planning (RCRP) & AICAE student chapter", "El Centro de la Raza"] },
  { match: ["mentor matching", "emparejamiento mentor", "find mentor match"], names: ["Mentoring Institute", "Society of Women Engineers (SWE) — UNM Chapter"] },
  { match: ["belen resources", "recursos belen nm", "belen new mexico help"], names: ["UNM-Valencia Community Resources Guide", "Valencia County Dial-a-Ride"] },
  { match: ["winter break food", "comida vacaciones invierno", "winter food help"], names: ["Lobo Food Pantry — Pack a Luminaria / Holiday Meals in a Bag", "Storehouse New Mexico"] },
  { match: ["honors scholarship", "beca honors", "honors college scholarship"], names: ["Center for Financial Capability Scholarship Index", "NM Legislative Lottery Scholarship"] },
  { match: ["dental school clinic", "clinica escuela dental", "dental clinic school"], names: ["Division of Dental Hygiene (Dept. of Dental Medicine)", "First Choice Community Healthcare"] },
  { match: ["international study money", "dinero estudiar fuera", "study overseas funding"], names: ["AMIGO Scholarship", "DIWC Scholarship"] },
  { match: ["canned food help", "comida enlatada gratis", "canned goods pantry"], names: ["Storehouse West", "The Food Depot"] },
  { match: ["jewish support groups", "grupos de apoyo judios", "jewish counseling"], names: ["Jewish Community Center (JCC) of Greater Albuquerque", "Agora Crisis Center"] },
  { match: ["diabetes help native", "diabetes nativos ayuda", "native diabetes care"], names: ["First Nations Community HealthSource", "Pueblo of Isleta Health Center"] },
  { match: ["senior meals delivery", "comida a domicilio ancianos", "home delivered meals seniors"], names: ["Adelante Development Center", "Sandoval County Community Services Department"] },
  { match: ["veteran child college", "hijo veterano universidad", "veteran dependent college"], names: ["NM Veterans' Dependents Tuition Waiver", "Veteran & Military Resource Center"] },
  { match: ["healthcare regardless of status", "salud sin importar estatus", "healthcare immigration status"], names: ["State-Funded Healthcare Access for Non-Citizens", "Free/Income-Based Clinic Directories"] },
  { match: ["somos un pueblo unido", "somos", "somos un pueblo"], names: ["Somos Un Pueblo Unido", "El CENTRO de Igualdad y Derechos"] },
  { match: ["matricula consular bank", "banco con matricula", "consular id bank account"], names: ["Rio Grande Credit Union — Juntos Avanzamos Program", "ITIN Banking — General Access Explainer"] },
  { match: ["lideres inmigrantes", "immigrant leaders"], names: ["El CENTRO de Igualdad y Derechos", "Somos Un Pueblo Unido"] },
  { match: ["eitc itin", "eitc con itin", "earned income credit itin"], names: ["Federal Tax Credits Still Available to ITIN Filers", "AARP Tax-Aide"] },
  { match: ["abrir llc", "open llc new mexico", "llc sin ssn"], names: ["NM Business Registration Without an SSN", "U.S. Small Business Administration (SBA) — New Mexico District Office"] },
  { match: ["cnm student support"], names: ["CNM Food Pantry (4 campus locations)", "Wellness CNM — Case Management & Free Counseling"] },
  { match: ["first gen formerly incarcerated", "primera generacion ex encarcelado", "formerly incarcerated first gen"], names: ["F.I.R.S.T. Program", "College Enrichment Program (CEP)"] },
  { match: ["santa fe food resources"], names: ["The Food Depot", "Santa Fe County Food Resources Hub"] },
  { match: ["rio rancho senior help", "ayuda ancianos rio rancho", "rio rancho seniors"], names: ["Sandoval County Community Services Department", "ABQ RIDE Sun Van (Paratransit)"] },
  { match: ["job search help nm", "ayuda buscar trabajo nm", "new mexico job help"], names: ["NM Dept. of Workforce Solutions (DWS)", "Library Job & Career Guide — 'Working It Out!'"] },
  { match: ["oaaa", "oficina asuntos afroamericanos", "office african american affairs"], names: ["NM Office of African American Affairs (OAAA)", "City of Albuquerque Office of Immigrant & Refugee Affairs"] },
  { match: ["mckinney vento clothing", "ropa mckinney vento", "mckinney vento clothes"], names: ["APS Community Clothing Bank and School Supply Barn", "NM McKinney-Vento Homeless Education Program"] },
  { match: ["va claim help", "ayuda reclamo veteranos", "veteran claims assistance"], names: ["VA Albuquerque Regional Benefit Office", "NM Dept. of Veterans' Services (NMDVS) — Benefits Overview"] },
  { match: ["iaia pantry", "despensa iaia santa fe", "iaia food"], names: ["IAIA Emergency Aid Program + Community Food/Clothing Pantry + Hunger-Free Campus Initiative", "The Food Depot"] },
  { match: ["ufo pantry hours", "horario despensa ufo", "ufo pantry"], names: ["Cosmo's Cupboard / UFO Food Pantry", "Lobo Food Pantry"] },
  { match: ["gas payment assistance", "asistencia pago gas", "help paying gas bill"], names: ["HEAT New Mexico", "New Mexico Home Fund"] },
  { match: ["8 northern pueblos", "8 pueblos del norte", "eight northern pueblos"], names: ["Eight Northern Indian Pueblos Council, Inc. (ENIPC)", "Lutheran Family Services Rocky Mountains (LFS) — Refugee & Asylee Program"] },
  { match: ["sliding fee clinic", "clinica tarifa variable", "fee based on income clinic"], names: ["First Choice Community Healthcare", "Free/Income-Based Clinic Directories"] },
];

var _nameIndex = null;
function resourceByName(name){
  if(!_nameIndex){
    _nameIndex = {};
    DATA.forEach(function(r){ _nameIndex[normStr(r.name)] = r; });
  }
  return _nameIndex[normStr(name)] || null;
}

/* Resources whose phrase-bank entry matches the query, in bank order */
function phraseSuggest(query){
  var q = normStr(query), out = [], seen = {};
  PHRASE_SUGGESTIONS.forEach(function(entry){
    for(var i=0;i<entry.match.length;i++){
      if(q.indexOf(entry.match[i]) !== -1){
        entry.names.forEach(function(n){
          var r = resourceByName(n);
          if(r && !seen[r.id]){ seen[r.id]=1; out.push(r); }
        });
        break;
      }
    }
  });
  return out;
}

function phraseBoostIds(query){
  var ids = {};
  phraseSuggest(query).forEach(function(r){ ids[r.id]=1; });
  return ids;
}


/* ============================================================
   SEARCH & FILTER STATE
   ============================================================ */
function applyFilters(rows){
  var out=rows.filter(function(r){
    if(filters.immigrant && !r.immigrant_tag) return false;
    if(filters.hidden && r.hidden !== "Yes") return false;
    if(filters.search){
      var boost = phraseBoostIds(filters.search);
      r._s = scoreResource(r, filters.search) + (boost[r.id] ? 1000 : 0);
      return r._s>0;
    }
    return true;
  });
  if(filters.search){
    out.sort(function(a,b){ return (b._s||0)-(a._s||0); });
  }
  return out;
}
function toggleImmigrantFilter(){ filters.immigrant=!filters.immigrant; document.getElementById('immFilter').classList.toggle('active',filters.immigrant); render(); }
function toggleHiddenFilter(){ filters.hidden=!filters.hidden; document.getElementById('hiddenFilter').classList.toggle('active',filters.hidden); render(); }
document.getElementById('search').addEventListener('input', e=>{ filters.search=e.target.value; detailStack=[]; render(); });


/* ============================================================
   CATEGORY BANNERS & VIDEOS
   catBanner() renders the colored illustrated strip at the top of
   a category page. videoBlockFor() only shows real, independently-
   verified YouTube embeds tied to a specific category (currently
   just Food) — never shown globally.
   ============================================================ */
const VIDEOS = [
  { match:"Roadrunner Food Bank", title:"New Mexico food bank coverage", desc:"Local news coverage of a food bank drive in New Mexico, relevant background for the Food category.", id:"_axAcqOqceI" },
  { match:"Roadrunner Food Bank", title:"New Mexico food distribution coverage", desc:"Local news coverage of food distribution work in New Mexico.", id:"2HYdr15YMww" }
];

function catBanner(bucket){
  const cls = CAT_CLASS[bucket];
  const div = document.createElement('div');
  div.className = 'cat-banner ' + cls;
  div.innerHTML = `<div class="cat-banner-inner"><div class="icon-circle-lg">${icon(bucket,34)}</div></div>`;
  return div;
}

function videoBlockFor(matchName){
  const vids = VIDEOS.filter(v=>v.match===matchName);
  if(!vids.length) return null;
  const wrap = document.createElement('div');
  wrap.className = 'video-row video-row-tight';
  wrap.innerHTML = vids.map(v=>`
    <div class="video-card">
      <div class="frame-wrap"><iframe src="https://www.youtube.com/embed/${v.id}" title="${v.title}" allowfullscreen loading="lazy"></iframe></div>
      <div class="cap"><h3>${v.title}</h3><p>${v.desc}</p></div>
    </div>`).join('');
  return wrap;
}


/* ============================================================
   MAP VIEW
   Built with Leaflet.js + free OpenStreetMap tiles (no API key).
   Pin coordinates were verified via address geocoding (Oct 2026 pass,
   Nominatim/OpenStreetMap) — see the in-app disclaimer and the
   Verification Queue tab in the dataset for details.
   ============================================================ */
function showMapView(){
  navigate('#/map');
}

function renderMapView(){
  const main = document.getElementById('main');
  main.innerHTML = '';
  renderBreadcrumb();
  document.getElementById('mapToggle').classList.add('active');

  const withCoords = DATA.filter(r => r.lat && r.lng);

  const backBtn = document.createElement('button');
  backBtn.className = 'back-btn';
  backBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> ${t('backToCategories')}`;
  backBtn.onclick = ()=> history.back();
  main.appendChild(backBtn);

  const h = document.createElement('div'); h.className='section-head'; h.style.marginTop='14px';
  h.innerHTML = `<h2>${t('mapViewTitle')}</h2><span class="sub">${withCoords.length} ${t('mapKnownLoc')}</span>`;
  main.appendChild(h);

  const disclaimer = document.createElement('div');
  disclaimer.className = 'map-disclaimer';
  disclaimer.innerHTML = `<span>📍</span><div><b>${t('mapDisclaimerTitle')}</b> ${t('mapDisclaimerBody')}</div>`;
  main.appendChild(disclaimer);

  const mapDiv = document.createElement('div');
  mapDiv.id = 'leafletMap';
  main.appendChild(mapDiv);

  // Leaflet must attach after the div is in the DOM
  setTimeout(()=>{
    if(leafletMapInstance){ leafletMapInstance.remove(); leafletMapInstance = null; }
    const map = L.map('leafletMap').setView([35.0, -106.3], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markers = [];
    withCoords.forEach(r=>{
      const marker = L.circleMarker([r.lat, r.lng], {
        radius: 8, fillColor: '#1d7a70', color: '#fff', weight: 2, fillOpacity: 0.9
      }).addTo(map);
      marker.bindPopup(`<b>${r.name}</b>${r.org}<br><a href="#" data-id="${r.id}">View details →</a>`);
      marker.on('popupopen', (e)=>{
        const link = e.popup.getElement().querySelector('a[data-id]');
        if(link){ link.onclick = (evt)=>{ evt.preventDefault(); navigate('#/resource/'+r.id); }; }
      });
      markers.push(marker);
    });
    if(markers.length){
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }
    leafletMapInstance = map;
  }, 0);
}


/* ============================================================
   QUICK-START SITUATIONAL GUIDE
   Hand-curated "what's going on?" shortcuts — each maps a plain-
   language situation to a specific, verified list of resource names
   (not a generic category/keyword match). If you add a situation,
   double-check every name in `names` matches a Resource Name in the
   spreadsheet EXACTLY, or it will silently fail to show up.
   ============================================================ */
const QUICK_START = [
  { icon:"Housing", names:["Albuquerque Heading Home","Good Shepherd Center","Joy Junction","Barrett House / ABQ Rescue Mission Women's Center of Hope","Family Promise of Albuquerque"] },
  { icon:"Financial & Banking", names:["New Mexico Home Fund","Dean of Students Emergency Scholarship","PNM Good Neighbor Fund + PNM CARES","HEAT New Mexico","Salvation Army Bill Pay Assistance"] },
  { icon:"Food", names:["Lobo Food Pantry","Roadrunner Food Bank","Storehouse New Mexico","Rio Grande Food Project","LDS Bishops' Storehouse / Home Storage Center"] },
  { icon:"Immigrant & ITIN Resources", names:["Rio Grande Credit Union — Juntos Avanzamos Program","UNM ITIN Application Guidance","Undocumented UNM (undocumented.unm.edu)","NM Working Families Tax Credit — ITIN Filers Included","Homewise ITIN Mortgage Loans"] },
  { icon:"Financial & Banking", names:["Dean of Students Emergency Scholarship","UNM Short-Term Emergency Loan","Student Success Access Grant","Rust Opportunity Assistance Fund"] },
  { icon:"Healthcare", names:["UNM Care and Out of County Care","First Choice Community Healthcare","First Nations Community HealthSource","Presbyterian Healthcare Services — Financial Assistance"] },
];

function renderQuickStart(){
  const wrap = document.createElement('div');
  wrap.className = 'quick-start';
  wrap.innerHTML = `<div class="section-head"><h2>${t('qsTitle')}</h2><span class="sub">${t('qsSub')}</span></div>`;
  const grid = document.createElement('div');
  grid.className = 'qs-grid';
  QUICK_START.forEach((qs,i)=>{
    const label = t('qs')[i].label;
    const btn = document.createElement('div');
    btn.className = 'qs-btn ' + CAT_CLASS[qs.icon];
    btn.innerHTML = `<div class="icon-circle">${icon(qs.icon,20)}</div><span>${label}</span>`;
    makeInteractive(btn, ()=>{ navigate('#/situation/'+i); });
    grid.appendChild(btn);
  });
  wrap.appendChild(grid);
  return wrap;
}


/* ============================================================
   CRISIS FAST-PATH
   The persistent "Need help right now?" button available on every
   page. Same hand-curated-list pattern as Quick Start above.
   ============================================================ */
const CRISIS_NAMES = ["Albuquerque Heading Home","Good Shepherd Center","Joy Junction","Agora Crisis Center","New Mexico Crisis and Access Line","Rape Crisis Center of Central New Mexico"];

function showCrisisPanel(){
  navigate('#/crisis');
}

function renderCrisisRoute(){
  document.title = (lang==='es' ? 'Ayuda urgente' : 'Need help right now') + ' — New Mexico Resource Navigator';
  const matches = CRISIS_NAMES.map(n=>DATA.find(x=>x.name===n)).filter(Boolean);
  const main = document.getElementById('main');
  main.innerHTML = '';
  renderHomeExtras(false);
  renderBreadcrumb('crisis');
  const back = document.createElement('button');
  back.className = 'back-btn';
  back.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> ${t('backToCategories')}`;
  back.onclick = ()=> history.back();
  main.appendChild(back);
  const h = document.createElement('div'); h.className='section-head'; h.style.marginTop='14px';
  h.innerHTML = `<h2>${lang==='es' ? '¿Necesitas ayuda ahora mismo?' : 'Need help right now?'}</h2><span class="sub">${lang==='es' ? 'Refugio y líneas de crisis' : 'Shelter and crisis lines'}</span>`;
  main.appendChild(h);
  main.appendChild(buildCardList(matches));
  updateBottomNav();
}


/* ============================================================
   PRINT
   ============================================================ */
function printCurrentView(){
  window.print();
}


/* ============================================================
   KEYWORD-MATCHING ASSISTANT
   IMPORTANT: this is plain keyword scoring against resource text,
   not a real AI/LLM. It's labeled that way in the UI on purpose —
   don't oversell it in code comments either.
   ============================================================ */
function keywordMatch(query){
  if(!query || query.trim().length<3) return [];
  var out = phraseSuggest(query), seen = {};
  out.forEach(function(r){ seen[r.id]=1; });
  if(out.length < 6){
    var scored = DATA.map(r=>({r, score: scoreResource(r, query)}))
      .filter(x=>x.score>0 && !seen[x.r.id]);
    scored.sort((a,b)=>b.score-a.score);
    scored.slice(0, 6-out.length).forEach(function(x){ out.push(x.r); });
  }
  return out.slice(0,6);
}

function renderAssistant(){
  const wrap = document.createElement('div');
  wrap.className = 'assistant-block assistant-hero';
  wrap.id = 'assistantHero';
  const chips = t('sitChips').map(c=>`<button class="sit-chip" data-q="${c.q.replace(/"/g,'&quot;')}">${c.label}</button>`).join('');
  wrap.innerHTML = `
    <div class="section-head"><h2>${t('asstTitle')}</h2>
    <span class="sub">${t('asstSub')}</span></div>
    <textarea id="assistantInput" placeholder="${t('asstPlaceholder').replace(/"/g,'&quot;')}" rows="2"></textarea>
    <button class="asst-btn" id="assistantBtn">${t('asstBtn')}</button>
    <button class="asst-btn asst-ai" id="assistantAiBtn" style="display:none;margin-top:8px;">${t('asstAiBtn')}</button>
    <div class="asst-note">${t('asstNote')}</div>
    <div class="sit-chips"><span class="chip-label">${t('tryLabel')}</span>${chips}</div>
    <div id="assistantResults"></div>`;
  const btn = wrap.querySelector('#assistantBtn');
  const input = wrap.querySelector('#assistantInput');
  const runSearch = ()=>{
    const matches = keywordMatch(input.value);
    const resultsDiv = wrap.querySelector('#assistantResults');
    resultsDiv.innerHTML = '';
    if(matches.length){
      resultsDiv.appendChild(buildCardList(matches));
    } else if(input.value.trim().length>=3){
      const e = document.createElement('div'); e.className='empty'; e.textContent = t('noMatch');
      resultsDiv.appendChild(e);
    }
  };
  btn.onclick = runSearch;
  const aiBtn = wrap.querySelector('#assistantAiBtn');
  if(API_BASE){
    aiBtn.style.display = '';
    aiBtn.onclick = async ()=>{
      const q = input.value.trim();
      if(q.length < 3) return;
      const resultsDiv = wrap.querySelector('#assistantResults');
      resultsDiv.innerHTML = `<div class="empty">${t('aiThinking')}</div>`;
      aiBtn.disabled = true;
      try{
        const res = await fetch(API_BASE + '/api/ask', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({question: q, lang: lang})
        });
        const data = await res.json();
        resultsDiv.innerHTML = '';
        if(data.answer){
          const a = document.createElement('div'); a.className = 'ai-answer';
          a.textContent = data.answer;
          resultsDiv.appendChild(a);
        }
        const items = (data.resourceIds||[]).map(id=>DATA.find(x=>x.id===id)).filter(Boolean);
        if(items.length) resultsDiv.appendChild(buildCardList(items));
        if(!data.answer && !items.length){
          const e = document.createElement('div'); e.className='empty'; e.textContent = t('aiError');
          resultsDiv.appendChild(e);
        }
      }catch(err){
        resultsDiv.innerHTML = `<div class="empty">${t('aiError')}</div>`;
      }
      aiBtn.disabled = false;
    };
  }
  let deb = null;
  input.addEventListener('input', ()=>{ clearTimeout(deb); deb = setTimeout(runSearch, 350); });
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); clearTimeout(deb); runSearch(); } });
  wrap.querySelectorAll('.sit-chip').forEach(ch=>{
    ch.addEventListener('click', ()=>{ input.value = ch.dataset.q; runSearch(); input.focus(); });
  });
  return wrap;
}

function renderSituationRoute(idx){
  const qs = QUICK_START[idx];
  const label = t('qs')[idx].label;
  document.title = label + ' — New Mexico Resource Navigator';
  const matches = qs.names.map(n=>DATA.find(x=>x.name===n)).filter(Boolean);
  const main = document.getElementById('main');
  main.innerHTML = '';
  renderHomeExtras(false);
  renderBreadcrumb('situation', label);
  const back = document.createElement('button');
  back.className = 'back-btn';
  back.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> ${t('backToCategories')}`;
  back.onclick = ()=> history.back();
  main.appendChild(back);
  const h = document.createElement('div'); h.className='section-head'; h.style.marginTop='14px';
  h.innerHTML = `<h2>${label}</h2><span class="sub">${matches.length} ${t('curatedResourcesFor')}</span>`;
  main.appendChild(h);
  main.appendChild(buildCardList(matches));
  updateBottomNav();
}


/* ============================================================
   HOMEPAGE-ONLY EXTRAS
   The "how it works" ribbon, FAQ, and About section. These must
   ONLY appear on the true homepage — renderHomeExtras(false) clears
   them, and every other view (category, detail, map, search, crisis,
   situation) calls that before rendering its own content.
   ============================================================ */
function renderHomeExtras(show){
  const extras = document.getElementById('homeExtras');
  extras.innerHTML = '';
  if(!show) return;

  const ribbon = document.createElement('div');
  ribbon.className = 'how-ribbon';
  ribbon.innerHTML = t('howRibbon').map(c=>`<div class="how-cell"><div class="num">${c.n}</div><h3>${c.h}</h3><p>${c.p}</p></div>`).join('');
  extras.appendChild(ribbon);

  const twoCol = document.createElement('div');
  twoCol.className = 'two-col';
  twoCol.innerHTML = `
    <div>
      <div class="section-head"><h2>${t('faqTitle')}</h2></div>
      <div id="faqList"></div>
    </div>
    <div class="about-block">
      <div class="section-head"><h2>${t('aboutTitle')}</h2></div>
      <p>${t('aboutP1')}</p>
      <p>${t('aboutP2')}</p>
      <ul class="method-list">
        ${t('aboutList').map(li=>`<li><span class="check">✓</span> ${li}</li>`).join('')}
      </ul>
    </div>`;
  extras.appendChild(twoCol);

  const faqList = twoCol.querySelector('#faqList');
  if(faqList){
    faqList.innerHTML = t('faqs').map((f,i)=>`<div class="faq-item" data-i="${i}"><div class="faq-q">${f.q}<span class="plus">+</span></div><div class="faq-a"><p>${f.a}</p></div></div>`).join('');
    faqList.querySelectorAll('.faq-item').forEach(item=>{ makeInteractive(item.querySelector('.faq-q'), ()=>item.classList.toggle('open')); });
  }
}


/* ============================================================
   MAIN VIEW DISPATCH
   The single entry point every route ultimately calls. Reads the
   current app state (mapView / detailStack / path / filters) and
   decides what to draw. Prefer calling navigate(hash) over calling
   render() directly, so the URL always matches what's on screen.
   ============================================================ */
/* ============================================================
   BOTTOM NAV (mobile) — active state + labels, Search shortcut
   ============================================================ */
function updateBottomNav(){
  const nav = document.getElementById('bottomNav');
  if(!nav) return;
  nav.querySelector('#navHomeLabel').textContent = t('navHome');
  nav.querySelector('#navSearchLabel').textContent = t('navSearch');
  nav.querySelector('#navMapLabel').textContent = t('navMap');
  nav.querySelector('#navHelpLabel').textContent = t('navHelp');
  const h = location.hash || '#/';
  const isHome = (h==='#/'||h===''||h==='#') && !mapView && detailStack.length===0 && path.length===0 && !filters.search;
  nav.querySelectorAll('button').forEach(b=>{
    const k = b.dataset.nav;
    b.classList.toggle('active',
      (k==='home'&&isHome) || (k==='map'&&mapView) || (k==='help'&&h==='#/crisis'));
  });
}

function navToSearch(){
  const go = ()=>{
    const hero = document.getElementById('assistantHero');
    if(hero){
      hero.scrollIntoView({behavior:'smooth', block:'start'});
      const input = document.getElementById('assistantInput');
      if(input) setTimeout(()=>input.focus({preventScroll:true}), 450);
    }
  };
  if((location.hash||'#/') !== '#/'){ navigate('#/'); setTimeout(go, 60); }
  else go();
}

function render(){
  renderInner();
  updateBottomNav();
}

function renderInner(){
  if(mapView){ renderMapView(); renderHomeExtras(false); return; }
  document.getElementById('mapToggle').classList.remove('active');
  if(detailStack.length>0){ renderDetail(); renderHomeExtras(false); return; }
  const main = document.getElementById('main');
  main.innerHTML = '';
  renderBreadcrumb();
  const filtered = applyFilters(DATA);

  if(filters.search){
    renderHomeExtras(false);
    const h = document.createElement('div'); h.className='section-head'; h.innerHTML=`<h2>${t('searchResults')}</h2><span class="sub">${filtered.length} ${t('found')}</span>`;
    main.appendChild(h);
    main.appendChild(buildCardList(filtered));
    return;
  }
  if(path.length===0){
    main.appendChild(renderAssistant());
    main.appendChild(renderSavedButton());
    main.appendChild(renderQuickStart());
    main.appendChild(renderPlaybookGrid());
    const h = document.createElement('div'); h.className='section-head'; h.style.marginTop='30px'; h.innerHTML=`<h2>${t('browseByCategory')}</h2><span class="sub">${DATA.length} ${t('totalResources')}</span>`;
    main.appendChild(h);
    main.appendChild(buildCategoryGrid(filtered));
    if(filters.hidden || filters.immigrant){
      const h2 = document.createElement('div'); h2.className='section-head'; h2.style.marginTop='30px';
      h2.innerHTML = `<h2>${t('filteredResults')}</h2><span class="sub">${filtered.length} ${t('found')}</span>`;
      main.appendChild(h2);
      main.appendChild(buildCardList(filtered));
    }
    renderHomeExtras(true);
    return;
  }
  renderHomeExtras(false);
  const bucket = path[0];
  const wrap = document.createElement('div'); wrap.className = CAT_CLASS[bucket];
  wrap.appendChild(catBanner(bucket));
  const header = document.createElement('div'); header.className='list-header';
  header.innerHTML = `<div class="icon-circle">${icon(bucket,22)}</div><div class="section-head" style="margin:0; flex:1;"><h2>${t('catNames')[bucket]}</h2></div>`;
  wrap.appendChild(header);
  const items = filtered.filter(r=>r.bucket===bucket);
  wrap.appendChild(buildCardList(items));
  const vids = videoBlockFor(bucket==='Food' ? 'Roadrunner Food Bank' : '__none__');
  if(vids) wrap.appendChild(vids);
  main.appendChild(wrap);
}


/* ============================================================
   CATEGORY GRID, RESOURCE CARDS & RELATED-RESOURCE LOGIC
   relatedResources() prioritizes hand-curated links (the dataset's
   "Related Resources (curated)" column) over generic same-category/
   same-region matching, so parseEligibility() at the bottom turns a
   resource's eligibility prose into a scannable checklist.
   ============================================================ */
function buildCategoryGrid(filtered){
  const grid = document.createElement('div'); grid.className='cat-grid';
  const buckets = {}; filtered.forEach(r=>{ buckets[r.bucket]=(buckets[r.bucket]||0)+1; });
  Object.keys(ICONS).forEach(b=>{
    const count = buckets[b]||0;
    const tile = document.createElement('div'); tile.className = 'cat-tile ' + CAT_CLASS[b];
    tile.innerHTML = `<div class="icon-circle">${icon(b,20)}</div><div class="txt"><h3>${t('catNames')[b]}</h3><span class="count">${count} resource${count===1?'':'s'}</span></div>`;
    makeInteractive(tile, ()=>{ navigate('#/category/'+encodeURIComponent(b)); });
    grid.appendChild(tile);
  });
  return grid;
}

function relatedResources(r, max=4){
  const seen = new Set([r.id]); const out = [];
  if(r.related){
    const names = r.related.split(';').map(s=>s.trim()).filter(Boolean);
    names.forEach(name=>{
      const match = DATA.find(x=>x.name===name);
      if(match && !seen.has(match.id)){ seen.add(match.id); out.push({item:match, curated:true}); }
    });
  }
  if(out.length < max){
    const sameCat = DATA.filter(x=>!seen.has(x.id) && x.bucket===r.bucket);
    const sameGeo = DATA.filter(x=>!seen.has(x.id) && x.bucket!==r.bucket && geoTag(x.level)===geoTag(r.level));
    [...sameCat, ...sameGeo].forEach(item=>{
      if(out.length<max && !seen.has(item.id)){ seen.add(item.id); out.push({item, curated:false}); }
    });
  }
  return out.slice(0, max);
}

function badgesFor(r){
  return `<span class="badge geo">${geoTag(r.level)}</span>
    ${r.hidden==='Yes'?`<span class="badge hidden">${t('hiddenGem')}</span>`:''}
    ${r.immigrant_tag?`<span class="badge imm">${t('itinBadge')}</span>`:''}
    ${r.status==='Needs Verification'?`<span class="badge verify">${t('unverified')}</span>`:''}`;
}

/* Extract the first callable phone number from a contact string.
   Handles "505-764-3975", "1-800-283-4465", "211 or 505-247-2911". */
function extractPhone(contact){
  if(!contact) return null;
  const m = contact.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if(m){
    const digits = m[0].replace(/\D/g,'');
    return 'tel:+1' + digits.slice(-10);
  }
  const short = contact.match(/\b([23]11)\b/);
  if(short) return 'tel:' + short[1];
  return null;
}

/* ============================================================
   SAVED RESOURCES (localStorage) + SHARE + FEEDBACK
   API_BASE: set to the Cloudflare Worker URL when the $0
   AI/feedback backend is deployed; feedback POSTs there when set.
   ============================================================ */
var API_BASE = 'https://nmr-assistant.julio-d-rojas-loo.workers.dev';

function getFaves(){
  try{ return JSON.parse(localStorage.getItem('nmr-faves')||'[]'); }catch(e){ return []; }
}
function isFave(id){ return getFaves().indexOf(id) !== -1; }
function faveBtnInner(id){
  return isFave(id) ? '🔖 '+t('savedBtn') : '🔖 '+t('saveBtn');
}
function toggleFave(id, btn){
  let f = getFaves();
  const i = f.indexOf(id);
  if(i>=0) f.splice(i,1); else f.push(id);
  try{ localStorage.setItem('nmr-faves', JSON.stringify(f)); }catch(e){}
  render();
}
function shareResource(id){
  const r = DATA.find(x=>x.id===id);
  if(!r) return;
  const url = location.origin + location.pathname + '#/resource/' + r.id;
  const text = r.name + ' — ' + url;
  if(navigator.share){ navigator.share({title:r.name, text:r.name, url:url}).catch(()=>{}); }
  else { window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank'); }
}
function feedbackVote(id, val, wrap){
  try{
    const fb = JSON.parse(localStorage.getItem('nmr-fb')||'{}');
    fb[id] = val;
    localStorage.setItem('nmr-fb', JSON.stringify(fb));
  }catch(e){}
  if(API_BASE){ fetch(API_BASE+'/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,vote:val})}).catch(()=>{}); }
  wrap.innerHTML = `<span class="fb-thanks">${t('fbThanks')}</span>`;
}
function feedbackBlock(id){
  let cur = null;
  try{ cur = JSON.parse(localStorage.getItem('nmr-fb')||'{}')[id] || null; }catch(e){}
  const wrap = document.createElement('div');
  wrap.className = 'fb-block';
  if(cur){ wrap.innerHTML = `<span class="fb-thanks">${t('fbThanks')}</span>`; }
  else{
    wrap.innerHTML = `<span class="fb-q">${t('fbQ')}</span>
      <button class="fb-btn" data-v="up">${t('fbUp')}</button>
      <button class="fb-btn" data-v="down">${t('fbDown')}</button>`;
    wrap.querySelectorAll('.fb-btn').forEach(b=>{ b.onclick = ()=>feedbackVote(id, b.dataset.v, wrap); });
  }
  return wrap;
}

/* ============================================================
   SITUATION PLAYBOOKS — step-by-step guides (data in js/playbooks.js)
   ============================================================ */
function renderPlaybookGrid(){
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="section-head" style="margin-top:30px;"><h2>${t('playbooksTitle')}</h2><span class="sub">${t('playbooksSub')}</span></div>`;
  const grid = document.createElement('div'); grid.className = 'pb-grid';
  PLAYBOOKS.forEach(pb=>{
    const card = document.createElement('div'); card.className = 'pb-card';
    card.innerHTML = `<div class="pb-icon">${pb.icon}</div><div class="pb-txt"><h3>${pb.title[lang]}</h3><span>${pb.sub[lang]}</span></div><div class="pb-arrow">→</div>`;
    makeInteractive(card, ()=>navigate('#/playbook/'+pb.id));
    grid.appendChild(card);
  });
  wrap.appendChild(grid);
  return wrap;
}

function renderPlaybookRoute(id){
  const pb = PLAYBOOKS.find(p=>p.id===id);
  if(!pb){ navigate('#/'); return; }
  document.title = pb.title[lang] + ' — New Mexico Resource Navigator';
  const main = document.getElementById('main');
  main.innerHTML = '';
  renderHomeExtras(false);
  renderBreadcrumb('playbook', pb.title[lang]);
  const back = document.createElement('button');
  back.className = 'back-btn';
  back.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> ${t('backToCategories')}`;
  back.onclick = ()=> history.back();
  main.appendChild(back);
  const h = document.createElement('div'); h.className='section-head'; h.style.marginTop='14px';
  h.innerHTML = `<h2>${pb.icon} ${pb.title[lang]}</h2><span class="sub">${pb.sub[lang]}</span>`;
  main.appendChild(h);
  pb.steps.forEach((s,i)=>{
    const step = document.createElement('div'); step.className='pb-step';
    step.innerHTML = `<div class="pb-step-num">${i+1}</div><div class="pb-step-body"><h3>${s.h[lang]}</h3><p>${s.p[lang]}</p></div>`;
    main.appendChild(step);
    const items = s.names.map(n=>DATA.find(x=>x.name===n)).filter(Boolean);
    if(items.length) main.appendChild(buildCardList(items));
  });
  updateBottomNav();
  window.scrollTo({top:0});
}

function renderSavedRoute(){
  document.title = t('mySaved') + ' — New Mexico Resource Navigator';
  const main = document.getElementById('main');
  main.innerHTML = '';
  renderHomeExtras(false);
  renderBreadcrumb('saved', t('mySaved'));
  const back = document.createElement('button');
  back.className = 'back-btn';
  back.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> ${t('backToCategories')}`;
  back.onclick = ()=> history.back();
  main.appendChild(back);
  const h = document.createElement('div'); h.className='section-head'; h.style.marginTop='14px';
  h.innerHTML = `<h2>🔖 ${t('mySaved')}</h2>`;
  main.appendChild(h);
  const faves = getFaves().map(id=>DATA.find(x=>x.id===id)).filter(Boolean);
  if(faves.length){ main.appendChild(buildCardList(faves)); }
  else{ const e = document.createElement('div'); e.className='empty'; e.textContent = t('savedEmpty'); main.appendChild(e); }
  updateBottomNav();
  window.scrollTo({top:0});
}

function renderSavedButton(){
  const b = document.createElement('button');
  b.className = 'saved-link-btn';
  b.innerHTML = `🔖 ${t('mySaved')} (${getFaves().length})`;
  b.onclick = ()=>navigate('#/saved');
  return b;
}

function actionRow(r){
  const phone = extractPhone(r.contact);
  const acts = [];
  if(phone) acts.push(`<a class="act-call" href="${phone}" onclick="event.stopPropagation()" aria-label="${t('actCall')} ${r.name}">📞 ${t('actCall')}</a>`);
  if(r.url) acts.push(`<a class="act-web" href="${r.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">🌐 ${t('actWeb')}</a>`);
  if(r.lat && r.lng) acts.push(`<a class="act-dir" href="https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}" target="_blank" rel="noopener" onclick="event.stopPropagation()">📍 ${t('actDir')}</a>`);
  acts.push(`<button class="act-save" onclick="event.stopPropagation();toggleFave(${r.id},this)">${faveBtnInner(r.id)}</button>`);
  acts.push(`<button class="act-share" onclick="event.stopPropagation();shareResource(${r.id})">📤 ${t('shareBtn')}</button>`);
  if(!acts.length) return '';
  return `<div class="card-actions">${acts.join('')}</div>`;
}

function detailActions(r){
  const row = actionRow(r);
  if(!row) return '';
  return row.replace('card-actions', 'card-actions detail-actions');
}

function buildCardList(items){
  if(items.length===0){
    const e = document.createElement('div'); e.className='empty'; e.textContent=t('noMatch');
    return e;
  }
  const wrap = document.createElement('div'); wrap.className='card-list';
  items.forEach(r=>{
    const c = document.createElement('div'); c.className='rcard ' + CAT_CLASS[r.bucket];
    c.innerHTML = `<div class="body">
        <span class="rname">${r.name}</span>
        <span class="rorg">${r.org}</span>
        <div class="rmeta">${badgesFor(r)}</div>${actionRow(r)}</div>`;
    makeInteractive(c, ()=>{ navigate('#/resource/'+r.id); });
    wrap.appendChild(c);
  });
  return wrap;
}

function buildRelatedCardList(wrapped){
  const wrap = document.createElement('div'); wrap.className='card-list';
  wrapped.forEach(({item:r, curated})=>{
    const c = document.createElement('div'); c.className='rcard ' + CAT_CLASS[r.bucket];
    c.innerHTML = `<div class="body">
        <span class="rname">${r.name}</span>
        <span class="rorg">${r.org}</span>
        <div class="rmeta">
          ${curated?`<span class="badge curated">${t('directlyConnected')}</span>`:''}
          ${badgesFor(r)}
        </div></div>`;
    makeInteractive(c, ()=>{ navigate('#/resource/'+r.id); });
    wrap.appendChild(c);
  });
  return wrap;
}

function parseEligibility(text){
  if(!text) return [];
  let parts;
  if(text.includes(';')){
    parts = text.split(';');
  } else {
    const commaCount = (text.match(/,/g)||[]).length;
    parts = commaCount >= 2 ? text.split(',') : [text];
  }
  return parts.map(p=>p.trim().replace(/^(and|or)\s+/i,'').replace(/\.$/,'')).filter(p=>p.length>2);
}


/* ============================================================
   RESOURCE DETAIL PAGE
   Every resource gets its own shareable URL and page title here.
   ============================================================ */
function renderDetail(){
  const main = document.getElementById('main');
  main.innerHTML = '';
  const r = detailStack[detailStack.length-1];
  renderBreadcrumb('resource', r.name);
  document.title = r.name + ' — New Mexico Resource Navigator';

  const wrap = document.createElement('div'); wrap.className = 'detail-view ' + CAT_CLASS[r.bucket];

  const row = document.createElement('div'); row.className='back-row';
  const back = document.createElement('button'); back.className='back-btn';
  back.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> ${t('backToList')}`;
  back.onclick = ()=> history.back();
  const share = document.createElement('button'); share.className='share-btn';
  share.innerHTML = t('copyLink');
  share.onclick = ()=>{
    const url = location.href.split('#')[0] + '#/resource/' + r.id;
    copyToClipboard(url);
    share.innerHTML = t('copied');
    setTimeout(()=>{ share.innerHTML = t('copyLink'); }, 1600);
  };
  const printBtn = document.createElement('button'); printBtn.className='share-btn';
  printBtn.textContent = lang==='es' ? 'Imprimir' : 'Print';
  printBtn.onclick = printCurrentView;
  const feedback = document.createElement('button'); feedback.className='share-btn';
  feedback.textContent = lang==='es' ? 'Reportar un problema' : 'Report an issue';
  feedback.onclick = ()=>{
    const subject = encodeURIComponent('Resource issue: ' + r.name);
    const body = encodeURIComponent((lang==='es' ? 'Recurso: ' : 'Resource: ') + r.name + '\n' + (lang==='es' ? 'Describe el problema:' : 'Describe the issue:') + '\n\n');
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  row.appendChild(back); row.appendChild(printBtn); row.appendChild(feedback); row.appendChild(share);
  wrap.appendChild(row);

  const card = document.createElement('div'); card.className='detail-card';
  card.innerHTML = `<div class="accent-bar"></div><div class="inner">
    <div class="badges-row">${badgesFor(r)}</div>
    <h2>${r.name}</h2>
    ${detailActions(r)}
    <div class="field"><b>${t('fldOrg')}</b>${r.org}</div>
    <div class="field"><b>${t('fldWhat')}</b>${r.what}</div>
    <div class="field"><b>${t('fldHow')}</b>${r.how}</div>
    <div class="field"><b>${t('fldElig')}</b><ul class="elig-checklist">${parseEligibility(r.elig).map(p=>`<li><span class="chk">☐</span>${p}</li>`).join('')}</ul></div>
    <div class="field"><b>${t('fldContact')}</b>${r.contact||'—'}</div>
    <div class="field"><b>${t('fldSource')}</b><a href="${r.url}" target="_blank" rel="noopener">${r.url}</a></div>
  </div>`;
  wrap.appendChild(card);

  wrap.appendChild(feedbackBlock(r.id));

  const related = relatedResources(r);
  if(related.length){
    const hasCurated = related.some(x=>x.curated);
    const relBlock = document.createElement('div'); relBlock.className='related-block';
    relBlock.innerHTML = `<div class="section-head"><h2>${t('relatedResources')}</h2>${hasCurated?`<span class="sub">${t('curatedSub')}</span>`:''}</div>`;
    relBlock.appendChild(buildRelatedCardList(related));
    wrap.appendChild(relBlock);
  }
  main.appendChild(wrap);
  window.scrollTo({top:0});
}


/* ============================================================
   BREADCRUMB
   ============================================================ */
function renderBreadcrumb(extra, extraLabel){
  const bc = document.getElementById('breadcrumb');
  let parts = [{label:t('home'), hash:'#/'}];
  if(mapView) parts.push({label:t('mapViewTitle'), hash:'#/map'});
  if(extra==='crisis') parts.push({label: lang==='es' ? '¿Necesitas ayuda ahora mismo?' : 'Need help right now?', hash:'#/crisis'});
  if(extra==='situation') parts.push({label: extraLabel, hash: null});
  if(path.length>0) parts.push({label:t('catNames')[path[0]], hash:'#/category/'+encodeURIComponent(path[0])});
  if(detailStack.length>0) parts.push({label:detailStack[detailStack.length-1].name, hash:null});
  bc.innerHTML = parts.map((p,i)=>`<span data-i="${i}">${p.label}</span>`).join(' &nbsp;/&nbsp; ');
  bc.querySelectorAll('span').forEach(span=>{
    const i = parseInt(span.dataset.i);
    const p = parts[i];
    if(p.hash && i < parts.length-1){
      span.onclick = ()=> navigate(p.hash);
    }
  });
}


/* ============================================================
   FOOTER
   ============================================================ */
function renderFooter(){
  const footer = document.getElementById('siteFooter');
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-col">
        <h4>${t('footerTitle')}</h4>
        <p>${t('footerAbout')}</p>
      </div>
      <div class="footer-col"><h4>${t('footerBrowse')}</h4><ul id="footerCats"></ul></div>
      <div class="footer-col"><h4>${t('footerRegions')}</h4><ul>${t('regions').map(r=>`<li>${r}</li>`).join('')}</ul></div>
      <div class="footer-col"><h4>${t('footerGoodKnow')}</h4><ul>${t('goodKnow').map(g=>`<li>${g}</li>`).join('')}</ul></div>
    </div>
    <div class="footer-bottom"><span>${t('footerBottom1')}</span><span>📅 ${t('footerReviewed')}</span><span>${t('footerBottom2')}</span></div>`;
  renderFooterCats();
}

function renderFooterCats(){
  const ul = document.getElementById('footerCats');
  ul.innerHTML = Object.keys(ICONS).slice(0,6).map(b=>`<li><a href="#" data-b="${b}">${t('catNames')[b]}</a></li>`).join('');
  ul.querySelectorAll('a').forEach(a=>{ a.onclick=(e)=>{ e.preventDefault(); path=[a.dataset.b]; detailStack=[]; window.scrollTo({top:0}); render(); }; });
}

/* ============================================================
   LANGUAGE TOGGLE
   Applies the current I18N dict to every static (non re-rendered)
   DOM element, then re-renders the dynamic content on top.
   ============================================================ */
function applyStaticTranslations(){
  document.getElementById('officialBannerText').innerHTML = t('officialBanner').replace('not an official government website', '<b>not an official government website</b>');
  document.getElementById('heroEyebrow').textContent = t('heroEyebrow');
  document.getElementById('heroH1').innerHTML = `${t('heroH1_pre')}<em>${t('heroH1_em')}</em>${t('heroH1_post')}`;
  document.getElementById('heroP').textContent = t('heroP');
  document.getElementById('heroBigNumLabel').textContent = t('heroBigNumLabel');
  document.getElementById('search').placeholder = t('searchPlaceholder');
  document.getElementById('immFilter').textContent = t('toggleImm');
  document.getElementById('hiddenFilter').textContent = t('toggleHidden');
  document.getElementById('mapToggle').textContent = t('toggleMap');
  document.getElementById('langToggleBtn').textContent = t('langToggle');
  updateBottomNav();
  renderFooter();
}

function toggleLang(){
  lang = (lang === 'en') ? 'es' : 'en';
  applyStaticTranslations();
  render();
}

/* ============================================================
   STARTUP
   Applies translations, then hands off to the router with
   whatever hash is already in the URL (handles page reloads and
   direct/shared links landing on a specific resource, category,
   or view instead of always starting at the homepage).
   ============================================================ */
document.getElementById('heroBigNum').textContent = DATA.length;
applyStaticTranslations();
applyRoute(location.hash || '#/', true);

/* PWA: offline support via service worker (no-op where unsupported) */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}
