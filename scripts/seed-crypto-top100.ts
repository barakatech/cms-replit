import { MemStorage } from '../server/storage';
import type { InsertCryptoPage } from '../shared/schema';

const STABLECOIN_SYMBOLS = ['USDT', 'USDC', 'DAI', 'FDUSD', 'TUSD', 'USDE', 'USDP', 'PYUSD'];

interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_date: string | null;
  last_updated: string;
}

const MANDATORY_DISCLAIMERS = {
  en: ['This page is for information only and is not investment advice.'],
  ar: ['هذه الصفحة لأغراض معلوماتية فقط وليست نصيحة استثمارية.'],
};

function generateEditorialContent(coin: CoinGeckoCoin) {
  const symbol = coin.symbol.toUpperCase();
  const name = coin.name;
  const rank = coin.market_cap_rank || 'N/A';

  return {
    whatIsIt_en: `<p><strong>${name} (${symbol})</strong> is a cryptocurrency ranked #${rank} by market capitalization. It operates on blockchain technology, enabling secure and transparent transactions without the need for intermediaries.</p><p>As with all cryptocurrencies, ${name} is subject to market volatility and regulatory developments. Investors should conduct their own research before making any investment decisions.</p>`,
    whatIsIt_ar: `<p><strong>${name} (${symbol})</strong> هي عملة رقمية تحتل المرتبة #${rank} من حيث القيمة السوقية. تعمل على تقنية البلوكتشين، مما يتيح معاملات آمنة وشفافة دون الحاجة إلى وسطاء.</p><p>مثل جميع العملات الرقمية، تخضع ${name} لتقلبات السوق والتطورات التنظيمية. يجب على المستثمرين إجراء أبحاثهم الخاصة قبل اتخاذ أي قرارات استثمارية.</p>`,
    
    howItWorks_en: `<p>${name} utilizes distributed ledger technology to record all transactions on a public blockchain. This creates a transparent and immutable record that can be verified by anyone.</p><p>Transactions are validated by network participants using consensus mechanisms, ensuring the integrity of the network without requiring a central authority.</p>`,
    howItWorks_ar: `<p>تستخدم ${name} تقنية السجل الموزع لتسجيل جميع المعاملات على بلوكتشين عام. هذا يخلق سجلاً شفافاً وغير قابل للتغيير يمكن التحقق منه من قبل أي شخص.</p><p>يتم التحقق من المعاملات من قبل المشاركين في الشبكة باستخدام آليات الإجماع، مما يضمن سلامة الشبكة دون الحاجة إلى سلطة مركزية.</p>`,
    
    risks_en: `<p><strong>Important Risk Disclosures:</strong></p><ul><li><strong>Market Volatility:</strong> Cryptocurrency prices can fluctuate significantly in short periods. Past performance is not indicative of future results.</li><li><strong>Regulatory Risk:</strong> Cryptocurrency regulations vary by jurisdiction and may change, potentially affecting the asset's value and usability.</li><li><strong>Technology Risk:</strong> Smart contracts and blockchain networks may contain vulnerabilities or bugs that could result in loss of funds.</li><li><strong>Liquidity Risk:</strong> Some cryptocurrencies may have limited liquidity, making it difficult to buy or sell at desired prices.</li><li><strong>Loss of Capital:</strong> You may lose some or all of your invested capital. Only invest what you can afford to lose.</li></ul>`,
    risks_ar: `<p><strong>إفصاحات المخاطر المهمة:</strong></p><ul><li><strong>تقلبات السوق:</strong> يمكن أن تتقلب أسعار العملات الرقمية بشكل كبير في فترات قصيرة. الأداء السابق ليس مؤشراً على النتائج المستقبلية.</li><li><strong>المخاطر التنظيمية:</strong> تختلف لوائح العملات الرقمية حسب الولاية القضائية وقد تتغير، مما قد يؤثر على قيمة الأصل وقابليته للاستخدام.</li><li><strong>مخاطر التكنولوجيا:</strong> قد تحتوي العقود الذكية وشبكات البلوكتشين على ثغرات أو أخطاء قد تؤدي إلى خسارة الأموال.</li><li><strong>مخاطر السيولة:</strong> قد يكون لبعض العملات الرقمية سيولة محدودة، مما يجعل من الصعب الشراء أو البيع بالأسعار المرغوبة.</li><li><strong>خسارة رأس المال:</strong> قد تخسر بعض أو كل رأس المال المستثمر. استثمر فقط ما يمكنك تحمل خسارته.</li></ul>`,
    
    heroSummary_en: `${name} (${symbol}) is ranked #${rank} by market capitalization. Track real-time price, market data, and learn more about ${name} on baraka.`,
    heroSummary_ar: `${name} (${symbol}) تحتل المرتبة #${rank} من حيث القيمة السوقية. تتبع السعر في الوقت الفعلي وبيانات السوق وتعرف على المزيد عن ${name} على بركة.`,
    
    metaTitle_en: `${name} (${symbol}) Price, Charts & Market Data | baraka`,
    metaTitle_ar: `سعر ${name} (${symbol}) والرسوم البيانية وبيانات السوق | بركة`,
    
    metaDescription_en: `Get the latest ${name} price, market cap, trading volume, and detailed analysis. Track ${symbol} price charts and learn more about ${name}.`,
    metaDescription_ar: `احصل على أحدث سعر ${name} والقيمة السوقية وحجم التداول والتحليل التفصيلي. تتبع مخططات أسعار ${symbol}.`,
    
    faq: [
      {
        question_en: `What is ${name} (${symbol})?`,
        question_ar: `ما هو ${name} (${symbol})؟`,
        answer_en: `${name} is a cryptocurrency that operates on blockchain technology. It is ranked #${rank} by market capitalization and can be traded on various cryptocurrency exchanges.`,
        answer_ar: `${name} هي عملة رقمية تعمل على تقنية البلوكتشين. تحتل المرتبة #${rank} من حيث القيمة السوقية ويمكن تداولها على مختلف بورصات العملات الرقمية.`,
      },
      {
        question_en: `Is ${name} a good investment?`,
        question_ar: `هل ${name} استثمار جيد؟`,
        answer_en: `We cannot provide investment advice. All cryptocurrency investments carry significant risk, and you should conduct your own research and consider your risk tolerance before investing. Never invest more than you can afford to lose.`,
        answer_ar: `لا يمكننا تقديم نصائح استثمارية. جميع استثمارات العملات الرقمية تحمل مخاطر كبيرة، ويجب عليك إجراء بحثك الخاص والنظر في تحملك للمخاطر قبل الاستثمار. لا تستثمر أبداً أكثر مما يمكنك تحمل خسارته.`,
      },
    ],
  };
}

function determineAssetType(coin: CoinGeckoCoin): 'coin' | 'token' | 'stablecoin' | 'wrapped' | 'defi' | 'nft' | 'meme' {
  const symbolUpper = coin.symbol.toUpperCase();
  const nameLower = coin.name.toLowerCase();
  
  if (STABLECOIN_SYMBOLS.includes(symbolUpper) || nameLower.includes('usd')) {
    return 'stablecoin';
  }
  if (nameLower.includes('wrapped') || symbolUpper.startsWith('W')) {
    return 'wrapped';
  }
  if (nameLower.includes('meme') || nameLower.includes('doge') || nameLower.includes('shib') || nameLower.includes('pepe')) {
    return 'meme';
  }
  return 'coin';
}

async function seedCryptoTop100() {
  console.log('🚀 Starting crypto top 100 seed...\n');
  
  const storage = new MemStorage();
  
  console.log('📡 Fetching top 100 coins from CoinGecko...');
  
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d'
  );
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }
  
  const coins: CoinGeckoCoin[] = await response.json();
  console.log(`✅ Fetched ${coins.length} coins\n`);
  
  let createdCount = 0;
  let updatedCount = 0;
  let publishedCount = 0;
  let needsReviewCount = 0;
  const sampleUrls: string[] = [];
  
  for (const coin of coins) {
    const symbol = coin.symbol.toUpperCase();
    const slug = `${symbol.toLowerCase()}-${coin.id}`;
    const rank = coin.market_cap_rank || 9999;
    const isFeatured = rank <= 10;
    const assetType = determineAssetType(coin);
    const isStablecoin = assetType === 'stablecoin';
    
    const content = generateEditorialContent(coin);
    
    const existingPage = await storage.getCryptoPageByCoingeckoId(coin.id);
    
    const pageData = {
      coingeckoId: coin.id,
      symbol,
      name: coin.name,
      slug,
      title_en: coin.name,
      title_ar: coin.name,
      marketCapRank: rank,
      status: 'published' as const,
      featured: isFeatured,
      tags: [] as string[],
      indexable: false,
      editorialLocked: false,
      assetType,
      isStablecoin,
      languageDefault: 'en' as const,
      complianceStatus: 'pass' as const,
      requiredDisclosuresPresent: true,
      
      heroSummary_en: content.heroSummary_en,
      heroSummary_ar: content.heroSummary_ar,
      whatIsIt_en: content.whatIsIt_en,
      whatIsIt_ar: content.whatIsIt_ar,
      howItWorks_en: content.howItWorks_en,
      howItWorks_ar: content.howItWorks_ar,
      risks_en: content.risks_en,
      risks_ar: content.risks_ar,
      
      disclaimers_en: MANDATORY_DISCLAIMERS.en,
      disclaimers_ar: MANDATORY_DISCLAIMERS.ar,
      
      metaTitle_en: content.metaTitle_en,
      metaTitle_ar: content.metaTitle_ar,
      metaDescription_en: content.metaDescription_en,
      metaDescription_ar: content.metaDescription_ar,
      ogImage: coin.image,
      
      pageModules: [
        { id: 'hero', type: 'hero' as const, enabled: true, order: 1 },
        { id: 'price_chart', type: 'price_chart' as const, enabled: true, order: 2 },
        { id: 'key_stats', type: 'key_stats' as const, enabled: true, order: 3 },
        { id: 'about', type: 'about' as const, enabled: true, order: 4 },
        { id: 'how_it_works', type: 'how_it_works' as const, enabled: true, order: 5 },
        { id: 'use_cases', type: 'use_cases' as const, enabled: true, order: 6 },
        { id: 'markets_table', type: 'markets_table' as const, enabled: true, order: 7 },
        { id: 'news_feed', type: 'news_feed' as const, enabled: true, order: 8 },
        { id: 'related_assets', type: 'related_assets' as const, enabled: true, order: 9 },
        { id: 'risk_callout', type: 'risk_callout' as const, enabled: true, order: 10 },
        { id: 'faq', type: 'faq' as const, enabled: true, order: 11 },
        { id: 'disclosures', type: 'disclosures' as const, enabled: true, order: 12 },
        { id: 'quick_trade_cta', type: 'quick_trade_cta' as const, enabled: true, order: 13 },
      ],
    };
    
    if (existingPage) {
      if (!existingPage.editorialLocked) {
        await storage.updateCryptoPage(existingPage.id, pageData);
        updatedCount++;
      }
    } else {
      await storage.createCryptoPage(pageData);
      createdCount++;
    }
    
    await storage.upsertCryptoMarketSnapshot({
      provider: 'coingecko',
      providerCoinId: coin.id,
      symbol,
      name: coin.name,
      image: coin.image,
      rank,
      priceUsd: coin.current_price ?? 0,
      marketCapUsd: coin.market_cap ?? 0,
      volume24hUsd: coin.total_volume ?? 0,
      priceChange24hPct: coin.price_change_percentage_24h ?? 0,
      circulatingSupply: coin.circulating_supply ?? undefined,
      totalSupply: coin.total_supply ?? undefined,
      maxSupply: coin.max_supply ?? undefined,
      athUsd: coin.ath ?? undefined,
      athDate: coin.ath_date ?? undefined,
      atlUsd: coin.atl ?? undefined,
      atlDate: coin.atl_date ?? undefined,
      lastUpdatedAt: coin.last_updated || new Date().toISOString(),
    });
    
    publishedCount++;
    
    if (sampleUrls.length < 20) {
      sampleUrls.push(`/crypto/${slug}`);
    }
    
    console.log(`  ${isFeatured ? '⭐' : '  '} #${rank.toString().padStart(3)} ${coin.name} (${symbol}) -> ${slug}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SEED SUMMARY');
  console.log('='.repeat(60));
  console.log(`  Created:       ${createdCount}`);
  console.log(`  Updated:       ${updatedCount}`);
  console.log(`  Published:     ${publishedCount}`);
  console.log(`  Needs Review:  ${needsReviewCount}`);
  console.log('');
  console.log('📍 Sample URLs (first 20):');
  sampleUrls.forEach(url => console.log(`  ${url}`));
  console.log('');
  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Start the dev server: npm run dev');
  console.log('  2. Visit CMS: /admin/crypto');
  console.log('  3. Visit public: /crypto');
  console.log('  4. Visit demo gallery: /crypto/demo-gallery');
}

seedCryptoTop100().catch(console.error);
