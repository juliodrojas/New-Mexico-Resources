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
    langToggle:"Español"
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
    langToggle:"English"
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
var PHRASE_SUGGESTIONS = [
/* ---------- Housing / shelter ---------- */
{ match:["i need a place to stay tonight","need somewhere to stay tonight","where can i sleep tonight","need shelter tonight","necesito un lugar donde quedarme esta noche","donde puedo dormir esta noche","no tengo donde dormir","necesito refugio esta noche"],
  names:["Albuquerque Heading Home","Good Shepherd Center","Joy Junction","Barrett House / ABQ Rescue Mission Women's Center of Hope"] },
{ match:["i'm being evicted","getting evicted","eviction notice","landlord is kicking me out","me van a desalojar","aviso de desalojo","desalojo","el dueno me quiere sacar"],
  names:["New Mexico Legal Aid","Albuquerque Housing Authority","HUD Albuquerque Field Office"] },
{ match:["i'm homeless","we are homeless","my family is homeless","estoy sin hogar","no tengo hogar","estamos sin hogar","persona sin hogar"],
  names:["Albuquerque Heading Home","Good Shepherd Center","Joy Junction","Family Promise of Albuquerque"] },
{ match:["i can't pay rent","can't pay my rent","behind on rent","help with rent","no puedo pagar la renta","atrasado en la renta","no tengo para la renta","ayuda con la renta"],
  names:["New Mexico Home Fund","Albuquerque Housing Authority","Housing Choice Voucher Program (Section 8)"] },
{ match:["looking for a cheap apartment","affordable apartment","cheap rent","cheap apartments near me","busco apartamento barato","apartamento barato","renta barata","apartamentos baratos"],
  names:["Manzano Vista","Bluewater Village","Sandia Vista","Aztec Village"] },
{ match:["section 8","housing voucher","housing choice voucher","section 8 application"],
  names:["Housing Choice Voucher Program (Section 8)","Albuquerque Housing Authority"] },
/* ---------- Food ---------- */
{ match:["i need food","need food","we need food","need groceries","necesito comida","necesitamos comida","necesito alimentos"],
  names:["Roadrunner Food Bank","Storehouse New Mexico","Rio Grande Food Project","Lobo Food Pantry"] },
{ match:["i'm hungry","my kids are hungry","we're hungry","tengo hambre","mis hijos tienen hambre","tenemos hambre"],
  names:["Roadrunner Food Bank","Storehouse New Mexico","Noon Day Ministry"] },
{ match:["food stamps","snap benefits","apply for snap","estampillas de comida","cupones de alimentos","beneficios snap"],
  names:["SNAP (federally funded, state-administered)"] },
{ match:["free groceries","free food distribution","despensa gratis","comida gratis","distribucion de comida"],
  names:["Roadrunner Food Bank","Storehouse New Mexico","The Food Depot"] },
{ match:["wic","women infants children"],
  names:["WIC (Women, Infants & Children)"] },
/* ---------- Work ---------- */
{ match:["i lost my job","just lost my job","got fired","i was laid off","perdi mi trabajo","me despidieron","me quede sin trabajo","perdi el trabajo"],
  names:["NM Dept. of Workforce Solutions (DWS)","Library Job & Career Guide — 'Working It Out!'"] },
{ match:["i need a job","looking for work","need work","find a job","necesito trabajo","busco trabajo","necesito empleo","busco empleo"],
  names:["NM Dept. of Workforce Solutions (DWS)","Library Job & Career Guide — 'Working It Out!'"] },
{ match:["unemployment","unemployment benefits","file for unemployment","desempleo","beneficios de desempleo","seguro de desempleo"],
  names:["NM Dept. of Workforce Solutions (DWS)"] },
/* ---------- Healthcare ---------- */
{ match:["i need a doctor","need to see a doctor","find a doctor","necesito un doctor","necesito ver un medico","buscar un doctor"],
  names:["First Choice Community Healthcare","UNM Care and Out of County Care","La Familia Medical Center"] },
{ match:["no health insurance","don't have insurance","can't afford insurance","sin seguro medico","no tengo seguro","no tengo seguro medico"],
  names:["UNM Care and Out of County Care","First Choice Community Healthcare","Presbyterian Healthcare Services — Financial Assistance"] },
{ match:["tooth hurts","toothache","need a dentist","dental care","cheap dentist","me duele un diente","dolor de muela","necesito un dentista","dentista barato"],
  names:["First Choice Community Healthcare","La Familia Medical Center"] },
{ match:["mental health","feeling depressed","depression","anxiety help","salud mental","depresion","me siento deprimido","ansiedad"],
  names:["Agora Crisis Center","New Mexico Crisis and Access Line"] },
{ match:["i want to die","thinking of suicide","kill myself","suicidal","quiero morirme","pensando en suicidarme","quiero quitarme la vida"],
  names:["New Mexico Crisis and Access Line","Agora Crisis Center"] },
{ match:["emergency medicaid","medicaid for undocumented"],
  names:["Emergency Medicaid Coverage for Undocumented Residents","State-Funded Healthcare Access for Non-Citizens"] },
/* ---------- Immigration ---------- */
{ match:["i don't have papers","no social security number","don't have a social security","no tengo papeles","sin papeles","no tengo seguro social","no ssn"],
  names:["New Mexico Immigrant Law Center (NMILC)","Enlace Comunitario","Undocumented UNM (undocumented.unm.edu)"] },
{ match:["itin","itin number","tax id number","individual taxpayer","numero itin","sacar el itin"],
  names:["UNM ITIN Application Guidance","NM Working Families Tax Credit — ITIN Filers Included","Homewise ITIN Mortgage Loans"] },
{ match:["immigration lawyer","immigration attorney","need an immigration lawyer","abogado de inmigracion","necesito abogado de inmigracion","abogado migratorio"],
  names:["New Mexico Immigrant Law Center (NMILC)"] },
/* ---------- Bills / utilities ---------- */
{ match:["can't pay electric bill","electric bill help","power shut off","lights shut off","no puedo pagar la luz","me van a cortar la luz","ayuda con la luz"],
  names:["PNM Good Neighbor Fund + PNM CARES","LIHEAP (Low Income Home Energy Assistance)","HEAT New Mexico"] },
{ match:["behind on bills","can't pay bills","help with bills","atrasado en las cuentas","no puedo pagar las cuentas","atrasado en pagos"],
  names:["PNM Good Neighbor Fund + PNM CARES","HEAT New Mexico","Salvation Army Bill Pay Assistance"] },
{ match:["help paying rent or bills","need help paying","necesito ayuda para pagar"],
  names:["Salvation Army Bill Pay Assistance","PNM Good Neighbor Fund + PNM CARES","New Mexico Home Fund"] },
/* ---------- Crisis / safety ---------- */
{ match:["i need help right now","help me now","it's an emergency","necesito ayuda ahora mismo","emergencia","ayuda urgente","es una emergencia"],
  names:["New Mexico Crisis and Access Line","Agora Crisis Center","Good Shepherd Center"] },
{ match:["domestic violence","my partner hits me","abusive relationship","being abused","violencia domestica","mi pareja me pega","violencia en el hogar","maltrato"],
  names:["Rape Crisis Center of Central New Mexico","Barrett House / ABQ Rescue Mission Women's Center of Hope","New Mexico Crisis and Access Line"] },
/* ---------- Students / money ---------- */
{ match:["i'm a student and need money","student emergency money","broke college student","soy estudiante y necesito dinero","dinero de emergencia estudiante","estudiante sin dinero"],
  names:["Dean of Students Emergency Scholarship","UNM Short-Term Emergency Loan","ASUNM Emergency Scholarship & Advocacy Scholarship"] },
{ match:["scholarship","scholarships for college","becas","beca","necesito una beca","becas universitarias"],
  names:["NM Opportunity Scholarship","NM Legislative Lottery Scholarship","El Centro External Scholarship Hub"] },
/* ---------- Family ---------- */
{ match:["need childcare","can't afford daycare","childcare assistance","necesito cuidado de ninos","guarderia","no puedo pagar la guarderia"],
  names:["NM Child Care Assistance Program"] },
/* ---------- Transport / internet ---------- */
{ match:["bus pass","need a ride","bus fare","pase de autobus","necesito transporte","boleto de camion"],
  names:["ABQ RIDE (Fixed Route + ART + Connect Microtransit)","ABQ RIDE Sun Van (Paratransit)"] },
{ match:["free internet","cheap internet","internet assistance","internet gratis","internet barato"],
  names:["EveryoneOn","Lifeline"] }
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
  wrap.className = 'assistant-block';
  wrap.innerHTML = `
    <div class="section-head"><h2>${lang==='es' ? "Cuéntanos qué está pasando" : "Tell us what's going on"}</h2>
    <span class="sub">${lang==='es' ? "Búsqueda por palabras clave — no es una IA real" : "Keyword-matching helper — not a real AI"}</span></div>
    <textarea id="assistantInput" placeholder="${lang==='es' ? "Ej: perdí mi trabajo y no puedo pagar la renta..." : "e.g. I lost my job and can't pay rent..."}" rows="2"></textarea>
    <button class="toggle" id="assistantBtn" style="margin-top:8px;">${lang==='es' ? "Buscar" : "Find resources"}</button>
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
  input.onkeydown = (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); runSearch(); } };
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
function render(){
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
    main.appendChild(renderQuickStart());
    main.appendChild(renderAssistant());
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
        <div class="rmeta">${badgesFor(r)}</div></div>`;
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
    <div class="field"><b>${t('fldOrg')}</b>${r.org}</div>
    <div class="field"><b>${t('fldWhat')}</b>${r.what}</div>
    <div class="field"><b>${t('fldHow')}</b>${r.how}</div>
    <div class="field"><b>${t('fldElig')}</b><ul class="elig-checklist">${parseEligibility(r.elig).map(p=>`<li><span class="chk">☐</span>${p}</li>`).join('')}</ul></div>
    <div class="field"><b>${t('fldContact')}</b>${r.contact||'—'}</div>
    <div class="field"><b>${t('fldSource')}</b><a href="${r.url}" target="_blank" rel="noopener">${r.url}</a></div>
  </div>`;
  wrap.appendChild(card);

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
    <div class="footer-bottom"><span>${t('footerBottom1')}</span><span>${t('footerBottom2')}</span></div>`;
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
