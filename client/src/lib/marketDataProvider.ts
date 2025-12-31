export interface MarketData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sparkline?: number[];
}

const dummyMarketData: Record<string, MarketData> = {
  AAPL: { ticker: 'AAPL', price: 185.64, change: 2.34, changePercent: 1.28, volume: '52.3M', marketCap: '$2.85T', sparkline: [180, 182, 181, 183, 184, 183, 185, 186] },
  TSLA: { ticker: 'TSLA', price: 242.84, change: -5.21, changePercent: -2.10, volume: '98.7M', marketCap: '$771B', sparkline: [250, 248, 245, 243, 240, 242, 244, 243] },
  MSFT: { ticker: 'MSFT', price: 378.91, change: 4.52, changePercent: 1.21, volume: '21.5M', marketCap: '$2.82T', sparkline: [372, 374, 376, 375, 377, 379, 378, 379] },
  GOOGL: { ticker: 'GOOGL', price: 141.25, change: 2.15, changePercent: 1.55, volume: '28.4M', marketCap: '$1.76T', sparkline: [138, 139, 140, 139, 141, 140, 141, 141] },
  NVDA: { ticker: 'NVDA', price: 875.42, change: 28.54, changePercent: 3.37, volume: '45.2M', marketCap: '$2.15T', sparkline: [840, 850, 855, 860, 868, 872, 875, 875] },
  AMZN: { ticker: 'AMZN', price: 178.75, change: -1.25, changePercent: -0.69, volume: '35.8M', marketCap: '$1.86T', sparkline: [180, 179, 178, 179, 178, 177, 178, 179] },
  META: { ticker: 'META', price: 505.95, change: 12.45, changePercent: 2.52, volume: '18.9M', marketCap: '$1.29T', sparkline: [490, 495, 498, 500, 502, 504, 505, 506] },
  AMD: { ticker: 'AMD', price: 162.30, change: 6.82, changePercent: 4.39, volume: '52.1M', marketCap: '$262B', sparkline: [155, 157, 158, 160, 161, 162, 163, 162] },
  NFLX: { ticker: 'NFLX', price: 628.40, change: -8.60, changePercent: -1.35, volume: '8.2M', marketCap: '$273B', sparkline: [640, 638, 635, 632, 630, 628, 629, 628] },
  DIS: { ticker: 'DIS', price: 112.85, change: 1.95, changePercent: 1.76, volume: '12.4M', marketCap: '$206B', sparkline: [110, 111, 110, 111, 112, 113, 112, 113] },
  PYPL: { ticker: 'PYPL', price: 65.20, change: -2.30, changePercent: -3.41, volume: '15.6M', marketCap: '$71B', sparkline: [68, 67, 66, 65, 64, 65, 66, 65] },
  SQ: { ticker: 'SQ', price: 78.45, change: 2.15, changePercent: 2.82, volume: '9.8M', marketCap: '$48B', sparkline: [75, 76, 77, 77, 78, 78, 79, 78] },
  NIO: { ticker: 'NIO', price: 5.82, change: -0.28, changePercent: -4.59, volume: '85.2M', marketCap: '$12B', sparkline: [6.2, 6.1, 6.0, 5.9, 5.8, 5.9, 5.8, 5.8] },
  RIVN: { ticker: 'RIVN', price: 12.45, change: 0.85, changePercent: 7.33, volume: '42.1M', marketCap: '$13B', sparkline: [11.5, 11.8, 12.0, 12.1, 12.3, 12.4, 12.5, 12.4] },
  LCID: { ticker: 'LCID', price: 3.25, change: -0.15, changePercent: -4.41, volume: '28.5M', marketCap: '$7.5B', sparkline: [3.5, 3.4, 3.3, 3.3, 3.2, 3.3, 3.2, 3.2] },
  GM: { ticker: 'GM', price: 42.80, change: 0.45, changePercent: 1.06, volume: '8.9M', marketCap: '$48B', sparkline: [42, 42.2, 42.4, 42.5, 42.6, 42.7, 42.8, 42.8] },
  F: { ticker: 'F', price: 12.15, change: 0.22, changePercent: 1.84, volume: '45.2M', marketCap: '$48B', sparkline: [11.8, 11.9, 12.0, 12.0, 12.1, 12.1, 12.2, 12.1] },
  TSM: { ticker: 'TSM', price: 142.50, change: 3.20, changePercent: 2.30, volume: '12.5M', marketCap: '$735B', sparkline: [138, 139, 140, 141, 142, 142, 143, 142] },
  ASML: { ticker: 'ASML', price: 985.20, change: 18.40, changePercent: 1.90, volume: '1.2M', marketCap: '$388B', sparkline: [965, 970, 975, 980, 982, 984, 985, 985] },
  AVGO: { ticker: 'AVGO', price: 1285.60, change: -15.40, changePercent: -1.18, volume: '2.8M', marketCap: '$595B', sparkline: [1300, 1295, 1290, 1288, 1286, 1285, 1286, 1286] },
  INTC: { ticker: 'INTC', price: 42.85, change: -1.25, changePercent: -2.83, volume: '32.1M', marketCap: '$182B', sparkline: [44, 43.5, 43, 42.8, 42.6, 42.5, 42.8, 42.8] },
  JPM: { ticker: 'JPM', price: 195.40, change: 3.80, changePercent: 1.98, volume: '8.5M', marketCap: '$562B', sparkline: [191, 192, 193, 194, 195, 195, 196, 195] },
  V: { ticker: 'V', price: 285.20, change: 2.40, changePercent: 0.85, volume: '5.8M', marketCap: '$577B', sparkline: [282, 283, 284, 284, 285, 285, 286, 285] },
  MA: { ticker: 'MA', price: 468.50, change: 5.20, changePercent: 1.12, volume: '2.1M', marketCap: '$437B', sparkline: [462, 464, 465, 466, 467, 468, 469, 468] },
  BAC: { ticker: 'BAC', price: 35.80, change: 0.65, changePercent: 1.85, volume: '38.2M', marketCap: '$284B', sparkline: [35, 35.2, 35.4, 35.5, 35.6, 35.7, 35.8, 35.8] },
  KO: { ticker: 'KO', price: 62.40, change: 0.35, changePercent: 0.56, volume: '12.1M', marketCap: '$269B', sparkline: [62, 62.1, 62.2, 62.3, 62.3, 62.4, 62.4, 62.4] },
  PEP: { ticker: 'PEP', price: 175.80, change: -0.85, changePercent: -0.48, volume: '4.2M', marketCap: '$241B', sparkline: [177, 176.5, 176, 175.8, 175.6, 175.5, 175.8, 175.8] },
  JNJ: { ticker: 'JNJ', price: 158.20, change: 1.15, changePercent: 0.73, volume: '6.8M', marketCap: '$381B', sparkline: [157, 157.2, 157.5, 157.8, 158, 158.1, 158.2, 158.2] },
  UNH: { ticker: 'UNH', price: 528.40, change: 8.60, changePercent: 1.65, volume: '3.2M', marketCap: '$487B', sparkline: [518, 520, 522, 524, 526, 527, 528, 528] },
  PG: { ticker: 'PG', price: 162.50, change: 0.80, changePercent: 0.49, volume: '5.5M', marketCap: '$383B', sparkline: [161.5, 161.8, 162, 162.2, 162.3, 162.4, 162.5, 162.5] },
  XOM: { ticker: 'XOM', price: 105.20, change: 2.40, changePercent: 2.33, volume: '15.8M', marketCap: '$420B', sparkline: [102, 103, 104, 104.5, 105, 105.1, 105.2, 105.2] },
  CVX: { ticker: 'CVX', price: 152.80, change: 3.10, changePercent: 2.07, volume: '7.2M', marketCap: '$286B', sparkline: [149, 150, 151, 151.5, 152, 152.5, 152.8, 152.8] },
  WMT: { ticker: 'WMT', price: 168.40, change: 1.20, changePercent: 0.72, volume: '8.4M', marketCap: '$453B', sparkline: [167, 167.3, 167.6, 167.8, 168, 168.2, 168.4, 168.4] },
  HD: { ticker: 'HD', price: 385.60, change: 4.80, changePercent: 1.26, volume: '3.5M', marketCap: '$384B', sparkline: [380, 381, 382, 383, 384, 385, 386, 385] },
  COST: { ticker: 'COST', price: 748.20, change: 8.40, changePercent: 1.14, volume: '1.8M', marketCap: '$332B', sparkline: [738, 740, 742, 744, 746, 747, 748, 748] },
};

export interface MarketDataProvider {
  getMarketData(ticker: string): Promise<MarketData | null>;
  getMarketDataBatch(tickers: string[]): Promise<Record<string, MarketData>>;
}

class DummyMarketDataProvider implements MarketDataProvider {
  async getMarketData(ticker: string): Promise<MarketData | null> {
    return dummyMarketData[ticker] || null;
  }

  async getMarketDataBatch(tickers: string[]): Promise<Record<string, MarketData>> {
    const result: Record<string, MarketData> = {};
    for (const ticker of tickers) {
      if (dummyMarketData[ticker]) {
        result[ticker] = dummyMarketData[ticker];
      }
    }
    return result;
  }
}

export const marketDataProvider = new DummyMarketDataProvider();
