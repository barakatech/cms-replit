import type { InsertBondPage, BondPage, BondCouponScheduleEntry, BondRatingAgency, BondFaqEntry, BondHighlightEntry, BondDisclaimerEntry, BondTooltipEntry, BondIncomeCalculatorDefaults, BondCallPutScheduleEntry, BondIssuerDocLink, BondPageSEO, BondPageBlock } from '../shared/schema';

const BASE_URL = 'http://localhost:5000';

interface SeedBondData {
  title: { en: string; ar: string };
  slug: string;
  status: 'draft' | 'published';
  tags: string[];
  featured: boolean;
  instrumentType: string;
  issuerType: string;
  couponType: string;
  seniority: string;
  callable: boolean;
  putable: boolean;
  convertible: boolean;
  guaranteed: boolean;
  callSchedule?: Array<{ callDate: string; callPrice: number; callType: string }>;
  isin?: string;
  cusip?: string;
  countryOfRisk?: string;
  issuerCountry?: string;
  currency: string;
  issueDate?: string;
  maturityDate?: string;
  dayCountConvention?: string;
  settlementDays?: number;
  denomination?: number;
  minimumInvestment?: { amount: number; currency: string };
  incrementSize?: { amount: number; currency: string };
  cleanPrice?: number;
  dirtyPrice?: number;
  accruedInterest?: number;
  ytm?: number;
  currentYield?: number;
  yieldToCall?: number;
  yieldToWorst?: number;
  spread?: { type: string; valueBps: number | null };
  benchmark?: { name: string; spreadToBenchmarkBps: number };
  bidPrice?: number;
  askPrice?: number;
  bidYield?: number;
  askYield?: number;
  couponRate?: number;
  couponFrequency?: string;
  lastCouponDate?: string;
  nextCouponDate?: string;
  principalRepaymentType?: string;
  couponSchedule?: Array<{ paymentDate: string; amountPer100: number; currency: string }>;
  creditRatingDisplay?: string;
  ratingAgencies?: Array<{ agency: string; rating: string; outlook: string; lastReviewedDate: string }>;
  riskLevel?: string;
  duration?: number;
  macaulayDuration?: number;
  convexity?: number;
  interestRateSensitivityNotes?: { en: string; ar: string };
  defaultRiskNotes?: { en: string; ar: string };
  countryRiskNotes?: { en: string; ar: string };
  issuerName: string;
  issuerShortDescription?: { en: string; ar: string };
  issuerSector?: string;
  issuerWebsite?: string;
  issuerFinancialHighlights?: { en: string; ar: string };
  issuerDocsLinks?: Array<{ name: string; url: string }>;
  liquidityScore?: number;
  typicalBidAskBps?: number;
  tradableOnPlatform?: boolean;
  tradingHoursNotes?: { en: string; ar: string };
  earlyExitNotes?: { en: string; ar: string };
  heroSummary?: { en: string; ar: string };
  highlights?: { en: string[]; ar: string[] };
  howItWorks?: { en: string; ar: string };
  faq?: Array<{ q: { en: string; ar: string }; a: { en: string; ar: string } }>;
  riskDisclosure: { en: string; ar: string };
  disclaimers: { en: string[]; ar: string[] };
  educationalTooltips?: { en: Record<string, string>; ar: Record<string, string> };
  showCharts?: boolean;
  metaTitle?: { en: string; ar: string };
  metaDescription?: { en: string; ar: string };
  ogTitle?: { en: string; ar: string };
  ogDescription?: { en: string; ar: string };
  indexable?: boolean;
}

const COMMON_RISK_DISCLOSURE = {
  en: "Bonds carry risks including interest rate risk, credit risk, and liquidity risk. Capital is at risk.",
  ar: "تنطوي السندات على مخاطر تشمل مخاطر أسعار الفائدة ومخاطر الائتمان ومخاطر السيولة. رأس المال معرّض للمخاطر."
};

const COMMON_DISCLAIMERS = {
  en: ["This page is for information only and is not investment advice."],
  ar: ["هذه الصفحة لأغراض معلوماتية فقط وليست نصيحة استثمارية."]
};

const INCOME_DISCLAIMER = {
  en: "Income estimates are illustrative and depend on price, yields, and holding period. Capital is at risk.",
  ar: "تقديرات الدخل لغرض التوضيح وتعتمد على السعر والعوائد وفترة الاحتفاظ. رأس المال معرّض للمخاطر."
};

const bondSeedData: SeedBondData[] = [
  {
    title: { en: "US Treasury Note 4.50% (May 2031)", ar: "سندات الخزانة الأمريكية 4.50% (مايو 2031)" },
    slug: "us-treasury-note-4-50-may-2031",
    status: "published",
    tags: ["government", "usd", "treasury", "fixed-income"],
    featured: true,
    instrumentType: "treasury",
    issuerType: "sovereign",
    couponType: "fixed",
    seniority: "senior_unsecured",
    callable: false,
    putable: false,
    convertible: false,
    guaranteed: true,
    isin: "US000000DUMMY1",
    cusip: "000000AA1",
    countryOfRisk: "United States",
    issuerCountry: "United States",
    currency: "USD",
    issueDate: "2021-05-15",
    maturityDate: "2031-05-15",
    dayCountConvention: "ACT/ACT",
    settlementDays: 2,
    denomination: 100,
    minimumInvestment: { amount: 100, currency: "USD" },
    incrementSize: { amount: 100, currency: "USD" },
    cleanPrice: 98.75,
    dirtyPrice: 99.10,
    accruedInterest: 0.35,
    ytm: 4.62,
    currentYield: 4.56,
    yieldToWorst: 4.62,
    benchmark: { name: "UST", spreadToBenchmarkBps: 0 },
    bidPrice: 98.70,
    askPrice: 98.80,
    bidYield: 4.63,
    askYield: 4.61,
    couponRate: 4.5,
    couponFrequency: "semi_annual",
    lastCouponDate: "2025-11-15",
    nextCouponDate: "2026-05-15",
    principalRepaymentType: "bullet",
    couponSchedule: [
      { paymentDate: "2026-05-15", amountPer100: 2.25, currency: "USD" },
      { paymentDate: "2026-11-15", amountPer100: 2.25, currency: "USD" },
      { paymentDate: "2027-05-15", amountPer100: 2.25, currency: "USD" },
      { paymentDate: "2027-11-15", amountPer100: 2.25, currency: "USD" }
    ],
    creditRatingDisplay: "AAA (example)",
    ratingAgencies: [{ agency: "S&P", rating: "AAA", outlook: "Stable", lastReviewedDate: "2025-12-01" }],
    riskLevel: "low",
    duration: 5.8,
    macaulayDuration: 6.1,
    convexity: 0.9,
    interestRateSensitivityNotes: {
      en: "Bond prices can move when market interest rates change; longer duration may mean higher sensitivity.",
      ar: "قد تتغير أسعار السندات عند تغير أسعار الفائدة في السوق؛ المدة الأطول قد تعني حساسية أعلى."
    },
    defaultRiskNotes: {
      en: "Even high-quality bonds can fluctuate in price before maturity.",
      ar: "حتى السندات عالية الجودة قد تتقلب أسعارها قبل الاستحقاق."
    },
    countryRiskNotes: {
      en: "Country and currency factors may affect outcomes for non-domestic investors.",
      ar: "قد تؤثر عوامل الدولة والعملة على النتائج للمستثمرين من خارج الدولة."
    },
    issuerName: "United States Treasury",
    issuerShortDescription: { en: "Debt securities issued by the US government.", ar: "أدوات دين تصدرها حكومة الولايات المتحدة." },
    issuerSector: "Government",
    issuerWebsite: "https://home.treasury.gov/",
    issuerFinancialHighlights: {
      en: "Demo issuer profile for seeding. Replace with your production issuer content source when available.",
      ar: "ملف مُصدر تجريبي لأغراض التهيئة. استبدله بمصدر محتوى المُصدر الفعلي عند توفره."
    },
    issuerDocsLinks: [{ name: "Issuer page (demo)", url: "https://example.com/issuer/us-treasury" }],
    liquidityScore: 95,
    typicalBidAskBps: 2,
    tradableOnPlatform: true,
    tradingHoursNotes: { en: "Trading availability may vary by venue and product.", ar: "قد يختلف توفر التداول حسب الجهة والمنتج." },
    earlyExitNotes: {
      en: "Selling before maturity may result in a gain or loss depending on market conditions.",
      ar: "قد يؤدي البيع قبل الاستحقاق إلى ربح أو خسارة حسب ظروف السوق."
    },
    heroSummary: {
      en: "A USD government bond with scheduled coupon payments and a defined maturity date.",
      ar: "سند حكومي بالدولار الأمريكي مع دفعات كوبون مجدولة وتاريخ استحقاق محدد."
    },
    highlights: {
      en: ["Fixed coupon schedule", "Defined maturity date", "USD-denominated"],
      ar: ["جدول كوبون ثابت", "تاريخ استحقاق محدد", "مقوم بالدولار الأمريكي"]
    },
    howItWorks: {
      en: "This bond pays periodic coupons and returns principal at maturity. Market prices can fluctuate prior to maturity.",
      ar: "يدفع هذا السند كوبونات دورية ويعيد أصل الاستثمار عند الاستحقاق. قد تتقلب الأسعار في السوق قبل الاستحقاق."
    },
    faq: [
      {
        q: { en: "What is Yield to Maturity (YTM)?", ar: "ما هو العائد حتى الاستحقاق (YTM)؟" },
        a: { en: "YTM is an annualized estimate based on price, coupon, and time to maturity if held to maturity.", ar: "YTM هو تقدير سنوي يعتمد على السعر والكوبون والمدة حتى الاستحقاق إذا تم الاحتفاظ بالسند حتى الاستحقاق." }
      },
      {
        q: { en: "What happens at maturity?", ar: "ماذا يحدث عند الاستحقاق؟" },
        a: { en: "At maturity, the issuer repays principal (face value) and the bond stops paying coupons.", ar: "عند الاستحقاق، يقوم المُصدر بسداد أصل الاستثمار (القيمة الاسمية) ويتوقف السند عن دفع الكوبونات." }
      }
    ],
    riskDisclosure: COMMON_RISK_DISCLOSURE,
    disclaimers: COMMON_DISCLAIMERS,
    educationalTooltips: {
      en: { "Coupon": "A periodic payment made by the issuer, typically expressed as an annual rate.", "Duration": "A measure of price sensitivity to interest rate changes.", "Clean Price": "Bond price excluding accrued interest." },
      ar: { "الكوبون": "دفعة دورية من المُصدر، وعادةً ما تُعرض كنسبة سنوية.", "المدة": "مقياس لحساسية السعر تجاه تغيرات أسعار الفائدة.", "السعر النظيف": "سعر السند دون احتساب الفائدة المستحقة." }
    },
    showCharts: false,
    metaTitle: { en: "US Treasury Note 4.50% (May 2031) | Bonds", ar: "سندات الخزانة الأمريكية 4.50% (مايو 2031) | السندات" },
    metaDescription: { en: "Key facts, coupon schedule, risk notes, and issuer overview for a demo US Treasury bond page.", ar: "حقائق أساسية، جدول الكوبونات، ملاحظات المخاطر، ونبذة عن المُصدر لصفحة سندات تجريبية." },
    ogTitle: { en: "US Treasury Note 4.50% (May 2031)", ar: "سندات الخزانة الأمريكية 4.50% (مايو 2031)" },
    ogDescription: { en: "Demo bond page showing yield, coupon schedule, and risk disclosures.", ar: "صفحة سندات تجريبية تعرض العائد وجدول الكوبونات وإفصاحات المخاطر." },
    indexable: true
  },
  {
    title: { en: "UAE Government Bond 3.90% (Oct 2030)", ar: "سند حكومي إماراتي 3.90% (أكتوبر 2030)" },
    slug: "uae-government-bond-3-90-oct-2030",
    status: "published",
    tags: ["government", "aed", "fixed-income"],
    featured: true,
    instrumentType: "government",
    issuerType: "sovereign",
    couponType: "fixed",
    seniority: "senior_unsecured",
    callable: false,
    putable: false,
    convertible: false,
    guaranteed: true,
    isin: "AE000000DUMMY2",
    countryOfRisk: "United Arab Emirates",
    issuerCountry: "United Arab Emirates",
    currency: "AED",
    issueDate: "2022-10-20",
    maturityDate: "2030-10-20",
    dayCountConvention: "30/360",
    settlementDays: 2,
    denomination: 100,
    minimumInvestment: { amount: 1000, currency: "AED" },
    incrementSize: { amount: 100, currency: "AED" },
    cleanPrice: 100.40,
    dirtyPrice: 100.55,
    accruedInterest: 0.15,
    ytm: 3.84,
    currentYield: 3.88,
    yieldToWorst: 3.84,
    benchmark: { name: "UAE Gov Curve", spreadToBenchmarkBps: 0 },
    bidPrice: 100.30,
    askPrice: 100.50,
    bidYield: 3.86,
    askYield: 3.82,
    couponRate: 3.9,
    couponFrequency: "semi_annual",
    lastCouponDate: "2025-10-20",
    nextCouponDate: "2026-04-20",
    principalRepaymentType: "bullet",
    couponSchedule: [
      { paymentDate: "2026-04-20", amountPer100: 1.95, currency: "AED" },
      { paymentDate: "2026-10-20", amountPer100: 1.95, currency: "AED" },
      { paymentDate: "2027-04-20", amountPer100: 1.95, currency: "AED" }
    ],
    creditRatingDisplay: "AA (example)",
    ratingAgencies: [{ agency: "Moody's", rating: "Aa (example)", outlook: "Stable", lastReviewedDate: "2025-11-01" }],
    riskLevel: "low",
    duration: 4.9,
    macaulayDuration: 5.1,
    convexity: 0.8,
    interestRateSensitivityNotes: { en: "Prices can move as local interest rates change; longer duration tends to increase sensitivity.", ar: "قد تتغير الأسعار مع تغير أسعار الفائدة المحلية؛ المدة الأطول غالباً تزيد الحساسية." },
    defaultRiskNotes: { en: "Government issuers can still be affected by market conditions.", ar: "قد يتأثر المُصدر الحكومي بظروف السوق أيضاً." },
    countryRiskNotes: { en: "Currency and country factors may matter for investors outside the AED base.", ar: "قد تكون عوامل العملة والدولة مهمة للمستثمرين خارج قاعدة الدرهم." },
    issuerName: "UAE Government (Demo)",
    issuerShortDescription: { en: "Demo government issuer profile for UAE sovereign exposure.", ar: "ملف مُصدر حكومي تجريبي للتعرض السيادي الإماراتي." },
    issuerSector: "Government",
    issuerWebsite: "https://example.com/issuer/uae-government",
    issuerFinancialHighlights: { en: "This is dummy content used to validate page layout and modules.", ar: "هذا محتوى تجريبي لاختبار تصميم الصفحة والوحدات." },
    issuerDocsLinks: [{ name: "Issuer page (demo)", url: "https://example.com/issuer/uae-government" }],
    liquidityScore: 85,
    typicalBidAskBps: 4,
    tradableOnPlatform: true,
    tradingHoursNotes: { en: "Trading availability may vary.", ar: "قد يختلف توفر التداول." },
    earlyExitNotes: { en: "Early sale may result in price differences versus purchase price.", ar: "قد يؤدي البيع المبكر إلى اختلافات في السعر مقارنة بسعر الشراء." },
    heroSummary: { en: "An AED-denominated government bond with fixed coupons and a defined maturity date.", ar: "سند حكومي بالدرهم مع كوبونات ثابتة وتاريخ استحقاق محدد." },
    highlights: { en: ["AED exposure", "Fixed coupon payments", "Defined maturity date"], ar: ["تعرض للدرهم", "دفعات كوبون ثابتة", "تاريخ استحقاق محدد"] },
    howItWorks: { en: "You may receive coupon payments on the schedule shown, and principal is repaid at maturity. Market prices can move prior to maturity.", ar: "قد تتلقى دفعات كوبون وفق الجدول الموضح ويتم سداد أصل الاستثمار عند الاستحقاق. قد تتغير الأسعار قبل الاستحقاق." },
    faq: [{ q: { en: "What is a coupon payment?", ar: "ما هي دفعة الكوبون؟" }, a: { en: "A coupon is the periodic interest payment paid by the issuer to bondholders.", ar: "الكوبون هو دفعة الفائدة الدورية التي يدفعها المُصدر لحاملي السند." } }],
    riskDisclosure: COMMON_RISK_DISCLOSURE,
    disclaimers: COMMON_DISCLAIMERS,
    educationalTooltips: { en: { "YTM": "An annualized estimate of return if held to maturity, based on current price and coupon." }, ar: { "YTM": "تقدير سنوي للعائد إذا تم الاحتفاظ بالسند حتى الاستحقاق بناءً على السعر الحالي والكوبون." } },
    showCharts: false,
    metaTitle: { en: "UAE Government Bond 3.90% (Oct 2030) | Bonds", ar: "سند حكومي إماراتي 3.90% (أكتوبر 2030) | السندات" },
    metaDescription: { en: "Demo UAE government bond page with coupons, yield, and disclosures.", ar: "صفحة سند حكومي إماراتي تجريبية مع الكوبونات والعائد والإفصاحات." },
    ogTitle: { en: "UAE Government Bond 3.90% (Oct 2030)", ar: "سند حكومي إماراتي 3.90% (أكتوبر 2030)" },
    ogDescription: { en: "Demo bond page with key facts and risk notes.", ar: "صفحة سندات تجريبية مع الحقائق الأساسية وملاحظات المخاطر." },
    indexable: true
  },
  {
    title: { en: "Saudi Corporate Bond 5.75% (Mar 2029)", ar: "سند شركة سعودي 5.75% (مارس 2029)" },
    slug: "saudi-corporate-bond-5-75-mar-2029",
    status: "published",
    tags: ["corporate", "usd", "fixed-income"],
    featured: false,
    instrumentType: "corporate",
    issuerType: "corporate",
    couponType: "fixed",
    seniority: "senior_unsecured",
    callable: true,
    putable: false,
    convertible: false,
    guaranteed: false,
    callSchedule: [{ callDate: "2027-03-01", callPrice: 101.0, callType: "Optional" }],
    isin: "SA000000DUMMY3",
    countryOfRisk: "Saudi Arabia",
    issuerCountry: "Saudi Arabia",
    currency: "USD",
    issueDate: "2019-03-01",
    maturityDate: "2029-03-01",
    dayCountConvention: "30/360",
    settlementDays: 2,
    denomination: 100,
    minimumInvestment: { amount: 500, currency: "USD" },
    incrementSize: { amount: 100, currency: "USD" },
    cleanPrice: 97.10,
    dirtyPrice: 97.60,
    accruedInterest: 0.50,
    ytm: 6.15,
    currentYield: 5.92,
    yieldToCall: 6.05,
    yieldToWorst: 6.05,
    spread: { type: "OAS (example)", valueBps: 185 },
    benchmark: { name: "UST", spreadToBenchmarkBps: 185 },
    bidPrice: 96.95,
    askPrice: 97.25,
    bidYield: 6.19,
    askYield: 6.11,
    couponRate: 5.75,
    couponFrequency: "semi_annual",
    lastCouponDate: "2025-09-01",
    nextCouponDate: "2026-03-01",
    principalRepaymentType: "callable",
    couponSchedule: [
      { paymentDate: "2026-03-01", amountPer100: 2.875, currency: "USD" },
      { paymentDate: "2026-09-01", amountPer100: 2.875, currency: "USD" },
      { paymentDate: "2027-03-01", amountPer100: 2.875, currency: "USD" }
    ],
    creditRatingDisplay: "BBB (example)",
    ratingAgencies: [{ agency: "Fitch", rating: "BBB (example)", outlook: "Stable", lastReviewedDate: "2025-10-15" }],
    riskLevel: "medium",
    duration: 4.2,
    macaulayDuration: 4.5,
    convexity: 0.7,
    interestRateSensitivityNotes: { en: "Corporate bonds can be sensitive to both rate moves and credit spreads.", ar: "قد تتأثر سندات الشركات بتغيرات الفائدة واتساع فروق الائتمان." },
    defaultRiskNotes: { en: "Credit conditions and issuer fundamentals can affect market pricing.", ar: "قد تؤثر ظروف الائتمان وأساسيات المُصدر على التسعير في السوق." },
    countryRiskNotes: { en: "Country and regional factors may influence risk perception.", ar: "قد تؤثر عوامل الدولة والمنطقة على تقييم المخاطر." },
    issuerName: "Demo Issuer (Saudi Corporate)",
    issuerShortDescription: { en: "Demo corporate issuer used to test corporate-bond layouts.", ar: "مُصدر شركة تجريبي لاختبار تصميم صفحات سندات الشركات." },
    issuerSector: "Corporate",
    issuerWebsite: "https://example.com/issuer/saudi-corporate-demo",
    issuerFinancialHighlights: { en: "Dummy highlights to validate issuer module rendering.", ar: "ملخصات تجريبية للتحقق من عرض وحدة المُصدر." },
    issuerDocsLinks: [{ name: "Issuer docs (demo)", url: "https://example.com/docs/saudi-corp-demo" }],
    liquidityScore: 60,
    typicalBidAskBps: 25,
    tradableOnPlatform: true,
    tradingHoursNotes: { en: "Liquidity can vary; spreads may widen during volatile periods.", ar: "قد تتغير السيولة؛ وقد تتسع الفروق خلال فترات التقلب." },
    earlyExitNotes: { en: "Exiting early may result in gains or losses based on market price and spreads.", ar: "قد يؤدي الخروج المبكر إلى أرباح أو خسائر حسب سعر السوق والفروق." },
    heroSummary: { en: "A USD corporate bond with fixed coupons and a call feature (see call schedule).", ar: "سند شركة بالدولار مع كوبونات ثابتة وخيار استدعاء (راجع جدول الاستدعاء)." },
    highlights: { en: ["Fixed coupon payments", "Callable feature", "USD-denominated"], ar: ["دفعات كوبون ثابتة", "ميزة الاستدعاء", "مقوم بالدولار الأمريكي"] },
    howItWorks: { en: "This bond pays coupons on schedule. If called, the issuer may repay early according to the call terms.", ar: "يدفع هذا السند كوبونات وفق الجدول. إذا تم استدعاؤه، قد يقوم المُصدر بالسداد المبكر وفق الشروط." },
    faq: [{ q: { en: "What does callable mean?", ar: "ماذا يعني قابل للاستدعاء؟" }, a: { en: "Callable bonds may be repaid early by the issuer under defined terms.", ar: "السندات القابلة للاستدعاء قد يسددها المُصدر مبكراً وفق شروط محددة." } }],
    riskDisclosure: COMMON_RISK_DISCLOSURE,
    disclaimers: COMMON_DISCLAIMERS,
    educationalTooltips: { en: { "Yield to Worst": "The lowest potential yield among call/maturity scenarios, based on current terms." }, ar: { "العائد إلى الأسوأ": "أدنى عائد محتمل بين سيناريوهات الاستدعاء/الاستحقاق بناءً على الشروط الحالية." } },
    showCharts: false,
    metaTitle: { en: "Saudi Corporate Bond 5.75% (Mar 2029) | Bonds", ar: "سند شركة سعودي 5.75% (مارس 2029) | السندات" },
    metaDescription: { en: "Demo corporate bond page with call schedule, yield metrics, and risk disclosures.", ar: "صفحة سندات شركة تجريبية مع جدول الاستدعاء ومقاييس العائد وإفصاحات المخاطر." },
    ogTitle: { en: "Saudi Corporate Bond 5.75% (Mar 2029)", ar: "سند شركة سعودي 5.75% (مارس 2029)" },
    ogDescription: { en: "Demo corporate bond page for CMS seeding.", ar: "صفحة سندات شركة تجريبية لتهيئة نظام إدارة المحتوى." },
    indexable: true
  },
  {
    title: { en: "Investment Grade Corporate Bond 4.20% (Jun 2028)", ar: "سند شركة بدرجة استثمارية 4.20% (يونيو 2028)" },
    slug: "investment-grade-corp-4-20-jun-2028",
    status: "published",
    tags: ["corporate", "usd", "investment-grade"],
    featured: false,
    instrumentType: "corporate",
    issuerType: "corporate",
    couponType: "fixed",
    seniority: "senior_unsecured",
    callable: false,
    putable: false,
    convertible: false,
    guaranteed: false,
    isin: "US000000DUMMY4",
    cusip: "000000BB4",
    countryOfRisk: "United States",
    issuerCountry: "United States",
    currency: "USD",
    issueDate: "2020-06-15",
    maturityDate: "2028-06-15",
    dayCountConvention: "30/360",
    settlementDays: 2,
    denomination: 100,
    minimumInvestment: { amount: 500, currency: "USD" },
    incrementSize: { amount: 100, currency: "USD" },
    cleanPrice: 99.05,
    dirtyPrice: 99.35,
    accruedInterest: 0.30,
    ytm: 4.38,
    currentYield: 4.24,
    yieldToWorst: 4.38,
    spread: { type: "OAS (example)", valueBps: 120 },
    benchmark: { name: "UST", spreadToBenchmarkBps: 120 },
    bidPrice: 98.95,
    askPrice: 99.15,
    bidYield: 4.41,
    askYield: 4.35,
    couponRate: 4.2,
    couponFrequency: "semi_annual",
    lastCouponDate: "2025-12-15",
    nextCouponDate: "2026-06-15",
    principalRepaymentType: "bullet",
    couponSchedule: [
      { paymentDate: "2026-06-15", amountPer100: 2.10, currency: "USD" },
      { paymentDate: "2026-12-15", amountPer100: 2.10, currency: "USD" },
      { paymentDate: "2027-06-15", amountPer100: 2.10, currency: "USD" }
    ],
    creditRatingDisplay: "A- (example)",
    ratingAgencies: [{ agency: "S&P", rating: "A- (example)", outlook: "Stable", lastReviewedDate: "2025-09-20" }],
    riskLevel: "medium",
    duration: 3.6,
    macaulayDuration: 3.8,
    convexity: 0.6,
    interestRateSensitivityNotes: { en: "Investment-grade bonds can still move in price when rates or spreads change.", ar: "قد تتغير أسعار السندات بدرجة استثمارية عند تغير الفائدة أو فروق الائتمان." },
    defaultRiskNotes: { en: "Issuer credit quality is a key risk driver; ratings can change over time.", ar: "جودة ائتمان المُصدر عامل مهم للمخاطر؛ وقد تتغير التصنيفات مع الوقت." },
    countryRiskNotes: { en: "USD instruments may involve FX considerations for non-USD investors.", ar: "قد تتضمن الأدوات بالدولار اعتبارات صرف للمستثمرين غير الدولار." },
    issuerName: "Demo Issuer (Investment Grade)",
    issuerShortDescription: { en: "Demo issuer profile for an investment-grade corporate bond.", ar: "ملف مُصدر تجريبي لسند شركة بدرجة استثمارية." },
    issuerSector: "Corporate",
    issuerWebsite: "https://example.com/issuer/investment-grade-demo",
    issuerFinancialHighlights: { en: "Dummy issuer highlights for layout testing.", ar: "ملخصات مُصدر تجريبية لاختبار التصميم." },
    issuerDocsLinks: [{ name: "Issuer docs (demo)", url: "https://example.com/docs/investment-grade-demo" }],
    liquidityScore: 70,
    typicalBidAskBps: 15,
    tradableOnPlatform: true,
    tradingHoursNotes: { en: "Spreads may vary based on market conditions.", ar: "قد تختلف الفروق حسب ظروف السوق." },
    earlyExitNotes: { en: "Selling before maturity may result in a gain or loss.", ar: "قد يؤدي البيع قبل الاستحقاق إلى ربح أو خسارة." },
    heroSummary: { en: "A demo investment-grade corporate bond with fixed coupons and defined maturity.", ar: "سند شركة تجريبي بدرجة استثمارية مع كوبونات ثابتة واستحقاق محدد." },
    highlights: { en: ["Investment-grade example", "Fixed coupon schedule", "Defined maturity date"], ar: ["مثال بدرجة استثمارية", "جدول كوبون ثابت", "تاريخ استحقاق محدد"] },
    howItWorks: { en: "Coupons may be paid on schedule and principal is returned at maturity. Secondary prices can fluctuate.", ar: "قد تُدفع الكوبونات وفق الجدول ويُعاد أصل الاستثمار عند الاستحقاق. قد تتقلب أسعار السوق الثانوية." },
    faq: [{ q: { en: "Why does bond price move?", ar: "لماذا يتغير سعر السند؟" }, a: { en: "Prices can change due to interest rates, issuer credit spreads, and liquidity conditions.", ar: "قد يتغير السعر بسبب أسعار الفائدة وفروق ائتمان المُصدر وظروف السيولة." } }],
    riskDisclosure: COMMON_RISK_DISCLOSURE,
    disclaimers: COMMON_DISCLAIMERS,
    educationalTooltips: { en: { "Spread": "The difference in yield between a bond and a benchmark, reflecting credit risk." }, ar: { "الفارق": "الفرق في العائد بين السند والمؤشر المرجعي، يعكس مخاطر الائتمان." } },
    showCharts: false,
    metaTitle: { en: "Investment Grade Corporate Bond 4.20% (Jun 2028) | Bonds", ar: "سند شركة بدرجة استثمارية 4.20% (يونيو 2028) | السندات" },
    metaDescription: { en: "Demo investment-grade corporate bond with yield metrics and risk notes.", ar: "سند شركة تجريبي بدرجة استثمارية مع مقاييس العائد وملاحظات المخاطر." },
    ogTitle: { en: "Investment Grade Corporate Bond 4.20% (Jun 2028)", ar: "سند شركة بدرجة استثمارية 4.20% (يونيو 2028)" },
    ogDescription: { en: "Demo bond page for CMS testing.", ar: "صفحة سندات تجريبية لاختبار نظام إدارة المحتوى." },
    indexable: true
  },
  {
    title: { en: "High Yield Corporate Bond 7.25% (Dec 2027)", ar: "سند شركة عالي العائد 7.25% (ديسمبر 2027)" },
    slug: "high-yield-corp-7-25-dec-2027",
    status: "published",
    tags: ["corporate", "usd", "high-yield"],
    featured: true,
    instrumentType: "corporate",
    issuerType: "corporate",
    couponType: "fixed",
    seniority: "subordinated",
    callable: true,
    putable: false,
    convertible: false,
    guaranteed: false,
    callSchedule: [{ callDate: "2026-12-15", callPrice: 103.5, callType: "Optional" }],
    isin: "US000000DUMMY5",
    countryOfRisk: "United States",
    issuerCountry: "United States",
    currency: "USD",
    issueDate: "2022-12-15",
    maturityDate: "2027-12-15",
    dayCountConvention: "30/360",
    settlementDays: 2,
    denomination: 100,
    minimumInvestment: { amount: 1000, currency: "USD" },
    incrementSize: { amount: 100, currency: "USD" },
    cleanPrice: 94.50,
    dirtyPrice: 95.10,
    accruedInterest: 0.60,
    ytm: 8.45,
    currentYield: 7.67,
    yieldToCall: 7.85,
    yieldToWorst: 7.85,
    spread: { type: "OAS (example)", valueBps: 420 },
    benchmark: { name: "UST", spreadToBenchmarkBps: 420 },
    bidPrice: 94.30,
    askPrice: 94.70,
    bidYield: 8.52,
    askYield: 8.38,
    couponRate: 7.25,
    couponFrequency: "semi_annual",
    lastCouponDate: "2025-12-15",
    nextCouponDate: "2026-06-15",
    principalRepaymentType: "callable",
    couponSchedule: [
      { paymentDate: "2026-06-15", amountPer100: 3.625, currency: "USD" },
      { paymentDate: "2026-12-15", amountPer100: 3.625, currency: "USD" },
      { paymentDate: "2027-06-15", amountPer100: 3.625, currency: "USD" }
    ],
    creditRatingDisplay: "BB- (example)",
    ratingAgencies: [{ agency: "S&P", rating: "BB- (example)", outlook: "Stable", lastReviewedDate: "2025-08-10" }],
    riskLevel: "high",
    duration: 2.8,
    macaulayDuration: 3.0,
    convexity: 0.5,
    interestRateSensitivityNotes: { en: "High-yield bonds can be more volatile due to credit sensitivity.", ar: "قد تكون السندات عالية العائد أكثر تقلباً بسبب الحساسية الائتمانية." },
    defaultRiskNotes: { en: "Higher yield often reflects higher credit risk.", ar: "العائد المرتفع غالباً يعكس مخاطر ائتمانية أعلى." },
    countryRiskNotes: { en: "Issuer-specific and market factors can drive price volatility.", ar: "قد تؤدي عوامل المُصدر والسوق إلى تقلب الأسعار." },
    issuerName: "Demo Issuer (High Yield)",
    issuerShortDescription: { en: "Demo high-yield corporate issuer for testing.", ar: "مُصدر شركة تجريبي عالي العائد للاختبار." },
    issuerSector: "Corporate",
    issuerWebsite: "https://example.com/issuer/high-yield-demo",
    issuerFinancialHighlights: { en: "Dummy financial highlights for high-yield issuer.", ar: "ملخصات مالية تجريبية لمُصدر عالي العائد." },
    issuerDocsLinks: [{ name: "Issuer docs (demo)", url: "https://example.com/docs/high-yield-demo" }],
    liquidityScore: 50,
    typicalBidAskBps: 40,
    tradableOnPlatform: true,
    tradingHoursNotes: { en: "Spreads can widen significantly during market stress.", ar: "قد تتسع الفروق بشكل كبير خلال ضغوط السوق." },
    earlyExitNotes: { en: "High-yield bonds may be harder to sell at favorable prices.", ar: "قد يكون بيع السندات عالية العائد بأسعار مواتية أصعب." },
    heroSummary: { en: "A high-yield corporate bond with elevated coupon and call feature.", ar: "سند شركة عالي العائد مع كوبون مرتفع وميزة استدعاء." },
    highlights: { en: ["Higher coupon rate", "Callable bond", "Subordinated seniority"], ar: ["معدل كوبون أعلى", "سند قابل للاستدعاء", "أقدمية ثانوية"] },
    howItWorks: { en: "This bond pays higher coupons but carries higher risk. May be called early.", ar: "يدفع هذا السند كوبونات أعلى لكنه يحمل مخاطر أعلى. قد يُستدعى مبكراً." },
    faq: [{ q: { en: "What is high yield?", ar: "ما هو العائد المرتفع؟" }, a: { en: "High-yield bonds offer higher coupons but have lower credit ratings.", ar: "السندات عالية العائد تقدم كوبونات أعلى لكن تصنيفاتها الائتمانية أقل." } }],
    riskDisclosure: COMMON_RISK_DISCLOSURE,
    disclaimers: COMMON_DISCLAIMERS,
    educationalTooltips: { en: { "High Yield": "Bonds rated below investment grade, offering higher yields with higher risk." }, ar: { "العائد المرتفع": "سندات مصنفة أقل من الدرجة الاستثمارية، تقدم عوائد أعلى مع مخاطر أعلى." } },
    showCharts: false,
    metaTitle: { en: "High Yield Corporate Bond 7.25% (Dec 2027) | Bonds", ar: "سند شركة عالي العائد 7.25% (ديسمبر 2027) | السندات" },
    metaDescription: { en: "Demo high-yield bond with call feature and elevated coupon.", ar: "سند تجريبي عالي العائد مع ميزة استدعاء وكوبون مرتفع." },
    ogTitle: { en: "High Yield Corporate Bond 7.25% (Dec 2027)", ar: "سند شركة عالي العائد 7.25% (ديسمبر 2027)" },
    ogDescription: { en: "Demo high-yield bond page for CMS seeding.", ar: "صفحة سند عالي العائد تجريبية لتهيئة نظام إدارة المحتوى." },
    indexable: true
  },
  {
    title: { en: "Sukuk Al-Ijara 4.80% (Sep 2032)", ar: "صكوك الإجارة 4.80% (سبتمبر 2032)" },
    slug: "sukuk-al-ijara-4-80-sep-2032",
    status: "published",
    tags: ["sukuk", "usd", "islamic-finance"],
    featured: true,
    instrumentType: "sukuk",
    issuerType: "corporate",
    couponType: "fixed",
    seniority: "senior_unsecured",
    callable: false,
    putable: false,
    convertible: false,
    guaranteed: false,
    isin: "XS000000DUMMY6",
    countryOfRisk: "United Arab Emirates",
    issuerCountry: "United Arab Emirates",
    currency: "USD",
    issueDate: "2022-09-01",
    maturityDate: "2032-09-01",
    dayCountConvention: "ACT/360",
    settlementDays: 2,
    denomination: 100,
    minimumInvestment: { amount: 1000, currency: "USD" },
    incrementSize: { amount: 100, currency: "USD" },
    cleanPrice: 101.25,
    dirtyPrice: 101.60,
    accruedInterest: 0.35,
    ytm: 4.65,
    currentYield: 4.74,
    yieldToWorst: 4.65,
    benchmark: { name: "UST", spreadToBenchmarkBps: 95 },
    bidPrice: 101.10,
    askPrice: 101.40,
    bidYield: 4.68,
    askYield: 4.62,
    couponRate: 4.8,
    couponFrequency: "semi_annual",
    lastCouponDate: "2025-09-01",
    nextCouponDate: "2026-03-01",
    principalRepaymentType: "bullet",
    couponSchedule: [
      { paymentDate: "2026-03-01", amountPer100: 2.40, currency: "USD" },
      { paymentDate: "2026-09-01", amountPer100: 2.40, currency: "USD" },
      { paymentDate: "2027-03-01", amountPer100: 2.40, currency: "USD" }
    ],
    creditRatingDisplay: "A (example)",
    ratingAgencies: [{ agency: "Moody's", rating: "A2 (example)", outlook: "Stable", lastReviewedDate: "2025-07-15" }],
    riskLevel: "medium",
    duration: 5.5,
    macaulayDuration: 5.8,
    convexity: 0.85,
    interestRateSensitivityNotes: { en: "Sukuk prices can move with market rates similar to conventional bonds.", ar: "قد تتغير أسعار الصكوك مع أسعار السوق مثل السندات التقليدية." },
    defaultRiskNotes: { en: "Sukuk credit risk depends on the issuer and underlying assets.", ar: "تعتمد مخاطر ائتمان الصكوك على المُصدر والأصول الأساسية." },
    countryRiskNotes: { en: "Cross-border factors may affect returns for international investors.", ar: "قد تؤثر العوامل العابرة للحدود على العوائد للمستثمرين الدوليين." },
    issuerName: "Demo Sukuk Issuer",
    issuerShortDescription: { en: "Demo Islamic finance issuer for sukuk testing.", ar: "مُصدر تمويل إسلامي تجريبي لاختبار الصكوك." },
    issuerSector: "Financial",
    issuerWebsite: "https://example.com/issuer/sukuk-demo",
    issuerFinancialHighlights: { en: "Dummy sukuk issuer profile for CMS testing.", ar: "ملف مُصدر صكوك تجريبي لاختبار نظام إدارة المحتوى." },
    issuerDocsLinks: [{ name: "Sukuk docs (demo)", url: "https://example.com/docs/sukuk-demo" }],
    liquidityScore: 65,
    typicalBidAskBps: 20,
    tradableOnPlatform: true,
    tradingHoursNotes: { en: "Sukuk trading may be available during standard market hours.", ar: "قد يتوفر تداول الصكوك خلال ساعات السوق المعتادة." },
    earlyExitNotes: { en: "Selling sukuk before maturity may result in gains or losses.", ar: "قد يؤدي بيع الصكوك قبل الاستحقاق إلى أرباح أو خسائر." },
    heroSummary: { en: "A Sharia-compliant sukuk with fixed periodic distributions.", ar: "صكوك متوافقة مع الشريعة مع توزيعات دورية ثابتة." },
    highlights: { en: ["Sharia-compliant structure", "Fixed periodic distributions", "USD-denominated"], ar: ["هيكل متوافق مع الشريعة", "توزيعات دورية ثابتة", "مقوم بالدولار الأمريكي"] },
    howItWorks: { en: "Sukuk holders receive periodic distributions based on underlying assets. Principal is returned at maturity.", ar: "يتلقى حاملو الصكوك توزيعات دورية بناءً على الأصول الأساسية. يُعاد أصل الاستثمار عند الاستحقاق." },
    faq: [{ q: { en: "What is a sukuk?", ar: "ما هو الصك؟" }, a: { en: "A sukuk is a Sharia-compliant financial certificate similar to a bond.", ar: "الصك هو شهادة مالية متوافقة مع الشريعة تشبه السند." } }],
    riskDisclosure: COMMON_RISK_DISCLOSURE,
    disclaimers: COMMON_DISCLAIMERS,
    educationalTooltips: { en: { "Sukuk": "Islamic financial certificates representing ownership in underlying assets." }, ar: { "الصكوك": "شهادات مالية إسلامية تمثل ملكية في الأصول الأساسية." } },
    showCharts: false,
    metaTitle: { en: "Sukuk Al-Ijara 4.80% (Sep 2032) | Bonds", ar: "صكوك الإجارة 4.80% (سبتمبر 2032) | السندات" },
    metaDescription: { en: "Demo sukuk page with Islamic finance structure and key facts.", ar: "صفحة صكوك تجريبية مع هيكل التمويل الإسلامي والحقائق الأساسية." },
    ogTitle: { en: "Sukuk Al-Ijara 4.80% (Sep 2032)", ar: "صكوك الإجارة 4.80% (سبتمبر 2032)" },
    ogDescription: { en: "Demo sukuk page for CMS testing.", ar: "صفحة صكوك تجريبية لاختبار نظام إدارة المحتوى." },
    indexable: true
  },
  {
    title: { en: "Emerging Market Sovereign 6.50% (Aug 2033)", ar: "سند سيادي للأسواق الناشئة 6.50% (أغسطس 2033)" },
    slug: "em-sovereign-6-50-aug-2033",
    status: "draft",
    tags: ["government", "usd", "emerging-markets"],
    featured: false,
    instrumentType: "government",
    issuerType: "sovereign",
    couponType: "fixed",
    seniority: "senior_unsecured",
    callable: false,
    putable: false,
    convertible: false,
    guaranteed: false,
    isin: "XS000000DUMMY7",
    countryOfRisk: "Brazil",
    issuerCountry: "Brazil",
    currency: "USD",
    issueDate: "2023-08-15",
    maturityDate: "2033-08-15",
    dayCountConvention: "30/360",
    settlementDays: 2,
    denomination: 100,
    minimumInvestment: { amount: 1000, currency: "USD" },
    incrementSize: { amount: 100, currency: "USD" },
    cleanPrice: 96.80,
    dirtyPrice: 97.30,
    accruedInterest: 0.50,
    ytm: 7.02,
    currentYield: 6.71,
    yieldToWorst: 7.02,
    spread: { type: "Z-spread", valueBps: 280 },
    benchmark: { name: "UST", spreadToBenchmarkBps: 280 },
    bidPrice: 96.60,
    askPrice: 97.00,
    bidYield: 7.08,
    askYield: 6.96,
    couponRate: 6.5,
    couponFrequency: "semi_annual",
    lastCouponDate: "2025-08-15",
    nextCouponDate: "2026-02-15",
    principalRepaymentType: "bullet",
    couponSchedule: [
      { paymentDate: "2026-02-15", amountPer100: 3.25, currency: "USD" },
      { paymentDate: "2026-08-15", amountPer100: 3.25, currency: "USD" },
      { paymentDate: "2027-02-15", amountPer100: 3.25, currency: "USD" }
    ],
    creditRatingDisplay: "BB+ (example)",
    ratingAgencies: [{ agency: "Fitch", rating: "BB+ (example)", outlook: "Negative", lastReviewedDate: "2025-06-01" }],
    riskLevel: "high",
    duration: 6.2,
    macaulayDuration: 6.5,
    convexity: 0.95,
    interestRateSensitivityNotes: { en: "Emerging market bonds can be sensitive to both rate and credit spread changes.", ar: "قد تتأثر سندات الأسواق الناشئة بتغيرات الفائدة وفروق الائتمان." },
    defaultRiskNotes: { en: "Sovereign credit risk in emerging markets can be elevated.", ar: "قد تكون مخاطر الائتمان السيادي في الأسواق الناشئة مرتفعة." },
    countryRiskNotes: { en: "Political and economic factors in the issuing country can affect bond value.", ar: "قد تؤثر العوامل السياسية والاقتصادية في الدولة المُصدرة على قيمة السند." },
    issuerName: "Demo EM Sovereign",
    issuerShortDescription: { en: "Demo emerging market sovereign issuer.", ar: "مُصدر سيادي تجريبي للأسواق الناشئة." },
    issuerSector: "Government",
    issuerWebsite: "https://example.com/issuer/em-sovereign-demo",
    issuerFinancialHighlights: { en: "Dummy EM sovereign profile for testing.", ar: "ملف سيادي تجريبي للأسواق الناشئة للاختبار." },
    issuerDocsLinks: [{ name: "Sovereign docs (demo)", url: "https://example.com/docs/em-sovereign-demo" }],
    liquidityScore: 55,
    typicalBidAskBps: 35,
    tradableOnPlatform: true,
    tradingHoursNotes: { en: "EM bonds may have wider spreads during volatile periods.", ar: "قد تكون فروق سندات الأسواق الناشئة أوسع خلال فترات التقلب." },
    earlyExitNotes: { en: "Selling EM bonds early may result in significant price differences.", ar: "قد يؤدي بيع سندات الأسواق الناشئة مبكراً إلى فروق كبيرة في السعر." },
    heroSummary: { en: "A USD-denominated emerging market sovereign bond with fixed coupons.", ar: "سند سيادي للأسواق الناشئة بالدولار مع كوبونات ثابتة." },
    highlights: { en: ["Emerging market exposure", "USD-denominated", "Fixed coupon schedule"], ar: ["تعرض للأسواق الناشئة", "مقوم بالدولار", "جدول كوبون ثابت"] },
    howItWorks: { en: "Coupons are paid semi-annually and principal is returned at maturity. Prices can fluctuate.", ar: "تُدفع الكوبونات نصف سنوياً ويُعاد أصل الاستثمار عند الاستحقاق. قد تتقلب الأسعار." },
    faq: [{ q: { en: "What are emerging market bonds?", ar: "ما هي سندات الأسواق الناشئة؟" }, a: { en: "Bonds issued by governments or companies in developing economies.", ar: "سندات تصدرها حكومات أو شركات في الاقتصادات النامية." } }],
    riskDisclosure: COMMON_RISK_DISCLOSURE,
    disclaimers: COMMON_DISCLAIMERS,
    educationalTooltips: { en: { "Emerging Markets": "Economies transitioning toward developed market status." }, ar: { "الأسواق الناشئة": "اقتصادات في مرحلة انتقالية نحو وضع الأسواق المتقدمة." } },
    showCharts: false,
    metaTitle: { en: "Emerging Market Sovereign 6.50% (Aug 2033) | Bonds", ar: "سند سيادي للأسواق الناشئة 6.50% (أغسطس 2033) | السندات" },
    metaDescription: { en: "Demo EM sovereign bond with yield metrics and risk disclosures.", ar: "سند سيادي تجريبي للأسواق الناشئة مع مقاييس العائد وإفصاحات المخاطر." },
    ogTitle: { en: "Emerging Market Sovereign 6.50% (Aug 2033)", ar: "سند سيادي للأسواق الناشئة 6.50% (أغسطس 2033)" },
    ogDescription: { en: "Demo EM bond page (draft status).", ar: "صفحة سند تجريبية للأسواق الناشئة (حالة مسودة)." },
    indexable: false
  },
  {
    title: { en: "Zero Coupon Treasury STRIP (Nov 2035)", ar: "سند خزانة بدون كوبون (نوفمبر 2035)" },
    slug: "zero-coupon-treasury-strip-nov-2035",
    status: "draft",
    tags: ["government", "usd", "zero-coupon"],
    featured: false,
    instrumentType: "treasury",
    issuerType: "sovereign",
    couponType: "zero",
    seniority: "senior_unsecured",
    callable: false,
    putable: false,
    convertible: false,
    guaranteed: true,
    isin: "US000000DUMMY8",
    cusip: "000000CC8",
    countryOfRisk: "United States",
    issuerCountry: "United States",
    currency: "USD",
    issueDate: "2020-11-15",
    maturityDate: "2035-11-15",
    dayCountConvention: "ACT/ACT",
    settlementDays: 1,
    denomination: 100,
    minimumInvestment: { amount: 100, currency: "USD" },
    incrementSize: { amount: 100, currency: "USD" },
    cleanPrice: 62.50,
    dirtyPrice: 62.50,
    accruedInterest: 0,
    ytm: 4.85,
    currentYield: 0,
    yieldToWorst: 4.85,
    benchmark: { name: "UST", spreadToBenchmarkBps: 0 },
    bidPrice: 62.40,
    askPrice: 62.60,
    bidYield: 4.87,
    askYield: 4.83,
    couponRate: 0,
    couponFrequency: "none",
    principalRepaymentType: "bullet",
    creditRatingDisplay: "AAA (example)",
    ratingAgencies: [{ agency: "S&P", rating: "AAA", outlook: "Stable", lastReviewedDate: "2025-11-01" }],
    riskLevel: "low",
    duration: 9.8,
    macaulayDuration: 9.8,
    convexity: 1.2,
    interestRateSensitivityNotes: { en: "Zero coupon bonds have higher duration sensitivity to rate changes.", ar: "سندات الكوبون الصفري لها حساسية مدة أعلى لتغيرات الفائدة." },
    defaultRiskNotes: { en: "US Treasury STRIPs are backed by the full faith and credit of the US government.", ar: "سندات الخزانة الأمريكية مدعومة بالثقة والائتمان الكامل لحكومة الولايات المتحدة." },
    countryRiskNotes: { en: "Currency considerations apply for non-USD investors.", ar: "تنطبق اعتبارات العملة على المستثمرين غير الدولار." },
    issuerName: "United States Treasury",
    issuerShortDescription: { en: "Zero coupon strips backed by US Treasury.", ar: "سندات بدون كوبون مدعومة من الخزانة الأمريكية." },
    issuerSector: "Government",
    issuerWebsite: "https://home.treasury.gov/",
    issuerFinancialHighlights: { en: "Demo zero coupon treasury profile.", ar: "ملف خزانة بدون كوبون تجريبي." },
    issuerDocsLinks: [{ name: "Treasury docs", url: "https://example.com/docs/treasury-strip" }],
    liquidityScore: 90,
    typicalBidAskBps: 3,
    tradableOnPlatform: true,
    tradingHoursNotes: { en: "Trading availability may vary.", ar: "قد يختلف توفر التداول." },
    earlyExitNotes: { en: "Selling before maturity may result in significant gain or loss due to duration.", ar: "قد يؤدي البيع قبل الاستحقاق إلى ربح أو خسارة كبيرة بسبب المدة." },
    heroSummary: { en: "A zero coupon US Treasury STRIP purchased at a discount to face value.", ar: "سند خزانة أمريكي بدون كوبون يُشترى بخصم من القيمة الاسمية." },
    highlights: { en: ["No periodic coupons", "Purchased at discount", "Returns face value at maturity"], ar: ["بدون كوبونات دورية", "يُشترى بخصم", "يُعيد القيمة الاسمية عند الاستحقاق"] },
    howItWorks: { en: "Zero coupon bonds pay no periodic interest. Investors buy at a discount and receive face value at maturity.", ar: "لا تدفع سندات الكوبون الصفري فوائد دورية. يشتري المستثمرون بخصم ويستلمون القيمة الاسمية عند الاستحقاق." },
    faq: [{ q: { en: "What is a zero coupon bond?", ar: "ما هو سند الكوبون الصفري؟" }, a: { en: "A bond that pays no coupons and is sold at a discount to its face value.", ar: "سند لا يدفع كوبونات ويُباع بخصم من قيمته الاسمية." } }],
    riskDisclosure: COMMON_RISK_DISCLOSURE,
    disclaimers: COMMON_DISCLAIMERS,
    educationalTooltips: { en: { "Zero Coupon": "A bond that makes no periodic payments and is issued at a discount." }, ar: { "الكوبون الصفري": "سند لا يقدم دفعات دورية ويُصدر بخصم." } },
    showCharts: false,
    metaTitle: { en: "Zero Coupon Treasury STRIP (Nov 2035) | Bonds", ar: "سند خزانة بدون كوبون (نوفمبر 2035) | السندات" },
    metaDescription: { en: "Demo zero coupon Treasury STRIP with yield and duration metrics.", ar: "سند خزانة تجريبي بدون كوبون مع مقاييس العائد والمدة." },
    ogTitle: { en: "Zero Coupon Treasury STRIP (Nov 2035)", ar: "سند خزانة بدون كوبون (نوفمبر 2035)" },
    ogDescription: { en: "Demo zero coupon bond page (draft status).", ar: "صفحة سند بدون كوبون تجريبية (حالة مسودة)." },
    indexable: false
  }
];

function mapSeedDataToBondPage(data: SeedBondData, index: number): InsertBondPage {
  const now = new Date().toISOString();
  
  const couponSchedule: BondCouponScheduleEntry[] = (data.couponSchedule || []).map(c => ({
    date: c.paymentDate,
    amount: c.amountPer100,
    isEstimated: false
  }));

  const ratingAgencies: BondRatingAgency[] = (data.ratingAgencies || []).map(r => ({
    agency: r.agency,
    rating: r.rating,
    outlook: r.outlook as 'stable' | 'positive' | 'negative' | 'watch' | undefined,
    lastReviewedDate: r.lastReviewedDate
  }));

  const faq: BondFaqEntry[] = (data.faq || []).map(f => ({
    question_en: f.q.en,
    question_ar: f.q.ar,
    answer_en: f.a.en,
    answer_ar: f.a.ar
  }));

  const highlights: BondHighlightEntry[] = [];
  if (data.highlights) {
    const enHighlights = data.highlights.en || [];
    const arHighlights = data.highlights.ar || [];
    for (let i = 0; i < Math.max(enHighlights.length, arHighlights.length); i++) {
      highlights.push({
        text_en: enHighlights[i] || '',
        text_ar: arHighlights[i] || ''
      });
    }
  }

  const disclaimers: BondDisclaimerEntry[] = [];
  if (data.disclaimers) {
    const enDisclaimers = data.disclaimers.en || [];
    const arDisclaimers = data.disclaimers.ar || [];
    for (let i = 0; i < Math.max(enDisclaimers.length, arDisclaimers.length); i++) {
      disclaimers.push({
        title_en: 'Disclaimer',
        title_ar: 'إخلاء المسؤولية',
        content_en: enDisclaimers[i] || '',
        content_ar: arDisclaimers[i] || ''
      });
    }
  }

  const educationalTooltips: BondTooltipEntry[] = [];
  if (data.educationalTooltips) {
    const enTooltips = data.educationalTooltips.en || {};
    const arTooltips = data.educationalTooltips.ar || {};
    for (const key of Object.keys(enTooltips)) {
      const arKey = Object.keys(arTooltips)[Object.keys(enTooltips).indexOf(key)] || key;
      educationalTooltips.push({
        term_en: key,
        term_ar: arKey,
        definition_en: enTooltips[key],
        definition_ar: arTooltips[arKey] || ''
      });
    }
  }

  const incomeCalculatorDefaults: BondIncomeCalculatorDefaults = {
    defaultInvestmentAmount: data.minimumInvestment?.amount || 1000,
    showIncomeEstimate: true,
    disclaimer_en: INCOME_DISCLAIMER.en,
    disclaimer_ar: INCOME_DISCLAIMER.ar
  };

  const callSchedule: BondCallPutScheduleEntry[] = (data.callSchedule || []).map(c => ({
    date: c.callDate,
    price: c.callPrice,
    type: 'call' as const
  }));

  const issuerDocsLinks: BondIssuerDocLink[] = (data.issuerDocsLinks || []).map(d => ({
    name_en: d.name,
    name_ar: d.name,
    url: d.url
  }));

  const seo_en: BondPageSEO = {
    metaTitle: data.metaTitle?.en || data.title.en,
    metaDescription: data.metaDescription?.en || '',
    ogTitle: data.ogTitle?.en || data.title.en,
    ogDescription: data.ogDescription?.en || '',
    indexable: data.indexable !== false
  };

  const seo_ar: BondPageSEO = {
    metaTitle: data.metaTitle?.ar || data.title.ar,
    metaDescription: data.metaDescription?.ar || '',
    ogTitle: data.ogTitle?.ar || data.title.ar,
    ogDescription: data.ogDescription?.ar || '',
    indexable: data.indexable !== false
  };

  const pageBuilderJson: BondPageBlock[] = [
    { id: '1', type: 'bond_hero', visible: true, order: 0, showYtm: true, showCoupon: true, showMaturity: true, showRating: true, ctaText_en: 'Learn More', ctaText_ar: 'اعرف المزيد', ctaUrl: '#' },
    { id: '2', type: 'key_facts', visible: true, order: 1, facts: ['currency', 'couponRate', 'maturityDate', 'ytm'] },
    { id: '3', type: 'issuer_profile', visible: true, order: 2, showLogo: true, showFinancials: true, showDocuments: true },
    { id: '4', type: 'risk_summary', visible: true, order: 3, showRatings: true, showDuration: true, showNotes: true },
    { id: '5', type: 'disclosures', visible: true, order: 4, showRiskDisclosure: true, showDisclaimers: true }
  ];

  return {
    title_en: data.title.en,
    title_ar: data.title.ar,
    slug: data.slug,
    status: data.status,
    tags: data.tags,
    featured: data.featured,
    instrumentType: data.instrumentType as any,
    issuerType: data.issuerType as any,
    couponType: data.couponType as any,
    seniority: data.seniority as any,
    callable: data.callable,
    callSchedule: callSchedule.length > 0 ? callSchedule : undefined,
    putable: data.putable,
    convertible: data.convertible,
    guaranteed: data.guaranteed,
    isin: data.isin,
    cusip: data.cusip,
    issuerCountry: data.issuerCountry,
    countryOfRisk: data.countryOfRisk,
    currency: data.currency,
    issueDate: data.issueDate,
    maturityDate: data.maturityDate,
    isPerpetual: false,
    settlementDays: data.settlementDays,
    denomination: data.denomination,
    minInvestment: data.minimumInvestment?.amount,
    incrementSize: data.incrementSize?.amount,
    dayCountConvention: data.dayCountConvention as any,
    cleanPrice: data.cleanPrice,
    dirtyPrice: data.dirtyPrice,
    accruedInterest: data.accruedInterest,
    ytm: data.ytm,
    currentYield: data.currentYield,
    yieldToCall: data.yieldToCall,
    yieldToWorst: data.yieldToWorst,
    spreadValue: data.spread?.valueBps ?? undefined,
    spreadType: data.spread?.type as any,
    benchmark: data.benchmark?.name,
    spreadToBenchmark: data.benchmark?.spreadToBenchmarkBps,
    bidPrice: data.bidPrice,
    bidYield: data.bidYield,
    askPrice: data.askPrice,
    askYield: data.askYield,
    priceLastUpdatedAt: now,
    priceSource: 'manual',
    couponRate: data.couponRate,
    couponFrequency: data.couponFrequency as any,
    nextCouponDate: data.nextCouponDate,
    lastCouponDate: data.lastCouponDate,
    principalRepaymentType: data.principalRepaymentType as any,
    couponSchedule: couponSchedule.length > 0 ? couponSchedule : undefined,
    incomeCalculatorDefaults,
    creditRatingDisplay: data.creditRatingDisplay,
    ratingAgencies: ratingAgencies.length > 0 ? ratingAgencies : undefined,
    riskLevel: data.riskLevel as any,
    duration: data.duration,
    macaulayDuration: data.macaulayDuration,
    convexity: data.convexity,
    interestRateSensitivityNotes_en: data.interestRateSensitivityNotes?.en,
    interestRateSensitivityNotes_ar: data.interestRateSensitivityNotes?.ar,
    defaultRiskNotes_en: data.defaultRiskNotes?.en,
    defaultRiskNotes_ar: data.defaultRiskNotes?.ar,
    countryRiskNotes_en: data.countryRiskNotes?.en,
    countryRiskNotes_ar: data.countryRiskNotes?.ar,
    issuerName_en: data.issuerName,
    issuerName_ar: data.issuerName,
    issuerShortDescription_en: data.issuerShortDescription?.en,
    issuerShortDescription_ar: data.issuerShortDescription?.ar,
    issuerSector: data.issuerSector,
    issuerWebsite: data.issuerWebsite,
    issuerFinancialHighlights_en: data.issuerFinancialHighlights?.en,
    issuerFinancialHighlights_ar: data.issuerFinancialHighlights?.ar,
    issuerDocsLinks: issuerDocsLinks.length > 0 ? issuerDocsLinks : undefined,
    liquidityScore: data.liquidityScore,
    typicalBidAskBps: data.typicalBidAskBps,
    tradableOnPlatform: data.tradableOnPlatform !== false,
    tradingHoursNotes_en: data.tradingHoursNotes?.en,
    tradingHoursNotes_ar: data.tradingHoursNotes?.ar,
    earlyExitNotes_en: data.earlyExitNotes?.en,
    earlyExitNotes_ar: data.earlyExitNotes?.ar,
    heroSummary_en: data.heroSummary?.en,
    heroSummary_ar: data.heroSummary?.ar,
    highlights: highlights.length > 0 ? highlights : undefined,
    howItWorks_en: data.howItWorks?.en,
    howItWorks_ar: data.howItWorks?.ar,
    faq: faq.length > 0 ? faq : undefined,
    riskDisclosure_en: data.riskDisclosure.en,
    riskDisclosure_ar: data.riskDisclosure.ar,
    disclaimers: disclaimers.length > 0 ? disclaimers : undefined,
    educationalTooltips: educationalTooltips.length > 0 ? educationalTooltips : undefined,
    showCharts: data.showCharts || false,
    seo_en,
    seo_ar,
    pageBuilderJson,
    complianceStatus: 'pending',
    requiredDisclosuresPresent: true,
    publishedAt: data.status === 'published' ? now : undefined
  };
}

async function seedBonds() {
  console.log('Starting bond page seeding...\n');
  
  const results: Array<{
    slug: string;
    'title.en': string;
    issuerName: string;
    currency: string;
    ytm: number | string;
    maturityDate: string;
    status: string;
    complianceStatus: string;
  }> = [];

  for (let i = 0; i < bondSeedData.length; i++) {
    const data = bondSeedData[i];
    const bondPage = mapSeedDataToBondPage(data, i);
    
    try {
      const existingRes = await fetch(`${BASE_URL}/api/bond-pages?slug=${data.slug}`);
      let bondId: string;
      let action: string;

      if (existingRes.ok) {
        const existingBonds = await existingRes.json() as BondPage[];
        const existing = existingBonds.find(b => b.slug === data.slug);
        
        if (existing) {
          const updateRes = await fetch(`${BASE_URL}/api/bond-pages/${existing.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bondPage)
          });
          
          if (!updateRes.ok) {
            throw new Error(`Failed to update bond: ${await updateRes.text()}`);
          }
          
          bondId = existing.id;
          action = 'Updated';
        } else {
          const createRes = await fetch(`${BASE_URL}/api/bond-pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bondPage)
          });
          
          if (!createRes.ok) {
            throw new Error(`Failed to create bond: ${await createRes.text()}`);
          }
          
          const created = await createRes.json() as BondPage;
          bondId = created.id;
          action = 'Created';
        }
      } else {
        const createRes = await fetch(`${BASE_URL}/api/bond-pages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bondPage)
        });
        
        if (!createRes.ok) {
          throw new Error(`Failed to create bond: ${await createRes.text()}`);
        }
        
        const created = await createRes.json() as BondPage;
        bondId = created.id;
        action = 'Created';
      }

      console.log(`${action}: ${data.title.en} (${data.slug})`);

      const scanRes = await fetch(`${BASE_URL}/api/bond-pages/${bondId}/compliance-scan`, {
        method: 'POST'
      });
      
      let complianceStatus = 'pending';
      if (scanRes.ok) {
        const scanResult = await scanRes.json() as BondPage;
        complianceStatus = scanResult.complianceStatus;
        console.log(`  Compliance scan: ${complianceStatus}`);
      } else {
        console.log(`  Compliance scan failed: ${await scanRes.text()}`);
      }

      results.push({
        slug: data.slug,
        'title.en': data.title.en,
        issuerName: data.issuerName,
        currency: data.currency,
        ytm: data.ytm ?? 'N/A',
        maturityDate: data.maturityDate || 'Perpetual',
        status: data.status,
        complianceStatus
      });
      
    } catch (error) {
      console.error(`Error processing ${data.slug}:`, error);
      results.push({
        slug: data.slug,
        'title.en': data.title.en,
        issuerName: data.issuerName,
        currency: data.currency,
        ytm: data.ytm ?? 'N/A',
        maturityDate: data.maturityDate || 'Perpetual',
        status: data.status,
        complianceStatus: 'error'
      });
    }
  }

  console.log('\n========================================');
  console.log('SEEDED BOND PAGES SUMMARY');
  console.log('========================================\n');
  console.table(results);

  console.log('\n========================================');
  console.log('PUBLIC URLS');
  console.log('========================================\n');
  
  for (const result of results) {
    console.log(`/bonds/${result.slug}`);
  }
  
  console.log('\n========================================');
  console.log(`Total: ${results.length} bonds seeded`);
  console.log(`Published: ${results.filter(r => r.status === 'published').length}`);
  console.log(`Draft: ${results.filter(r => r.status === 'draft').length}`);
  console.log('========================================\n');
}

seedBonds().catch(console.error);
