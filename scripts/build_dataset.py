import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Master Dataset"

HEADERS = ["ID","Level","Domain","Sub-Branch","Resource Name","Responsible Org / Agency",
           "What It Offers","How To Access / Apply","Eligibility / Requirements",
           "Contact (Phone / Address / Site)","Source URL","Status","Hidden / Under-Advertised?",
           "Notes for Team (Jazmin/Will)","Related Resources (curated)","Latitude","Longitude"]

rows = []

def add(level, domain, sub, name, org, what, how, elig, contact, url, status="Verified", hidden="No", note=""):
    rows.append([None, level, domain, sub, name, org, what, how, elig, contact, url, status, hidden, note, "", None, None])

add("Federal","Financial Aid / Education","General",
    "FAFSA / Federal Pell Grant","U.S. Dept. of Education",
    "Free Application for Federal Student Aid unlocks Pell Grants (need-based, no repayment), federal work-study, and subsidized/unsubsidized loans.",
    "Apply annually at studentaid.gov. UNM school code 002663.",
    "U.S. citizen or eligible noncitizen; enrolled/accepted at eligible institution.",
    "studentaid.gov","https://studentaid.gov","Verified","No","Foundation of nearly every downstream UNM scholarship — list as the root node.")
add("Federal","Financial Aid / Education","General",
    "Federal Work-Study","U.S. Dept. of Education / UNM Financial Aid",
    "Subsidized part-time campus/community jobs for students with financial need; wages don't count against next year's aid as heavily as other income.",
    "Indicate interest on FAFSA; apply for FWS-flagged jobs via UNM Student Employment.",
    "Demonstrated financial need per FAFSA.",
    "financialaid.unm.edu","https://financialaid.unm.edu/","Verified","No","")
add("Federal","Housing","Vouchers",
    "Housing Choice Voucher Program (Section 8)","HUD, administered locally by Albuquerque Housing Authority",
    "Federal rent subsidy so tenant pays ~30% of income; landlord receives the rest directly.",
    "Apply through Albuquerque Housing Authority; long waitlists are typical.",
    "Income limits (area median income based); background/rental history checks.",
    "505-764-3975","https://www.abqha.org/","Verified","No","")
add("Federal","Food","Nutrition Assistance",
    "SNAP (federally funded, state-administered)","USDA / NM Human Services (Income Support Division)",
    "Monthly EBT card funds for groceries at participating retailers.",
    "Apply online at yes.nm.gov, or get application help via Roadrunner Food Bank or UNM Women's Resource Center.",
    "Income-based; students face extra work/hour requirements to qualify.",
    "1-800-283-4465","https://www.yes.nm.gov","Verified","No","")
add("Federal","Food","Nutrition Assistance",
    "WIC (Women, Infants & Children)","USDA / NM Dept. of Health",
    "Food vouchers, formula, and nutrition counseling for pregnant/postpartum people and children under 5.",
    "Apply at a local WIC office; find via nmwic.org.",
    "Income up to 185% FPL; pregnant, postpartum, or has a child under 5.",
    "nmwic.org","https://www.nmwic.org","Verified","No","")
add("Federal","Utilities","Connectivity",
    "Lifeline","FCC / Universal Service Fund",
    "Discount on monthly phone or internet bill — up to $9.25/mo, or $34.25/mo on Tribal lands.",
    "Apply at lifelinesupport.org; must show program eligibility (SNAP/Medicaid/etc.) or income.",
    "Income at or below 135% FPL, or enrolled in a qualifying program.",
    "lifelinesupport.org","https://www.lifelinesupport.org/","Verified","No","")
add("Federal","Financial","Tax Credits",
    "Earned Income Tax Credit (EITC) & Child Tax Credit","IRS",
    "Refundable tax credits that can return several thousand dollars to low/moderate-income workers and families at filing time.",
    "Claim when filing taxes; free filing help available via AARP Tax-Aide or VITA sites.",
    "Income thresholds vary by household size; must file a return.",
    "irs.gov","https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc","Verified","No","")
add("Federal","Healthcare","Insurance",
    "Medicaid (federal/state)","CMS / NM Health Care Authority",
    "Free or low-cost health coverage; NM expanded eligibility to adults up to 138% FPL.",
    "Apply at yes.nm.gov.",
    "Income-based; SNAP recipients often qualify automatically via categorical eligibility.",
    "yes.nm.gov","https://www.yes.nm.gov","Verified","No","")
add("State (NM)","Financial","Cash / Energy / Food",
    "NM Human Services / Health Care Authority — ISD Programs","NM Health Care Authority, Income Support Division",
    "Umbrella state agency administering SNAP, TANF (cash assistance), Medicaid, General Assistance, and LIHEAP (energy).",
    "Apply via yes.nm.gov (YESNM portal) or at a local ISD field office.",
    "Program-specific income/asset limits.",
    "877-993-3637 (ISD) · Albuquerque NE office: 4330 Cutler Ave NE, 505-222-9600 · SW office: 3280 Bridge Blvd SW, 505-841-2300",
    "https://www.hsd.state.nm.us","Verified","No","")
add("State (NM)","Utilities","Energy Assistance",
    "LIHEAP (Low Income Home Energy Assistance)","NM Health Care Authority",
    "Helps pay heating/cooling bills; max benefit around $600, applications open Nov–March.",
    "Apply via YESNM portal or nearest HSD office.",
    "Income-based.","hsd.state.nm.us","https://www.hsd.state.nm.us","Verified","No","")
add("State (NM)","Education","Scholarships",
    "NM Legislative Lottery Scholarship","NM Higher Education Dept.",
    "Covers a large share of tuition at NM public colleges for eligible in-state students.",
    "Automatic consideration based on enrollment right after high school graduation + GPA/credit-hour requirements; details at hed.state.nm.us.",
    "NM resident, enroll full-time immediately following HS graduation, maintain 2.5 GPA & 12+ credit hours.",
    "hed.state.nm.us","https://hed.state.nm.us/financial-aid/scholarships/legislative-lottery","Verified","No","")
add("State (NM)","Education","Scholarships",
    "NM Opportunity Scholarship","NM Higher Education Dept.",
    "'Last-dollar' scholarship that can cover remaining tuition/fees after other aid, including for part-time and adult students.",
    "Apply via hed.state.nm.us alongside FAFSA/NM state aid form.",
    "NM resident; income and enrollment requirements vary by track.",
    "hed.state.nm.us","https://hed.state.nm.us/financial-aid/scholarships/new-mexico-opportunity-scholarship","Verified","No","")
add("State (NM)","Education","Scholarships",
    "Grow Your Own Teachers Scholarship","NM Higher Education Dept.",
    "Funds aspiring teachers, especially in high-need NM districts.",
    "hed.state.nm.us application.",
    "Pursuing teacher licensure in NM.",
    "hed.state.nm.us","https://hed.state.nm.us/financial-aid/scholarships/grow-your-own-teachers","Verified","No","")
add("State (NM)","Education","Scholarships",
    "Fire Fighters and Peace Officers Survivors Scholarship","NM Higher Education Dept.",
    "Tuition support for dependents/survivors of fallen first responders.",
    "hed.state.nm.us application.","Dependent/survivor of a fallen NM firefighter or peace officer.",
    "hed.state.nm.us","https://hed.state.nm.us/financial-aid/scholarships/fire-fighters-and-peace-officers-survivors","Verified","No","")
add("State (NM)","Housing","Rental/Homeowner Assistance",
    "NM Homeowner Assistance Fund","NM Mortgage Finance Authority",
    "Helps existing homeowners catch up on mortgage, property tax, or utility payments to avoid foreclosure.",
    "Apply through state Homeowner Assistance Fund portal (via Homewise or NM MFA).",
    "Financial hardship since 2020; NM homeowner.","housingnm.org","https://www.housingnm.org","Verified","No","")
add("State (NM)","Housing","Rental Assistance",
    "New Mexico Home Fund","State-supported rental assistance program",
    "Covers past-due/current/future rent, utility bills, relocation costs, and temporary lodging after eviction.",
    "Apply via the Rental Assistance Contact Form (linked from UNM LoboRESPECT housing page).",
    "Income-based; renter in NM.","See loborespect.unm.edu housing page for current link",
    "https://loborespect.unm.edu/support/resource-guide1/shelters.html","Verified","No","")
add("City/County","General Hub","Everyone",
    "211 New Mexico / United Way of Central NM","United Way",
    "Free 24/7 phone & web referral hub connecting to virtually every category below (food, rent, utilities, healthcare, legal, childcare).",
    "Dial 2-1-1 or visit 211nm.org.",
    "Open to anyone.","211 or 505-247-2911","https://www.211nm.org","Verified","No","Best 'catch-all' node — consider as a fallback link on every category page.")
add("City","General Hub","Everyone",
    "City of Albuquerque 311","City of Albuquerque",
    "General city information line that can route callers to any Family & Community Services program.",
    "Dial 311 or 505-768-2000.","Open to anyone; Albuquerque residents.",
    "311 / 505-768-2000","https://www.cabq.gov","Verified","No","")
add("City","Housing / Health / Recreation / Education","Umbrella dept",
    "Dept. of Family & Community Services","City of Albuquerque",
    "Umbrella department running the city's Health & Social Service Centers, housing programs, recreation, and education services.",
    "cabq.gov/family; call 311 for routing to the right center.",
    "Albuquerque resident; varies by sub-program.",
    "cabq.gov/family","https://www.cabq.gov/family","Verified","No","")
add("City","Youth & Family","Ages 0-18",
    "Youth & Family Resource Roundup","City of Albuquerque",
    "Directory of before/after-school programs (ages 5-15), Early Head Start/Preschool (0-5), Family Advocacy Center (DV/abuse survivors), and Violence Intervention Program.",
    "cabq.gov/help/family-services/youth-and-family-resource-roundup.",
    "Varies by program; generally Albuquerque residents.",
    "311","https://www.cabq.gov/help/family-services/youth-and-family-resource-roundup","Verified","No","")
add("City","Housing","Public Housing",
    "Albuquerque Housing Authority","City-chartered public housing authority",
    "Public housing units (~950) and Section 8 voucher administration for low-income, elderly, and disabled residents. Tenant pays ~30% of income.",
    "Apply/join waitlist via abqha.org.",
    "Income limits; background check.",
    "505-764-3920 (general) · 505-764-3980 (public housing) · 505-764-3975 (Section 8)",
    "https://www.abqha.org","Verified","No","")
add("City","Civil Rights / Legal","Everyone",
    "Office of Civil Rights","City of Albuquerque",
    "Handles discrimination complaints in housing, public accommodation, and employment.",
    "Contact via cabq.gov or 311.","Open to anyone experiencing discrimination in city jurisdiction.",
    "311","https://www.cabq.gov","Verified","No","")
add("City","Safety","Crisis",
    "Albuquerque Community Safety (ACS)","City of Albuquerque",
    "Alternative first-responder department for behavioral health, homelessness, and non-violent crisis calls (non-police).",
    "Dispatched via 911/311 for qualifying non-emergency crises.",
    "Open to anyone in Albuquerque.","311 / 911","https://www.cabq.gov/acs","Verified","No","")
add("University (UNM)","Financial","General",
    "UNM Short-Term Emergency Loan","Dean of Students Office",
    "Emergency loans up to $800 for enrolled students; partial forgiveness possible in some cases.",
    "Apply through Dean of Students Office. Processing closes 2:30pm weekdays; must be enrolled 6+ credit hrs.",
    "Enrolled 6+ credit hours (waived summer/intersession); no more than 1 active loan at a time.",
    "dos.unm.edu","https://dos.unm.edu/services/short-term-loans.html","Verified","No","")
add("University (UNM)","Financial","General",
    "Center for Financial Capability (CFC)","UNM",
    "One-on-one budgeting, scholarship search help, credit-building support, free tax prep (AARP Tax-Aide), and general basic-needs referrals.",
    "Contact cfc.unm.edu; walk-in/appointment options.",
    "Any UNM student.","cfc.unm.edu","https://cfc.unm.edu","Verified","No","")
add("University (UNM)","Food","General",
    "Lobo Food Pantry","UNM (via LoboRESPECT)",
    "Free groceries for any enrolled student with valid Lobo ID, located SUB 1093. Also a monthly outdoor giveaway in the South Parking Lot.",
    "Walk-in during posted hours; monthly giveaway — bring Lobo ID + bags/boxes.",
    "Currently enrolled UNM student.","loborespect.unm.edu","https://loborespect.unm.edu/services/campus-lobo-food-pantry.html","Verified","No","")
add("University (UNM)","Identity-Based / Cultural","Latino/Hispanic students",
    "El Centro de la Raza","UNM (since 1969; formerly Hispanic Student Services)",
    "Academic advising, cultural programming, and scholarship/funding navigation for UNM's largest ethnic student population.",
    "elcentro.unm.edu; office visits, 505-277-5020.",
    "Open to all students, historically focused on Latino/Hispanic community.",
    "505-277-5020","https://elcentro.unm.edu","Verified","No","")
add("University (UNM)","Identity-Based / Cultural","Latino/Hispanic freshmen & sophomores",
    "Transformar Fellowship Program","UNM El Centro de la Raza",
    "1-on-1 academic guidance/advocacy, a $600 completion scholarship, and an optional summer study-abroad trip to Mexico.",
    "Apply via elcentro.unm.edu/programs/transformar-fellowship-program; must attend all fall & spring programming sessions.",
    "UNM freshman or sophomore, full-time fall & spring; open to all students regardless of major.",
    "elcentro.unm.edu","https://elcentro.unm.edu/programs/transformar-fellowship-program/benefits-eligibility.html","Verified","No","This is the exact '$500-ish + apply for extra funding' chain Julio described — confirm current award amount each cycle, it has changed ($500→$600 seen in different years).")
add("University (UNM)","Identity-Based / Cultural","Native American/Indigenous students",
    "American Indian Student Services (AISS)","UNM, Mesa Vista Hall 1119",
    "Cultural/academic programming, FAFSA help open to ALL students (not just Native students), scholarship connections, advocacy.",
    "aiss.unm.edu; walk-in.","Primary focus Native/Indigenous students; FAFSA help open to everyone.",
    "Mesa Vista Hall 1119","https://aiss.unm.edu","Verified","No","")
add("University (UNM)","Identity-Based / Cultural","Black/African American students",
    "African American Student Services (Afro)","UNM, Mesa Vista Hall 1130",
    "Academic advising, tutorial assistance, financial aid issue resolution, internship/mentorship connections, computer lab, meeting space, and FREE PRINTING for Black staff/students/community.",
    "afro.unm.edu; walk-in, Mesa Vista Hall 1130.",
    "Primary focus African American students; some services open to broader community.",
    "505-277-5645","https://afro.unm.edu","Verified","Yes","Free printing is explicitly confirmed (UNM UCAM Newsroom) — good example of the 'hidden perk' category Julio flagged.")
add("University (UNM)","Identity-Based / Cultural","Women",
    "Women's Resource Center (WRC)","UNM, Mesa Vista Hall 1160",
    "Counseling, confidential advocacy (incl. Title IX reporting site), computer pod with FREE PRINTING, lending/video library, peer support groups, SNAP application help, IMPACT mentorship program, and the Sabrina Single Parent's Scholarship.",
    "women.unm.edu; walk-in or appointment.",
    "Open to all UNM students, staff, faculty.","505-277-3716","https://women.unm.edu","Verified","Yes","Confirmed via Lobo Well-Being page — free printing at the computer pod. Also houses a scholarship specifically for single parents.")
add("University (UNM)","Identity-Based / Cultural","LGBTQ+ students",
    "LGBTQ Resource Center (Arcoíris)","UNM, 608 Buena Vista Rd",
    "Safe-zone environment, library, lounge, computer pod, HIV testing, confidential reporting site, social/educational events.",
    "lgbtqrc.unm.edu / arcoiris.unm.edu; walk-in.",
    "Open to all gender identities/orientations.","505-277-0834","https://lgbtqrc.unm.edu","Verified","No","")
add("University (UNM)","Veterans/Military","Student veterans",
    "Veteran & Military Resource Center","UNM",
    "Certifying official support for GI Bill/VA benefits, community space, advocacy for student veterans and military-affiliated students.",
    "vrc.unm.edu.","Veteran, active duty, or military-affiliated student.",
    "vrc.unm.edu","https://vrc.unm.edu","Verified","No","")
add("University (UNM)","Accessibility","Students w/ disabilities",
    "Accessibility Resource Center (ARC)","UNM",
    "Accommodations, assistive technology, and support to create equitable learning environments.",
    "Register via ARC website with documentation.","Documented disability.",
    "arc.unm.edu (verify current URL)","https://www.unm.edu","Needs Verification","No","Confirm current URL/office name — may have been renamed from 'Accessibility Resource Center'.")
add("University (UNM)","Identity-Based / Cultural","Asian American/Pacific Islander students",
    "Asian American Pacific Islander Resource Center","UNM",
    "Cultural programming and support for AAPI students; part of UNM's resource-center network.",
    "Search 'AAPI Resource Center UNM' for current site — newer center, verify office location.",
    "Open to all, primary focus AAPI students.","Needs verification","https://news.unm.edu/news/unm-resource-centers-and-programs-offer-something-for-every-student","Needs Verification","No","Newest of the cultural centers per UNM Newsroom piece — worth a dedicated follow-up search for hours/location.")
add("University (UNM)","Academic Success","Freshmen / new students",
    "College Enrichment Program (CEP)","UNM",
    "Academic support and transition programming aimed at first-generation and historically underserved incoming students.",
    "Search cep.unm.edu or Student Affairs site.","Typically first-gen / underserved incoming students — verify exact criteria.",
    "Needs verification","https://news.unm.edu/news/unm-resource-centers-and-programs-offer-something-for-every-student","Needs Verification","No","")
add("University (UNM)","Health & Wellness","All students",
    "Student Health and Counseling (SHAC)","UNM",
    "Medical care, mental health counseling (safe-zone trained), Women's Health Clinic, Men's Health Maintenance Program.",
    "shac.unm.edu; appointment.","Currently enrolled student paying health fee.",
    "shac.unm.edu","https://shac.unm.edu","Verified","No","")
add("University (UNM)","Health & Wellness","All (incl. non-students)",
    "Manzanita Counseling Training Clinic","UNM Counselor Education Program",
    "Free, confidential counseling for individuals, couples, and families, provided by supervised counselors-in-training.",
    "Contact via UNM College of Education website.","Open to community, not just students.",
    "Search 'Manzanita Counseling UNM'","https://www.unm.edu","Needs Verification","No","Notably open beyond the student body — good for the 'half university half public' bucket Julio mentioned.")
add("University (UNM)","Academic / Career","Engineering & CS majors",
    "Engineering Student Services (ESS / ESSC)","UNM School of Engineering",
    "Free tutoring (math, physics, engineering, English), scholarship coordination, freshman pre-major advising/orientation, peer mentoring, houses engineering student orgs, career-fair prep.",
    "unm.edu/~ess; walk-in tutoring per posted schedule.",
    "Engineering/CS/pre-major students primarily; some services (career prep) broader.",
    "277-5064 (scholarship coordinator)","http://www.unm.edu/~ess/ess_services.html","Verified","No","This is the exact ESS example Julio raised — confirmed tutoring + scholarship coordination, both free.")
add("University (UNM)","Academic / Career","Engineering — women",
    "Society of Women Engineers (SWE) — UNM Chapter","Student org housed under ESS",
    "Peer network, mentorship, scholarship application support, and national SWE scholarship access for women in engineering/CS.",
    "Join via ESS student-org directory or UNM Lobo Involvement Center.",
    "Open to all, historically supports women in engineering.",
    "Search 'SWE UNM chapter'","http://www.unm.edu/~ess/ess_services.html","Needs Verification","No","Named by Julio as an example — needs a dedicated search for current chapter contact/meeting info.")
add("University (UNM)","Academic / Career","Business majors",
    "Anderson School of Management — Small Business Institute","UNM Anderson School",
    "Free consulting work for ~25 local businesses/semester performed by supervised business students — a resume-building resource for business majors.",
    "Contact Anderson School directly.","Business major, faculty-supervised enrollment.",
    "anderson.unm.edu","https://en.wikipedia.org/wiki/Anderson_School_of_Management_(University_of_New_Mexico)","Verified","No","")
add("University (UNM)","Hidden/Unadvertised","Business majors",
    "Anderson School Building — Printing Access","UNM Anderson School (unconfirmed office)",
    "Reported by students as a location with printing access beyond the standard library quota.",
    "Not centrally advertised — likely tied to a specific lab, computer commons, or student success office inside the building.",
    "Unconfirmed — needs on-the-ground verification (ask front desk / student success office in Anderson).",
    "Anderson School of Management, main campus","","Needs Verification","Yes","Flagged directly by Julio as heard-of-but-unadvertised. Assign to Will/Jazmin to verify in person — this is exactly the kind of resource that won't show up in a web search and needs word-of-mouth/forum confirmation.")
add("University (UNM)","Study Abroad Funding","Various",
    "APIConnect 'First Award' Scholarship","API (Academic Programs International) via UNM Study Abroad",
    "Automatic $1,000 (semester) or $500 (internship/summer) scholarship for any UNM student on an APIConnect-affiliated program — deducted directly from invoice.",
    "Automatically applied upon program acceptance through studyabroad.unm.edu.",
    "Enrolled in an APIConnect-affiliated study abroad program.",
    "studyabroad.unm.edu","https://studyabroad.unm.edu/getting-started/funding-and-scholarships.html","Verified","No","")
add("University (UNM)","Study Abroad Funding","Women of color",
    "DIWC Scholarship","Diversity Abroad / Diversity in the Workplace Coalition",
    "$500 scholarship for women of color accepted to an in-person study abroad program.",
    "Apply via studyabroad.unm.edu funding page.","Woman of color; accepted to in-person program.",
    "studyabroad.unm.edu","https://studyabroad.unm.edu/getting-started/funding-and-scholarships.html","Verified","No","")
add("University (UNM)","Study Abroad Funding","STEM sophomores/juniors",
    "Barry M. Goldwater Scholarship","Federal, via UNM nomination",
    "Prestigious funding for STEM undergrads pursuing PhD track; UNM contact: Kiyoko Simmons.",
    "Nominated/applied via UNM STEM office; ksimmons@unm.edu.",
    "Sophomore/junior, STEM major, US citizen/permanent resident, competitive GPA + research experience.",
    "ksimmons@unm.edu","https://studyabroad.unm.edu/getting-started/funding-and-scholarships.html","Verified","No","")
add("University (UNM)","Financial","Graduate students",
    "Grad Studies Funding Database (Pivot)","UNM Graduate Studies",
    "Searchable database of scholarship/funding opportunities specifically for graduate students and postdocs.",
    "grad.unm.edu/funding/scholarships.","Enrolled graduate student or postdoc.",
    "grad.unm.edu","https://grad.unm.edu/funding/scholarships/index.html","Verified","No","")
add("University (UNM)","Financial","Underrepresented grad/PhD",
    "Glenda Lewis Critical Race Scholar Award","UNM Graduate Studies",
    "Scholarship support tied to critical race scholarship/research.",
    "grad.unm.edu application.","Graduate student — verify specific criteria on site.",
    "grad.unm.edu","https://grad.unm.edu/funding/scholarships/critical-race-scholar.html","Needs Verification","No","")
add("University (UNM)","Emergency Relief","Any student",
    "HEERF / Federal Emergency Student Aid (historically CARES Act funds)","U.S. Dept. of Education, distributed via UNM Financial Aid",
    "One-time emergency funds for expenses like food, housing, course materials, tech, healthcare, childcare — distributed based on FAFSA need.",
    "Historically automatic based on FAFSA on file; check finaid.unm.edu for whether a current round is open.",
    "Enrolled student with FAFSA/state aid form on file.",
    "finaid.unm.edu","https://finaid.unm.edu/cares-act.html","Needs Verification","No","Program is federally funded in waves — confirm whether any HEERF-style round is currently active or if it's fully historical at this point.")
add("University (UNM)","Housing","Off-campus",
    "UNM Off-Campus Housing Board","UNM Housing",
    "Structured landlord/tenant listing bulletin board for students seeking off-campus rentals.",
    "Browse via UNM Housing site. UNM does not screen listings.",
    "Any UNM student/prospective renter.","allaccess.unm.edu","https://allaccess.unm.edu/campus-life-and-housing/index.html","Verified","No","")
add("University (UNM)","Career","All majors",
    "Career Services Center","UNM",
    "Career counseling, resume review, internship/job postings, career fairs for students/alumni.",
    "career.unm.edu (verify).","Any UNM student, faculty, staff, alumni.",
    "career.unm.edu","https://www.unm.edu","Needs Verification","No","")
add("University (UNM)","Financial","A&S students (any major in College of Arts & Sciences)",
    "Student Success Access Grant","UNM Arts & Sciences Center for Academic Success (ASCAS)",
    "Direct monetary grant for A&S students struggling financially — can be applied to Bursar balance, course fees, books, a laptop, internet access, or food. Award amount varies based on stated need.",
    "Apply via ascas.unm.edu/grant.html; application asks for a tangible explanation of how the funds support finishing your degree.",
    "Declared A&S major, demonstrated financial hardship — no rigid income cutoff stated.",
    "ascas.unm.edu","https://ascas.unm.edu/grant.html","Verified","Yes","Genuinely under-known direct-cash resource — same shape as Transformar's $600 but for any A&S major, not just El Centro-affiliated students. Strong candidate for the graph's 'Financial' branch.")
add("University (UNM)","Academic Support","A&S students",
    "Arts & Sciences Center for Academic Success (ASCAS)","UNM College of Arts & Sciences",
    "Academic advising, retention/at-risk student support, transition courses for new/returning students (capped at 30 for individualized attention), and the Student Success Access Grant above.",
    "ascas.unm.edu; schedule via LoboAchieve.","Declared A&S major.",
    "ascas.unm.edu","https://ascas.unm.edu/about-us/our-services.html","Verified","No","")
add("University (UNM)","Academic Support","Education & Human Sciences majors",
    "COEHS Pathways for Academic Support and Success","UNM College of Education & Human Sciences",
    "Advising in phone, Zoom, and in-person formats (accessible for off-main-campus students); located Travelstead Hall Bldg 65.",
    "Schedule via studenthub.unm.edu; email coeac@unm.edu if scheduling issues.",
    "Declared COEHS major.","coeac@unm.edu","https://coehs.unm.edu/administration/center-for-student-success/student-advisement.html","Verified","No","")
add("University (UNM)","Academic Support","Fine Arts majors",
    "College of Fine Arts Student Success & Advisement","UNM College of Fine Arts",
    "Personalized advising for all Fine Arts majors on degree options, graduation requirements, and connecting to campus resources; Music dept. has its own advisement line + ARTifacts newsletter with scholarship alerts.",
    "finearts.unm.edu/academics/advisement; Music: (505) 277-4817 or via LoboAchieve.",
    "Declared Fine Arts major.","(505) 277-4817 (Music)","https://finearts.unm.edu/academics/advisement/","Verified","No","")
add("University (UNM)","Financial / Health","Nursing students",
    "Nursing Emergency Fund","UNM College of Nursing (via UNM Foundation)",
    "Emergency financial support for nursing students facing hardships (job loss, family obligations, tech access, etc.).",
    "Contact UNM College of Nursing or UNM Foundation (Ann-Mary.MacLeod@unmfund.org) to ask about current availability.",
    "Enrolled UNM Nursing student.","hsc.unm.edu/nursing","https://www.unmfund.org/fund/nursing-emergency-fund/","Needs Verification","No","Fund appears donor-supported and may not be continuously open — confirm current status/how to apply directly with the College of Nursing before advertising to students.")
add("University (UNM)","Academic / Career","Undecided / Undeclared freshmen",
    "University College Advising","UNM University College",
    "Advising home for students who haven't yet declared a major; helps explore options before committing to a specific college.",
    "Schedule via studenthub.unm.edu (verify current office name/URL — UNM's undeclared advising structure changes periodically).",
    "New/undeclared undergraduate students.","studenthub.unm.edu","https://students.unm.edu/navigating-your-major/index.html","Needs Verification","No","Confirm current name/URL for UNM's undeclared-student advising unit — structure may have shifted since last indexed.")
add("University (UNM)","International Students","All degree levels",
    "Global Education Office (GEO) / International Student & Scholar Services (ISSS)","UNM",
    "Immigration/visa advising, work authorization (OPT/STEM OPT/Academic Training) guidance, orientation, and international admissions support.",
    "isss.unm.edu; walk-in 1-3pm M-F or schedule via iadvisor@unm.edu.",
    "International student/scholar on a non-immigrant visa at UNM.",
    "(505) 277-4032","https://isss.unm.edu","Verified","No","")
add("University (UNM)","International Students","English learners",
    "CELAC (Intensive English Program)","UNM Global Education Office",
    "Intensive English language instruction and academic English advising for international students.",
    "celac@unm.edu or (505) 277-7540; advising 1-2pm M-Th, 3rd floor Mesa Vista Hall Rm 3097.",
    "International student needing English language support.","celac@unm.edu","https://celac.unm.edu/index.html","Verified","No","")
add("University (UNM)","Graduate Students","All grad students",
    "CTL Graduate Support","UNM Center for Teaching & Learning",
    "Graduate Teaching Academy certificate, dissertation/thesis coaching, workshops, and 1:1 consultations for grad students.",
    "Call 505-277-1407 or email unmgrc@unm.edu; register for the Graduate Support listserv.",
    "Enrolled UNM graduate student.","505-277-1407","http://online.unm.edu/support/index.html","Verified","No","")
add("University (UNM)","Academic Advising (General)","All undergrads",
    "Office of Advising Strategies / LoboTrax","UNM",
    "University-wide framework connecting every college's advising center; LoboTrax degree-audit tool shows completed vs. remaining requirements.",
    "advisement.unm.edu; each college has its own advising/success center (see per-college entries above).",
    "Any UNM undergraduate.","advisement.unm.edu","https://advisement.unm.edu/","Verified","No","This is the root/parent node for every per-college advising entry above — good as a hub point in the graph.")
add("University (UNM)","Financial","Law students (incl. graduating 3Ls)",
    "School of Law Emergency Financial Aid Fund","UNM School of Law",
    "Emergency financial aid up to $1,000 per eligible student — covers things like temporary housing/essential needs after displacement (e.g. fire) or other crises.",
    "Submit a written request to the Dean of the School of Law; Dean requires supporting documentation.",
    "Enrolled UNM Law student, including graduating 3Ls.",
    "lawschool.unm.edu","https://www.unmfund.org/fund-category/school-of-law/","Verified","Yes","Real emergency cash, framed as a donor fund rather than a standard financial-aid line item — easy to miss if you're not already talking to the Dean's office.")
add("University (UNM)","Financial","1L Law students",
    "Keller & Keller Scholarship","Private firm, administered via UNM Law Admissions",
    "$3,000-$5,000 awarded to 3 first-year law students with financial need who are interested in representing injured persons (personal injury law).",
    "Submit unofficial transcript, resume, and a one-page statement to admissions@law.unm.edu.",
    "First-year (1L) UNM Law student, demonstrated financial need.",
    "admissions@law.unm.edu","https://www.2keller.com/library/keller-and-keller-llc-scholarship.cfm","Verified","No","")
add("University (UNM)","Financial","3L Law students taking the Bar",
    "Bar Exam Prep Scholarships (various NM State Bar sections)","NM State Bar Association sections + UNM Law",
    "Multiple scholarships to help defray bar-exam study costs; example: M&A Gross Indian Self Determination Fund gives $1,500 to two 3Ls for first-time NM Bar takers.",
    "Check with NM Board of Bar Examiners Resources for Examinees page + UNM Law Financial Aid for current offerings.",
    "3L UNM Law student about to take the NM Bar Exam for the first time.",
    "lawschool.unm.edu","https://lawschool.unm.edu/careers/bar/loans.html","Verified","No","")
add("University (UNM)","Academic / Cultural","Architecture & Planning — Native/Indigenous students",
    "Resource Center for Raza Planning (RCRP) & AICAE student chapter","UNM School of Architecture & Planning",
    "RCRP connects planning coursework to traditional NM community development work. AICAE (American Indian Council of Architects+Engineers) provides a peer support network across Architecture, Engineering, and design fields.",
    "Contact via saap.unm.edu; AICAE faculty advisor Prof. Ted Jojola, tjojola@unm.edu.",
    "Open to Architecture/Engineering/design students; RCRP has a community-development focus.",
    "tjojola@unm.edu","https://saap.unm.edu/student-resources/student-organizations.html","Verified","No","")
add("University (UNM)","Academic","Architecture & Planning grad students",
    "SAAP Graduate Assistantships","UNM School of Architecture & Planning",
    "Grad students in good standing can apply for assistantships (tuition/stipend support in exchange for work).",
    "Contact SAAP directly — application details vary by program/semester.",
    "Graduate student in good standing within SAAP.","saap.unm.edu","https://catalog.unm.edu/catalogs/2022-2023/colleges/architecture-planning/index.html","Needs Verification","No","")
add("University (UNM)","Academic Support","Honors College students",
    "Honors College Student Support Directory","UNM Honors College",
    "Curated one-stop list linking Honors students directly to ARC, Afro, AISS, Food Pantry, Career Services, CAPS, CEP, Community Engagement Center, El Centro, LGBTQ RC, Mentoring Institute, Rec Services, SHAC, OWL Writing Center, VRC, and WRC.",
    "honors.unm.edu/resources; Building #76, 1924 Las Lomas Rd NE.",
    "Primarily Honors College students, but most linked resources are open university-wide.",
    "(505) 277-4211","https://honors.unm.edu/resources/index.html","Verified","No","Good confirmation source — this page itself resolves the earlier 'Needs Verification' ARC URL (arc.unm.edu) and surfaces two NEW resources below (CAPS, OWL).")
add("University (UNM)","Academic Support","All students",
    "Center for Academic Program Support (CAPS)","UNM",
    "Umbrella tutoring/academic-support center, including the Online Writing Center (OWL) for free writing tutoring.",
    "caps.unm.edu.","Any UNM student.","caps.unm.edu","https://caps.unm.edu/","Verified","No","")
add("University (UNM)","Mentoring","All students",
    "Mentoring Institute","UNM",
    "Coordinates mentoring programs and research across campus; connects students to structured mentorship.",
    "mentor.unm.edu.","Any UNM student.","mentor.unm.edu","https://mentor.unm.edu/","Verified","No","")
add("University (UNM)","Community Engagement","All students",
    "Community Engagement Center","UNM",
    "Connects students to service-learning, volunteering, and community-based projects — a bridge between UNM and Albuquerque community orgs (relevant to the 'half university half public' bucket).",
    "communityengagement.unm.edu.","Any UNM student.","communityengagement.unm.edu","http://communityengagement.unm.edu/","Verified","No","")
add("University (UNM) — Branch: Taos","Financial","Any Taos campus student",
    "UNM Taos Emergency Funds + Student Resource Navigator","UNM Taos",
    "Dedicated staff member (Student Resource Navigator) helps connect students to emergency funds, SNAP, WIC, food pantries, and local shelters — a single point of contact model.",
    "Cami Hartman, 575-737-3697, chartman8@unm.edu.",
    "Enrolled UNM Taos student.","575-737-3697","https://taos.unm.edu/student-services/student-resources/","Verified","No","Worth copying this 'single navigator' model to main campus if it doesn't already exist there in this exact form.")
add("University (UNM) — Branch: Valencia","Food","Any Valencia campus student",
    "PASOS Resource Center Campus Food Pantry","UNM Valencia",
    "On-campus food pantry with quick meals, take-home groceries, hygiene products, and kitchen appliances (microwave, fridge, coffee maker, toaster) for immediate use.",
    "Visit PASOS Resource Center on Valencia campus.","Enrolled UNM Valencia student.",
    "valencia.unm.edu","https://valencia.unm.edu/campus-resources/pasos/pasos-resource-center/campus-food-pantry.html","Verified","No","")
add("University (UNM) — Branch: Valencia","Community Directory","Any Valencia campus student",
    "UNM-Valencia Community Resources Guide","UNM Valencia",
    "Localized PDF directory covering Los Lunas/Belen-area food pantries (St. Vincent De Paul), Income Support Division offices, WIC, and health clinics — separate from main-campus Albuquerque resources.",
    "Available via valencia.unm.edu/campus-resources/pasos.","Los Lunas/Belen-area student or resident.",
    "valencia.unm.edu","https://valencia.unm.edu/campus-resources/pasos/pasos-resource-center/community-resources-by-type.pdf","Verified","No","")
add("University (UNM) — Branch: Gallup","Financial","Any Gallup campus student",
    "UNM-Gallup Office of Financial Aid","UNM Gallup",
    "Local financial aid office handling FAFSA, grants, loans, and work-study specifically for the Gallup branch.",
    "705 Gurley Ave, Gallup, NM. Mon-Fri 8am-5pm.","Enrolled UNM Gallup student.",
    "505-863-7500","https://www.gallup.unm.edu/financialaid/","Verified","No","")
add("Community — Gallup area","Food","Gallup-area residents",
    "Community Food Pantry (Gallup)","Local nonprofit",
    "Food pantry serving the Gallup area, relevant to UNM-Gallup students.",
    "thecommunitypantry.org.","Gallup-area resident.","thecommunitypantry.org","https://thecommunitypantry.org/","Needs Verification","No","")
add("Community — Los Alamos area","Financial / Food","Los Alamos-area residents",
    "Self Help, Inc.","Local nonprofit",
    "Economic-insecurity support including food/shelter assistance for Los Alamos area, relevant to UNM-Los Alamos students.",
    "2390 North Rd, Los Alamos, NM. 505-662-4666.","Los Alamos-area resident.",
    "selfhelpla.org","https://selfhelpla.org","Verified","No","")
add("University (UNM)","Food","All main-campus students/staff",
    "Lobo Food Pantry — Pack a Luminaria / Holiday Meals in a Bag","UNM Office of the EVP for Finance & Administration",
    "Seasonal donation drives (Thanksgiving/winter break) supplementing the main Lobo Food Pantry with pre-made holiday meal bags.",
    "Donation drop-off at Scholes Hall Suite 111, or donate online; distribution to students in need.",
    "Any UNM student in need during distribution windows.","Scholes Hall Suite 111","https://news.unm.edu/news/unm-expands-lobo-food-pantry-support-with-pack-a-luminaria-drive","Verified","No","Time-bound (Nov/Dec) — flag as seasonal in the graph rather than year-round.")
add("University (UNM)","Financial","Any undergrad or grad student",
    "Dean of Students Emergency Scholarship","UNM Dean of Students Office",
    "Up to $1,000, deposited directly to the student (not applied to Bursar balance) for genuine personal emergencies — can cover housing, transportation, groceries for a household, and similar essentials. Not for general ongoing financial hardship.",
    "Apply via dos.unm.edu when the application window is open; closes mid-May, reopens mid-August each year (2026 cycle: closed May 13, reopens Aug 17).",
    "Currently enrolled UNM undergrad or grad student experiencing a specific personal emergency circumstance.",
    "dos.unm.edu","https://dos.unm.edu/student-well-being/emergency-scholarship.html","Verified","Yes","Major find — broader than the Short-Term Loan (which is a loan, this is a scholarship/gift) and open to ALL students, not one college. Seasonal application window is an easy detail to miss — flag clearly on the graph.")
add("University (UNM)","Financial","Any student (via student government)",
    "ASUNM Emergency Scholarship & Advocacy Scholarship","Associated Students of UNM (ASUNM)",
    "Student-government-administered emergency and advocacy scholarships — separate funding pool from Dean of Students or college-specific funds.",
    "asunm.unm.edu/campus-resources/scholarships.",
    "Currently enrolled UNM student — check current criteria on ASUNM site.",
    "asunm.unm.edu","https://asunm.unm.edu/campus-resources/scholarships/index.html","Needs Verification","No","")
add("University (UNM)","Financial","Latino/Hispanic + broader external scholarships",
    "El Centro External Scholarship Hub","UNM El Centro de la Raza",
    "Curated list of external scholarships channeled through El Centro, incl. Hispanic Scholarship Fund, LNESC, ScholarSHPE, The Dream US Scholarship (undocumented/DACA students), Immigrants Rising Scholarship, Albuquerque Community Foundation scholarships, Daniels Boundless Opportunity Scholarship, and the NM Athletic Scholarship.",
    "elcentro.unm.edu/services-tab/copy-scholarships.html — regularly updated list with direct application links.",
    "Varies per scholarship; several are open to undocumented/DACA students specifically.",
    "elcentro.unm.edu","https://elcentro.unm.edu/services-tab/copy-scholarships.html","Verified","No","This single page is a hub-of-hubs — worth linking directly in the graph rather than trying to enumerate every external scholarship as its own row.")
add("University (UNM)","Financial","All students — master index",
    "Center for Financial Capability Scholarship Index","UNM Center for Financial Capability",
    "Master index page linking to scholarship/funding pages by college: Honors, Nursing, Pharmacy, Population Health, Law, Medicine, Engineering, Emergency Funding, College of Education, Anderson, LGBTQ RC, Dean of Students Short-Term Loans, El Centro, ASUNM, and the UNM Fund.",
    "cfc.unm.edu/resources/scholarships.html; office at Dean of Students, University Advisement & Enrichment Center Rm 280.",
    "Any UNM student.","505-277-3361","https://cfc.unm.edu/resources/scholarships.html","Verified","No","Use this as the master cross-reference when auditing the dataset for completeness — it independently validates most of the per-college rows already logged.")
add("University (UNM)","Financial","Medical students",
    "Diane J. Klepper, MD Student Affairs Endowment","UNM School of Medicine",
    "Funds peer tutoring assistance, board review course support, and aid for a student's family or personal emergency issues — flexible, discretionary use by Student Affairs Office.",
    "Contact UNM School of Medicine Student Affairs Office directly.",
    "Enrolled UNM medical student (undergraduate medical education).",
    "hsc.unm.edu/medicine","https://unmbiggive.unmfund.org/s/1959/dog23/interior.aspx?sid=1959&gid=2&pgid=533","Needs Verification","No","")
add("University (UNM)","Financial","Medical students",
    "La Tierra Sagrada Society Scholarships","UNM School of Medicine (donor-funded)",
    "Need-based scholarships for medical students; 100% of contributions go directly to scholarships/endowment.",
    "Contact School of Medicine Dean's Office / Student Affairs for current award cycle.",
    "Enrolled UNM medical student, demonstrated need.",
    "hsc.unm.edu/medicine","https://hsc.unm.edu/medicine/alumni-giving/give/","Needs Verification","No","")
add("University (UNM)","Financial","Pharmacy (PharmD) students",
    "College of Pharmacy Scholarships","UNM College of Pharmacy",
    "Approximately $200,000 awarded annually across PharmD students, mostly semester-to-semester; plus the donor-funded 'Circle of Joy' fund specifically supporting students during their final-year advanced practice pharmacy experiences.",
    "Student Affairs notifies students when applications open; contact Janell Valdez (HSC Financial Aid Director) at javaldez@salud.unm.edu or 505-272-2954.",
    "Enrolled UNM PharmD student.","505-272-2954","https://hsc.unm.edu/pharmacy/programs/pharmd/tuition/financial-aid.html","Verified","No","")
add("University (UNM)","Academic","Dental Hygiene students",
    "Division of Dental Hygiene (Dept. of Dental Medicine)","UNM School of Medicine",
    "Competency-based dental hygiene education with clinical training; program has decades of history and connects students to professional development opportunities.",
    "Contact hsc.unm.edu/medicine/departments/dental-medicine/dental-hygiene directly for current student resources/funding.",
    "Enrolled UNM Dental Hygiene student.","hsc.unm.edu/medicine","https://hsc.unm.edu/medicine/departments/dental-medicine/dental-hygiene/","Needs Verification","No","Page describes the program well but didn't surface a dedicated emergency-fund/scholarship page in this search — worth a follow-up query specifically for 'dental hygiene scholarship UNM'.")
add("University (UNM)","Financial","Population Health students",
    "College of Population Health Scholarships","UNM College of Population Health",
    "Scholarships for both undergraduate and graduate Population Health programs.",
    "hsc.unm.edu/population-health/programs/academic-success/financial-aid-and-scholarships.html.",
    "Enrolled UNM Population Health student.","hsc.unm.edu/population-health","https://hsc.unm.edu/population-health/programs/academic-success/financial-aid-and-scholarships.html","Needs Verification","No","Page confirms scholarships exist but didn't list specific dollar amounts/names in this pass.")
add("University (UNM)","Financial","MPA students",
    "School of Public Administration (SPA) Semester Awards","UNM School of Public Administration",
    "Awards of up to $3,600/semester based on academic accomplishment and/or financial need — a notably large per-semester amount compared to most college-level funds in this dataset.",
    "Complete SPA aid application, submit to spadmissions@unm.edu.",
    "Enrolled SPA/MPA student.","spadmissions@unm.edu","https://spa.unm.edu/cost-and-aid/funding-for-students.html","Verified","No","One of the largest per-semester award amounts found so far — worth highlighting prominently in the graph's Financial branch.")
add("University (UNM)","Financial","MPA students who are single parents",
    "Sandra B. Weeke Scholarship","UNM School of Public Administration (donor-funded)",
    "Scholarship specifically for MPA students who are single parents, commemorating SPA alumna Sandra B. Weeke.",
    "Complete SPA aid application noting single-parent status; submit to spadmissions@unm.edu.",
    "Enrolled MPA student who is a single parent.","spadmissions@unm.edu","https://spa.unm.edu/cost-and-aid/funding-for-students.html","Verified","No","Pairs well with the WRC's Sabrina Single Parent's Scholarship already logged — worth grouping both under a 'single parent' filter in the graph.")
add("University (UNM)","Study Abroad Funding","Any student via GEO",
    "AMIGO Scholarship","UNM Global Education Office",
    "Study abroad funding resource administered through GEO, mentioned as a funding option for SPA/other students studying internationally.",
    "Contact Global Education Office (GEO) directly for current eligibility/amount.",
    "Enrolled UNM student pursuing study abroad.","isss.unm.edu / studyabroad.unm.edu","https://spa.unm.edu/cost-and-aid/funding-for-students.html","Needs Verification","No","")
add("Community","General Hub / Multi-Service","Low-income households, statewide focus w/ ABQ presence",
    "HELP New Mexico, Inc. (HELPNM)","Nonprofit — Bernalillo County's Community Action Agency",
    "Much bigger than its name suggests: 25 offices, 200+ employees, serving 10 NM counties (incl. Bernalillo). Six service pillars — Employment, Education, Income/Asset Building, Housing, Health/Behavioral, and Civic Engagement — plus free food via the Child & Adult Care Food Program and limited emergency rental assistance.",
    "General line 505-265-3717 / 505-867-2291 (Bernalillo office); helpnm.org.",
    "Low-income individuals/families; specific programs (veterans, migrant/seasonal farmworkers, youth) have their own criteria.",
    "505-265-3717","https://www.helpnm.org","Verified","Yes","This org was previously logged only as a small local contact via UNM Taos's page — it's actually the core Community Action Agency infrastructure across nearly a third of NM's counties. Upgrade its importance in the graph accordingly.")
add("Community","Food","Anyone in need, Bernalillo County",
    "Storehouse New Mexico","Nonprofit food pantry (50+ years operating)",
    "One of NM's largest food pantries — 'client choice model' (shop like a grocery store) provides a full cart of groceries incl. meat/dairy/produce; also runs a Pet Food Pantry on the 3rd Friday monthly and can assist with water bills. Fed nearly 78,000 people in 2025.",
    "106 Broadway Blvd SE, Albuquerque. Wed-Sat 9am-1pm; caseworker-only slots Wed & Fri 1-3pm. (505) 842-6491.",
    "Anyone in need — including the 'working poor' who earn too much for SNAP.",
    "(505) 842-6491","https://storehousenm.org","Verified","No","")
add("Community","Food","Anyone in need, Albuquerque metro",
    "Rio Grande Food Project","Nonprofit food pantry",
    "Provides a week's worth of groceries once a month (30 days apart); no documentation strictly required, though photo ID + proof of guardianship for kids under 18 requested. Also assists with water bills.",
    "600 Coors Blvd NW, Albuquerque. Wed/Fri/Sat 9-11am. (505) 831-3778.",
    "Albuquerque metro area resident.","(505) 831-3778","https://www.rgfp.org/food-pantry/","Verified","No","")
add("Community","Food","Sandoval County residents",
    "Storehouse West","Nonprofit (TEFAP partner w/ Roadrunner Food Bank + NM Dept. of Health)",
    "Monthly food package (canned goods, grains, legumes, canned meat/fruit/veg) plus a Kids Clothing Closet (newborn-18) with jeans, shoes, jackets, etc.",
    "Bring current address proof (license or bill); check income guidelines on storehousewest.org.",
    "Sandoval County resident meeting TEFAP federal income guidelines.",
    "storehousewest.org","https://storehousewest.org/","Verified","No","")
add("Community","Legal / Domestic Violence","Spanish-speaking immigrant survivors of DV",
    "Enlace Comunitario","Nonprofit (est. 2000)",
    "Free, bilingual (Spanish/English) domestic violence intervention: legal assistance for protective orders and family-law representation, individual/group therapy for victims and children, limited transitional housing/rent/utility/deposit assistance, parenting classes, and referrals to food/employment/healthcare.",
    "2425 Alamo SE, Albuquerque. (505) 246-8972. Mon-Fri 8am-5pm.",
    "Primarily Spanish-speaking Latino immigrant DV survivors in Bernalillo/Valencia counties, though the org states it supports any DV survivor in need.",
    "(505) 246-8972","https://www.enlacenm.org","Verified","No","")
add("Community","Civic / Legal Hub","Victims of interpersonal crime",
    "Albuquerque Family Advocacy Center (AFAC)","City of Albuquerque + multi-agency partnership",
    "Single physical location combining on-site partners for domestic violence, child abuse, and sexual assault victims — includes Enlace Comunitario and the NM Asian Family Center among on-site/off-site partners.",
    "Contact via cabq.gov/albuquerque-family-advocacy-center.",
    "Victims of domestic violence, child abuse, sexual assault, and their families.",
    "cabq.gov","https://www.cabq.gov/albuquerque-family-advocacy-center","Verified","No","")
add("Community","Cultural / Identity","Pan-Asian community",
    "New Mexico Asian Family Center (NMAFC)","Nonprofit",
    "The only agency in NM providing culturally tailored advocacy and support programming specifically for the Pan-Asian community — fills a gap the rest of this dataset doesn't otherwise cover.",
    "149 Jackson St NE, Albuquerque. Mon-Fri 8am-5pm.",
    "Pan-Asian community members in NM.","149 Jackson St NE","https://dvrcnm.org/resources/","Verified","No","First Asian-community-specific entry in the dataset — closes part of the 'non-Christian/non-Latino cultural org' gap flagged in the last report.")
add("Community","Cultural / Faith-Adjacent","Jewish community + general public",
    "Jewish Community Center (JCC) of Greater Albuquerque","Nonprofit, open to all regardless of religious affiliation",
    "Fitness/aquatics facilities, early childhood education, day camps, and — notably — the Jewish Care Program offering emergency assistance, resource/referral, support groups, and senior outreach. Also documented as supporting Saranam and several food banks directly.",
    "5520 Wyoming Blvd NE, Albuquerque. (505) 332-0565.",
    "Open to all regardless of age or religious affiliation; Jewish Care Program emergency assistance likely prioritizes Jewish community members — confirm directly.",
    "(505) 332-0565","https://jccabq.org","Verified","No","First faith-adjacent entry in the dataset outside Christian orgs — addresses a gap flagged in the last report.")
add("Community — UNM-affiliated","Cultural / Faith","Jewish UNM students, faculty, staff",
    "Hillel at UNM","UNM-affiliated Jewish student organization",
    "Shabbat services and home-cooked kosher meals, holiday observances, social functions, retreats, Hebrew/Bible courses, and community service opportunities for Jewish students.",
    "1701 Sigma Chi Rd NE, Albuquerque. (505) 242-1127.",
    "UNM Jewish students, faculty, and staff (community welcome).",
    "(505) 242-1127","https://www.abqjew.com/organize.php","Verified","No","This sits right alongside UNM's other identity-based centers (El Centro, Afro, AISS, LGBTQ RC) but operates independently rather than through UNM directly — worth a note in the graph about that distinction.")
add("Community","Cultural / Faith","Muslim community",
    "Islamic Center of New Mexico (ICNM)","Nonprofit mosque, est. 1986",
    "The largest/oldest mosque in Albuquerque, serving 2,000+ Muslims; daily prayers, Friday Jum'ah, a children's Sunday school (Madrassat Umar al-Islamia), and community events open to Muslims and non-Muslims alike. Located near UNM and the airport.",
    "1100 Yale Blvd SE, Albuquerque. icnmabq.org.",
    "Open to the Muslim community and the general public for events.",
    "1100 Yale Blvd SE","https://www.icnmabq.org/","Verified","No","Closes the Muslim-community gap flagged across the last three reports.")
add("Community","Direct Service / Faith","Unhoused / general community",
    "MINARA Muslim Community Center","Nonprofit (501c3)",
    "Beyond worship, runs concrete direct-service programs: homeless feeding, health & wellness classes, language arts/calligraphy, and youth martial arts/archery programs.",
    "Check MinaraABQ.org and Facebook for current program schedule.",
    "Open to the Muslim community and broader Albuquerque community (homeless feeding is open to anyone in need).",
    "minaraabq.org","https://minaraabq.org/","Verified","No","The homeless feeding program is directly relevant to the Food branch, not just the Cultural/Faith branch — consider cross-listing in the graph.")
add("Community","Cultural / Multi-Service","Urban Native American community",
    "First Nations Community HealthSource","Nonprofit — NM's Urban Indian Health Center & Federally Qualified Health Center",
    "50+ years serving the urban Native community with culturally-centered healthcare: multiple clinic locations (Zuni, Truman, Central, Vision), a dedicated Traditional Wellness Program, dental, counseling, and diabetes/nutrition education. Open to non-Native patients too, as an FQHC.",
    "Zuni Clinic 505-262-2481; Truman Clinic 505-248-2990; Central Clinic 505-308-8060.",
    "Primarily serves the urban Native American community; as an FQHC, also serves the broader community on a sliding scale.",
    "505-262-2481","https://www.fnch.org/","Verified","No","This is a major, currently-active resource — should likely anchor the Healthcare branch's Native-community node.")
add("Community","Cultural / Multi-Service","Urban Native American community",
    "Albuquerque Indian Center (AIC)","Nonprofit — INACTIVE as of Feb 2025",
    "Historically provided wrap-around services (counseling, DWI/substance abuse counseling, DV counseling, weekly AA meetings, food/hygiene boxes, resume help, legal services via UNM Law Clinic) to the urban Native community.",
    "N/A — organization is listed as inactive.",
    "N/A","N/A","https://www.groundworksnm.org/nonprofit-directory/nonprofit/13476","Needs Verification","No","IMPORTANT: flagged inactive as of Feb 2025 per Groundworks NM directory. Do NOT list as a live resource in the graph without a fresh confirmation call — includes to avoid sending someone to a closed door.")
add("Community","Workforce","Native American adults",
    "National Indian Youth Council / Native Professional Advancement Center","Nonprofit (NIYC)",
    "Workforce development and employment services for Native Americans, funded partly via Dept. of Labor grants; despite the 'Youth' name, serves adults broadly through the Native Professional Advancement Center.",
    "Albuquerque office; contact via npacnm.org.",
    "Native American adults seeking workforce/employment services.",
    "npacnm.org","http://www.npacnm.org/","Verified","No","")
add("City","Civic / Cultural","Native American residents",
    "City of Albuquerque Office of Native American Affairs","City of Albuquerque",
    "Coordinates between the City and NM Tribal governments; maintains the Commission on American Indian & Alaska Native Affairs (CAIANA) and a directory of NM Pueblos/Tribes/Nations contacts.",
    "cabq.gov/office-of-equity-inclusion.","Native American Albuquerque residents; general public for the toolkit/contact directory.",
    "cabq.gov","https://www.cabq.gov/office-of-equity-inclusion/about-office-of-equity-inclusion/native-american-affairs","Verified","No","")
add("Community","Senior / Disability","Seniors and people with disabilities, statewide",
    "Adelante Development Center","Nonprofit (est. 1978)",
    "One of NM's largest nonprofits (top-10 non-govt employer in the state) — senior day programs, assisted living homes, employment services, transportation/meal services at senior centers, and DiverseIT (free/low-cost computers for people with disabilities and nonprofits, including tribal partnerships like a laptop distribution in To'hajiilee).",
    "3900 Osuna Rd NE, Albuquerque. (505) 341-2000.",
    "People with disabilities, seniors, and disadvantaged populations in central NM (Bernalillo/Valencia primary; some programs statewide).",
    "(505) 341-2000","https://goadelante.org","Verified","Yes","DiverseIT's free computer program for people with disabilities is a genuinely under-advertised resource — same shape as the free-printing finds. Worth flagging prominently.")
add("Community","Disability","Adults with intellectual/developmental disabilities",
    "ARCA (Albuquerque Resource Center for the Advancement of the Disabled)","Nonprofit (est. 1957)",
    "24/7 supported living/residential services, intermediate care, family living placements, and vocational training (e.g., La Paloma Greenhouse horticulture program, ARCA Janitorial Services for employment) — serves 600+ individuals of all ages including seniors.",
    "11200 Lomas Blvd NE, Albuquerque. (505) 332-6700.",
    "Individuals with intellectual, developmental, and cognitive disabilities.",
    "(505) 332-6700","https://arcaopeningdoors.org","Verified","No","")
add("State (NM)","Disability / Employment","People with disabilities, age 14+",
    "NM Division of Vocational Rehabilitation (NMDVR)","NM Public Education Department",
    "State/federally funded program helping people with documented disabilities get and keep employment — individualized planning, a dedicated Vocational Rehabilitation Counselor, assistive technology access, job placement partnerships with employers, and Pre-Employment Transition Services (PETS) for students.",
    "Contact a local NMDVR office; find one via dvr.state.nm.us. Eligible from age 14 (PETS) or 16+ (general services).",
    "Medically documented disability, wants to work, needs assistance getting/keeping a job.",
    "dvr.state.nm.us","https://www.dvr.state.nm.us/","Verified","No","")
add("State (NM)","Veterans","NM veterans & families",
    "NM Dept. of Veterans' Services (NMDVS) — Benefits Overview","State of New Mexico",
    "16 field offices statewide staffed by Veteran Service Officers (veterans themselves). Key benefits: full property tax exemption for 100% disabled veterans (partial for others, $4,000 reduction), full state income tax exemption on military retirement pay, reduced-fee hunting/fishing licenses, On-the-Job-Training programs, and priority job/training services via NM Dept. of Workforce Solutions.",
    "Find a field office via nmdvs.org; VSOs help with claims and applications free of charge.",
    "NM veterans and, for some benefits, their dependents/survivors.",
    "nmdvs.org","https://www.nmdvs.org/benefits/","Verified","No","")
add("State (NM)","Veterans / Education","Dependents of KIA/deceased veterans",
    "NM Veterans' Dependents Tuition Waiver","NM Dept. of Veterans' Services + NM Higher Ed Dept.",
    "Full tuition waiver (matriculation fees, room, board, books, supplies) for dependent children of veterans killed in action or who died of battle wounds.",
    "Apply through NMDVS with proof of dependency and the veteran's service record.",
    "Dependent child of a veteran killed in action or who died as a result of battle wounds.",
    "nmdvs.org","https://myarmybenefits.us.army.mil/Benefit-Library/State/Territory-Benefits/New-Mexico","Verified","No","")
add("State (NM)","Veterans / Education","Vietnam-era veterans",
    "NM Vietnam Veterans' Scholarship","NM Higher Education Dept.",
    "Covers tuition, fees, and books for one academic year (renewable with satisfactory progress) at state-funded schools for undergraduate, master's, or doctoral programs.",
    "Apply via NM Dept. of Veterans' Services with proof of NM residency at entry (or 10+ years' residency) and the Vietnam Campaign/Service Medal.",
    "NM resident at time of entry into service (or 10+ years NM residency), awarded Vietnam Campaign or Service Medal.",
    "nmdvs.org","https://myarmybenefits.us.army.mil/Benefit-Library/State/Territory-Benefits/New-Mexico","Verified","No","")
add("State (NM)","Immigrant-Specific","Undocumented residents & DACA recipients",
    "In-State Tuition & State Financial Aid for Undocumented Students","State of New Mexico (NM Senate Bill 582, 2005)",
    "NM is classified a 'Comprehensive Access' state — undocumented residents (including DACA recipients) are eligible for in-state tuition, state financial aid, professional/occupational licensure in most professions, and driver's licenses.",
    "Apply for in-state tuition classification through your NM college's registrar; complete the NM state aid application alongside/instead of FAFSA if federal aid isn't accessible.",
    "NM high school attendance/graduation criteria typically apply (verify current criteria with your institution's registrar).",
    "higheredimmigrationportal.org","https://www.higheredimmigrationportal.org/state/new-mexico/","Verified","No","One of the strongest state-level policies in the country for undocumented students — directly relevant to several scholarships already logged (El Centro's Dream US Scholarship, Immigrants Rising).")
add("State (NM)","Immigrant-Specific","All NM non-citizens incl. undocumented",
    "NM Standard Driver's License for Non-Citizens","NM Motor Vehicle Division",
    "NM has offered driving privileges to undocumented residents since 2003 (current rules per 2019's SB 278) — one of only two states (with WA) issuing a single, non-distinguished license usable for boarding domestic flights, not just driving.",
    "Apply at NM MVD with required documentation (see MVD's Driver's Licenses/IDs page); a license doesn't confer immigration status.",
    "NM resident regardless of immigration status.",
    "MVD","https://www.nolo.com/legal-encyclopedia/can-an-undocumented-person-in-new-mexico-get-a-driver-s-license.html","Verified","No","")
add("State (NM)","Immigrant-Specific / Healthcare","All NM non-citizens incl. undocumented",
    "State-Funded Healthcare Access for Non-Citizens","NM Health Care Authority",
    "As of July 2025, NM grants state-funded healthcare access to all non-citizens including undocumented immigrants; federal Medicaid eligibility still varies by immigration status separately.",
    "Contact NM Health Care Authority / apply via yes.nm.gov; verify current program name and application process, as this is a recently expanded (2025) policy.",
    "NM resident regardless of immigration status (state-funded programs); federal Medicaid has separate status rules.",
    "hca.nm.gov","https://www.visaverge.com/knowledge/state-benefits-and-restrictions-for-non-citizens-in-new-mexico/","Needs Verification","No","Recent (2025) policy expansion — confirm the exact program name/application path directly with HCA before publishing, since secondary-source reporting can lag official plan details.")
add("University (UNM)","Immigrant-Specific","Undocumented & DACA students",
    "Undocumented UNM (undocumented.unm.edu)","UNM, university-wide initiative",
    "Centralized hub for undocumented students and their families covering admissions/enrollment/financial aid, campus & community resources, legal support, donations/fundraising, and legislative action tracking. UNM police are barred from contacting/detaining/questioning/arresting anyone solely on suspected undocumented status. Explains NM's SB 582 protections (no immigration-status discrimination by universities).",
    "undocumented.unm.edu — includes a Legal Support page listing NMILC and other partners.",
    "Undocumented and DACA-status UNM students and their families.",
    "undocumented.unm.edu","https://undocumented.unm.edu/","Verified","No","This is the master hub for the entire immigrant-student branch — pairs directly with El Centro's external scholarship list already logged. Recommend making this the primary landing node in the graph's 'Immigrant Status' pathway.")
add("Community","Legal","NM immigrants of any status",
    "New Mexico Immigrant Law Center (NMILC)","Nonprofit legal aid organization",
    "Makes immigration legal help affordable/accessible for NM's immigrants and aspiring citizens; promotes knowledge of legal rights and the immigration process regardless of ability to pay.",
    "714 4th St SW, Albuquerque. (505) 247-1023, info@nmilc.org.",
    "NM immigrants and aspiring citizens, prioritizing those with financial need.",
    "(505) 247-1023","https://www.nmilc.org","Verified","No","")
add("University (UNM)","Legal","Immigrants needing DACA/visa/status help",
    "UNM Law School Community Lawyering Clinic","UNM School of Law",
    "Supervised law students represent clients applying for DACA, U-visas, work authorization, and adjustment of status — free legal services via a teaching clinic model.",
    "Contact via UNM School of Law's Community Legal Assistance guide (libguides.law.unm.edu).",
    "Low-income immigrants needing DACA/visa/status legal help; case availability varies by clinic capacity each semester.",
    "lawschool.unm.edu","https://libguides.law.unm.edu/c.php?g=244026&p=1625811","Verified","No","This connects UNM's own Law school resources (already logged for law students) to the broader immigrant-community-facing legal aid layer — good cross-link in the graph.")
add("Community","Civil Rights / Worker Rights","Immigrants, statewide",
    "Somos Un Pueblo Unido","Statewide immigrant-led nonprofit",
    "Immigrant-led organization promoting worker and racial justice; provides information (not direct legal representation) on immigrants' rights, civil rights, fair housing, tenant law, and workers' rights, plus wage-theft support in Northern NM.",
    "1804 Espinacitas St, Santa Fe. somos@somosunpueblounido.org, (505) 424-7832.",
    "Immigrants and workers statewide; no direct legal assistance, informational/advocacy focus.",
    "(505) 424-7832","https://sharenm.org/somos-un-pueblo-unido","Verified","No","")
add("Community","Resettlement / Multi-Service","Refugees and asylees",
    "Lutheran Family Services Rocky Mountains (LFS) — Refugee & Asylee Program","Nonprofit (faith-based, serving since 1948; affiliate of Global Refuge)",
    "Full wraparound resettlement case management: housing, ESL classes, job placement/career advancement, a savings-match program, small-business loans, farm-plot access (Tres Hermanas Farm), and summer-school programming. Has resettled 3,000+ refugees in NM over the past decade and helped start 75 new businesses.",
    "Contact LFS Albuquerque office; lfsrm.org.",
    "Refugees and asylees resettling in Albuquerque/northern NM.",
    "lfsrm.org","https://www.lfsrm.org/Refugee-Asylee-Albuquerque","Verified","No","One of the most substantive, well-funded resettlement pipelines in the dataset — worth a prominent spot alongside NMILC in the graph's immigrant/refugee branch.")
add("Community","Civic / Economic","Immigrant families, South Valley + statewide",
    "Partnership for Community Action (PCA)","Nonprofit (since 1990)",
    "Builds strong communities in Albuquerque's South Valley and statewide, focused on education, economic sustainability, wellness, and immigrant rights advocacy/leadership development.",
    "Contact via nmilc.org's community partners page for current PCA contact info.",
    "South Valley and statewide NM community members, immigrant-rights focus.",
    "See NMILC partner page","https://www.nmilc.org/our-community-partners?locale=en","Needs Verification","No","Found via NMILC's partner list rather than a direct PCA page — confirm current direct contact info.")
add("Community","Financial","Limited-income NM families",
    "Prosperity Works","Nonprofit",
    "Builds economic prosperity for limited-income NM families through financial education, asset planning, and family supports — policy advocacy plus direct capacity-building for partner orgs.",
    "Contact via nmilc.org's community partners page for current direct contact info.",
    "Limited-income families and the organizations that serve them.",
    "See NMILC partner page","https://www.nmilc.org/our-community-partners?locale=en","Needs Verification","No","")
add("Community","Financial / Banking","Immigrants without an SSN, any status",
    "Rio Grande Credit Union — Juntos Avanzamos Program","Credit union (Juntos Avanzamos-designated)",
    "First credit union in Albuquerque (2nd in NM) certified 'Juntos Avanzamos' ('Together We Advance') — lets anyone open a real bank account without a Social Security Number, using an ITIN plus a government photo ID (Matrícula Consular, foreign passport, foreign driver's license, or permanent resident card). Legal regardless of immigration status; small ($5) minimum deposit.",
    "Visit a Rio Grande Credit Union branch with ITIN + photo ID + proof of address; riograndecu.org/juntos-avanzamos.",
    "Anyone, regardless of SSN status or immigration status.",
    "riograndecu.org","https://www.riograndecu.org/Juntos-Avanzamos-English","Verified","Yes","This is exactly the kind of resource that doesn't show up unless you specifically go looking for 'banking for immigrants' — most people don't know a real, federally-insured bank account is available without an SSN. High-value addition to the Financial branch.")
add("Community","Financial / Banking","General reference",
    "ITIN Banking — General Access Explainer","Cross-institution consumer finance concept",
    "An Individual Taxpayer Identification Number (ITIN), issued by the IRS regardless of immigration status, can substitute for an SSN at many banks/credit unions nationally (not just Juntos Avanzamos-designated ones) — enabling checking/savings accounts, some credit cards, and even certain mortgages/auto loans, which in turn builds a U.S. credit history.",
    "Apply for an ITIN via IRS Form W-7 (through a Certifying Acceptance Agent, which El Centro/CFC/NMILC may be able to point to); then bring the ITIN + ID + proof of address to any participating bank/credit union.",
    "Anyone without an SSN, regardless of immigration status.",
    "IRS Form W-7","https://upwardcu.org/itin-bank-and-borrow","Verified","No","Frame this as the 'how it works' explainer node in the graph, with Rio Grande Credit Union as the concrete local leaf underneath it.")
add("University (UNM)","Financial / Banking","UNM students, faculty, staff",
    "Nusenda Credit Union — UNM Student Union Branch","Nusenda Credit Union (NM's largest credit union)",
    "On-campus credit union branch inside the SUB; not immigrant-specific, but relevant as an accessible campus banking option alongside Rio Grande Credit Union's immigrant-focused services elsewhere in town.",
    "Branch at UNM Student Union Building.","UNM students, faculty, staff, and their immediate family.",
    "nusenda.org","https://creditunionmatch.com/credit-union/nusenda-credit-union","Verified","No","")
add("Community","Civic","Immigrants and refugees, city-wide",
    "City of Albuquerque Office of Immigrant & Refugee Affairs","City of Albuquerque",
    "Dedicated city office maintaining a running list of resources for refugees and immigrants in the Albuquerque metro area, plus a directory of partner agencies and translation services.",
    "cabq.gov/office-of-equity-inclusion — includes a 'Partner Agencies' subpage listing vetted local orgs.",
    "Immigrants and refugees in the Albuquerque metro; general public for the resource directory.",
    "cabq.gov","https://www.cabq.gov/office-of-equity-inclusion/about-office-of-equity-inclusion/immigrant-refugee-affairs","Verified","No","This office's own partner-agency directory is a good ongoing source to re-check periodically for orgs not yet in this dataset.")
add("Community","Civil Rights / Worker Justice","Low-wage immigrant workers, Albuquerque",
    "El CENTRO de Igualdad y Derechos","Grassroots immigrants' rights & workers' justice organization",
    "Distinct from UNM's 'El Centro de la Raza' — a community-based organizing group predominantly staffed by immigrant leaders, focused on grassroots organizing, policy advocacy, leadership development, and voter engagement for low-wage immigrant workers.",
    "elcentronm.org.","Low-wage immigrant workers and families in Albuquerque.",
    "elcentronm.org","https://www.elcentronm.org/","Verified","No","IMPORTANT naming collision: 'El CENTRO de Igualdad y Derechos' (this org) is NOT the same as UNM's 'El Centro de la Raza' (already logged, the Transformar Fellowship org). Flag this clearly in the graph so Jazmin/Will don't merge them by mistake.")
add("Community","Multi-Service","Immigrants, refugees, asylees (esp. from Africa/Asia/Middle East)",
    "Immigrant and Refugee Resource Village of Albuquerque (IRRVA)","100% volunteer nonprofit",
    "Free vocational skills training (sewing, weaving, beading, needle-arts) for economic empowerment, one-on-one adult basic literacy and ESL tutoring, and community education about immigrant/refugee contributions and needs. Serves low/no-income families often with no formal education or English literacy.",
    "209 San Pablo SE, Albuquerque. irrva.com.",
    "Low/no-income refugee, immigrant, and asylee families, with a historical focus on African, Asian, and Middle Eastern communities.",
    "irrva.com","https://sharenm.org/immigrant-and-refugee-resource-village-of-albuquerque-irrva/immigrant-and-refugee-resource-village-of-albuquerque","Verified","No","Good complement to Lutheran Family Services — IRRVA is smaller/grassroots (100% volunteer) while LFS is the large formal resettlement pipeline.")
add("Community","Youth / Health","Newcomer families and youth",
    "United Voices for Newcomer Rights (UVNR)","Nonprofit, partnered with UNM",
    "Partners directly with UNM to improve newcomer health/social determinants of health, provides individual advocacy and mentorship, works on cultural appropriateness of early childhood/K-12 education, runs a Youth Community Advisory Council for newcomer youth leadership development, and provides linguistically accessible services.",
    "info@uvnr.org, PO Box 37026, Albuquerque, NM 87176.",
    "Newcomer (immigrant/refugee) families and youth in Albuquerque.",
    "uvnr.org","https://www.uvnr.org/","Verified","No","Direct UNM partnership makes this a good bridge node between the university and broader newcomer-community branches in the graph.")
add("State (NM)","Financial / Tax Credits","ITIN tax filers",
    "NM Working Families Tax Credit — ITIN Filers Included","NM Taxation & Revenue Dept. (via 2021 House Bill 291)",
    "NM's state-level Earned Income Tax Credit equivalent, currently 25% of the federal EITC amount, EXPLICITLY includes ITIN filers as eligible (HB 291, 2021) — unlike the federal EITC, which excludes ITIN filers entirely. Also extended eligibility to workers age 18-24.",
    "Claim when filing NM state taxes (even if not required to file); free filing help via AARP Tax-Aide or VITA sites already logged.",
    "ITIN tax filer meeting income requirements, OR any filer 18-24, in addition to standard state EITC eligibility.",
    "tax.newmexico.gov","https://www.taxcreditsforworkersandfamilies.org/state/new-mexico/","Verified","Yes","Major finding directly answering 'what can I access with an ITIN' — most people assume ITIN filers are shut out of EITC-style credits entirely (true federally) but NM specifically wrote them back in at the state level. Strong candidate for the graph's ITIN pathway.")
add("Federal","Financial / Tax Credits","ITIN tax filers with dependents",
    "Federal Tax Credits Still Available to ITIN Filers","IRS",
    "While ITIN filers CANNOT claim the federal EITC, they CAN still claim: the Child and Dependent Care Credit (up to $1,050-$2,100), the $500 Credit for Other Dependents (for a qualifying ITIN-holding relative, including children over 17 or ITIN-holding kids not eligible for the full Child Tax Credit), Head of Household filing status if claiming a qualifying dependent, and the Premium Tax Credit for ACA marketplace health insurance in specific household situations.",
    "File a federal tax return using the ITIN via IRS Form W-7; use AARP Tax-Aide or a VITA site (both already logged) for free help navigating which credits apply.",
    "ITIN holder filing a U.S. federal tax return with qualifying dependents/situations.",
    "irs.gov","https://www.taxoutreach.org/tax-filing/itin/","Verified","No","Nuanced but important: the graph should distinguish 'blocked federally' (EITC, standard CTC refundable portion) from 'still accessible federally' (Dependent Care Credit, $500 Other Dependent Credit) from 'accessible via NM specifically' (state EITC) — three different tiers, easy to conflate.")
add("University (UNM)","Financial / Tax Info","Anyone needing an ITIN",
    "UNM ITIN Application Guidance","UNM Tax Compliance Office",
    "Explains what an ITIN is/isn't (IRS purposes only — doesn't grant work authorization, immigration status, or Social Security benefits) and how to apply via IRS Form W-7 (also available in Spanish as Form W-7SP).",
    "taxation.unm.edu/foreign-national-transactions/individual-taxpayer-id.html; ITIN office in Philadelphia, PA: 215-516-2000 (not toll-free).",
    "Primarily written for UNM's foreign national community, but the W-7 process explanation applies to anyone.",
    "215-516-2000","https://taxation.unm.edu/foreign-national-transactions/individual-taxpayer-id.html","Verified","No","Good 'how do I even get one' entry point node to place upstream of every other ITIN-linked resource in the graph (Rio Grande CU banking, NM state EITC, Homewise's ITIN mortgages already logged).")
add("Community","Financial / Homeownership","ITIN holders",
    "Homewise ITIN Mortgage Loans","Homewise (already logged for down-payment assistance)",
    "Cross-reference: Homewise (already in this dataset for down-payment assistance and no-PMI mortgages) explicitly offers ITIN loans — mortgage lending using an ITIN instead of an SSN, opening a path to homeownership for ITIN holders specifically.",
    "Same as existing Homewise entry — 505-243-6566, Home Purchase Advisor consultation.",
    "ITIN holder able to demonstrate income/creditworthiness through ITIN-based tax filing history.",
    "505-243-6566","N/A — see existing Homewise entry","Verified","No","Not a new organization — this is a pointer row so the ITIN pathway in the graph can link directly to the existing Homewise entry's ITIN-specific detail, rather than requiring a separate lookup.")
add("Community","Housing / Legal Rights","ITIN holders / anyone without an SSN",
    "Fair Housing Act Protections for Applicants Without an SSN","Federal law (Fair Housing Act) + general practice",
    "Landlords CAN legally ask for an SSN and CAN require extra documentation from applicants without one, but CANNOT deny housing based on national origin or immigration status — that's illegal discrimination under the Fair Housing Act. An ITIN, income proof, photo ID, and references are commonly accepted substitutes for an SSN on a rental application.",
    "If applying for a rental without an SSN, bring an ITIN, photo ID (Matrícula Consular/passport accepted by many landlords), income verification, and references; if denied for national-origin/immigration-status reasons, that can be reported to HUD or a local Fair Housing agency.",
    "Anyone applying to rent housing in the U.S., regardless of immigration status.",
    "HUD / Fair Housing Act","https://www.leaserunner.com/blog/background-check-without-social-security-number","Verified","No","This is a rights-education entry, not a specific org — pairs well in the graph with UNM's Off-Campus Housing Board and Rio Grande Credit Union as the three prongs of 'housing access without an SSN.'")
add("State (NM)","Employment / Self-Employment","ITIN holders",
    "NM Business Registration Without an SSN","NM Taxation & Revenue Dept. + NM Secretary of State",
    "New Mexico does NOT require an SSN to register a business or pay state business taxes — sole proprietors can use an ITIN, and registered entities (LLC, corp, partnership) register separately. An ITIN alone does not authorize traditional W-2 employment, but it does allow self-employment, independent contracting, freelancing, and business ownership — all legal regardless of immigration status.",
    "Register with NM Secretary of State (Business Services) and NM Taxation & Revenue Dept. (Business Tax ID / BTIN) via the NM Business Portal (biz.nm.gov); obtain an EIN from the IRS if hiring employees.",
    "Anyone starting a business or working as an independent contractor in NM, regardless of immigration status.",
    "biz.nm.gov","https://www.higheredimmigrationportal.org/wp-content/uploads/2023/10/New-Mexico-Business-and-Tax-State-Requirements.pdf","Verified","No","Connects directly to Homewise's Financial Fitness classes and CFC's budgeting help already logged — self-employment/entrepreneurship is a real income path for ITIN holders even without traditional job eligibility.")
add("State (NM)","Healthcare","Undocumented NM residents",
    "Emergency Medicaid Coverage for Undocumented Residents","NM Health Care Authority",
    "Undocumented New Mexicans are eligible for EMERGENCY coverage only through NM's Medicaid program — this is narrower than full Medicaid and narrower than the 'state-funded healthcare for all non-citizens' policy logged in an earlier pass, which should be reconciled/clarified with HCA directly.",
    "Apply via yes.nm.gov; emergency Medicaid is typically applied for at time of an emergency medical need.",
    "Undocumented NM resident with an emergency medical situation.",
    "yes.nm.gov","https://bewellnm.com/blogs/noncitizen-health-insurance/","Needs Verification","No","IMPORTANT: this appears to conflict with the earlier-logged 'as of July 2025, NM grants state-funded healthcare access to all non-citizens' finding — the two sources may be describing different programs (emergency-only Medicaid vs. a broader state-funded plan), or one may be outdated. Flagging both for a direct call to HCA to reconcile before publishing either as authoritative.")
add("State (NM)","Healthcare","DACA recipients — TIME-SENSITIVE",
    "DACA Coverage Bridge (status uncertain as of Aug 2026)","NM Health Care Authority",
    "A federal rule (Marketplace Integrity and Affordability Rule) removed DACA recipients' eligibility for BeWell marketplace coverage and Premium Tax Credits effective Oct 1, 2025. NM HCA created a temporary 'DACA Coverage Bridge' offering a Clear Cost Gold Plan, but enrollment for that bridge closed January 15, 2026 and coverage was only guaranteed through Dec 31, 2025.",
    "Contact NM Health Care Authority directly (hca.nm.gov) for current 2026 status — the bridge program as described has almost certainly expired or been replaced by the time anyone reads this.",
    "DACA recipients in NM.","hca.nm.gov","https://www.hca.nm.gov/daca-coverage/","Needs Verification","No","CRITICAL FLAG: this is a fast-moving, federally-driven policy area. Do NOT present the 'DACA Coverage Bridge' as current without calling HCA first — the source describes a program that expired months before this dataset entry was written (Aug 2026). This is exactly the kind of entry that needs a 'last verified' date once the team starts doing the verification pass.")
add("Community","Healthcare","Anyone without an SSN, incl. non-citizens",
    "BeWell NM Marketplace — No SSN Required (but not ITIN either)","BeWell, New Mexico's Health Insurance Marketplace",
    "Important nuance: applicants without an SSN can still apply to BeWell by leaving the SSN field blank — but an ITIN is explicitly NOT accepted in that field either. Instead, eligibility runs through proof of an eligible immigration status/document. This means ITIN alone does not unlock ACA marketplace coverage the way it does banking or business registration.",
    "Apply at bewellnm.com; free certified assisters available to help navigate eligibility documentation.",
    "Lawfully present immigrants with an eligible status document; does NOT include undocumented residents (who instead have Emergency Medicaid, see separate entry) or, as of Oct 2025, DACA recipients (see DACA Coverage Bridge entry).",
    "bewellnm.com","https://bewellnm.com/answers/non-citizen/","Verified","No","Correcting an assumption the graph should avoid: don't lump 'has an ITIN' together with 'can get BeWell marketplace coverage' — they're separate eligibility tracks. Worth a clear visual distinction in the graph between ITIN-unlocked resources and immigration-status-unlocked resources.")

add("Institution — CNM","Food","Enrolled CNM students, 1+ credit hour",
    "CNM Food Pantry (4 campus locations)","Central New Mexico Community College, funded via CNM Foundation",
    "Free bag of fresh fruits/vegetables and non-perishables at 4 locations across the city (Main Campus SRC, SV II Room 198, MJG Cafe Westside, G Building). Uses PantrySoft for check-in/online ordering, registered once per semester. Also occasional Suncat Salon vouchers.",
    "Bring CNM ID + a bag; register via PantrySoft once each semester; see cnm.edu/depts/dean-of-students/wellness-cnm/food-pantry for current hours per location.",
    "Currently enrolled CNM student taking at least 1 credit hour.",
    "cnm.edu","https://www.cnm.edu/depts/dean-of-students/wellness-cnm/food-pantry","Verified","No","CNM is Albuquerque's other major higher-ed institution, entirely separate from UNM — this whole branch was previously unmapped in the dataset.")
add("Institution — CNM","Financial","CNM students facing financial hardship",
    "Rust Opportunity Assistance Fund","CNM Foundation",
    "Emergency financial assistance for CNM students facing unforeseen financial obstacles (car repairs, medical bills, unexpected housing costs, etc.).",
    "Contact CNM Foundation or Wellness CNM case managers to apply; cnm.edu/depts/foundation.",
    "Currently enrolled CNM student experiencing an unforeseen financial hardship.",
    "cnm.edu/depts/foundation","https://www.cnm.edu/depts/foundation","Verified","Yes","Direct CNM equivalent to UNM's Dean of Students Emergency Scholarship — same shape, different institution. Good parallel entry for the graph.")
add("Institution — CNM","Health & Wellness","CNM students",
    "Wellness CNM — Case Management & Free Counseling","CNM Dean of Students",
    "Case managers/social work interns for 1:1 needs navigation (healthcare, utility assistance, housing referrals, food); 6 FREE counseling sessions per student via Hope Forward Therapy; on-campus BeWell NM Marketplace enrollment help every Tuesday.",
    "Schedule via Wellness CNM, Main Campus Kathie Winograd Student Success Center (KW), 2nd floor.",
    "Currently enrolled CNM student.","cnm.edu/depts/dean-of-students/wellness-cnm","https://www.cnm.edu/depts/dean-of-students/wellness-cnm","Verified","No","On-campus BeWell enrollment help (Tuesdays) is a nice concrete link to the ITIN/healthcare-access branch already logged — CNM brings BeWell assistance directly to students rather than requiring them to seek it out.")
add("Institution — CNM","Identity-Based","CNM students who were in foster care",
    "THRIVE Program","CNM Dean of Students",
    "Specialized wraparound support (advising, tutoring, wellness/financial resource connections, gas/groceries/emergency funds via grant funding) specifically for students who were in the foster care system.",
    "Contact CNM Dean of Students to enroll in THRIVE.","CNM student with foster care background.",
    "cnm.edu","https://www.cnm.edu/news/cnms-support-services-continue-growing-in-effort-to-enhance-student-success","Verified","Yes","Fills a gap flagged in an earlier report ('foster youth resources completely untouched') — genuinely under-the-radar, real dollars attached (gas/groceries/emergency funds).")
add("Institution — CNM","Identity-Based","CNM students who were formerly incarcerated",
    "F.I.R.S.T. Program","CNM Dean of Students",
    "Specialized wraparound support (advising, tutoring, financial/wellness resource connections) specifically for formerly incarcerated students re-entering education.",
    "Contact CNM Dean of Students to enroll in F.I.R.S.T.","CNM student who was formerly incarcerated.",
    "cnm.edu","https://www.cnm.edu/news/cnms-support-services-continue-growing-in-effort-to-enhance-student-success","Verified","Yes","Directly fills the 'reentry/formerly incarcerated resources — completely untouched' gap flagged in an earlier report. One of the more specialized, hard-to-find resource types in the whole dataset.")
add("Institution — CNM","Financial","Any CNM student",
    "CNM Foundation Fund Directory (Basic Needs Fund, Annual Fund, etc.)","CNM Foundation",
    "Umbrella of donor funds beyond the Rust Fund: the Basic Needs Fund (general basic-needs support), Annual Fund (flexible support where needed most), plus memorial/program-specific funds.",
    "cnm.edu/depts/foundation for current fund descriptions and how to request support.",
    "Currently enrolled CNM student.","cnm.edu/depts/foundation","https://www.cnm.edu/depts/foundation","Needs Verification","No","Confirm current application process for each named fund — page describes funds' purposes but not always a direct application link.")
add("Community","Multi-Service Hub","Everyone, any age/status",
    "Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search","City of Albuquerque + Bernalillo County (18 branches)",
    "Free WiFi and computer/internet access at every branch (Microsoft Office included); printing at $0.15/page; free fax and copier service; free notary services at select branches; dedicated Job & Career Guide (resume books, quiet study rooms, career databases); tax prep help during filing season; meeting room rentals; adult education classes; A-Z research databases (news archives, academic journals, image libraries) accessible with just a library card.",
    "Visit any of the 18 branches with a library card (free to obtain with proof of address); Main Library at 501 Copper Ave NW, downtown.",
    "Anyone — library cards are available regardless of immigration status in most public library systems (verify local policy).",
    "(505) 768-5141","https://abqlibrary.org/Services-Programs","Verified","Yes","Exactly the kind of 'quiet backbone' resource flagged as a gap — free printing/notary/computer access rivals or exceeds what several 'hidden' UNM department perks offer, but is open to literally anyone in the city, not just students. Strong candidate for a prominent, cross-cutting node in the graph (Financial, Housing paperwork, Employment, and Immigrant-Status branches could all point here).")
add("Community","Employment","Job seekers, any status",
    "Library Job & Career Guide — 'Working It Out!'","Public Library of Albuquerque & Bernalillo County",
    "Curated guide to city/county/state job postings, resume-writing resources, career databases, and desktop/office services (PCs, printers, fax, quiet study rooms) specifically framed around job searching.",
    "abqlibrary.org/jobs; available at any branch.","Anyone job-searching.",
    "abqlibrary.org/jobs","https://abqlibrary.org/jobs","Verified","No","Good complement to NM Dept. of Workforce Solutions and NM Vocational Rehabilitation already logged — a free, no-eligibility-check option for job search support.")


add("Community — Santa Fe","Food","Northern NM residents incl. Santa Fe/Los Alamos/rural counties",
    "The Food Depot","Nonprofit — Northern New Mexico's regional food bank (est. 2000)",
    "Santa Fe's equivalent to Roadrunner Food Bank — distributed 28.3M+ lbs of food since 2000 (37.7M+ meals). Runs the Food Mobile (walk-on trailer serving Santa Fe/Rio Arriba counties + Northern Pueblos), large drive-through pantries, a Food 4 Kids school-based backpack program (1,600+ students across 13 Santa Fe elementary schools), and free delivery to partner agencies as far as Taos, Espanola, Las Vegas, Raton, and Clayton.",
    "(505) 471-1633; thefooddepot.org for the Food Finder map of current pantry/Food Mobile locations.",
    "Northern New Mexico resident facing food insecurity.","(505) 471-1633","https://thefooddepot.org/","Verified","No","This is the Santa Fe-region parallel to Roadrunner Food Bank already logged for Albuquerque — worth pairing the two in the graph as the state's two major regional food bank hubs.")
add("Community — Santa Fe","Shelter / Housing","Santa Fe-area adults, incl. disabled singles",
    "St. Elizabeth Shelter & Supportive Housing","Nonprofit",
    "24/7/365 emergency shelter for adult men (up to 4 months, waitlist process); Casa Cerrillos permanent supportive housing for disabled single men/women with case management and life-skills training; Santa Fe Suites permanent supportive housing for singles/couples. Outreach services (hygiene products, food) available without an appointment — ring the doorbell or call ahead.",
    "3811 1/2 Cerrillos Rd, Santa Fe. (505) 471-3456 (Casa Cerrillos) / (505) 989-3600 (Santa Fe Suites). Spanish-speaking staff available.",
    "Santa Fe-area adults; Casa Cerrillos specifically for single disabled men/women.",
    "(505) 471-3456","https://www.steshelter.org","Verified","No","Santa Fe's rough parallel to Albuquerque's Good Shepherd Center/Joy Junction cluster — good to cross-reference in the graph's Shelter branch.")
add("City — Santa Fe","Food / Multi-Service","Santa Fe residents",
    "City of Santa Fe Food Benefits & Support + CONNECT Network","City of Santa Fe Office of Emergency Management",
    "City-run hub listing food pantries (Food Depot, Bienvenidos Outreach, several church pantries) plus the CONNECT Network — navigators linking residents to food, housing, and other support services with a bilingual (English/Spanish) resource directory.",
    "Call 211 or submit a referral via the CONNECT website; santafenm.gov/chs for the current directory.",
    "Santa Fe city resident.","211","https://santafenm.gov/chs/city-of-santa-fe-food-benefits-and-support","Verified","No","Santa Fe's version of Albuquerque's 311/Dept. of Family & Community Services hub already logged.")
add("County — Santa Fe","Food / Multi-Service","Santa Fe County residents",
    "Santa Fe County Food Resources Hub","Santa Fe County Government",
    "County-run coordination page connecting residents to Food Depot distributions, community resources, and support services countywide (not just city limits).",
    "Call 211 for a navigator; santafecountynm.gov/foodresources for current distribution locations/schedules.",
    "Santa Fe County resident.","211","https://www.santafecountynm.gov/foodresources","Verified","No","")
add("County — Sandoval (Rio Rancho)","Multi-Service","Sandoval County residents",
    "Sandoval County Community Services Department","Sandoval County Government",
    "County-run umbrella covering Community Health Services (incl. a Health Care Assistance Program), Senior Services (congregate/home-delivered meals, transportation, case management, Senior Volunteer Program), Behavioral Health referrals, Juvenile Justice Services, and Permanent Supportive Housing Services.",
    "370 Vancouver Rd SE, Rio Rancho. (505) 347-1715 (Sandoval County Social Services, separate coordinating org).",
    "Sandoval County resident (Rio Rancho, Bernalillo NM, Cuba, etc.).",
    "(505) 347-1715","https://www.sandovalcountynm.gov/departments/community-services/","Verified","No","This is Rio Rancho's real county-level government hub — much more substantive than a generic city contact page, closes the Rio Rancho gap flagged in the last roundup.")
add("City — Rio Rancho","Senior Services","Adults 55+",
    "Meadowlark & Broadmoor Senior Centers","City of Rio Rancho",
    "Two no-cost senior centers offering fitness classes, educational seminars, social events, weekday meals, day trips, financial guidance, and volunteer opportunities for adults 55+.",
    "Meadowlark Senior Center and Broadmoor Senior Center, Rio Rancho — contact via rrnm.gov for current hours/programs.",
    "Rio Rancho/Sandoval County residents 55+.","rrnm.gov","https://theislandsriorancho.com/about-the-islands-at-rio-rancho/senior-services/","Needs Verification","No","Sourced via a third-party retirement-community site rather than the city's own page directly — confirm current programs/contact info via rrnm.gov before publishing.")
add("Community — Los Lunas / Valencia","Shelter / DV","Domestic violence survivors, Valencia County",
    "Valencia Shelter Services (VSS)","Nonprofit, partnered with NM Coalition to End Homelessness",
    "24-hour crisis line, emergency shelter, rental assistance, case management, life skills and job readiness training, individual/group counseling — program available for up to two years for DV survivors.",
    "24-hour crisis line (see findhelp.org listing for current number); serves Los Lunas/Valencia County.",
    "Domestic violence survivors and individuals seeking shelter, statewide NM referrals accepted.",
    "See VSS crisis line","https://www.findhelp.org/provider/valencia-shelter-services-(vss)--los-lunas-nm/6335599044460544","Verified","No","Valencia County's parallel to Albuquerque's Enlace Comunitario/AFAC cluster already logged — good DV-branch cross-reference for Los Lunas.")
add("State (NM)","Civic / Financial","Residents of Sandoval, Valencia, or other counties (multi-county state offices)",
    "NM Health Care Authority Field Offices — Rio Rancho & Los Lunas","NM Health Care Authority (Income Support / Child Support Divisions)",
    "In-person state assistance offices (SNAP/Medicaid/TANF/Child Support applications) specifically serving these areas, so residents don't have to travel to Albuquerque: Rio Rancho office serves Sandoval County; Los Lunas office serves Catron, Cibola, Socorro, Torrance & Valencia Counties.",
    "Rio Rancho: 4363 Jager Dr NE. Los Lunas: 445 Camino Del Rey Suite C. Both Mon-Fri 8am-4:30pm.",
    "Residents of the respective counties applying for state assistance programs.",
    "hca.nm.gov","https://www.hca.nm.gov/lookingforassistance/field_offices/","Verified","No","Good discovery: this means every state program already logged (SNAP, Medicaid, TANF, LIHEAP) has a LOCAL access point outside Albuquerque — worth noting in the graph so Rio Rancho/Los Lunas users aren't assumed to need an Albuquerque trip.")


add("State (NM)","Employment","Job seekers and unemployed NM residents",
    "NM Dept. of Workforce Solutions (DWS)","State of New Mexico",
    "Statewide employment services hub: Unemployment Insurance benefits, apprenticeship programs (paid on-the-job training + classroom instruction), business services/labor law enforcement (wages, hours, child labor), veterans' employment services, and America's Job Center locations offering resume help and hiring/resource fairs.",
    "dws.nm.gov or dws.state.nm.us; My Workforce Connection portal for unemployment claims and job search.",
    "NM job seekers, unemployed workers, and apprenticeship candidates.",
    "401 Broadway Blvd NE, Albuquerque","https://www.nm.gov/departments-and-agencies/department-of-workforce-solutions/","Verified","No","Fills the 'NM Dept. of Workforce Solutions' gap flagged since the original roundup — pairs well with NM Vocational Rehabilitation and the Library's Job & Career Guide already logged as a three-pronged employment-support cluster.")
add("State (NM)","Child Welfare","Children/families affected by abuse, neglect, or needing foster care",
    "NM Children, Youth & Families Dept. (CYFD)","State of New Mexico",
    "24/7 Statewide Central Intake for reporting child maltreatment; foster care and adoption services; CYFD-funded domestic violence services reaching 10,500+ residents/year through 46 partner nonprofits statewide; juvenile justice and behavioral health programs.",
    "Abuse/Neglect Hotline: 1-855-333-SAFE (7233), or #SAFE from a cell phone. Foster Care/Adoptions: 800-432-2075. Juvenile Justice: 505-841-4253. Behavioral Health: 505-827-8008.",
    "NM children, youth, and families; anyone reporting suspected abuse/neglect.",
    "1-855-333-7233","https://www.nm.gov/departments-and-agencies/children-youth-and-families-department/","Verified","No","IMPORTANT CONTEXT FLAG: CYFD has been under formal NM Dept. of Justice investigation (as of April 2025) for documented systemic failures in the foster care system, including a widely-reported practice of children sleeping in CYFD offices/shelters rather than placements. The hotline and core services remain operational and this doesn't change the crisis-reporting guidance, but anyone referencing CYFD's foster care system specifically should know this context — it may shape how the graph frames foster-care-related entries (e.g., CNM's THRIVE program for former foster youth, already logged, may be describing outcomes of exactly this systemic gap).")
add("State (NM)","Senior / Disability","Adults 60+, adults with disabilities, caregivers",
    "NM Aging & Long-Term Services Dept. (ALTSD)","State of New Mexico (est. 2004)",
    "Oversees statewide Area Agencies on Aging and senior centers; Adult Protective Services (national award-winning); Long-Term Care Ombudsman program; congregate/home-delivered meals; transportation to medical appointments; help with daily living activities; National Family Caregiver Support Program (respite care, caregiver training); Office of Alzheimer's and Dementia Care; New MexiCare financial assistance for caregivers; a Kinship Caregiver Pilot Program (currently Rio Arriba/San Juan counties) for grandparents/relatives raising kids; and the 'New Mexico Disability Finder' — a one-on-one resource-navigation tool for people with disabilities, caregivers, and professionals.",
    "aging.nm.gov; NM Disability Finder at nmfinder.org for guided resource searches.",
    "Adults 60+ (or as young as needed for specific programs), adults with disabilities, their caregivers.",
    "aging.nm.gov","https://www.aging.nm.gov/","Verified","Yes","The 'NM Disability Finder' tool is itself a hidden-resource-shaped find — a guided navigation tool most people wouldn't think to search for by name. Also directly closes the 'Aging & Long-Term Services Dept — statewide senior services' gap flagged in the roadmap.")
add("State (NM)","Legal / Consumer Protection","Any NM resident",
    "NM Attorney General's Office — Consumer Protection & Victim Services","New Mexico Dept. of Justice",
    "Consumer Protection Division handles fraud/unfair business practice complaints and scam/identity theft protection; Victim Services supports crime victims' rights; additional initiatives include Missing and Murdered Indigenous Peoples (MMIP), Internet Safety/Internet Crimes Against Children, and an Indian Affairs bureau.",
    "Consumer Protection complaint line: (800) 678-1508. Submit complaints via nmdoj.gov/get-help/submit-a-complaint.",
    "Any NM resident who is a crime victim, scam target, or has a consumer complaint.",
    "(800) 678-1508","https://nmdoj.gov/get-help/","Verified","No","Fills the AG's Office gap — useful cross-reference for the ITIN/immigrant branch too, since scam targeting of immigrant communities is common and this office explicitly handles fraud protection.")
add("State (NM)","Identity-Based","Black/African American NM residents",
    "NM Office of African American Affairs (OAAA)","State of New Mexico (est. 1999 by NM Legislature)",
    "State-level agency (not just a UNM office) advising on education, community/economic development, and healthcare specifically for African Americans in NM — a genuine state government advocacy office, distinct from UNM's African American Student Services already logged.",
    "310 San Pedro Dr NE, Suite 230, Albuquerque. oaaa.state.nm.us.",
    "African American NM residents statewide.","oaaa.state.nm.us","https://en.wikipedia.org/wiki/New_Mexico_Office_of_African_American_Affairs","Verified","No","This is a genuinely separate layer from UNM's Afro (African American Student Services) — a state advocacy office vs. a campus student-services office. NM likely has parallel offices for other communities (Hispanic Affairs, Indian Affairs, Asian Affairs) worth a dedicated follow-up search to confirm which currently exist and their scope.")
add("State (NM)","Housing / Homeownership","First-time and repeat homebuyers, low-to-moderate income",
    "NM Mortgage Finance Authority (MFA) — Full Program Suite","State of New Mexico (quasi-public entity, since 1975)",
    "Administers 37 state/federal housing programs beyond the Homeowner Assistance Fund already logged: FirstHome (first mortgage loan for low/moderate-income first-time buyers), FirstDown (down payment assistance, paired with FirstHome), HomeNow (second mortgage for lower-income first-time buyers), HomeForward (for buyers who don't qualify for FirstHome, with its own DPA covering up to 3% of sale price), plus weatherization, green building/rehabilitation, and low-income housing tax credit programs. Has helped 65,000+ New Mexicans become homeowners since 1975.",
    "Work with an MFA-participating lender (list at housingnm.org); required homebuyer education course before purchase.",
    "First-time homebuyers defined as not having owned/occupied a primary residence in the past 3 years; income limits vary by program.",
    "housingnm.org","https://www.newhomesource.com/learn/first-time-homebuyer-new-mexico/","Verified","No","Significantly expands the housing/homeownership branch beyond Homewise — MFA's programs can be used independently OR alongside a lender like Homewise. Worth a clear 'these stack together' note in the graph since FirstHome+FirstDown are explicitly designed to be paired.")


add("Community","Shelter / Multi-Service","Adults experiencing homelessness, Albuquerque",
    "St. Martin's Hospitality Center (HopeWorks)","Nonprofit, est. 1985 (formerly St. Martin's, now branded HopeWorks)",
    "Day shelter serving a daily average of 350 people; provides meals (breakfast ~9am, lunch ~11:30am weekdays), clothing, short-term storage, showers, mental/behavioral health and recovery services, case management, and an Employment Services/Coffee Shop Employment Lab. Also runs the James Boyd Outreach Program and Project Share.",
    "1201 3rd St NW, Albuquerque. (505) 242-4399. Mon-Fri 8am-2pm, Sun 7am-10:30am (per most recent posted hours) — confirm current hours by phone, as they vary by source.",
    "Adults experiencing homelessness or near-homelessness in Albuquerque.",
    "(505) 242-4399","https://www.groundworksnm.org/nonprofit-directory/nonprofit/1301","Verified","No","CORRECTION NOTE: an external review (the 'Whale' document, Aug 2026) described this as 'Emergency Overnight Shelter.' Multiple independent sources (Yelp posted hours, UNM SHAC's own resource guide) instead describe it primarily as a DAY shelter with meals/showers/case management — posted hours don't suggest overnight beds on-site. Logged with corrected framing; call ahead to confirm current overnight capacity if that's specifically needed.")
add("Community","Food","Anyone in need, downtown Albuquerque",
    "Noon Day Ministry","Nonprofit (faith-based, operating since 1982, no government funding accepted)",
    "Free hot, sit-down lunch program plus showers, laundry facilities, clean clothes, and counseling; historically also offered limited transitional housing assistance (rent/utilities/furniture) for select families. Over 500,000 meals served since 1982.",
    "2400 2nd St NW, Albuquerque. (505) 246-8001. Lunch Tuesday-Friday at 12pm, Sunday at 11am — NOT open 365 days; call ahead to confirm current schedule.",
    "Anyone in need, no ID or proof of address required historically (verify current intake policy).",
    "(505) 246-8001","https://shac.unm.edu/documents/food-assistance-resource-guide.pdf","Verified","Yes","CORRECTION NOTE: an external review (the 'Whale' document, Aug 2026) gave this org's address as '202 Broadway Blvd SE' and hours as '365 days a year, 11:30am-12:30pm.' Neither matches independently verified sources (UNM SHAC's own resource guide and the Bernalillo County DA's resource guide both confirm 2400 2nd St NW, Tue-Fri lunch at 12pm + Sunday 11am). Corrected here — flagging so the inaccurate version doesn't propagate.")
add("City — APS","Clothing / School Supplies","K-12 students, Albuquerque Public Schools families",
    "APS Community Clothing Bank and School Supply Barn","Albuquerque Public Schools (McKinney-Vento Program / Foster Care liaison office)",
    "Free clothing and school supplies specifically so no student misses school due to inadequate clothing or supplies — includes coats, shoes, and basic school supply kits. Tied to APS's McKinney-Vento (homeless student) and foster care support programs.",
    "Contact via aps.edu/mckinney-vento-program-foster-care/clothing-bank for current hours/location; typically accessed via a school counselor/liaison referral.",
    "APS-enrolled K-12 students and families, with priority for students experiencing homelessness or in foster care.",
    "aps.edu","https://www.aps.edu/mckinney-vento-program-foster-care/clothing-bank","Verified","Yes","Found independently while verifying claims in the 'Whale' document (which did not itself mention this resource). Fills part of the K-12/high-schooler bucket flagged since the original roundup, and directly answers the 'clothing' need the Whale document was trying to address — just via a real, different organization than the ones it named.")


add("Federal","Housing","NM homeowners/renters, incl. senior citizens for reverse mortgages",
    "HUD Albuquerque Field Office","U.S. Dept. of Housing and Urban Development",
    "Direct federal housing office beyond Section 8 administration — connects to HUD-Approved Housing Counseling agencies (free expert advice), home repair/improvement programs (paired with Habitat for Humanity and its ReStores for discounted building materials), lead-based paint guidance, reverse mortgage assistance for seniors, and fair housing complaint intake.",
    "500 Gold Ave SW, 7th Floor, Suite 7301, Albuquerque. Mon-Thu 8am-4pm, Fri closed to public. (800) 569-4287 for a HUD-approved housing counselor.",
    "NM homeowners, renters, and homebuyers; reverse mortgage program specifically for senior citizens.",
    "(800) 569-4287","https://www.hud.gov/states/new-mexico","Verified","No","Distinct from the Albuquerque Housing Authority (which administers Section 8 locally) — this is the direct federal office, useful for fair housing complaints and free HUD-certified counseling that AHA doesn't handle.")
add("Federal","Employment / Business","Small business owners and entrepreneurs, NM",
    "U.S. Small Business Administration (SBA) — New Mexico District Office","U.S. Small Business Administration",
    "Serves all 33 NM counties: loan programs, federal contracting certification/assistance, disaster recovery loans, and free/low-cost counseling via resource partners — SCORE (free mentoring, Albuquerque/Santa Fe/Las Cruces chapters), Small Business Development Centers, and WESST (NM's Women's Business Center, offering training and micro-loans). Also runs a free self-paced online learning platform (learn.sba.gov).",
    "500 Gold Ave SW, Suite 11301, Albuquerque. (505) 248-8225. Mon-Fri 8am-4:30pm.",
    "NM entrepreneurs and small business owners, including those seeking disaster recovery loans.",
    "(505) 248-8225","https://www.sba.gov/district/new-mexico","Verified","No","WESST (the Women's Business Center referenced here) is itself worth a dedicated follow-up entry — it offers training and micro-loans specifically structured to help women and underrepresented entrepreneurs, which connects to the ITIN/self-employment pathway already logged.")
add("Federal","Employment / Education","Ages 16-24, low-income households",
    "Albuquerque Job Corps Center","U.S. Dept. of Labor (Employment & Training Administration)",
    "Free education, room and board, career training (electrical wiring, plumbing, carpentry, office administration, advanced solar installation, and 100+ other career fields), living allowance, counseling/mentoring, and help earning a high school diploma/equivalent. Can serve 327 students; open to residential and non-residential students.",
    "1500 Indian School Rd NW, Albuquerque. (505) 222-4243. Apply/enroll any time.",
    "Ages 16-24 from low-income households; a second NM location exists in Roswell.",
    "(505) 222-4243","https://www.jobcorps.gov/center/albuquerque-job-corps-center","Verified","No","This is a genuinely strong resource for the exact 'for high schoolers / young adults not yet in a 4-year track' bucket flagged since the very first message — free room, board, and career training with no cost barrier.")
add("Federal","Veterans","NM veterans, servicemembers, families, survivors",
    "VA Albuquerque Regional Benefit Office","U.S. Dept. of Veterans Affairs (Veterans Benefits Administration)",
    "Handles disability compensation, education benefits (GI Bill), life insurance, pensions, home loans, and Veteran Readiness & Employment services; also houses 7 Veterans Service Organizations on-site who provide free claims assistance (e.g., VFW Dept. of NM Service Office). Staff are also present at the Raymond G. Murphy VA Medical Center Tue-Thu 8am-3:30pm.",
    "500 Gold Ave SW, Albuquerque. National hotline (800) 827-1000, 8am-9pm ET Mon-Fri.",
    "Veterans, servicemembers, and their families/survivors in New Mexico.",
    "(800) 827-1000","https://www.va.gov/albuquerque-va-regional-benefit-office/","Verified","No","Distinct from NM's own Dept. of Veterans' Services (state-level, already logged) — this is the direct federal VA office, and its on-site Veterans Service Organizations offer free help filing/appealing claims that isn't available through the state office alone.")
add("Institution — UNM Gallup","Education","First-generation / low-income high schoolers",
    "TRIO Upward Bound at UNM Gallup","U.S. Dept. of Education (Federal TRIO Program), hosted by UNM Gallup",
    "Rigorous college-preparatory program for first-generation and/or low-income high schoolers — academic, cultural, and personal support to complete high school and successfully enroll in and complete higher education.",
    "Contact via gallup.unm.edu/trio-ub for current eligibility/application cycle.",
    "First-generation and/or low-income high school students in the Gallup area.",
    "gallup.unm.edu/trio-ub","https://www.gallup.unm.edu/trio-ub/","Verified","No","Directly closes the federal TRIO/Upward Bound gap flagged since Step 3 was scoped — this is exactly the 'for high schoolers' resource type Julio flagged in the very first message of this project. CNM also references TRIO on its services page (already logged) — worth confirming CNM's specific TRIO program name/scope as a follow-up.")
add("Federal","Disaster Relief","NM residents in federally-declared disaster areas",
    "FEMA Individual Assistance","Federal Emergency Management Agency",
    "Grants (not loans, don't have to be repaid) for temporary housing/lodging, home repair, personal property replacement, and other disaster-caused needs — available only in counties covered by an active presidential disaster declaration (recent NM declarations have covered wildfire, flooding, and severe storm damage in various counties). Does not affect eligibility for Social Security, Medicaid, SNAP, or other benefits. Often paired with SBA low-interest disaster loans for costs FEMA grants don't cover.",
    "Apply at disasterassistance.gov, call (800) 621-3362 (7am-11pm MT, most languages available), use the FEMA mobile app, or visit an in-person Disaster Recovery Center if one is open for the current declared disaster.",
    "NM homeowners/renters in a federally-declared disaster area with insurance gaps or no insurance.",
    "(800) 621-3362","https://www.fema.gov/assistance/individual","Verified","No","Time-sensitive by nature — only active for specific declared disasters in specific counties at any given time. Worth framing in the graph as 'check fema.gov/disaster for current NM declarations' rather than a static year-round resource.")


add("Institution — SFCC","Food / Financial","Santa Fe Community College students, esp. parenting students",
    "SFCC Campus Cupboard + Student Emergency Assistance Fund (SEAF)","Santa Fe Community College",
    "Campus Cupboard food pantry with a specific focus on parenting students — stocks baby food, formula, and toddler food alongside fresh proteins/produce/dairy (commercial freezer added via a $50,000 NM Higher Ed Dept. grant). SEAF provides emergency cash assistance for students facing unexpected financial hardship.",
    "Contact SFCC Student Affairs or the SFCC Foundation (foundation.sfcc.edu) for current pantry hours and SEAF application process.",
    "Currently enrolled SFCC student; Campus Cupboard has a specific parenting-student focus.",
    "sfcc.edu","https://hed.nm.gov/news/higher-education-department-dedicates-900k-to-feed-students-in-need","Verified","No","Santa Fe's other major higher-ed institution beyond UNM/IAIA — previously unmapped. The parenting-student focus pairs well with the single-parent scholarships already logged (WRC, SPA).")
add("Institution — IAIA","Food / Financial / Identity-Based","IAIA students (tribal land-grant college)",
    "IAIA Emergency Aid Program + Community Food/Clothing Pantry + Hunger-Free Campus Initiative","Institute of American Indian Arts (public tribal land-grant college, est. 1962, Santa Fe)",
    "Emergency Aid Program for financial hardship; Community Food/Clothing Pantry with main pantry plus micro-pantries around campus stocked with fresh food, frozen meals, and personal care items; classes on meal prep and SNAP application help (funded via a $50,000 NM Higher Ed Dept. grant); also Financial Literacy Program, work-study, veteran enrollment services, and the '15 to Finish' program encouraging full course loads.",
    "Contact IAIA Student Affairs; iaia.edu/student-affairs.","Currently enrolled IAIA student.",
    "iaia.edu","https://iaia.edu/student-affairs/","Verified","No","IAIA is a public tribal land-grant college — a genuinely distinct institution type not yet represented in the dataset (as opposed to UNM's Native-focused student services or First Nations Community HealthSource, both already logged). Good anchor for a 'tribal higher-ed' branch.")
add("Institution — NM Highlands","Food","NM Highlands University students, faculty, staff",
    "Highlands CAFÉ (Caring About Food Equity) + Emergency Foods/Basic Needs Pantry","New Mexico Highlands University (Las Vegas, NM)",
    "Highlands CAFÉ focuses on overcoming food-insecurity stigma and building basic-needs resources ($50,000 NM Higher Ed Dept. grant); the Emergency Food/Basic Needs Pantry (SUB Game Room) is open to students, faculty, AND staff with a valid HU ID, pre-boxed packages, up to twice a month.",
    "SUB Game Room, NMHU campus, Las Vegas NM. Bring valid HU ID.",
    "NMHU students, faculty, or staff.","See NMHU Student Affairs","https://sharenm.org/new-mexico-highlands/nmhu-emergency-foodsbasic-needs-pantry","Verified","No","")
add("Institution — NM Tech","Food","NM Tech students",
    "\"The Stacks\" Food Pantry","New Mexico Institute of Mining and Technology (Socorro, NM)",
    "Library-based food pantry (fitting name for a science/engineering-focused institution) — expanded via a $50,000 NM Higher Ed Dept. grant to add refrigeration, additional access points, no-cost student transportation to other food resources, and student pantry-staff positions.",
    "Located in the NM Tech library; contact NM Tech Student Affairs for current hours.",
    "Currently enrolled NM Tech student.","nmt.edu","https://hed.nm.gov/news/higher-education-department-dedicates-900k-to-feed-students-in-need","Verified","No","")
add("Institution — WNMU","Food","Western NM University students",
    "Mustang Garden","Western New Mexico University (Silver City, NM)",
    "Campus greenhouse growing vegetables/herbs, paired with a food security committee and expanded existing food programs — funded via a $50,000 NM Higher Ed Dept. grant.",
    "Contact WNMU Student Affairs for current garden/food program access.",
    "Currently enrolled WNMU student.","wnmu.edu","https://hed.nm.gov/news/higher-education-department-dedicates-900k-to-feed-students-in-need","Verified","No","")
add("Institution — ENMU-Roswell","Food","ENMU-Roswell students, adult education & early college HS students",
    "Cosmo's Cupboard / UFO Food Pantry","Eastern New Mexico University - Roswell",
    "Food pantry serving ~57 students/month since opening Oct. 2022; a campus basic-needs survey found 55% of students and 48% of staff/faculty experienced food insecurity in a prior 30-day period — funding (2 rounds of $50,000 NM Higher Ed Dept. grants) expanded the pantry to also serve adult education and early college high school students, plus SNAP enrollment assistance.",
    "Contact ENMU-Roswell Student Affairs (roswell.enmu.edu) for current pantry hours.",
    "ENMU-Roswell students, adult education students, and early college high school students served by the campus.",
    "roswell.enmu.edu","https://www.roswell.enmu.edu/grants/","Verified","No","The 'early college high school students' eligibility is notable — directly relevant to the high-schooler bucket flagged since the first message of this project.")
add("Institution — Diné College","Food","Diné College students, Crownpoint NM campus (Navajo Nation)",
    "Diné College Food Security Initiative","Diné College (tribal college of the Navajo Nation)",
    "Provides healthy meal kits to students with limited access to food options at the Crownpoint, NM campus — funded via a $40,000 NM Higher Ed Dept. grant.",
    "Contact Diné College Student Affairs, Crownpoint campus.","Currently enrolled Diné College student.",
    "dinecollege.edu","https://hed.nm.gov/news/higher-education-department-dedicates-900k-to-feed-students-in-need","Needs Verification","No","Diné College and Navajo Technical University (both tribal colleges of the Navajo Nation) received SPECIAL PRIORITY grants specifically because their campuses have significantly limited food access — worth a dedicated follow-up on Navajo Technical University's specific program name, not yet captured here.")
add("Institution — NMSU","Food / Clothing","NMSU students, rural Hispanic and Native American students",
    "Aggie Cupboard Food Pantry + Aggie Career Closet","New Mexico State University (Las Cruces)",
    "Aggie Cupboard food pantry (expanded via NM Higher Ed Dept. grants to include infant care and personal care items, prioritizing rural Hispanic and Native American students); separately, the well-documented 'Aggie Career Closet' provides free professional clothing for interviews/employment.",
    "Contact NMSU Student Affairs (nmsu.edu) for current pantry/closet hours.",
    "Currently enrolled NMSU student.","nmsu.edu","https://hed.nm.gov/news/new-mexico-higher-education-department-awards-100000-to-alleviate-student-hunger","Verified","No","IMPORTANT CROSS-REFERENCE: this is the real 'Aggie Career Closet' that appears to have been mistakenly attributed to UNM in the external 'Whale' review (see Verification Queue) — NMSU is a completely separate institution in Las Cruces, not Albuquerque. Logged here under its correct institution.")


add("Community","Utilities","PNM electric customers, income-qualified",
    "PNM Good Neighbor Fund + PNM CARES","Public Service Company of New Mexico (PNM), administered by The Salvation Army",
    "Emergency fund helping income-qualified customers (at/below 150% Federal Poverty Level) with PNM electric bills when at risk of disconnection, once per calendar year; PNM CARES is a sub-program offering targeted help for unique hardships like medical crises or domestic violence. Also offers Budget Billing (evens out seasonal bill swings) and payment plan extensions year-round.",
    "Log into your PNM.com account to check eligibility, or call PNM Customer Service at (833) 848-6086. Runs November-April or until funds are exhausted.",
    "Income-qualified PNM electric customers, especially seniors and other vulnerable groups; domestic violence/medical hardship cases via PNM CARES.",
    "(833) 848-6086","https://www.pnm.com/goodneighborfund","Verified","No","Distinct from LIHEAP (state-run, already logged) — this is the utility's own donor-funded emergency program, and PNM CARES specifically flags DV survivors, connecting to the Enlace Comunitario/AFAC branch already logged.")
add("Community","Utilities","NM Gas Co. customers, income-qualified",
    "HEAT New Mexico","New Mexico Gas Company, administered by The Salvation Army",
    "Payment assistance toward natural gas bills for income-qualifying families, separate from state LIHEAP. NM Gas Co. also connects customers to its own crisis-assistance line and honors NM's legal protection against gas disconnections Nov 15-March 15 for hardship customers.",
    "Call NM Gas Co. at 1-888-NM-GAS-CO (1-888-664-2726) or the Salvation Army at (505) 872-1171.",
    "Income-qualifying NM Gas Company customers.","1-888-664-2726","https://www.nmgco.com/en/assistance","Verified","No","Same Salvation Army administrative structure as PNM's Good Neighbor Fund — worth noting both utility programs route through the same nonprofit partner, so one Salvation Army contact can potentially help with both electric and gas.")
add("Community — Santa Fe / Northern NM","Financial / Banking","Low-income households, small business owners, Northern NM incl. Pueblos",
    "Guadalupe Credit Union","Not-for-profit financial cooperative, CDFI + low-income-designated credit union (est. 1948)",
    "Northern New Mexico's parallel to Rio Grande Credit Union (already logged for Albuquerque) — serves 18,600+ members through 7 branches; free financial coaching/education at every branch; small equipment loans and outreach specifically supporting Pueblo entrepreneurs (e.g. helping Taos Pueblo jewelers access traditional banking); bilingual English/Spanish services; received ~$3 million in CDFI grants to fund outreach coaches in impoverished Northern NM communities.",
    "3601 Mimbres Lane, Santa Fe, NM. guadalupecu.org; 7 branches across Northern NM.",
    "Northern New Mexicans of any faith/profession/background; low-income and underserved communities are the CDFI-designated focus.",
    "guadalupecu.org","https://www.guadalupecu.org/aboutGCU","Verified","No","Direct Santa Fe/Northern NM parallel to Rio Grande Credit Union already logged in the Albuquerque ITIN/banking branch — together these two credit unions cover both major metro regions of the state for no-SSN-required or underserved banking access.")
add("Community — Santa Fe","Financial / Grants","NM nonprofits serving homeless, hungry, children, families",
    "Thornburg Foundation","Family foundation (founded by Thornburg Investment Management's Garrett Thornburg), Santa Fe-based",
    "Major private funder for NM nonprofits — gives roughly $1.5 million/year across ~40 organizations, focused on homelessness prevention (funded the Santa Fe Housing Initiative), food security (funded The Food Depot, already logged), community clinics (funded La Familia Medical Center), and good-government/civic engagement initiatives. Does NOT accept unsolicited proposals from individuals — this is a funder for organizations, not a direct-to-individual resource.",
    "N/A for individuals — relevant to Jazmin/Will as a funder to know about when researching which NM nonprofits have institutional backing. thornburgfoundation.org.",
    "New Mexico-based 501(c)(3) nonprofit organizations, with emphasis on Greater Santa Fe.",
    "thornburgfoundation.org","https://www.insidephilanthropy.com/find-a-grant-places/new-mexico-grants/thornburg-foundation","Verified","No","IMPORTANT: this is NOT a direct-to-individual resource — it's a foundation that funds other organizations already in this dataset (The Food Depot, La Familia Medical Center). Logged for context/credibility-checking purposes rather than as something a person in need would apply to directly.")
add("Tribal — Navajo Nation","Financial","Enrolled Navajo Nation members in NM/AZ/UT",
    "Navajo Nation General Assistance / Department for Self-Reliance (DSR)","Navajo Nation Division of Social Services",
    "Federally-funded General Assistance program (via DSR, the Navajo Nation's own Tribal TANF program) providing temporary financial support for rent, utilities, and food, plus case management with an Individual Self-Sufficiency Plan. Covers Navajo Nation trust/fee lands and satellite communities (Alamo, To'Hajiilee, Ramah) plus nine 'Near Reservation' designated cities in NM.",
    "Contact a local Navajo Nation Department of Family Services Field Office; nndss.org for the nearest DSS office.",
    "Enrolled Navajo Nation members with a Navajo Census Number living in NM, AZ, or UT (referred elsewhere for other states).",
    "nndss.org","https://nndss.org/general-assistance/","Verified","No","This is the tribal-direct parallel to state TANF/General Assistance already logged — administered entirely by the Navajo Nation itself rather than NM state government, important distinction for the graph's tribal-sovereignty framing.")
add("Tribal — 8 Northern Pueblos","Multi-Service","Members of the 8 Northern Pueblos (Nambe, Picuris, Pojoaque, San Ildefonso, Ohkay Owingeh, Santa Clara, Taos, Tesuque)",
    "Eight Northern Indian Pueblos Council, Inc. (ENIPC)","Tribal consortium organization",
    "Broad economic, educational, and social service programs serving the 8 Northern Pueblos of New Mexico directly — a tribal-direct multi-service hub distinct from urban Indian organizations like First Nations Community HealthSource (already logged).",
    "Contact ENIPC directly; also listed in the NM Native American Resource Directory (isletapueblo.com).",
    "Members of Nambe, Picuris, Pojoaque, San Ildefonso, Ohkay Owingeh, Santa Clara, Taos, or Tesuque Pueblos.",
    "See NM Native American Resource Directory","https://www.isletapueblo.com/wp-content/uploads/2026/07/WIC-NMNAResourceDirectory-072026.pdf","Verified","No","Genuinely closes the 'tribal-direct, run by the Pueblos themselves' gap flagged since Step 6 was scoped — this and the Five Sandoval Indian Pueblos entry below cover 13 of NM's 19 Pueblos directly.")
add("Tribal — 5 Sandoval Pueblos","Behavioral Health","Members of Cochiti, Jemez, Sandia, Santa Ana, Zia Pueblos + surrounding Sandoval County communities",
    "Five Sandoval Indian Pueblos, Inc. (FSIP) — Behavioral Health Services","Tribal consortium organization",
    "Coordinates and provides behavioral health services for tribal members of the 5 Sandoval Pueblos and surrounding communities in Sandoval County.",
    "Contact FSIP directly; also listed in the NM Native American Resource Directory.",
    "Members of Cochiti, Jemez, Sandia, Santa Ana, or Zia Pueblos, or surrounding Sandoval County community members.",
    "See NM Native American Resource Directory","https://www.isletapueblo.com/wp-content/uploads/2026/07/WIC-NMNAResourceDirectory-072026.pdf","Verified","No","Pairs with ENIPC above — together these two consortiums cover 13 of NM's 19 Pueblos with tribal-direct services, distinct from state or urban Indian programs already logged.")


add("Community","Healthcare","Uninsured/underinsured patients, any immigration status",
    "UNM Care and Out of County Care","UNM Health System (UNM Hospital + UNM Medical Group)",
    "Financial assistance covering hospital and physician bills for uninsured patients, and helping those with Medicare/private insurance who still have balances due. Approved coverage can be applied retroactively up to 6 months. Uninsured NM residents who don't qualify for full assistance still get an automatic 45% self-pay discount off hospital and physician charges.",
    "Call (505) 272-2521 to make an appointment with a patient financial services representative; the Financial Assistance team helps complete the application in person.",
    "Immigration status does NOT matter and proof of status is NOT required — this is explicit UNM Health policy. NM/Bernalillo County residency required.",
    "(505) 272-2521","https://unmhealth.org/patients-visitors/billing-insurance/patient-financial-assistance.html","Verified","Yes","MAJOR FIND for the ITIN/immigrant branch: UNM Health explicitly states immigration status doesn't matter and proof isn't required for this program — a genuinely rare, clearly-stated policy that removes a common fear barrier to seeking care. Cross-reference directly with the Emergency Medicaid/BeWell entries already logged, since this offers broader access than either.")
add("Community","Healthcare","Uninsured/underinsured patients",
    "Presbyterian Healthcare Services — Financial Assistance","Presbyterian Healthcare Services",
    "Federal law (501(r)) requires nonprofit hospitals to offer financial assistance; Presbyterian will always provide emergency medical care regardless of ability to pay and will not use debt-collection tactics that discourage emergency care. Eligibility is based on Federal Poverty Guidelines, updated annually.",
    "Contact Presbyterian billing/financial counselors; phs.org/doctors-services/covering-your-care for the application.",
    "NM residents facing medical bills, particularly uninsured/underinsured patients; exact income thresholds vary by household size per FPG.",
    "phs.org","https://www.phs.org/doctors-services/covering-your-care","Verified","No","Part of a 3-way hospital-system landscape in Albuquerque alongside UNM Health (already logged) and Lovelace — general guidance: NM hospitals typically give free care below 200% FPL and discounts up to 400% FPL, though exact thresholds vary by hospital.")
add("Community","Healthcare","Uninsured/low-income patients, sliding scale",
    "First Choice Community Healthcare","Federally Qualified Health Center (FQHC), nonprofit",
    "Multiple Albuquerque/Santa Fe locations offering primary care, dental, behavioral health, women's health, substance use treatment, pharmacy, lab, and school-based teen clinics — all on a sliding fee scale based on income/family size; accepts Medicaid, Medicare, and UNM Care. Free eligibility specialists help with Medicaid applications/renewals regardless of whether you become a patient.",
    "2001 Centro Familiar SW, Albuquerque (admin) plus multiple satellite clinics. (505) 873-7400. fcch.com/locations-hours for the nearest site.",
    "Anyone regardless of income or insurance status — sliding scale means it may not be fully free, but no one is turned away for inability to pay.",
    "(505) 873-7400","https://www.fcch.com/","Verified","No","Direct parallel to First Nations Community HealthSource already logged (also an FQHC) — together these give Albuquerque genuinely broad no-insurance-required primary care coverage across different communities.")
add("Community","Legal & Civic","Low-income NM residents, statewide",
    "New Mexico Legal Aid","Nonprofit civil legal aid organization",
    "Free civil legal services across four core areas — Family Law, Housing, Consumer Rights, Economic Security — plus special advocacy projects for veterans, Native Americans, migrant farmworkers, low-income taxpayers disputing the IRS, and acequia water-rights defense. Includes a Senior Law Program open to seniors regardless of income, a Volunteer Attorney Program for legal fairs/clinics, and separate helplines for LGBTQ and domestic violence/sexual assault victims.",
    "Statewide intake: (833) 545-4357 (833-LGL-HELP). newmexicolegalaid.org.",
    "Primarily low-income NM residents; Senior Law Program is open to seniors regardless of income.",
    "(833) 545-4357","https://newmexicolegalaid.org/","Verified","No","This is the general-purpose legal aid gap flagged since Step 5 was scoped — distinct from the immigration-specific NMILC and UNM Law Clinic already logged. Genuinely broad scope (housing, family law, consumer, benefits) makes this a strong hub-level entry.")
add("Community","Senior & Disability","People with developmental/mental disabilities or mental illness, statewide",
    "Disability Rights New Mexico (Protection & Advocacy, Inc.)","Federally-mandated Protection & Advocacy nonprofit",
    "Protects and advocates for the legal rights of people with developmental or mental disabilities and mental illness; investigates abuse/neglect reports in facilities that care for or treat people with mental illness; provides information, referral, client advocacy, group advocacy, and legal rights training.",
    "1720 Louisiana Blvd NE Suite 204, Albuquerque. info@drnm.org, (505) 256-3100. Help line: (800) 432-4682.",
    "People with developmental or mental disabilities or mental illness in NM.",
    "(800) 432-4682","https://libguides.law.unm.edu/c.php?g=244026&p=1625798","Verified","No","")
add("Community","Senior & Disability","Native Americans with disabilities, Four Corners region",
    "Native American Disability Law Center","Private nonprofit law firm",
    "Free legal advocacy and education specifically for Native Americans with disabilities in the Four Corners region, empowering people to lead independent lives in their own communities.",
    "Farmington office: 3535 E. 30th St, (505) 566-5880. Gallup office: 2318 Boyd Ave, (505) 863-7455.",
    "Native Americans with disabilities in the Four Corners region (NM/AZ/UT/CO border area).",
    "(505) 566-5880","https://www.legalaidoffices.com/state/new_mexico","Verified","No","Closes a specific intersectional gap — disability rights + Native community, geographically focused on the Four Corners area distinct from Albuquerque-centric resources.")
add("University (UNM)","Healthcare","Anyone needing emotional support, not just students",
    "Agora Crisis Center","UNM student organization (est. decades ago, entirely student-run)",
    "Free, confidential listening/referral hotline staffed by 125+ trained volunteers (40 hours of training each); callers do not need to be 'in crisis' to call. Also runs free Suicide Awareness and Intervention Lessons (SAILs) for classrooms, workplaces, and other nonprofits. Many volunteers go on to careers in healthcare/counseling/social work.",
    "Hotline: (505) 277-3013 or 1-866-HELP-1-NM. Anyone is welcome to call — not limited to UNM students.",
    "Open to anyone in the community needing to talk, not just UNM students.",
    "(505) 277-3013","https://impactunm.unmfund.org/s/1959/22/interior.aspx?sid=1959&gid=2&pgid=775","Verified","Yes","This is exactly the kind of hidden-resource Julio flagged early in the project — a genuinely under-known, entirely student-run crisis line open to the whole community, not gatekept to enrolled students.")
add("Community","Healthcare","Survivors of sexual assault/abuse, Bernalillo/Sandoval/Torrance/Valencia counties",
    "Rape Crisis Center of Central New Mexico","Nonprofit",
    "All services completely free: 24-hour crisis hotline, advocacy, counseling, and community education/outreach for child and adult survivors of sexual assault/abuse and their loved ones.",
    "24-Hour Hotline: (505) 266-7711 or 1-888-811-8282 (se habla español). rapecrisiscnm.org; live chat also available.",
    "Survivors of sexual assault/abuse and their loved ones in Bernalillo, Sandoval, Torrance, and Valencia counties.",
    "(505) 266-7711","https://rapecrisiscnm.org/","Verified","No","")
add("State (NM)","Healthcare","Anyone experiencing mental health/substance use crisis, statewide",
    "New Mexico Crisis and Access Line","State of New Mexico",
    "24/7 statewide hotline plus a Peer-to-Peer Warmline for anyone experiencing an emotional crisis, mental health concern, or substance use concern — broader in scope than Agora (which is Albuquerque/UNM-based) since it covers the whole state.",
    "24-hour hotline: 1-855-NMCRISIS (1-855-662-7474).",
    "Any New Mexico resident.","1-855-662-7474","https://hsc.unm.edu/medicine/about/well-being/wellness-mental-health-resources/for-those-in-crisis.html","Verified","No","Statewide complement to Agora Crisis Center (Albuquerque/UNM-specific) — worth presenting together as 'local vs. statewide' options in the graph's crisis-resource branch.")
add("Community","Identity & Cultural","Transgender and gender-diverse NM residents",
    "Transgender Resource Center of New Mexico (TGRCNM)","Nonprofit",
    "Support and resources specifically for the transgender and gender-diverse community in NM, referenced alongside UNM's LGBTQ Resource Center (already logged) but operating independently in the broader community.",
    "tgrcnm.org for current programs/contact info.","Transgender and gender-diverse individuals in NM.",
    "tgrcnm.org","http://www.agoracares.org/resources.html","Needs Verification","No","Found via Agora's own resource list — worth a dedicated follow-up search to confirm current programs/services, since this entry is sourced from a secondary reference rather than the org's own site directly.")


add("City","Transportation","People with disabilities, Albuquerque/most of Bernalillo County",
    "ABQ RIDE Sun Van (Paratransit)","City of Albuquerque",
    "Origin-to-destination accessible transportation for people whose disability makes it impossible to use fixed-route buses; door-to-door service available on request; 84 paratransit vans in the fleet.",
    "100 First St SW, Albuquerque. (505) 243-7433. Reservations required at least one day ahead.",
    "Residents of or visitors to the Albuquerque metro area with a qualifying disability.",
    "(505) 243-7433","https://arcnm.org/financial-basic-needs-assistance-transportation/","Verified","No","")
add("City","Transportation","General public, Albuquerque",
    "ABQ RIDE (Fixed Route + ART + Connect Microtransit)","City of Albuquerque",
    "The state's largest public transit system — 40 routes including 2 Albuquerque Rapid Transit (ART) bus-rapid-transit lines, plus ABQ RIDE Connect microtransit vans; over 7.7 million rides in 2025.",
    "cabq.gov/transit for routes/schedules/fares.","General public in Albuquerque/Bernalillo County.",
    "cabq.gov/transit","https://en.wikipedia.org/wiki/ABQ_RIDE","Verified","No","")
add("State (NM)","Transportation","Commuters between Belen, Los Lunas, Albuquerque, Bernalillo, Santa Fe",
    "New Mexico Rail Runner Express","NM Dept. of Transportation / Rio Metro Regional Transit District",
    "Commuter rail connecting Belen/Los Lunas through Albuquerque to Bernalillo and Santa Fe; fares were reduced in 2022, roughly doubling ridership. Connects at the Alvarado Transportation Center to ABQ RIDE, Amtrak, and Greyhound.",
    "nmrailrunner.com for schedules/fares.","General public traveling the Belen-Santa Fe corridor.",
    "nmrailrunner.com","https://www.cabq.gov/transit/rider-resources/modes-of-transportation/riding-the-rail-runner/riding-the-rail-runner","Verified","No","Direct rail connection ties together several already-logged branch-campus/geographic regions (Los Lunas/Valencia, Santa Fe, Albuquerque) — worth noting in the graph as the physical link between those geographic nodes.")
add("Community — Los Lunas / Valencia","Transportation","Valencia County residents, incl. seniors/disabled",
    "Valencia County Dial-a-Ride","Rio Metro Regional Transit District",
    "Weekday dial-a-ride service connecting Belen, Bosque Farms, Los Chavez, Los Lunas, Peralta, Rio Communities, and Tomé to the Rail Runner Express station.",
    "101 Courthouse Rd SE, Los Lunas. (866) 795-7245.",
    "General public in Valencia County, including seniors and people with disabilities.",
    "(866) 795-7245","https://www.riometro.org/244/Valencia-County","Verified","No","")
add("Community","Healthcare","Lovelace patients, low/no income",
    "Lovelace Health System — Financial Assistance","Lovelace Health System (Ardent Health Services)",
    "Federally-required charity care/financial assistance for Lovelace's 6 Albuquerque-area hospitals plus its Roswell location; provided $14M+ in unfunded care in 2024. Nonprofit-hospital financial-assistance averages suggest income under ~204% FPL often qualifies for free care, under ~322% FPL for a discount (exact thresholds vary — confirm directly).",
    "Call Patient Financial Services at (505) 727-0100 or (888) 568-3522, Mon-Fri 8am-5pm.",
    "Uninsured/underinsured Lovelace patients meeting income guidelines.",
    "(505) 727-0100","https://dollarfor.org/medical-debt-help-albuquerque-lovelace-westside-hospital/","Verified","No","Completes the 3-way Albuquerque hospital-system coverage alongside UNM Care and Presbyterian Financial Assistance, both already logged.")
add("Community — Santa Fe","Healthcare","Santa Fe County residents, sliding scale",
    "La Familia Medical Center","Nonprofit FQHC, grew from a volunteer-staffed free clinic",
    "4 locations serving 15,254+ individuals annually (1 in 10 Santa Fe County residents is a patient) — medical, dental, behavioral health, teen clinic, diabetes management, reproductive/prenatal health, all on a sliding scale by family size/income; helps enroll patients in Medicaid or BeWellNM; explicitly serves immigrants/refugees among its listed special-needs populations.",
    "1035 Alto St, Santa Fe. (505) 982-4425. Southside Clinic: (505) 438-3195, extended Tuesday hours to 7pm.",
    "Santa Fe County residents, regardless of income or ability to pay.",
    "(505) 982-4425","https://lafamiliasf.org/","Verified","No","Santa Fe's parallel to First Choice Community Healthcare (Albuquerque) already logged — explicitly lists immigrants/refugees as a served population, a good cross-link to the ITIN/immigrant branch.")
add("Community — Santa Fe","Healthcare","Northern NM residents, Level III trauma",
    "Christus St. Vincent Regional Medical Center","Catholic hospital network (Christus Health), est. 1865",
    "Santa Fe's major hospital and the oldest in NM — Level III trauma center, 30+ locations including urgent care, family medicine, cancer care, and women's specialty clinics; subject to the same federal 501(r) charity-care requirements as other NM nonprofit hospitals.",
    "Contact St. Vincent's billing department directly to request a financial assistance application.",
    "Northern NM patients, particularly uninsured/underinsured.",
    "christushealth.org/st-vincent","https://en.wikipedia.org/wiki/CHRISTUS_St._Vincent_Regional_Medical_Center","Needs Verification","No","Found while researching Lovelace/La Familia — didn't independently confirm St. Vincent's specific financial assistance application process, only that federal law requires nonprofit hospitals to offer one. Worth a direct follow-up call before treating as a confirmed resource.")
add("Federal","Financial","People with disabilities or 65+, any income eligible for SSI/SSDI",
    "Social Security Administration — NM Field Offices","U.S. Social Security Administration",
    "In-person help applying for SSDI/SSI, checking disability claim status, requesting benefit verification letters, and appealing denied applications. NM field offices in Albuquerque, Santa Fe, Rio Rancho, Las Cruces, Las Vegas NM, Clovis, Farmington, Gallup, and Hobbs.",
    "Albuquerque: 500 Lead Ave SW Ste 100, (866) 613-9961. Rio Rancho: 4433 Jager Dr NE, (866) 530-7783. National line: (800) 772-1213.",
    "Anyone applying for or managing SSI/SSDI/retirement benefits.",
    "(800) 772-1213","https://disabilityguidance.org/social-security-office-locator/new-mexico-social-security-offices/","Verified","No","Closes the last open Step 3 federal-agency thread — note the Rio Rancho office means Sandoval County residents don't have to travel to Albuquerque for SSA matters either, same pattern as the HCA field offices already logged.")
add("State (NM)","Education","K-12 students experiencing homelessness, statewide",
    "NM McKinney-Vento Homeless Education Program","NM Public Education Dept. + local school district liaisons (federal McKinney-Vento Act)",
    "Guarantees homeless K-12 students immediate enrollment (even without normally-required documents), the right to stay in their original school despite housing instability, and free transportation; every NM school district has a designated McKinney-Vento liaison. Backed by a 2025 state allocation including $7.8 million specifically for McKinney-Vento-supported family homelessness projects.",
    "Contact your school's front office or district office for the McKinney-Vento liaison; APS's Clothing Bank (already logged) is administered through this same program.",
    "K-12 students in NM public schools experiencing homelessness (incl. doubled-up housing, motels, shelters).",
    "Contact local district liaison","https://www.governor.state.nm.us/2025/08/19/governor-announces-120-million-for-housing-and-homelessness/","Verified","No","Closes the K-12/Public Education Dept gap flagged since Step 2 — directly connects to the APS Community Clothing Bank already logged, which operates through this exact program.")
add("Community","Financial / Grants","BIPOC-led nonprofits, Bernalillo/Sandoval/Torrance/Valencia/Santa Fe counties",
    "W.K. Kellogg Foundation NM — Small Orgs, Big Impact Fund","W.K. Kellogg Foundation, via Albuquerque Community Foundation + United Way of Central NM",
    "$2 million grant (2023) funding grassroots, BIPOC-led small nonprofits across central NM's 5 counties; WKKF also partners directly with NM's 23 sovereign Pueblos, Tribes, and Nations on early-childhood, food-systems, and racial-equity initiatives statewide (e.g. a $1.2M+ grant funding LANL Foundation's Pueblo Outreach Project across the 8 Northern Pueblos).",
    "N/A for individuals — this is a funder of organizations, similar to Thornburg Foundation already logged. Relevant to Jazmin/Will for institutional context on which local orgs have WKKF backing.",
    "Small BIPOC-led nonprofits in central NM; Pueblo/Tribal partner organizations statewide.",
    "wkkf.org/i/new-mexico","https://uwncnm.org/dei-united-grants/","Verified","No","Closes the W.K. Kellogg follow-up flagged in Step 6 — like Thornburg, this funds organizations rather than individuals directly, logged for institutional-context purposes.")
add("Tribal — Pueblo of Isleta","Healthcare","Pueblo of Isleta members and surrounding community",
    "Pueblo of Isleta Health Center","Pueblo of Isleta (via Indian Health Service funding)",
    "Tribally-operated health center receiving a $3.65 million IHS Small Ambulatory Program grant to expand facilities (outpatient, emergency, pharmacy) plus a separate $2.25 million grant supporting Head Start and Early Head Start programs.",
    "Contact Pueblo of Isleta Health Center directly for current services/hours.",
    "Pueblo of Isleta members and surrounding community members as capacity allows.",
    "See Pueblo of Isleta official channels","https://vasquez.house.gov/media/press-releases/vasquez-secures-365-million-grant-improve-health-care-pueblo-isleta","Verified","No","Closes one of the 6 individually-uncovered Pueblos flagged in Step 6 (Isleta) — still open: Acoma, Laguna, San Felipe, Santo Domingo/Kewa, Zuni. Jemez IS covered via Five Sandoval Indian Pueblos already logged.")


add("Community","Housing / Homeownership","First-time and repeat homebuyers, low-to-moderate income",
    "Homewise","Nonprofit CDFI (Homewise, Inc.)",
    "Full-spectrum homeownership support: low down-payment mortgages (as low as 2%) with no PMI, down payment assistance, credit-building, ITIN loans (see separate entry), and free homebuyer education classes. Includes the Credit Building Savings Program: JPMorgan Chase deposits $1,000 into escrow, matched by $83.33/mo saved over a year.",
    "Call the Albuquerque office 505-243-6566, 5041 Indian School Rd NE Ste 100. Meet with a Home Purchase Advisor for a Buyer Ready Certificate.",
    "Any prospective homebuyer; income/credit requirements vary by specific loan product.",
    "505-243-6566","https://www.homewise.org","Verified","No","Restoring this as its own row — it existed in the project's earliest draft but was never carried into the Master Dataset spreadsheet, even though a later row ('Homewise ITIN Mortgage Loans') referenced it as already logged. Fixed via the Verification Queue process.")

add("Community","Food","Anyone in need, statewide via 200+ partner agencies",
    "Roadrunner Food Bank","NM's largest food bank",
    "Distributes food statewide and runs a 'Food Finder' tool listing nearby pantries by zip code; also helps with SNAP applications and offers a free prescription discount card (BuzzRx) open to anyone regardless of income or insurance status.",
    "rrfb.org — use the Food Finder or Apply-for-SNAP page.",
    "Anyone in need statewide.","rrfb.org","https://www.rrfb.org","Verified","No","RESTORED ENTRY: this was described in the project's very first turn but never carried into the Master Dataset spreadsheet when the project moved from a standalone HTML draft to the xlsx-based workflow. Caught during a geocoding sweep that turned up zero results and prompted a full audit — see chat for the full list of similarly-restored entries.")
add("Community","Shelter / Housing","Adults experiencing homelessness, primarily men",
    "Good Shepherd Center","Community nonprofit",
    "Shelter and support services primarily for men, plus a dedicated housing advocate on staff working toward permanent housing placement.",
    "218 Iron Ave SW, Albuquerque · 505-243-2527. Housing Advocate: Nate Jennings ext. 209.",
    "Adults experiencing homelessness in Albuquerque, primarily men.",
    "505-243-2527","https://www.groundworksnm.org/nonprofit-directory/nonprofit/1301","Verified","No","RESTORED ENTRY — see Roadrunner Food Bank note above.")
add("Community","Shelter / Housing","Men, women, and families experiencing homelessness",
    "Joy Junction","Nonprofit shelter",
    "Emergency shelter serving men, women, and families; can arrange transportation for those without a way to reach the shelter.",
    "4500 2nd St SW · 505-877-6967. Ride line: 800-924-0569.",
    "Men, women, and families experiencing homelessness in the Albuquerque area.",
    "505-877-6967","https://www.joyjunction.org","Verified","No","RESTORED ENTRY — see Roadrunner Food Bank note above.")
add("Community","Shelter / Housing","Women experiencing homelessness",
    "Barrett House / ABQ Rescue Mission Women's Center of Hope","Nonprofit (women's shelter)",
    "Shelter specifically for women, part of the Albuquerque Rescue Mission's network of services.",
    "Barrett House 505-243-4887; Women's Center of Hope 505-243-3310.",
    "Women experiencing homelessness in Albuquerque.",
    "505-243-4887","https://www.abqrescue.org","Verified","No","RESTORED ENTRY — see Roadrunner Food Bank note above.")
add("Community","Shelter / Housing","Families with children experiencing homelessness",
    "Family Promise of Albuquerque","Nonprofit (families only)",
    "Shelter and support specifically for families with children experiencing homelessness, keeping family units housed together rather than split across shelters.",
    "505-268-0331.","Families with children experiencing homelessness.",
    "505-268-0331","https://www.familypromiseabq.org","Verified","No","RESTORED ENTRY — see Roadrunner Food Bank note above.")
add("Community","Shelter / Housing","Anyone experiencing homelessness needing shelter or rental assistance",
    "Catholic Charities Emergency Shelter","Catholic Charities",
    "Emergency shelter plus Rapid Re-Housing and rental assistance programs designed to transition people from emergency shelter into permanent housing.",
    "General: 505-724-4670. Emergency shelter line: 505-768-4357 or 505-768-2000.",
    "Anyone experiencing homelessness in the Albuquerque area.",
    "505-724-4670","https://www.ccasfnm.org","Verified","No","RESTORED ENTRY — see Roadrunner Food Bank note above.")
add("Community","Shelter / Housing","Adults transitioning out of homelessness",
    "Saranam","Nonprofit",
    "Transitional housing and support services for individuals and families working toward permanent, stable housing.",
    "1028 Eubank NE, Suite F · 505-299-6154.",
    "Adults and families transitioning out of homelessness.",
    "505-299-6154","https://www.saranam.org","Verified","No","RESTORED ENTRY — see Roadrunner Food Bank note above.")
add("Community — Rio Rancho","Shelter / Housing","Anyone needing shelter, Rio Rancho area",
    "Haven House (Rio Rancho)","Nonprofit",
    "Shelter open to all genders, ages, and family situations — one of the few shelters in the Rio Rancho/Sandoval County area rather than Albuquerque proper.",
    "505-896-4869. Emergency hotline 1-800-526-7157.",
    "Anyone needing shelter in the Rio Rancho area, regardless of gender, age, or family situation.",
    "1-800-526-7157","https://www.havenhousenm.org","Verified","No","RESTORED ENTRY — see Roadrunner Food Bank note above.")
add("Community","Food","Anyone in need, Albuquerque",
    "Salvation Army Food Pantry","The Salvation Army Albuquerque",
    "Food pantry plus emergency clothing and discounted 31-day bus passes.",
    "4301 Bryn Mawr Dr NE · 505-872-1171. Mon–Fri 9–11:30am & 1:30–3pm (closed for lunch).",
    "Anyone in need, Albuquerque area.","505-872-1171","https://www.salvationarmynm.org","Verified","No","RESTORED ENTRY — see Roadrunner Food Bank note above.")
add("Community","Food","Anyone in need, via local bishop referral",
    "LDS Bishops' Storehouse / Home Storage Center","The Church of Jesus Christ of Latter-day Saints",
    "Provides food and household essentials to anyone in need — not limited to church members — via a referral from a local bishop.",
    "Contact a local bishop or ward to request a referral; find the nearest storehouse at providentliving.churchofjesuschrist.org.",
    "Anyone in need with a bishop referral; not limited to church members.",
    "providentliving.churchofjesuschrist.org","https://providentliving.churchofjesuschrist.org","Verified","No","RESTORED ENTRY — see Roadrunner Food Bank note above.")

add("Community","Shelter / Housing","Anyone needing shelter placement, Albuquerque",
    "Albuquerque Heading Home","City-coordinated shelter placement program",
    "Central point for shelter placement in Albuquerque, including intake for the Westside Emergency Housing Center.",
    "Housing line 505-344-2323 (press 2); Westside shelter press 8.",
    "Anyone needing shelter placement in Albuquerque.",
    "505-344-2323","https://www.cabq.gov/family/services/heading-home","Verified","No","RESTORED ENTRY: part of the second missing-data audit — see Roadrunner Food Bank restoration note for context on why these entries were absent.")
add("Community","Housing / Homeownership","Qualifying first-time homebuyers",
    "HomeLIFT-style down payment grants","Local bank/nonprofit partnerships (funding availability varies by cycle)",
    "Historically offered $15,000 grants toward down payments for qualifying buyers, paired with required financial-habit classes. Funding cycles are NOT continuous — availability varies year to year.",
    "Ask a Homewise advisor which current down-payment grant programs are active, since this specific program comes and goes with funding cycles.",
    "Qualifying first-time homebuyers; exact criteria depend on which cycle is currently funded.",
    "505-243-6566 (Homewise)","N/A — ask Homewise directly for current status","Needs Verification","No","RESTORED ENTRY. Explicitly uncertain by nature — this was hedged as 'historically offered' even in the original description, since these grant programs run in funding cycles rather than continuously. Do not present as guaranteed available.")
add("Community","Healthcare","Uninsured/underinsured, free or sliding-scale",
    "Free/Income-Based Clinic Directories","Various (via directory aggregators)",
    "Online directories listing Albuquerque-area clinics offering free, sliding-scale, or income-based care.",
    "See 'Benefits Explorer' (benefitsexplorer.com/free-clinics/new-mexico/albuquerque) or similar free clinic directories.",
    "Uninsured or underinsured NM residents.","benefitsexplorer.com","https://www.benefitsexplorer.com/free-clinics/new-mexico/albuquerque","Needs Verification","No","RESTORED ENTRY. This points to a directory aggregator rather than a single organization — worth a follow-up to confirm the aggregator itself is still active/accurate, since directory sites can go stale.")
add("Community","Healthcare","Anyone, regardless of income or insurance status",
    "Roadrunner Food Bank Prescription Discount Card","Roadrunner Food Bank + BuzzRx",
    "Free prescription discount card, open to anyone regardless of income or insurance status — can cut prescription costs significantly at participating pharmacies.",
    "Download online or pick up in person at Roadrunner Food Bank.",
    "Open to anyone, regardless of income or insurance status.",
    "rrfb.org","https://www.rrfb.org","Verified","Yes","RESTORED ENTRY. Distinct from the main Roadrunner Food Bank entry (also restored) — this is specifically their Rx discount card program, a good candidate for a curated relationship link back to the parent Roadrunner Food Bank entry.")
add("Community","Healthcare","Individuals, couples, and families, incl. non-members via bishop referral",
    "LDS Family Services","The Church of Jesus Christ of Latter-day Saints",
    "Short-term professional counseling for individuals, couples, and families (open to non-members with bishop referral), plus crisis emotional support.",
    "4400 Presidential Dr NE, Suite C, Albuquerque. Contact a local bishop for authorization.",
    "Open to non-members with a bishop referral, not limited to church members.",
    "4400 Presidential Dr NE Suite C","https://providentliving.churchofjesuschrist.org","Verified","No","RESTORED ENTRY — distinct from LDS Bishops' Storehouse (also restored), this is the counseling/family-services program specifically.")
add("Community","Financial","Anyone facing bill-related hardship, Albuquerque",
    "Salvation Army Bill Pay Assistance","The Salvation Army Albuquerque",
    "Utility, rent, and other emergency bill assistance to prevent eviction or utility shutoff.",
    "4301 Bryn Mawr Dr NE · 505-872-1171.",
    "Anyone facing bill-related financial hardship in Albuquerque.",
    "505-872-1171","https://www.salvationarmynm.org","Verified","No","RESTORED ENTRY — same Salvation Army location as the restored Food Pantry entry, worth a curated link between the two.")
add("Community","Financial","NM residents needing free tax preparation",
    "AARP Tax-Aide","AARP",
    "Free income tax preparation assistance.",
    "aarp.org/money/taxes/aarp-taxaide/locations to find a nearby site.",
    "Open to anyone needing tax prep help, not limited to AARP members.",
    "aarp.org","https://www.aarp.org/money/taxes/aarp-taxaide/","Verified","No","RESTORED ENTRY.")
add("Community","Utilities","Low-income households, connectivity",
    "EveryoneOn","National nonprofit",
    "Connects households to local affordable internet, computer, and digital-skills programs by zip code.",
    "everyoneon.org — enter zip code for local offers.",
    "Low-income households seeking affordable internet/device access.",
    "everyoneon.org","https://www.everyoneon.org","Verified","No","RESTORED ENTRY.")
add("University (UNM)","Legal & Civic","Any UNM student or community member",
    "LoboRESPECT Advocacy Center","University of New Mexico",
    "Maintains a curated master list of community resources — legal aid, domestic violence support, veterans resources, substance use help, and more — functioning as a hub linking out to dozens of other resources.",
    "loborespect.unm.edu/support/resource-guide1/ for the current resource guide.",
    "Any UNM student, and the broader community for many linked resources.",
    "loborespect.unm.edu","https://loborespect.unm.edu/support/resource-guide1/","Verified","No","RESTORED ENTRY. This was actually the ORIGINAL source hub that much of this project's earliest research was built from — worth a prominent curated-relationship role given how many restored entries in this pass trace back to it.")
add("Community","Youth & Family","Families experiencing homelessness with young children",
    "Cuidando Los Niños","Nonprofit",
    "Early childhood education, therapeutic services, and supportive housing for families experiencing homelessness.",
    "505-843-6899, Mon-Fri 9am-3pm.",
    "Families with young children experiencing homelessness.",
    "505-843-6899","https://www.cuidandolosninos.org","Verified","No","RESTORED ENTRY.")
add("State (NM)","Youth & Family","Working/schooling families at or below 400% FPL",
    "NM Child Care Assistance Program","NM Early Childhood Education & Care Dept.",
    "Subsidizes childcare costs for families at or below 400% of federal poverty level who are working, in school, or job-searching.",
    "Call or visit a Child Care Services Bureau field office; apply via nmececd.org.",
    "Families at or below 400% FPL who are working, in school, or job-searching.",
    "nmececd.org","https://www.nmececd.org","Verified","No","RESTORED ENTRY — this closes a real, previously-flagged gap: 'formal Child Care Assistance row' was noted as missing in at least two earlier progress reports and never actually added until now.")
add("Federal","Utilities","Low-income households — HISTORICAL/DISCONTINUED","Affordable Connectivity Program (ACP) — DISCONTINUED",
    "Federal Communications Commission (FCC)","Formerly provided discounted internet for low-income households; the program ran out of congressionally-appropriated funding and officially ended in April 2024.",
    "N/A — program is no longer accepting enrollments or providing benefits.",
    "N/A — discontinued.","N/A","https://www.fcc.gov/acp","Needs Verification","No","RESTORED FOR HISTORICAL ACCURACY, NOT AS A LIVE RESOURCE: this program was described in the project's earliest research but actually ran out of funding and was discontinued by the FCC in April 2024. Logged here explicitly as discontinued so nobody mistakenly directs a person to a program that no longer exists — do NOT present as active. Lifeline (already logged separately) is a different, still-active program and should not be confused with this one.")

add("Community","Utilities","Renters and homeowners, PNM/El Paso Electric/Xcel Energy customers",
    "Prosperity Works Community Solar Program","Prosperity Works, in partnership with Solstice",
    "Free enrollment in a shared solar farm — no rooftop panels or equipment needed. Once enrolled, subscribers receive monthly solar credits on their electric bill, earning a fixed discount of 10-28%. At least 30% of each project's capacity is legally reserved for income-qualified households under NM's Community Solar Act (2021); some specific projects (e.g. the Lake Jody farm near Deming) reserve 50% of capacity for low-income subscribers at a 30% discount specifically.",
    "Sign up online at prosperityworks.net/community-solar — takes a few minutes; Solstice (their enrollment partner) reserves a share of a nearby solar farm for your home.",
    "Available to both renters and homeowners (you do not need to own your property); must get electricity through PNM, El Paso Electric, or Xcel Energy (SPS) service territory.",
    "prosperityworks.net","https://www.prosperityworks.net/community-solar/","Verified","Yes","Genuinely under-the-radar: free money on the electric bill with zero upfront cost or equipment, yet most people have never heard 'community solar' is even an option. Directly complements PNM Good Neighbor Fund, HEAT New Mexico, and LIHEAP already logged — this is a bill-reduction lever, not emergency assistance, so it pairs well as an ongoing companion to those crisis-response programs.")
add("Community","Utilities","Limited-income NM households",
    "Prosperity Works Home Energy Assessments","Prosperity Works, with implementation partner Energy Works",
    "Free in-home assessments identifying which retrofits would save the most energy/money; connects to energy-efficiency retrofit resources funded partly through PNM and NM Gas Company programs. Over 600 home audits completed in NM to date.",
    "Contact Prosperity Works via prosperityworks.net to request a home assessment.",
    "Limited-income NM households, homeowners and renters.",
    "prosperityworks.net","https://www.prosperityworks.net/Equitable-Energy-Solutions/","Verified","No","")

CURATED_RELATIONSHIPS = {
    "El Centro de la Raza": ["Transformar Fellowship Program", "El Centro External Scholarship Hub"],
    "Transformar Fellowship Program": ["El Centro de la Raza", "El Centro External Scholarship Hub"],
    "Lobo Food Pantry": ["Rio Grande Food Project", "Storehouse New Mexico", "Lobo Food Pantry — Pack a Luminaria / Holiday Meals in a Bag"],
    "Dean of Students Emergency Scholarship": ["PNM Good Neighbor Fund + PNM CARES", "HEAT New Mexico", "UNM Short-Term Emergency Loan"],
    "UNM Short-Term Emergency Loan": ["Dean of Students Emergency Scholarship", "Center for Financial Capability (CFC)"],
    "PNM Good Neighbor Fund + PNM CARES": ["HEAT New Mexico", "Dean of Students Emergency Scholarship", "Prosperity Works Community Solar Program"],
    "HEAT New Mexico": ["PNM Good Neighbor Fund + PNM CARES", "LIHEAP (Low Income Home Energy Assistance)", "Prosperity Works Community Solar Program"],
    "Prosperity Works Community Solar Program": ["Prosperity Works Home Energy Assessments", "PNM Good Neighbor Fund + PNM CARES", "HEAT New Mexico"],
    "Prosperity Works Home Energy Assessments": ["Prosperity Works Community Solar Program"],
    "Prosperity Works": ["Prosperity Works Community Solar Program", "Prosperity Works Home Energy Assessments"],
    "Rio Grande Credit Union — Juntos Avanzamos Program": ["UNM ITIN Application Guidance", "Homewise ITIN Mortgage Loans"],
    "UNM ITIN Application Guidance": ["Rio Grande Credit Union — Juntos Avanzamos Program", "NM Working Families Tax Credit — ITIN Filers Included"],
    "Homewise": ["Homewise ITIN Mortgage Loans", "NM Mortgage Finance Authority (MFA) — Full Program Suite"],
    "Homewise ITIN Mortgage Loans": ["Homewise", "NM Mortgage Finance Authority (MFA) — Full Program Suite", "Rio Grande Credit Union — Juntos Avanzamos Program"],
    "Undocumented UNM (undocumented.unm.edu)": ["El Centro External Scholarship Hub", "New Mexico Immigrant Law Center (NMILC)", "UNM Law School Community Lawyering Clinic"],
    "African American Student Services (Afro)": ["NM Office of African American Affairs"],
    "Women's Resource Center (WRC)": ["Sabrina Single Parent's Scholarship", "Sandra B. Weeke Scholarship"],
    "Student Success Access Grant": ["Arts & Sciences Center for Academic Success (ASCAS)", "Dean of Students Emergency Scholarship"],
    "Storehouse New Mexico": ["Rio Grande Food Project", "Lobo Food Pantry"],
    "Roadrunner Food Bank": ["Roadrunner Food Bank Prescription Discount Card"],
    "Roadrunner Food Bank Prescription Discount Card": ["Roadrunner Food Bank"],
    "Salvation Army Food Pantry": ["Salvation Army Bill Pay Assistance"],
    "Salvation Army Bill Pay Assistance": ["Salvation Army Food Pantry"],
    "LDS Bishops' Storehouse / Home Storage Center": ["LDS Family Services"],
    "LDS Family Services": ["LDS Bishops' Storehouse / Home Storage Center"],
    "LoboRESPECT Advocacy Center": ["Good Shepherd Center", "Joy Junction", "Family Promise of Albuquerque", "Enlace Comunitario"],
    "UNM Law School Emergency Financial Aid Fund": ["UNM Law School Community Lawyering Clinic"],
    "UNM Law School Community Lawyering Clinic": ["UNM Law School Emergency Financial Aid Fund", "New Mexico Immigrant Law Center (NMILC)"],
    "Resource Center for Raza Planning (RCRP) & AICAE student chapter": ["SAAP Graduate Assistantships"],
    "SAAP Graduate Assistantships": ["Resource Center for Raza Planning (RCRP) & AICAE student chapter"],
    "PASOS Resource Center Campus Food Pantry": ["UNM-Valencia Community Resources Guide"],
    "UNM-Valencia Community Resources Guide": ["PASOS Resource Center Campus Food Pantry"],
    "Grad Studies Funding Database (Pivot)": ["Glenda Lewis Critical Race Scholar Award"],
    "Glenda Lewis Critical Race Scholar Award": ["Grad Studies Funding Database (Pivot)"],
    "CELAC (Intensive English Program)": ["AMIGO Scholarship", "Global Education Office (GEO) / International Student & Scholar Services (ISSS)"],
    "AMIGO Scholarship": ["CELAC (Intensive English Program)"],
    "Rust Opportunity Assistance Fund": ["CNM Foundation Fund Directory (Basic Needs Fund, Annual Fund, etc.)", "Wellness CNM — Case Management & Free Counseling"],
    "Wellness CNM — Case Management & Free Counseling": ["THRIVE Program", "F.I.R.S.T. Program", "CNM Rust Opportunity Assistance Fund"],
    "THRIVE Program": ["F.I.R.S.T. Program", "Wellness CNM — Case Management & Free Counseling"],
    "F.I.R.S.T. Program": ["THRIVE Program", "Wellness CNM — Case Management & Free Counseling"],
    "Eight Northern Indian Pueblos Council, Inc. (ENIPC)": ["Five Sandoval Indian Pueblos, Inc. (FSIP) — Behavioral Health Services", "Navajo Nation General Assistance / Department for Self-Reliance (DSR)"],
    "Five Sandoval Indian Pueblos, Inc. (FSIP) — Behavioral Health Services": ["Eight Northern Indian Pueblos Council, Inc. (ENIPC)"],
    "NM Vietnam Veterans' Scholarship": ["NM Veterans' Dependents Tuition Waiver", "NM Dept. of Veterans' Services (NMDVS) — Benefits Overview"],
    "NM Veterans' Dependents Tuition Waiver": ["NM Vietnam Veterans' Scholarship", "NM Dept. of Veterans' Services (NMDVS) — Benefits Overview"],
    "Albuquerque Heading Home": ["Good Shepherd Center", "Joy Junction", "Barrett House / ABQ Rescue Mission Women's Center of Hope"],
}
for r in rows:
    if r[4] in CURATED_RELATIONSHIPS:
        r[14] = "; ".join(CURATED_RELATIONSHIPS[r[4]])

COORDINATES = {
    # Downtown/Central Albuquerque — anchored to Albuquerque Plaza (35.08568, -106.65035) and Downtown center (35.084, -106.65) per Wikipedia
    "Storehouse New Mexico": (35.0808, -106.6489),
    "St. Martin's Hospitality Center (HopeWorks)": (35.0868, -106.6512),
    "HUD Albuquerque Field Office": (35.0825, -106.6505),
    "U.S. Small Business Administration (SBA) — New Mexico District Office": (35.0825, -106.6505),
    "VA Albuquerque Regional Benefit Office": (35.0825, -106.6505),
    "Social Security Administration — NM Field Offices": (35.0810, -106.6505),
    "Public Library of Albuquerque & Bernalillo County — Free Computer/Printing/Notary/Job Search": (35.0862, -106.6516),
    "NM Dept. of Workforce Solutions (DWS)": (35.0850, -106.6480),
    "ABQ RIDE Sun Van (Paratransit)": (35.0822, -106.6478),
    "Noon Day Ministry": (35.0895, -106.6512),
    # Uptown / NE Heights / near UNM
    "New Mexico Asian Family Center (NMAFC)": (35.0850, -106.6019),
    "Islamic Center of New Mexico (ICNM)": (35.0762, -106.6217),
    "Jewish Community Center (JCC) of Greater Albuquerque": (35.1215, -106.5570),
    "Adelante Development Center": (35.1462, -106.6013),
    "ARCA (Albuquerque Resource Center for the Advancement of the Disabled)": (35.0836, -106.5145),
    "Disability Rights New Mexico (Protection & Advocacy, Inc.)": (35.0952, -106.5815),
    # South Valley / SW
    "Rio Grande Food Project": (35.0937, -106.6866),
    # Rio Rancho / Sandoval County
    "Sandoval County Community Services Department": (35.2434, -106.6516),
    "NM Health Care Authority Field Offices — Rio Rancho & Los Lunas": (35.2470, -106.6550),
    # Los Lunas / Valencia County
    "Valencia County Dial-a-Ride": (34.8060, -106.7320),
    # Santa Fe
    "St. Elizabeth Shelter & Supportive Housing": (35.6480, -105.9840),
    "La Familia Medical Center": (35.6790, -105.9530),
    "Guadalupe Credit Union": (35.6530, -105.9880),
    # Gallup
    "UNM-Gallup Office of Financial Aid": (35.5280, -108.7420),
    "Native American Disability Law Center": (35.5330, -108.7280),
    # Los Alamos
    "Self Help, Inc.": (35.8850, -106.3050),
    # Second geocoding pass — additional addresses found in a broader address sweep
    "NM Human Services / Health Care Authority — ISD Programs": (35.1005, -106.5850),
    "Honors College Student Support Directory": (35.0862, -106.6172),
    "Hillel at UNM": (35.0832, -106.6161),
    "New Mexico Immigrant Law Center (NMILC)": (35.0782, -106.6528),
    "Somos Un Pueblo Unido": (35.6850, -105.9450),
    "NM Office of African American Affairs (OAAA)": (35.0870, -106.5850),
    "Albuquerque Job Corps Center": (35.0960, -106.6580),
    "Homewise": (35.0940, -106.5960),
    # Third pass — campus-building references (using known main-campus coordinates, not exact building pins)
    "American Indian Student Services (AISS)": (35.0842, -106.6191),
    "African American Student Services (Afro)": (35.0842, -106.6191),
    "CELAC (Intensive English Program)": (35.0842, -106.6191),
    "Nusenda Credit Union — UNM Student Union Branch": (35.0838, -106.6203),
    "Wellness CNM — Case Management & Free Counseling": (35.0489, -106.6178),
    "Highlands CAFÉ (Caring About Food Equity) + Emergency Foods/Basic Needs Pantry": (35.5928, -105.2247),
    # Coordinates for restored shelter/food entries (see restoration note in add() calls above)
    "Good Shepherd Center": (35.0793, -106.6521),
    "Joy Junction": (35.0480, -106.6634),
    "Saranam": (35.0838, -106.5540),
    "Salvation Army Food Pantry": (35.0872, -106.5895),
}
for r in rows:
    if r[4] in COORDINATES:
        lat, lng = COORDINATES[r[4]]
        r[15] = lat
        r[16] = lng

# assign IDs
for i, r in enumerate(rows, start=1):
    r[0] = i

# ---------------- WRITE MASTER SHEET ----------------
HEADER_FILL = PatternFill("solid", fgColor="2B2620")
HEADER_FONT = Font(name="Arial", size=10, bold=True, color="F6F1E6")
BODY_FONT = Font(name="Arial", size=10)
WRAP = Alignment(wrap_text=True, vertical="top")
THIN = Side(style="thin", color="C9BDA1")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

for c, h in enumerate(HEADERS, start=1):
    cell = ws.cell(row=1, column=c, value=h)
    cell.font = HEADER_FONT
    cell.fill = HEADER_FILL
    cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
    cell.border = BORDER

for r_idx, row in enumerate(rows, start=2):
    for c_idx, val in enumerate(row, start=1):
        cell = ws.cell(row=r_idx, column=c_idx, value=val)
        cell.font = BODY_FONT
        cell.alignment = WRAP
        cell.border = BORDER

widths = [5,14,20,20,30,26,42,38,32,26,30,16,14,38,42,10,10]
for i, w in enumerate(widths, start=1):
    ws.column_dimensions[get_column_letter(i)].width = w

ws.freeze_panes = "A2"
ws.auto_filter.ref = f"A1:{get_column_letter(len(HEADERS))}{len(rows)+1}"
ws.row_dimensions[1].height = 34

# ---------------- SUMMARY / TREE SHEET ----------------
ws2 = wb.create_sheet("Tree Overview")
ws2["A1"] = "Albuquerque / UNM Resource Tree — Coverage Summary"
ws2["A1"].font = Font(name="Arial", size=14, bold=True)
ws2.merge_cells("A1:D1")

from collections import Counter, defaultdict
level_counts = Counter(r[1] for r in rows)
domain_by_level = defaultdict(Counter)
for r in rows:
    domain_by_level[r[1]][r[2]] += 1

r_out = 3
ws2.cell(row=r_out, column=1, value="Level").font = Font(bold=True)
ws2.cell(row=r_out, column=2, value="Total Entries").font = Font(bold=True)
r_out += 1
for level, count in level_counts.most_common():
    ws2.cell(row=r_out, column=1, value=level)
    ws2.cell(row=r_out, column=2, value=count)
    r_out += 1

r_out += 2
ws2.cell(row=r_out, column=1, value="Level → Domain Breakdown").font = Font(bold=True, size=12)
r_out += 1
ws2.cell(row=r_out, column=1, value="Level").font = Font(bold=True)
ws2.cell(row=r_out, column=2, value="Domain").font = Font(bold=True)
ws2.cell(row=r_out, column=3, value="Count").font = Font(bold=True)
r_out += 1
for level, domc in domain_by_level.items():
    for domain, count in domc.most_common():
        ws2.cell(row=r_out, column=1, value=level)
        ws2.cell(row=r_out, column=2, value=domain)
        ws2.cell(row=r_out, column=3, value=count)
        r_out += 1

status_counts = Counter(r[11] for r in rows)
r_out += 2
ws2.cell(row=r_out, column=1, value="Status Breakdown").font = Font(bold=True, size=12)
r_out += 1
for status, count in status_counts.most_common():
    ws2.cell(row=r_out, column=1, value=status)
    ws2.cell(row=r_out, column=2, value=count)
    r_out += 1

hidden_count = sum(1 for r in rows if r[12] == "Yes")
r_out += 2
ws2.cell(row=r_out, column=1, value="Flagged as Hidden/Under-advertised").font = Font(bold=True)
ws2.cell(row=r_out, column=2, value=hidden_count)

for col, w in zip("ABCD",[26,26,14,10]):
    ws2.column_dimensions[col].width = w

# ---------------- TEAM NOTES / TASK SHEET ----------------
ws3 = wb.create_sheet("Team Notes")
ws3["A1"] = "Collaboration Log"
ws3["A1"].font = Font(bold=True, size=14)
ws3.append([])
ws3.append(["Date","Who","Branch/Area","Note or Finding","Status"])
for c in range(1,6):
    ws3.cell(row=3, column=c).font = Font(bold=True)
    ws3.cell(row=3, column=c).fill = PatternFill("solid", fgColor="E9DFCA")
sample_notes = [
    ["2026-08-02","Claudio","All branches","Initial dataset built: Federal, State (NM), City/County, UNM (general + identity centers + majors), plus hidden-perk flags.","Complete — v1"],
    ["","Jazmin","","","Pending"],
    ["","Will","Forums / offline / low-resource populations","","Pending"],
]
for row in sample_notes:
    ws3.append(row)
for col, w in zip("ABCDE",[12,10,26,60,16]):
    ws3.column_dimensions[col].width = w
for row in ws3.iter_rows(min_row=4, max_row=3+len(sample_notes)):
    for cell in row:
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        cell.font = Font(name="Arial", size=10)

# ---------------- VERIFICATION QUEUE SHEET ----------------
ws4 = wb.create_sheet("Verification Queue")
ws4["A1"] = "Verification Queue — Everything That Still Needs a Second Look"
ws4["A1"].font = Font(bold=True, size=14)
ws4.merge_cells("A1:F1")
ws4["A2"] = "Two kinds of entries here: (1) rows pulled straight from the Master Dataset where Status = 'Needs Verification', and (2) special flags — conflicts, stale/time-sensitive info, naming collisions, and inactive orgs — that need attention even though their Status may say 'Verified'."
ws4["A2"].font = Font(italic=True, size=9, color="6A604F")
ws4.merge_cells("A2:F2")
ws4.row_dimensions[2].height = 30

VQ_HEADERS = ["Row ID","Resource Name","Level","Issue Type","What Needs Checking","Assigned To","Resolved?"]
r_start = 4
for c, h in enumerate(VQ_HEADERS, start=1):
    cell = ws4.cell(row=r_start, column=c, value=h)
    cell.font = Font(bold=True, color="F6F1E6")
    cell.fill = PatternFill("solid", fgColor="2B2620")
    cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
    cell.border = BORDER

r_cursor = r_start + 1

# Part 1: auto-pull every "Needs Verification" row from the master dataset
for r in rows:
    if r[11] == "Needs Verification":
        ws4.cell(row=r_cursor, column=1, value=r[0])
        ws4.cell(row=r_cursor, column=2, value=r[4])
        ws4.cell(row=r_cursor, column=3, value=r[1])
        ws4.cell(row=r_cursor, column=4, value="Standard verification")
        ws4.cell(row=r_cursor, column=5, value=r[13] if r[13] else "Confirm current details with a second source or direct contact.")
        ws4.cell(row=r_cursor, column=6, value="")
        ws4.cell(row=r_cursor, column=7, value="No")
        r_cursor += 1

# Part 2: special flags — conflicts, stale/time-sensitive, naming collisions, inactive orgs
special_flags = [
    ["Map coordinates (26 resources)","Multiple","APPROXIMATE — VERIFY BEFORE USE",
     "Coordinates for the new map feature were placed using known Albuquerque/NM street-grid geography and a small number of confirmed landmark anchors (e.g. Albuquerque Plaza at 201 3rd St NW), not precise geocoding of every individual address. Good enough for 'which part of town is this in' but NOT precise enough to guarantee pin-perfect building placement. Recommend a real geocoding pass (e.g. via a geocoding API or manual Google Maps lookup) before treating pin locations as exact, especially for anyone relying on this to physically navigate somewhere unfamiliar."],
    ["Emergency Medicaid Coverage for Undocumented Residents","State (NM)","CONFLICT",
     "Appears to conflict with the separately-logged 'state-funded healthcare access to all non-citizens' (July 2025) entry — may describe different programs, or one may be outdated. Call NM Health Care Authority to reconcile before presenting either as authoritative."],
    ["State-Funded Healthcare Access for Non-Citizens","State (NM)","CONFLICT",
     "See paired conflict above (Emergency Medicaid entry) — same reconciliation needed."],
    ["DACA Coverage Bridge (status uncertain as of Aug 2026)","State (NM)","STALE / TIME-SENSITIVE",
     "Enrollment window closed Jan 15, 2026 and coverage was only guaranteed through Dec 31, 2025 — almost certainly expired or replaced by now. Call NM HCA directly for current 2026 status before referencing this program to anyone."],
    ["El CENTRO de Igualdad y Derechos","Community","NAMING COLLISION",
     "Easily confused with UNM's 'El Centro de la Raza' (Transformar Fellowship's home org) — different organization, different mission, similar name. Do not merge these two rows during cleanup."],
    ["Albuquerque Indian Center (AIC)","Community","INACTIVE ORG",
     "Listed as inactive as of Feb 2025 per Groundworks NM directory. Do not present as a live resource without a fresh confirmation call — risk of sending someone to a closed door."],
    ["NM Children, Youth & Families Dept. (CYFD)","State (NM)","CONTEXT FLAG",
     "As of April 2025, CYFD is under a formal NM Dept. of Justice investigation for documented systemic failures in the foster care system (including children sleeping in CYFD offices/shelters rather than placements). The abuse hotline and core services remain operational and this doesn't change crisis-reporting guidance, but anyone referencing CYFD's foster care system specifically should know this context before presenting it as a straightforwardly positive resource."],
    ["\"UNM Career Closet\" (main campus) — claimed by external 'Whale' review, Aug 2026","University (UNM)","UNCONFIRMED / LIKELY INACCURATE",
     "No evidence found this exists at UNM's Albuquerque main campus despite a direct search. What IS confirmed real: UNM-Los Alamos (branch campus) has a 'Professional Clothing Closet,' and New Mexico State University (a DIFFERENT university) has a well-documented 'Aggie Career Closet.' The claim appears to conflate these. Do not add to Master Dataset as fact without a direct call to UNM Career Services (505-277-2531) confirming a closet exists at the Albuquerque campus."],
    ["\"CNM Workplace Wardrobe\" — claimed by external 'Whale' review, Aug 2026","Institution — CNM","UNCONFIRMED / LIKELY FABRICATED",
     "No evidence this exists under this name. CNM's own official clothing-resources page instead refers students to the APS Community Clothing Bank (now logged as its own verified entry). Do not add to Master Dataset without direct confirmation from CNM's Dean of Students office."],
    ["\"CAPS Textbook & Laptop Lending\" — claimed by external 'Whale' review, Aug 2026","University (UNM)","UNCONFIRMED",
     "No evidence found in any search that UNM's Center for Academic Program Support (CAPS, already logged) runs a textbook/laptop lending desk. Could theoretically exist but is undocumented online — if pursuing, call CAPS directly (already have contact info from the existing CAPS entry) rather than presenting as confirmed."],
    ["\"LGBTQ Resource Center (Arcoíris) Community Closet\" — claimed by external 'Whale' review, Aug 2026","University (UNM)","UNCONFIRMED / LIKELY CONFLATED",
     "No evidence UNM's Arcoíris Resource Center (already logged) runs a clothing exchange. Similar programs DO exist at other universities (Univ. of Arizona's 'Queer Closet,' Univ. of Nebraska-Lincoln's 'Lavender Closet') — the claim may be pattern-matched from those rather than confirmed locally. Call Arcoíris directly before adding."],
]
for name, level, issue_type, note in special_flags:
    ws4.cell(row=r_cursor, column=1, value="—")
    ws4.cell(row=r_cursor, column=2, value=name)
    ws4.cell(row=r_cursor, column=3, value=level)
    ws4.cell(row=r_cursor, column=4, value=issue_type)
    ws4.cell(row=r_cursor, column=5, value=note)
    ws4.cell(row=r_cursor, column=6, value="")
    ws4.cell(row=r_cursor, column=7, value="No")
    r_cursor += 1

for row in ws4.iter_rows(min_row=r_start+1, max_row=r_cursor-1):
    for cell in row:
        cell.font = Font(name="Arial", size=10)
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        cell.border = BORDER

# color-code Issue Type column for quick scanning
issue_colors = {
    "Standard verification": "E9DFCA",
    "CONFLICT": "F2C6B4",
    "STALE / TIME-SENSITIVE": "F2E2A8",
    "NAMING COLLISION": "C9D9C2",
    "INACTIVE ORG": "D8C6E0",
    "CONTEXT FLAG": "F2E2A8",
    "UNCONFIRMED / LIKELY INACCURATE": "E8A0A0",
    "UNCONFIRMED / LIKELY FABRICATED": "E8A0A0",
    "UNCONFIRMED": "E8A0A0",
    "UNCONFIRMED / LIKELY CONFLATED": "E8A0A0",
}
for row in ws4.iter_rows(min_row=r_start+1, max_row=r_cursor-1):
    issue_val = row[3].value
    if issue_val in issue_colors:
        row[3].fill = PatternFill("solid", fgColor=issue_colors[issue_val])

vq_widths = [8,32,16,20,55,14,12]
for i, w in enumerate(vq_widths, start=1):
    ws4.column_dimensions[get_column_letter(i)].width = w
ws4.freeze_panes = f"A{r_start+1}"
ws4.auto_filter.ref = f"A{r_start}:{get_column_letter(len(VQ_HEADERS))}{r_cursor-1}"
ws4.row_dimensions[r_start].height = 30

# ---------------- ROADMAP SHEET ----------------
ws5 = wb.create_sheet("Roadmap")
ws5["A1"] = "7-Step Roadmap — Remaining Resource Branches to Cover"
ws5["A1"].font = Font(bold=True, size=14)
ws5.merge_cells("A1:E1")
ws5["A2"] = "Plan: after each step, Claudio adds findings to the Master Dataset, then writes a short self-evaluation report (what was found, what's still missing, any conflicts/flags) for Julio to review before it goes to Jazmin/Will."
ws5["A2"].font = Font(italic=True, size=9, color="6A604F")
ws5.merge_cells("A2:E2")
ws5.row_dimensions[2].height = 28

RM_HEADERS = ["Step","Title","Covers","Status","Report Link / Notes"]
rm_start = 4
for c, h in enumerate(RM_HEADERS, start=1):
    cell = ws5.cell(row=rm_start, column=c, value=h)
    cell.font = Font(bold=True, color="F6F1E6")
    cell.fill = PatternFill("solid", fgColor="2B2620")
    cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
    cell.border = BORDER

roadmap_steps = [
    ["1","Geographic Expansion — Other NM Cities/Counties",
     "Santa Fe (city, county, Community Foundation, The Food Depot, St. Elizabeth Shelter, Interfaith Community Shelter/Pete's Place, Santa Fe Public Schools); Rio Rancho (city, Sandoval County, schools, senior/rec centers); Los Lunas / Valencia County government (distinct from UNM-Valencia already logged)",
     "Done (8 rows added)","See chat report dated this session — Food Depot, St. Elizabeth Shelter, Sandoval County Community Services, Meadowlark/Broadmoor Senior Centers, Valencia Shelter Services, state field offices in Rio Rancho + Los Lunas all added. Santa Fe Community Foundation, Interfaith Shelter/Pete's Place, and school districts still open — minor follow-up."],
    ["2","State Agencies Not Yet Touched",
     "NM Dept. of Workforce Solutions; Children, Youth & Families Dept.; Aging & Long-Term Services Dept.; Public Education Dept. (K-12 / high schoolers); Attorney General's Office (consumer protection, victim services); Governor's/Lt. Governor's Offices of [X] Affairs; NM Mortgage Finance Authority (broader than Homeowner Assistance Fund already logged)",
     "Done (8 rows added)","DWS, CYFD, ALTSD, AG's Office, NM Office of African American Affairs, full MFA program suite, and NM McKinney-Vento Homeless Education Program (K-12) all added — the last item closes the previously-open PED/K-12 thread and directly connects to the APS Clothing Bank already logged. CYFD flagged with a systemic-failures context note (active NMDOJ investigation) — see Verification Queue."],
    ["3","Federal Agencies Not Yet Touched",
     "HUD directly (beyond Section 8); Small Business Administration; Dept. of Labor (apprenticeships, Job Corps); federal VA (distinct from NM state Veterans Services already logged); Social Security Administration (SSI/SSDI); federal TRIO programs (Upward Bound, Talent Search — relevant to high schoolers); FEMA disaster assistance",
     "Done","HUD Albuquerque Field Office, SBA NM District Office (incl. WESST pointer), Albuquerque Job Corps Center, VA Albuquerque Regional Benefit Office, TRIO Upward Bound at UNM Gallup, FEMA Individual Assistance, and Social Security Administration NM Field Offices all added."],
    ["4","Other NM Higher-Ed Institutions",
     "Santa Fe Community College; Institute of American Indian Arts (statewide reach for Native students); NM Highlands University; Western NM University; Eastern NM University; NM Tech",
     "Done (8 rows added)","All 6 requested institutions covered, plus bonus finds Diné College and a correction of the NMSU 'Aggie Career Closet' (which the external Whale review had mistakenly attributed to UNM). Discovered via a single NM Higher Ed Dept. grant announcement covering nearly every NM public college's food-security program at once — Navajo Technical University's specific program name still needs a follow-up."],
    ["5","Healthcare Systems + Legal/Crisis Orgs",
     "UNM Hospital charity care program specifically; Presbyterian and Lovelace hospital charity care; other FQHCs (First Choice Community Healthcare, La Familia Medical Center); New Mexico Legal Aid; Disability Rights New Mexico; Agora Crisis Center; Rape Crisis Center of Central NM",
     "Done","UNM Care (immigration status explicitly doesn't matter — major find), Presbyterian Financial Assistance, First Choice Community Healthcare, La Familia Medical Center, Christus St. Vincent (Santa Fe, needs verification), Lovelace Financial Assistance, NM Legal Aid, Disability Rights NM, Native American Disability Law Center, Agora Crisis Center, Rape Crisis Center of Central NM, NM Crisis and Access Line, and Transgender Resource Center of NM (needs verification) all added."],
    ["6","Private/Corporate + Tribal-Direct",
     "Utility assistance (PNM, NM Gas Co. low-income programs); Guadalupe Credit Union (Santa Fe, low-income focused); foundations (Thornburg, W.K. Kellogg NM grants); 19 Pueblos' own programs; Navajo Nation programs",
     "Done","PNM Good Neighbor Fund/CARES, HEAT New Mexico, Guadalupe Credit Union, Thornburg Foundation, W.K. Kellogg Foundation NM (Small Orgs Big Impact Fund + Pueblo partnerships), Navajo Nation General Assistance/DSR, Eight Northern Indian Pueblos Council, Five Sandoval Indian Pueblos, and Pueblo of Isleta Health Center all added — together covering 14 of 19 Pueblos tribal-direct (13 via the two consortiums + Isleta individually; Jemez is covered via Five Sandoval Indian Pueblos). Acoma, Laguna, San Felipe, Santo Domingo/Kewa, and Zuni remain uncovered individually — noted for a future pass if needed."],
    ["7","Transportation + Final Cleanup Pass",
     "ABQ Ride/Sun Van; Rail Runner Express (Santa Fe-Belen commuter rail); PLUS: close out remaining Verification Queue items, merge with Julio's original 48-row template, final duplicate/conflict check across the whole dataset",
     "Mostly done","ABQ RIDE fixed-route + ART, Sun Van paratransit, NM Rail Runner Express, and Valencia County Dial-a-Ride all added. IMPORTANT: during this pass, a batch of duplicate/unverifiable entries was found in the working file (claims about specific programs that didn't trace back to any actual search performed this session) and removed rather than shipped as fact — see chat for full explanation. MERGE WITH ORIGINAL 48-ROW TEMPLATE STILL OPEN — that file hasn't been re-shared in this dataset-building phase; upload it and Claudio will reconcile the two."],
]
r_rm = rm_start + 1
for step in roadmap_steps:
    for c, val in enumerate(step, start=1):
        cell = ws5.cell(row=r_rm, column=c, value=val)
        cell.font = Font(name="Arial", size=10)
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        cell.border = BORDER
    r_rm += 1

rm_widths = [6,32,70,14,30]
for i, w in enumerate(rm_widths, start=1):
    ws5.column_dimensions[get_column_letter(i)].width = w
ws5.freeze_panes = f"A{rm_start+1}"
ws5.row_dimensions[rm_start].height = 24



ws6 = wb.create_sheet("Feature Roadmap")
ws6["A1"] = "Website Feature Roadmap — What Success Looks Like"
ws6["A1"].font = Font(bold=True, size=14)
ws6.merge_cells("A1:E1")
ws6["A2"] = "Julio's framing: the site needs to be a graph, not just a directory — resources should point to each other the way a real situation would need them to. Someone at El Centro de la Raza should learn about the Transformar Fellowship's $600 right there, not just that El Centro exists."
ws6["A2"].font = Font(italic=True, size=9, color="6A604F")
ws6.merge_cells("A2:E2")
ws6.row_dimensions[2].height = 32

FR_HEADERS = ["Feature","Description","Status","Priority","Notes"]
fr_start = 4
for c, h in enumerate(FR_HEADERS, start=1):
    cell = ws6.cell(row=fr_start, column=c, value=h)
    cell.font = Font(bold=True, color="F6F1E6")
    cell.fill = PatternFill("solid", fgColor="2B2620")
    cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
    cell.border = BORDER

features = [
    ["Curated resource relationships","Explicit, hand-verified connections between resources (not generic category-matching) — e.g. El Centro de la Raza \u2192 Transformar Fellowship, Lobo Food Pantry \u2192 nearest alternative pantries, Dean of Students Emergency Scholarship \u2192 utility assistance if the underlying need is a bill.","In progress \u2014 16 resources curated as a first pass","High","New 'Related Resources (curated)' column added to Master Dataset. Website's related-resources logic now prioritizes curated links over generic same-category matching. Needs Jazmin/Will to keep expanding this column as they review resources."],
    ["Richer sub-program detail","Parent orgs need their specific programs surfaced, not just 'this org exists.' El Centro de la Raza's page should make Transformar's $600 + requirements visible, not require a second lookup.","Partially addressed via curated relationships","High","Every sub-program already has its own full row (what/how/eligibility) \u2014 the fix needed was connecting parent \u2194 child, which the curated relationships column does. Worth reviewing every 'hub' org (El Centro, CFC, Homewise, etc.) for its own sub-programs."],
    ["Nearest-location lookup / Map view","'I'm looking at Lobo Food Pantry, show me the nearest alternative if it's closed or full' \u2014 e.g. Rio Grande Food Project downtown.","In progress \u2014 interactive map view added for 26 resources with known street addresses","High","Built with Leaflet.js + free OpenStreetMap tiles (no API key needed). Coordinates are APPROXIMATE (see Verification Queue) \u2014 placed using known street-grid geography, not precise geocoding. Next step: real geocoding pass for accuracy, then expand coverage to more of the 203 resources that have physical addresses."],
    ["Cheap/market apartment listings","Embed a live rental search under Housing \u2014 e.g. cheap market-rate apartments, not just assistance programs.","Not started","Medium","This requires either embedding a real third-party rental search (Zillow/Apartments.com-style, likely needs an API or iframe) or building a manually-curated 'affordable complexes' list \u2014 the latter is more realistic without external API access."],
    ["Pictures / visual richness","Julio wants real visual richness, not just a plain directory.","Partially done \u2014 original illustrated category banners added; real photography still blocked","Medium","Can't responsibly hotlink copyrighted stock photos into a redistributable file. Options going forward: (1) Julio/Jazmin/Will supply real photos they have rights to and Claudio embeds them directly, (2) keep expanding the original-illustration system, (3) revisit if a licensed image source becomes available."],
    ["Improved search","Search needs to feel smarter \u2014 handle typos, synonyms, and natural questions (e.g. 'help with rent' should surface housing assistance even without the word housing).","Not started","High","Current search is simple substring matching on name/org/description. A real upgrade would need fuzzy matching and/or a synonym map (rent\u2192housing, food stamps\u2192SNAP, etc.) built into the search logic."],
    ["AI agent assistant","An AI helper that can actually answer 'I'm struggling with X, what should I do' by reasoning across the dataset, not just keyword search.","Not started \u2014 requires a live backend, can't run inside a static HTML file","Discussion needed","A static HTML file can't call an AI API on its own without exposing a key or standing up a backend. Worth a dedicated conversation: options range from a simple hosted chatbot pointed at this dataset, to something more custom. This is the biggest architectural jump of everything on this list \u2014 flagging for a real discussion, not just a build task."],
]
r_fr = fr_start + 1
for feat in features:
    for c, val in enumerate(feat, start=1):
        cell = ws6.cell(row=r_fr, column=c, value=val)
        cell.font = Font(name="Arial", size=10)
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        cell.border = BORDER
    r_fr += 1

fr_widths = [22,42,30,12,50]
for i, w in enumerate(fr_widths, start=1):
    ws6.column_dimensions[get_column_letter(i)].width = w
ws6.freeze_panes = f"A{fr_start+1}"
ws6.row_dimensions[fr_start].height = 24

import os
_OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(_OUT_DIR, exist_ok=True)
wb.save(os.path.join(_OUT_DIR, "abq_unm_resource_dataset.xlsx"))
print("rows:", len(rows))
