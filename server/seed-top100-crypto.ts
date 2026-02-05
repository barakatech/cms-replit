import type { IStorage } from './storage';

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
}

interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_date: string | null;
  last_updated: string;
}

const STABLECOIN_SYMBOLS = ['USDT', 'USDC', 'DAI', 'FDUSD', 'TUSD', 'USDE', 'USDP', 'PYUSD', 'BUSD'];

const MANDATORY_DISCLAIMERS = {
  en: [
    'This page is for information only and is not investment advice.',
    'Cryptocurrency investments are highly volatile and risky. You may lose all invested capital.',
    'Past performance does not guarantee future results.',
  ],
  ar: [
    'هذه الصفحة لأغراض معلوماتية فقط وليست نصيحة استثمارية.',
    'استثمارات العملات الرقمية متقلبة للغاية ومحفوفة بالمخاطر. قد تخسر كل رأس المال المستثمر.',
    'الأداء السابق لا يضمن النتائج المستقبلية.',
  ],
};

function generateEditorialContent(name: string, symbol: string, rank: number) {
  return {
    whatIsIt_en: `<p><strong>${name} (${symbol})</strong> is a cryptocurrency ranked #${rank} by market capitalization. It operates on blockchain technology, enabling secure and transparent transactions without the need for intermediaries.</p><p>As with all cryptocurrencies, ${name} is subject to market volatility and regulatory developments. Investors should conduct their own research before making any investment decisions.</p>`,
    whatIsIt_ar: `<p><strong>${name} (${symbol})</strong> هي عملة رقمية تحتل المرتبة #${rank} من حيث القيمة السوقية. تعمل على تقنية البلوكتشين، مما يتيح معاملات آمنة وشفافة دون الحاجة إلى وسطاء.</p>`,
    
    howItWorks_en: `<p>${name} utilizes distributed ledger technology to record all transactions on a public blockchain. This creates a transparent and immutable record that can be verified by anyone.</p><p>Transactions are validated by network participants using consensus mechanisms, ensuring the integrity of the network without requiring a central authority.</p>`,
    howItWorks_ar: `<p>تستخدم ${name} تقنية السجل الموزع لتسجيل جميع المعاملات على بلوكتشين عام. هذا يخلق سجلاً شفافاً وغير قابل للتغيير.</p>`,
    
    risks_en: `<p><strong>Important Risk Disclosures:</strong></p><ul><li><strong>Market Volatility:</strong> Cryptocurrency prices can fluctuate significantly in short periods.</li><li><strong>Regulatory Risk:</strong> Regulations vary by jurisdiction and may change.</li><li><strong>Technology Risk:</strong> Smart contracts may contain vulnerabilities.</li><li><strong>Loss of Capital:</strong> You may lose some or all of your invested capital.</li></ul>`,
    risks_ar: `<p><strong>إفصاحات المخاطر المهمة:</strong></p><ul><li><strong>تقلبات السوق:</strong> يمكن أن تتقلب أسعار العملات الرقمية بشكل كبير.</li><li><strong>المخاطر التنظيمية:</strong> تختلف اللوائح حسب الولاية القضائية.</li><li><strong>خسارة رأس المال:</strong> قد تخسر بعض أو كل رأس المال المستثمر.</li></ul>`,
    
    heroSummary_en: `${name} (${symbol}) is ranked #${rank} by market capitalization. Track real-time price, market data, and learn more about ${name}.`,
    heroSummary_ar: `${name} (${symbol}) تحتل المرتبة #${rank} من حيث القيمة السوقية. تتبع السعر في الوقت الفعلي وبيانات السوق.`,
    
    metaTitle_en: `${name} (${symbol}) Price, Charts & Market Data | baraka`,
    metaTitle_ar: `سعر ${name} (${symbol}) والرسوم البيانية | بركة`,
    metaDescription_en: `Get the latest ${name} price, market cap, volume, and trading information. Track ${symbol} live on baraka.`,
    metaDescription_ar: `احصل على أحدث سعر ${name} والقيمة السوقية والحجم ومعلومات التداول.`,
  };
}

function determineAssetType(symbol: string): 'coin' | 'token' | 'stablecoin' {
  if (STABLECOIN_SYMBOLS.includes(symbol.toUpperCase())) return 'stablecoin';
  return 'coin';
}

export async function seedTop100Crypto(storage: IStorage): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  try {
    console.log('[Seed] Fetching top 100 cryptocurrencies from CoinGecko...');
    
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.log('[Seed] CoinGecko API unavailable, using fallback data...');
      return await seedFallbackData(storage);
    }

    const coins: CoinGeckoCoin[] = await response.json();
    console.log(`[Seed] Received ${coins.length} coins from CoinGecko`);

    let binancePrices: Map<string, BinanceTicker> = new Map();
    try {
      const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      if (binanceResponse.ok) {
        const tickers: BinanceTicker[] = await binanceResponse.json();
        tickers.forEach(t => {
          if (t.symbol.endsWith('USDT')) {
            const base = t.symbol.replace('USDT', '');
            binancePrices.set(base, t);
          }
        });
        console.log(`[Seed] Received ${binancePrices.size} Binance prices`);
      }
    } catch (e) {
      console.log('[Seed] Binance API unavailable, using CoinGecko prices');
    }

    for (const coin of coins) {
      const symbol = coin.symbol.toUpperCase();
      const slug = `${symbol.toLowerCase()}-${coin.id}`;
      const rank = coin.market_cap_rank || 9999;
      const assetType = determineAssetType(symbol);
      const content = generateEditorialContent(coin.name, symbol, rank);

      const binanceData = binancePrices.get(symbol);
      const priceUsd = binanceData ? parseFloat(binanceData.lastPrice) : coin.current_price;
      const priceChange = binanceData ? parseFloat(binanceData.priceChangePercent) : coin.price_change_percentage_24h;
      const volume = binanceData ? parseFloat(binanceData.quoteVolume) : coin.total_volume;

      const existingPage = await storage.getCryptoPageBySlug(slug);
      
      const pageData = {
        coingeckoId: coin.id,
        symbol,
        name: coin.name,
        slug,
        logoUrl: coin.image,
        title_en: coin.name,
        title_ar: coin.name,
        marketCapRank: rank,
        status: 'published' as const,
        featured: rank <= 10,
        tags: [] as string[],
        indexable: true,
        editorialLocked: false,
        assetType,
        isStablecoin: assetType === 'stablecoin',
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
          { id: 'risk_callout', type: 'risk_callout' as const, enabled: true, order: 6 },
          { id: 'disclosures', type: 'disclosures' as const, enabled: true, order: 7 },
        ],
      };

      if (existingPage) {
        if (!existingPage.editorialLocked) {
          await storage.updateCryptoPage(existingPage.id, pageData);
          updated++;
        }
      } else {
        await storage.createCryptoPage(pageData);
        created++;
      }

      await storage.upsertCryptoMarketSnapshot({
        provider: 'coingecko',
        providerCoinId: coin.id,
        symbol,
        name: coin.name,
        image: coin.image,
        rank,
        priceUsd: priceUsd || 0,
        marketCapUsd: coin.market_cap || 0,
        volume24hUsd: volume || 0,
        priceChange24hPct: priceChange || 0,
        circulatingSupply: coin.circulating_supply ?? undefined,
        totalSupply: coin.total_supply ?? undefined,
        maxSupply: coin.max_supply ?? undefined,
        athUsd: coin.ath ?? undefined,
        athDate: coin.ath_date ?? undefined,
        atlUsd: coin.atl ?? undefined,
        atlDate: coin.atl_date ?? undefined,
        lastUpdatedAt: coin.last_updated || new Date().toISOString(),
      });
    }

    console.log(`[Seed] Complete: ${created} created, ${updated} updated`);
    return { created, updated };

  } catch (error) {
    console.error('[Seed] Error fetching crypto data:', error);
    return await seedFallbackData(storage);
  }
}

async function seedFallbackData(storage: IStorage): Promise<{ created: number; updated: number }> {
  console.log('[Seed] Using fallback top 100 crypto data...');
  
  const TOP_100_FALLBACK = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', rank: 1, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', rank: 2, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { id: 'tether', symbol: 'USDT', name: 'Tether', rank: 3, image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', rank: 4, image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', rank: 5, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', rank: 6, image: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png' },
    { id: 'ripple', symbol: 'XRP', name: 'XRP', rank: 7, image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', rank: 8, image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', rank: 9, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
    { id: 'tron', symbol: 'TRX', name: 'TRON', rank: 10, image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png' },
    { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', rank: 11, image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },
    { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', rank: 12, image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png' },
    { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', rank: 13, image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png' },
    { id: 'wrapped-bitcoin', symbol: 'WBTC', name: 'Wrapped Bitcoin', rank: 14, image: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', rank: 15, image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
    { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', rank: 16, image: 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png' },
    { id: 'sui', symbol: 'SUI', name: 'Sui', rank: 17, image: 'https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg' },
    { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', rank: 18, image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-logo.png' },
    { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', rank: 19, image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png' },
    { id: 'pepe', symbol: 'PEPE', name: 'Pepe', rank: 20, image: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg' },
    { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', rank: 21, image: 'https://assets.coingecko.com/coins/images/10365/large/near.jpg' },
    { id: 'dai', symbol: 'DAI', name: 'Dai', rank: 22, image: 'https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png' },
    { id: 'stellar', symbol: 'XLM', name: 'Stellar', rank: 23, image: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png' },
    { id: 'aptos', symbol: 'APT', name: 'Aptos', rank: 24, image: 'https://assets.coingecko.com/coins/images/26455/large/aptos_round.png' },
    { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', rank: 25, image: 'https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png' },
    { id: 'crypto-com-chain', symbol: 'CRO', name: 'Cronos', rank: 26, image: 'https://assets.coingecko.com/coins/images/7310/large/cro_token_logo.png' },
    { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic', rank: 27, image: 'https://assets.coingecko.com/coins/images/453/large/ethereum-classic-logo.png' },
    { id: 'kaspa', symbol: 'KAS', name: 'Kaspa', rank: 28, image: 'https://assets.coingecko.com/coins/images/25751/large/kaspa-icon-exchanges.png' },
    { id: 'render-token', symbol: 'RNDR', name: 'Render', rank: 29, image: 'https://assets.coingecko.com/coins/images/11636/large/rndr.png' },
    { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera', rank: 30, image: 'https://assets.coingecko.com/coins/images/3688/large/hbar.png' },
    { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', rank: 31, image: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png' },
    { id: 'monero', symbol: 'XMR', name: 'Monero', rank: 32, image: 'https://assets.coingecko.com/coins/images/69/large/monero_logo.png' },
    { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', rank: 33, image: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg' },
    { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', rank: 34, image: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png' },
    { id: 'okb', symbol: 'OKB', name: 'OKB', rank: 35, image: 'https://assets.coingecko.com/coins/images/4463/large/WeChat_Image_20220118095654.png' },
    { id: 'mantle', symbol: 'MNT', name: 'Mantle', rank: 36, image: 'https://assets.coingecko.com/coins/images/30980/large/token-logo.png' },
    { id: 'vechain', symbol: 'VET', name: 'VeChain', rank: 37, image: 'https://assets.coingecko.com/coins/images/1167/large/VeChain-Logo-768x725.png' },
    { id: 'immutable-x', symbol: 'IMX', name: 'Immutable', rank: 38, image: 'https://assets.coingecko.com/coins/images/17233/large/immutableX-symbol-BLK-RGB.png' },
    { id: 'maker', symbol: 'MKR', name: 'Maker', rank: 39, image: 'https://assets.coingecko.com/coins/images/1364/large/Mark_Maker.png' },
    { id: 'optimism', symbol: 'OP', name: 'Optimism', rank: 40, image: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png' },
    { id: 'injective-protocol', symbol: 'INJ', name: 'Injective', rank: 41, image: 'https://assets.coingecko.com/coins/images/12882/large/Secondary_Symbol.png' },
    { id: 'the-graph', symbol: 'GRT', name: 'The Graph', rank: 42, image: 'https://assets.coingecko.com/coins/images/13397/large/Graph_Token.png' },
    { id: 'theta-token', symbol: 'THETA', name: 'Theta Network', rank: 43, image: 'https://assets.coingecko.com/coins/images/2538/large/theta-token-logo.png' },
    { id: 'fantom', symbol: 'FTM', name: 'Fantom', rank: 44, image: 'https://assets.coingecko.com/coins/images/4001/large/Fantom_round.png' },
    { id: 'lido-dao', symbol: 'LDO', name: 'Lido DAO', rank: 45, image: 'https://assets.coingecko.com/coins/images/13573/large/Lido_DAO.png' },
    { id: 'bonk', symbol: 'BONK', name: 'Bonk', rank: 46, image: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg' },
    { id: 'sei-network', symbol: 'SEI', name: 'Sei', rank: 47, image: 'https://assets.coingecko.com/coins/images/28205/large/Sei_Logo_-_Transparent.png' },
    { id: 'gala', symbol: 'GALA', name: 'GALA', rank: 48, image: 'https://assets.coingecko.com/coins/images/12493/large/GALA-COINGECKO.png' },
    { id: 'algorand', symbol: 'ALGO', name: 'Algorand', rank: 49, image: 'https://assets.coingecko.com/coins/images/4380/large/download.png' },
    { id: 'flow', symbol: 'FLOW', name: 'Flow', rank: 50, image: 'https://assets.coingecko.com/coins/images/13446/large/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png' },
    { id: 'floki', symbol: 'FLOKI', name: 'FLOKI', rank: 51, image: 'https://assets.coingecko.com/coins/images/16746/large/PNG_image.png' },
    { id: 'aave', symbol: 'AAVE', name: 'Aave', rank: 52, image: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png' },
    { id: 'stacks', symbol: 'STX', name: 'Stacks', rank: 53, image: 'https://assets.coingecko.com/coins/images/2069/large/Stacks_logo_full.png' },
    { id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity', rank: 54, image: 'https://assets.coingecko.com/coins/images/13029/large/axie_infinity_logo.png' },
    { id: 'quant-network', symbol: 'QNT', name: 'Quant', rank: 55, image: 'https://assets.coingecko.com/coins/images/3370/large/5ZOu7brX_400x400.jpg' },
    { id: 'multiversx-egld', symbol: 'EGLD', name: 'MultiversX', rank: 56, image: 'https://assets.coingecko.com/coins/images/12335/large/egld-token-logo.png' },
    { id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox', rank: 57, image: 'https://assets.coingecko.com/coins/images/12129/large/sandbox_logo.jpg' },
    { id: 'bittensor', symbol: 'TAO', name: 'Bittensor', rank: 58, image: 'https://assets.coingecko.com/coins/images/28452/large/ARUsPeNQ_400x400.jpeg' },
    { id: 'decentraland', symbol: 'MANA', name: 'Decentraland', rank: 59, image: 'https://assets.coingecko.com/coins/images/878/large/decentraland-mana.png' },
    { id: 'beam-2', symbol: 'BEAM', name: 'Beam', rank: 60, image: 'https://assets.coingecko.com/coins/images/32417/large/chain-logo.png' },
    { id: 'eos', symbol: 'EOS', name: 'EOS', rank: 61, image: 'https://assets.coingecko.com/coins/images/738/large/eos-eos-logo.png' },
    { id: 'tezos', symbol: 'XTZ', name: 'Tezos', rank: 62, image: 'https://assets.coingecko.com/coins/images/976/large/Tezos-logo.png' },
    { id: 'neo', symbol: 'NEO', name: 'NEO', rank: 63, image: 'https://assets.coingecko.com/coins/images/480/large/NEO_512_512.png' },
    { id: 'kucoin-shares', symbol: 'KCS', name: 'KuCoin Token', rank: 64, image: 'https://assets.coingecko.com/coins/images/1047/large/sa9z79.png' },
    { id: 'iota', symbol: 'IOTA', name: 'IOTA', rank: 65, image: 'https://assets.coingecko.com/coins/images/692/large/IOTA_Swirl.png' },
    { id: 'wemix-token', symbol: 'WEMIX', name: 'WEMIX', rank: 66, image: 'https://assets.coingecko.com/coins/images/12998/large/wemixcoin_color_200.png' },
    { id: 'kava', symbol: 'KAVA', name: 'Kava', rank: 67, image: 'https://assets.coingecko.com/coins/images/9761/large/kava.png' },
    { id: 'fetch-ai', symbol: 'FET', name: 'Fetch.ai', rank: 68, image: 'https://assets.coingecko.com/coins/images/5681/large/Fetch.jpg' },
    { id: 'chiliz', symbol: 'CHZ', name: 'Chiliz', rank: 69, image: 'https://assets.coingecko.com/coins/images/8834/large/CHZ_Token_updated.png' },
    { id: 'zcash', symbol: 'ZEC', name: 'Zcash', rank: 70, image: 'https://assets.coingecko.com/coins/images/486/large/circle-zcash-color.png' },
    { id: 'mina-protocol', symbol: 'MINA', name: 'Mina', rank: 71, image: 'https://assets.coingecko.com/coins/images/15628/large/JM4_vQ34_400x400.png' },
    { id: 'dydx-chain', symbol: 'DYDX', name: 'dYdX', rank: 72, image: 'https://assets.coingecko.com/coins/images/32594/large/dydx.png' },
    { id: 'curve-dao-token', symbol: 'CRV', name: 'Curve DAO Token', rank: 73, image: 'https://assets.coingecko.com/coins/images/12124/large/Curve.png' },
    { id: 'singularitynet', symbol: 'AGIX', name: 'SingularityNET', rank: 74, image: 'https://assets.coingecko.com/coins/images/2138/large/singularitynet.png' },
    { id: 'blur', symbol: 'BLUR', name: 'Blur', rank: 75, image: 'https://assets.coingecko.com/coins/images/28453/large/blur.png' },
    { id: 'conflux-token', symbol: 'CFX', name: 'Conflux', rank: 76, image: 'https://assets.coingecko.com/coins/images/13079/large/3vuYMbjN.png' },
    { id: 'thorchain', symbol: 'RUNE', name: 'THORChain', rank: 77, image: 'https://assets.coingecko.com/coins/images/6595/large/Rune200x200.png' },
    { id: 'nervos-network', symbol: 'CKB', name: 'Nervos Network', rank: 78, image: 'https://assets.coingecko.com/coins/images/9566/large/nervos-ckb.png' },
    { id: 'frax', symbol: 'FRAX', name: 'Frax', rank: 79, image: 'https://assets.coingecko.com/coins/images/13422/large/FRAX_icon.png' },
    { id: 'enjincoin', symbol: 'ENJ', name: 'Enjin Coin', rank: 80, image: 'https://assets.coingecko.com/coins/images/1102/large/enjin-coin-logo.png' },
    { id: 'compound-governance-token', symbol: 'COMP', name: 'Compound', rank: 81, image: 'https://assets.coingecko.com/coins/images/10775/large/COMP.png' },
    { id: 'gnosis', symbol: 'GNO', name: 'Gnosis', rank: 82, image: 'https://assets.coingecko.com/coins/images/662/large/logo_square_simple_300px.png' },
    { id: 'worldcoin-wld', symbol: 'WLD', name: 'Worldcoin', rank: 83, image: 'https://assets.coingecko.com/coins/images/31069/large/worldcoin.jpeg' },
    { id: 'zilliqa', symbol: 'ZIL', name: 'Zilliqa', rank: 84, image: 'https://assets.coingecko.com/coins/images/2687/large/Zilliqa-logo.png' },
    { id: '1inch', symbol: '1INCH', name: '1inch Network', rank: 85, image: 'https://assets.coingecko.com/coins/images/13469/large/1inch-token.png' },
    { id: 'xdc-network', symbol: 'XDC', name: 'XDC Network', rank: 86, image: 'https://assets.coingecko.com/coins/images/2912/large/xdc-icon.png' },
    { id: 'pancakeswap-token', symbol: 'CAKE', name: 'PancakeSwap', rank: 87, image: 'https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png' },
    { id: 'frax-share', symbol: 'FXS', name: 'Frax Share', rank: 88, image: 'https://assets.coingecko.com/coins/images/13423/large/Frax_Shares_icon.png' },
    { id: 'synthetix-network-token', symbol: 'SNX', name: 'Synthetix', rank: 89, image: 'https://assets.coingecko.com/coins/images/3406/large/SNX.png' },
    { id: 'rocket-pool', symbol: 'RPL', name: 'Rocket Pool', rank: 90, image: 'https://assets.coingecko.com/coins/images/2090/large/rocket_pool_%28RPL%29.png' },
    { id: 'mask-network', symbol: 'MASK', name: 'Mask Network', rank: 91, image: 'https://assets.coingecko.com/coins/images/14051/large/Mask_Network.jpg' },
    { id: 'oasis-network', symbol: 'ROSE', name: 'Oasis Network', rank: 92, image: 'https://assets.coingecko.com/coins/images/13162/large/rose.png' },
    { id: 'celo', symbol: 'CELO', name: 'Celo', rank: 93, image: 'https://assets.coingecko.com/coins/images/11090/large/InjsHi7.png' },
    { id: 'ocean-protocol', symbol: 'OCEAN', name: 'Ocean Protocol', rank: 94, image: 'https://assets.coingecko.com/coins/images/3687/large/ocean-protocol-logo.jpg' },
    { id: 'basic-attention-token', symbol: 'BAT', name: 'Basic Attention Token', rank: 95, image: 'https://assets.coingecko.com/coins/images/677/large/basic-attention-token.png' },
    { id: 'loopring', symbol: 'LRC', name: 'Loopring', rank: 96, image: 'https://assets.coingecko.com/coins/images/913/large/LRC.png' },
    { id: 'ravencoin', symbol: 'RVN', name: 'Ravencoin', rank: 97, image: 'https://assets.coingecko.com/coins/images/3412/large/ravencoin.png' },
    { id: 'iotex', symbol: 'IOTX', name: 'IoTeX', rank: 98, image: 'https://assets.coingecko.com/coins/images/3334/large/iotex-logo.png' },
    { id: 'ankr', symbol: 'ANKR', name: 'Ankr', rank: 99, image: 'https://assets.coingecko.com/coins/images/4324/large/U85xTl2.png' },
    { id: 'convex-finance', symbol: 'CVX', name: 'Convex Finance', rank: 100, image: 'https://assets.coingecko.com/coins/images/15585/large/convex.png' },
  ];

  let created = 0;
  let updated = 0;

  for (const coin of TOP_100_FALLBACK) {
    const slug = `${coin.symbol.toLowerCase()}-${coin.id}`;
    const assetType = determineAssetType(coin.symbol);
    const content = generateEditorialContent(coin.name, coin.symbol, coin.rank);

    const existingPage = await storage.getCryptoPageBySlug(slug);
    
    const pageData = {
      coingeckoId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      slug,
      logoUrl: coin.image,
      title_en: coin.name,
      title_ar: coin.name,
      marketCapRank: coin.rank,
      status: 'published' as const,
      featured: coin.rank <= 10,
      tags: [] as string[],
      indexable: true,
      editorialLocked: false,
      assetType,
      isStablecoin: assetType === 'stablecoin',
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
        { id: 'risk_callout', type: 'risk_callout' as const, enabled: true, order: 6 },
        { id: 'disclosures', type: 'disclosures' as const, enabled: true, order: 7 },
      ],
    };

    if (existingPage) {
      if (!existingPage.editorialLocked) {
        await storage.updateCryptoPage(existingPage.id, pageData);
        updated++;
      }
    } else {
      await storage.createCryptoPage(pageData);
      created++;
    }

    await storage.upsertCryptoMarketSnapshot({
      provider: 'coingecko',
      providerCoinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      rank: coin.rank,
      priceUsd: 0,
      marketCapUsd: 0,
      volume24hUsd: 0,
      priceChange24hPct: 0,
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  console.log(`[Seed Fallback] Complete: ${created} created, ${updated} updated`);
  return { created, updated };
}
