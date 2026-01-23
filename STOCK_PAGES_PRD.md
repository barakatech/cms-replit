# Stock Pages - Functional Requirements Document (PRD)

## Table of Contents
1. [Overview](#1-overview)
2. [Stock Page Data Model](#2-stock-page-data-model)
3. [Public-Facing Stock Pages](#3-public-facing-stock-pages)
4. [Admin/CMS Stock Management](#4-admincms-stock-management)
5. [Stock Discovery & Browse](#5-stock-discovery--browse)
6. [Stock Themes](#6-stock-themes)
7. [SEO & Social Meta](#7-seo--social-meta)
8. [Localization & RTL Support](#8-localization--rtl-support)
9. [Real-Time Data Integration](#9-real-time-data-integration)
10. [Internal Linking System](#10-internal-linking-system)
11. [Collaborative Editing](#11-collaborative-editing)
12. [Related Features](#12-related-features)
13. [Content Syncing: Blog → Stories → Spotlight](#13-content-syncing-blog--stories--spotlight)

---

## 1. Overview

### 1.1 Purpose
The Stock Pages system is a comprehensive CMS-driven platform for creating, managing, and publishing individual stock landing pages. These pages serve as informational resources for investors, featuring company overviews, market data, analyst ratings, and educational content.

### 1.2 Core Features
- **Individual Stock Pages**: Detailed pages for each stock/ticker with company info, pricing, charts, and analysis
- **Stock Directory/Browse**: Searchable, filterable list of all available stocks
- **Stock Discover**: Curated discovery experience with trending, gainers, losers, and themes
- **Stock Themes**: Curated collections of stocks grouped by investment themes (e.g., AI Stocks, EV Stocks)
- **Admin CMS**: Full content management for creating/editing stock pages
- **Multi-language Support**: English and Arabic with RTL support
- **SEO Optimization**: Meta tags, Open Graph, Twitter Cards, and Schema.org markup
- **Real-time Market Data**: Live price, change, volume, and performance data

### 1.3 Key User Flows
1. **User browses stocks** → Discover/Browse page → Stock Detail page → CTA to trade
2. **Admin creates stock page** → Admin panel → Stock editor → Preview → Publish
3. **User explores themes** → Discover page → Theme page → Individual stock pages

---

## 2. Stock Page Data Model

### 2.1 Core StockPage Entity

```typescript
interface StockPage {
  // Identification
  id: string;                     // Unique identifier
  ticker: string;                 // Stock ticker symbol (e.g., "AAPL")
  slug: string;                   // URL-friendly slug (e.g., "apple-inc")
  
  // Company Information
  companyName_en: string;         // English company name
  companyName_ar: string;         // Arabic company name
  description_en: string;         // Short English description
  description_ar: string;         // Short Arabic description
  content_en: string;             // Rich content (English)
  content_ar: string;             // Rich content (Arabic)
  
  // Classification
  sector: string;                 // e.g., "Technology", "Healthcare"
  exchange: string;               // e.g., "NASDAQ", "NYSE", "AMEX"
  currency?: string;              // e.g., "USD"
  tags: string[];                 // Categorization tags
  
  // Status
  status: 'draft' | 'published' | 'archived';
  
  // SEO (per language)
  seo_en: StockPageSEO;
  seo_ar: StockPageSEO;
  
  // Page Builder
  pageBuilderJson: StockPageBlock[];  // Configurable content blocks
  
  // Related Content
  relatedTickers: string[];       // Related stocks for cross-linking
  
  // Timestamps
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2.2 Company Metadata

```typescript
interface CompanyMeta {
  ceo: string;                    // CEO name
  employees: string;              // Employee count (e.g., "164,000")
  headquarters: string;           // HQ location
  founded: string;                // Year founded
}
```

### 2.3 Stock Content Sections

```typescript
interface StockContent {
  en: {
    overview: string;           // Company overview text
    thesis: string;             // Investment thesis
    risks: string;              // Risk factors
    highlights: string;         // Key highlights (comma-separated)
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  ar: {
    // Same structure for Arabic
  };
}
```

### 2.4 Dynamic Market Data

```typescript
interface DynamicData {
  price: number;                  // Current stock price
  change: number;                 // Price change (absolute)
  changePercent: number;          // Price change (percentage)
  marketCap: string;              // Market capitalization (e.g., "$2.85T")
  volume: string;                 // Trading volume (e.g., "52.3M")
  pe: string;                     // P/E ratio
  eps: string;                    // Earnings per share
  dividend: string;               // Dividend yield
  sentiment: {
    buy: number;                  // Buy rating percentage
    hold: number;                 // Hold rating percentage
    sell: number;                 // Sell rating percentage
  };
  performance: {
    '1D': number;                 // 1-day performance
    '1W': number;                 // 1-week performance
    '1M': number;                 // 1-month performance
    '1Y': number;                 // 1-year performance
  };
}
```

---

## 3. Public-Facing Stock Pages

### 3.1 Stock Detail Page (`/stocks/:slug`)

#### 3.1.1 URL Structure
- Primary: `/stocks/{ticker-lowercase}` (e.g., `/stocks/aapl`)
- Alternative: `/stocks/{slug}` (e.g., `/stocks/apple-inc`)

#### 3.1.2 Page Layout (Two-Column)

**Main Content Area (8 columns)**:
1. **Stock Hero Section**
   - Company logo
   - Ticker symbol and exchange badge
   - Company name
   - Current price with change indicator (green/red)
   - Percentage change with trend icon
   
2. **Price Chart Panel**
   - Interactive chart with timeframe toggles: 1D, 1W, 1M, 3M, 1Y, ALL
   - Price axis with current price highlight
   - Volume overlay option

3. **About Company Block**
   - Company overview text
   - Company metadata (CEO, Employees, HQ, Founded)
   - Investment thesis section
   - Risk factors (collapsible)

4. **Key Statistics Block**
   - Market Cap, Volume
   - P/E Ratio, EPS
   - Dividend Yield
   - 52-Week High/Low

5. **Analyst Ratings Block**
   - Sentiment bar (Buy/Hold/Sell distribution)
   - Analyst consensus rating
   - Price target (if available)

6. **Earnings Block**
   - Next earnings date
   - Historical EPS chart
   - Revenue trends

7. **News List**
   - Recent news articles related to the stock
   - Source attribution
   - Timestamp

8. **FAQ Accordion**
   - Common questions about the stock
   - Expandable answer sections

9. **Similar Stocks Section**
   - Grid of related stocks (from relatedTickers + autoSuggestions)
   - Quick navigation cards

**Sidebar (4 columns)**:
1. **Trade Widget Block**
   - Buy/Trade CTA button (links to app download)
   - "Add to Watchlist" functionality
   - Share buttons

2. **Trending Stocks Block**
   - List of other popular stocks
   - Excludes current stock

#### 3.1.3 Sticky Header Behavior
- Standard header: Logo + navigation links
- On scroll (100px+): Condensed header with:
  - Ticker symbol
  - Current price
  - Change percentage
  - Quick nav to page sections

#### 3.1.4 Navigation Anchors
- About | Statistics | Ratings | Earnings | News | FAQ
- Smooth scroll to sections

### 3.2 Page States

| State | Description | Handling |
|-------|-------------|----------|
| Published | Stock page is live | Show full page |
| Draft | In progress, not public | 404 for public, visible in admin |
| Archived | Deprecated | 404 for public |
| Not Found | Ticker doesn't exist | Show "Stock not found" message with link to browse |

### 3.3 Preview Mode
- URL Parameter: `?preview=1`
- Shows preview banner at top
- Allows viewing unpublished drafts
- Locale override: `?locale=ar` or `?locale=en`

---

## 4. Admin/CMS Stock Management

### 4.1 Stock List View (`/admin/stocks`)

#### 4.1.1 Dashboard Metrics
- Total Pages count
- Published count
- Draft count
- Active Editors (real-time)

#### 4.1.2 Stock Table
| Column | Description |
|--------|-------------|
| Ticker | Logo + ticker symbol |
| Company | English company name |
| Sector | Industry sector |
| Status | Badge (draft/published/archived) |
| Editors | Real-time presence avatars |
| Actions | Preview / Edit buttons |

#### 4.1.3 Features
- Search by ticker/company/sector
- Filter by status
- Click row to edit
- "New Stock Page" button

### 4.2 Stock Editor (`/admin/stocks/:id/edit`)

#### 4.2.1 Editor Tabs

**Tab 1: Content**
- Stock Information
  - Ticker Symbol (required)
  - Exchange (NASDAQ/NYSE/AMEX)
  - Sector
  - URL Slug (auto-generated from ticker)
  - Status (draft/published/archived)
  
- Company Names
  - English name
  - Arabic name (RTL input)
  
- Descriptions
  - English description (textarea)
  - Arabic description (RTL textarea)
  
- About Company
  - CEO name
  - Employee count
  - Headquarters
  - Founded year
  - Overview (rich text, English)
  - Overview (rich text, Arabic)
  - Investment Thesis (English)
  - Investment Thesis (Arabic)

- Related Tickers
  - Comma-separated list

**Tab 2: SEO**
- Meta Titles (English/Arabic)
- Meta Descriptions (English/Arabic)
- Open Graph settings
  - OG Title (English/Arabic)
  - OG Description (English/Arabic)
  - OG Image URL
- Twitter Card settings
  - Twitter Title (English/Arabic)
  - Twitter Description (English/Arabic)
  - Twitter Image URL
  - Card Type (summary/summary_large_image)
- Schema.org settings
  - Schema Type (Corporation)
  - Ticker Symbol
  - Exchange
  - Currency

#### 4.2.2 Collaborative Features
- Real-time presence indicators
- Active editors bar (shows who else is editing)
- Field-level presence (shows which field others are editing)
- Connection status indicator

#### 4.2.3 Actions
- Save (creates/updates draft or published)
- Preview (opens in new tab with ?preview=1)
- Back to list

---

## 5. Stock Discovery & Browse

### 5.1 Browse Stocks Page (`/browse-stocks`)

#### 5.1.1 Features
- **Search**: Filter by ticker or company name
- **Sector Filters**: Badge-based sector selection
- **Sorting**: By Ticker | By Name | By Sector
- **View Modes**: Grid view | List view (alphabetical)

#### 5.1.2 Grid View
- Stock cards with:
  - Logo
  - Ticker + Exchange badge
  - Company name
  - Sector badge
  
#### 5.1.3 List View
- Alphabetically grouped by first letter
- Sticky letter headers
- Row format with logo, ticker, name, sector

#### 5.1.4 Theme Integration
- "Browse by Theme" section when no filters active
- Links to theme pages

### 5.2 Stocks Discover Page (`/discover`)

#### 5.2.1 Hero Section
- Configurable title/subtitle
- Global search bar with autocomplete
- Quick filter chips: Trending | Most Viewed | Top Gainers | Top Losers | Newly Added

#### 5.2.2 Trending Stocks Section
- Horizontal scrollable cards
- Sparkline charts (configurable)
- Price and change percentage

#### 5.2.3 Biggest Movers Section
- Two-column layout:
  - **Gainers**: Top 5 stocks by positive change
  - **Losers**: Top 5 stocks by negative change
- Ranked list format

#### 5.2.4 Stock Themes Section
- Grid of theme cards
- Featured theme badges
- Stock count per theme
- Sample tickers preview

#### 5.2.5 Featured Stock Pages
- Grid of curated stock cards
- Configurable ticker list

### 5.3 Configuration (Admin)
```typescript
interface DiscoverSettings {
  heroTitle: { en: string; ar: string; };
  heroSubtitle: { en: string; ar: string; };
  trendingTickers: string[];
  gainersTickers: string[];
  losersTickers: string[];
  featuredTickers: string[];
  showSparkline: boolean;
  // Section visibility toggles
  sectionVisibility: {
    offers: boolean;
    themes: boolean;
    trending: boolean;
    featured: boolean;
    priceAlerts: boolean;
    learn: boolean;
    newsletter: boolean;
    disclosures: boolean;
  };
}
```

---

## 6. Stock Themes

### 6.1 Theme Data Model

```typescript
interface StockTheme {
  id: string;
  slug: string;                   // URL slug (e.g., "ai-stocks")
  title_en: string;
  title_ar: string;
  description_en: string;         // Short description
  description_ar: string;
  longDescription_en?: string;    // Extended description
  longDescription_ar?: string;
  tickers: string[];              // Stocks in this theme
  heroImage: string;              // Theme banner image
  icon: string;                   // Icon identifier
  badges: string[];               // Display badges
  highlights: StockThemeHighlight[];  // "Why invest" cards
  sortMode: 'manual' | 'marketCap' | 'volume' | 'performance';
  relatedPostTags: string[];      // Blog content links
  seo: StockThemeSEO;
  order: number;                  // Display order
  status: 'draft' | 'published' | 'archived';
  isNew: boolean;                 // "New" badge
  isFeatured: boolean;            // Featured theme flag
}

interface StockThemeHighlight {
  icon: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
}

interface StockThemeSEO {
  metaTitle_en?: string;
  metaTitle_ar?: string;
  metaDescription_en?: string;
  metaDescription_ar?: string;
  canonicalUrl?: string;
  schemaJsonLd?: object;
}
```

### 6.2 Theme Page (`/stocks/themes/:slug`)

#### 6.2.1 Layout
1. **Header**
   - Theme icon
   - Theme title
   - Badges (New, Featured, custom)
   - Short description
   - Stock count

2. **Highlights Section** (if configured)
   - "Why invest in [Theme]?" heading
   - 3-column grid of benefit cards
   - Icon, title, description per card

3. **Stocks Grid**
   - Cards for each ticker in theme
   - Status indicators:
     - "Live" badge if stock page exists and is published
     - "Coming Soon" if no page exists
   - View Stock Page button (enabled/disabled)

4. **CTA Section**
   - "Ready to invest in [Theme]?" 
   - App download CTA

5. **Learn More Section**
   - Link to related blog content

---

## 7. SEO & Social Meta

### 7.1 SEO Configuration

#### 7.1.1 Per-Stock Page SEO

```typescript
interface StockPageSEO {
  metaTitle?: string;             // <title> tag content
  metaDescription?: string;       // <meta name="description">
  canonical?: string;             // Canonical URL
  robotsIndex?: boolean;          // noindex if false
  robotsFollow?: boolean;         // nofollow if false
  schemasJson?: object[];         // Schema.org JSON-LD
}
```

#### 7.1.2 Template Variables
SEO templates can include dynamic placeholders:
- `{{ticker}}` - Stock ticker symbol
- `{{companyName}}` - Company name
- `{{sector}}` - Industry sector
- `{{exchange}}` - Stock exchange
- `{{price}}` - Current price (dynamic)

Example template:
```
metaTitleTemplate_en: "{{ticker}} Stock - Buy {{companyName}} Shares | Baraka"
metaDescriptionTemplate_en: "Invest in {{companyName}} ({{ticker}}) on Baraka. Get real-time prices, market data, and expert analysis."
```

### 7.2 Open Graph Implementation

```html
<!-- Basic OG Tags -->
<meta property="og:title" content="{{ogTitle}}" />
<meta property="og:description" content="{{ogDescription}}" />
<meta property="og:image" content="{{ogImage}}" />
<meta property="og:url" content="{{canonicalUrl}}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Baraka" />

<!-- Stock-specific -->
<meta property="og:locale" content="en_US" /> <!-- or ar_AE -->
```

### 7.3 Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{twitterTitle}}" />
<meta name="twitter:description" content="{{twitterDescription}}" />
<meta name="twitter:image" content="{{twitterImage}}" />
```

### 7.4 Schema.org Markup (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Corporation",
  "name": "{{companyName}}",
  "tickerSymbol": "{{ticker}}",
  "exchange": "{{exchange}}",
  "currency": "USD",
  "url": "{{canonicalUrl}}",
  "description": "{{metaDescription}}"
}
```

### 7.5 SEO Templates (Global Settings)

```typescript
interface StockSeoTemplates {
  stockMetaTitleTemplate_en: string;
  stockMetaTitleTemplate_ar: string;
  stockMetaDescriptionTemplate_en: string;
  stockMetaDescriptionTemplate_ar: string;
  stockOgTitleTemplate_en: string;
  stockOgTitleTemplate_ar: string;
  stockOgDescriptionTemplate_en: string;
  stockOgDescriptionTemplate_ar: string;
}
```

---

## 8. Localization & RTL Support

### 8.1 Language Toggle
- Header toggle button: EN ↔ AR
- Persists user preference
- URL parameter override: `?locale=ar`

### 8.2 RTL Layout Handling
When `language === 'ar'`:
```css
/* Apply to container */
direction: rtl;
text-align: right;

/* Flex rows */
flex-direction: row-reverse;

/* Icons that indicate direction */
.rotate-180 { transform: rotate(180deg); }
```

### 8.3 Bilingual Content Fields
All content fields are duplicated:
- `title_en` / `title_ar`
- `description_en` / `description_ar`
- `content_en` / `content_ar`
- `metaTitle_en` / `metaTitle_ar`
- etc.

### 8.4 Number & Date Formatting
- Use locale-aware formatters
- Currency formatting: USD symbol
- Percentage formatting with proper decimals

---

## 9. Real-Time Data Integration

### 9.1 Market Data Provider

```typescript
interface MarketData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sparkline?: number[];           // Mini chart data points
  lastUpdated: number;            // Timestamp
}

interface MarketDataProvider {
  getMarketData(ticker: string): Promise<MarketData>;
  getMarketDataBatch(tickers: string[]): Promise<Record<string, MarketData>>;
  subscribe(ticker: string, callback: (data: MarketData) => void): () => void;
}
```

### 9.2 Data Update Strategy
- **Initial load**: Fetch batch data for visible stocks
- **Periodic refresh**: Poll every 30-60 seconds
- **On-demand**: Refresh when user focuses on price section

### 9.3 Price Display Components
- Color coding: Green (positive), Red (negative)
- Trend icons: TrendingUp / TrendingDown
- Animated transitions for price changes

---

## 10. Internal Linking System

### 10.1 Related Stocks Configuration

```typescript
interface InternalLinks {
  autoSuggestions: Array<{
    ticker: string;
    reason: string;               // "Same sector", "Users also traded", etc.
  }>;
  manual: string[];               // Manually curated tickers
}
```

### 10.2 Auto-Suggestion Algorithms
- **Same Sector**: Other stocks in the same industry
- **Users Also Traded**: Based on behavioral data
- **Similar Market Cap**: Companies of similar size
- **EV Competitors**: For automotive stocks, etc.

### 10.3 Display
- "Similar Stocks" section on stock detail page
- Grid of 4 stock cards with quick navigation
- Links to `/stocks/{ticker}`

---

## 11. Collaborative Editing

### 11.1 Presence System

```typescript
interface UserPresence {
  id: string;
  userId: string;
  userName: string;
  userColor: string;              // Unique color for avatar
  avatarUrl?: string;
  contentType: 'stock' | 'blog' | 'banner' | 'discover';
  contentId: string;              // Stock page ID being edited
  field?: string;                 // Currently focused field
  lastActive: number;             // Timestamp
  cursorPosition?: { x: number; y: number; };
}
```

### 11.2 Real-Time Features
- **Active Editors Bar**: Shows who else is editing the same page
- **Presence Avatars**: Colored avatars with names
- **Field Indicators**: Shows which field another user is editing
- **Connection Status**: Online/Offline indicator

### 11.3 Color Palette for Presence
```typescript
const PRESENCE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'
];
```

---

## 12. Related Features

### 12.1 Stock Watch Subscriptions
Users can subscribe to watch specific stocks:

```typescript
interface StockWatchSubscription {
  email: string;
  mobile: string;
  ticker: string;
  stockName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  locale: 'en' | 'ar';
}
```

### 12.2 Price Alert Subscriptions
```typescript
interface PriceAlertSubscription {
  email: string;
  tickers: string[];
  frequency: 'instant' | 'daily' | 'weekly';
  locale: 'en' | 'ar';
}
```

### 12.3 Stock Logo Component
```typescript
interface StockLogoProps {
  ticker: string;
  companyName?: string;
  size?: 'sm' | 'md' | 'lg';      // sm=8, md=10, lg=12 (in Tailwind units)
  className?: string;
}
```
- Attempts to load company logo from CDN
- Falls back to first 2 letters of ticker
- Rounded container with muted background

### 12.4 Sign-Up CTA Component
- Dynamic CTA text based on context
- Supports ticker-aware messaging: "Trade {TICKER}"
- Links to app download flow
- Mobile: OS-specific deep links
- Desktop: QR code modal

### 12.5 Mobile Install Banner
- Bottom/top sticky banner for mobile users
- Configurable per-page visibility
- Frequency capping (days between shows)
- Adjust deep links for iOS/Android tracking

### 12.6 Page Builder Blocks

```typescript
type StockPageBlockType = 
  | 'stockHeader'       // Hero with logo, ticker, price
  | 'priceSnapshot'     // Current price display
  | 'priceChart'        // Interactive chart
  | 'keyStatistics'     // Market cap, P/E, EPS, etc.
  | 'aboutCompany'      // Overview and metadata
  | 'analystRatings'    // Buy/Hold/Sell sentiment
  | 'earnings'          // Earnings data and dates
  | 'newsList'          // Related news articles
  | 'trendingStocks'    // Cross-sell other stocks
  | 'risksDisclosure';  // Risk warnings
```

Each block can be:
- Enabled/disabled
- Reordered
- Customized with block-specific config

---

## 13. Content Syncing: Blog → Stories → Spotlight

This section documents the content syncing functionality that enables seamless content repurposing across three content types: Blog Posts, Stories (for newsletters), and Spotlight Banners.

### 13.1 Overview

The content syncing system allows editors to:
1. **Blog → Story**: Create a newsletter Story from an existing Blog Post
2. **Story → Spotlight**: Create a Spotlight Banner from an existing Story
3. **Blog → Spotlight** (indirect): Blog → Story → Spotlight chain

This reduces duplicate work and ensures consistent messaging across channels.

### 13.2 Content Type Relationships

```
┌─────────────┐     sync      ┌─────────────┐     sync      ┌──────────────────┐
│  Blog Post  │ ───────────>  │    Story    │ ───────────>  │ Spotlight Banner │
└─────────────┘               └─────────────┘               └──────────────────┘
       │                             │                              │
       │                             │                              │
       ▼                             ▼                              ▼
   Web/SEO                      Newsletter                    In-App Banners
   Content                       Content                      (Home, Discover)
```

### 13.3 Data Models

#### 13.3.1 CMSBlogPost (Source)

```typescript
interface CMSBlogPost {
  id: string;
  title_en: string;
  title_ar: string;
  slug_en: string;
  slug_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_html_en: string;
  content_html_ar: string;
  content_json_en?: object;       // Structured editor content
  content_json_ar?: object;
  coverImageUrl: string;
  tags: string[];
  authorId: string;
  authorName: string;
  status: 'draft' | 'scheduled' | 'published';
  publishedAt?: string;
  scheduledAt?: string;
  seoTitle_en: string;
  seoTitle_ar: string;
  seoDescription_en: string;
  seoDescription_ar: string;
  canonicalUrl?: string;
  
  // Sync Links
  linkedSpotlightId?: string;     // Created Spotlight from this blog
  linkedNewsletterId?: string;    // Newsletter containing this blog
  
  createdAt: string;
  updatedAt: string;
}
```

#### 13.3.2 Story (Intermediate)

```typescript
interface Story {
  id: string;
  title_en: string;
  title_ar: string;
  snippet_en: string;             // Short teaser text
  snippet_ar: string;
  imageUrl: string;
  content_html_en: string;
  content_html_ar: string;
  whyItMatters_en: string;        // Newsletter-specific "Why it matters"
  whyItMatters_ar: string;
  tickers: string[];              // Related stock tickers
  status: 'draft' | 'published';
  locale: 'en' | 'ar' | 'both';
  
  // Sync Links
  linkedSpotlightId?: string;     // Spotlight created from this story
  linkedNewsletterId?: string;    // Newsletter containing this story
  sourceBlogPostId?: string;      // Original blog post (if synced)
  
  createdAt: string;
  updatedAt: string;
}
```

#### 13.3.3 SpotlightBanner (Target)

```typescript
interface SpotlightBanner {
  id: string;
  title: string;                  // Headline text
  subtitle: string;               // Supporting text (max 120 chars)
  imageUrl: string;
  ctaText: string;                // Button text
  ctaUrl: string;                 // Web URL
  appDeepLink?: string;           // Deep link for mobile app
  placements: SpotlightPlacement[];  // Where to show
  startAt?: string;               // Scheduled start
  endAt?: string;                 // Scheduled end
  status: 'draft' | 'active' | 'inactive';
  
  // Source Tracking
  sourceType: 'manual' | 'from_blog' | 'from_newsletter';
  blogPostId?: string;            // Source blog post ID
  newsletterId?: string;          // Source newsletter ID
  
  locale: 'en' | 'ar';
  createdAt: string;
  updatedAt: string;
}

type SpotlightPlacement = 'home' | 'discover' | 'blog' | 'stock' | 'custom';
```

### 13.4 Sync Flow: Blog → Story

#### 13.4.1 User Flow
1. Admin views Blog Post in CMS
2. Clicks "Create Story from Blog" button
3. System pre-fills Story fields from Blog:
   - `title_en/ar` → Story `title_en/ar`
   - `excerpt_en/ar` → Story `snippet_en/ar`
   - `coverImageUrl` → Story `imageUrl`
   - First 500 chars of `content_html` → Story `content_html`
   - `tags` → Extracted `tickers` (if any match stock symbols)
4. Admin reviews and edits Story content
5. Admin adds "Why it matters" section (newsletter-specific)
6. Admin saves Story with `sourceBlogPostId` set

#### 13.4.2 Field Mapping

| Blog Post Field | Story Field | Transformation |
|-----------------|-------------|----------------|
| `title_en` | `title_en` | Direct copy |
| `title_ar` | `title_ar` | Direct copy |
| `excerpt_en` | `snippet_en` | Direct copy (truncate to 200 chars) |
| `excerpt_ar` | `snippet_ar` | Direct copy (truncate to 200 chars) |
| `coverImageUrl` | `imageUrl` | Direct copy |
| `content_html_en` | `content_html_en` | First 500 chars or first 2 paragraphs |
| `content_html_ar` | `content_html_ar` | First 500 chars or first 2 paragraphs |
| `tags` | `tickers` | Filter for valid ticker symbols |
| - | `whyItMatters_en` | Manual entry required |
| - | `whyItMatters_ar` | Manual entry required |

#### 13.4.3 API Endpoint

```typescript
// POST /api/stories/from-blog
interface CreateStoryFromBlogRequest {
  blogPostId: string;
  locale: 'en' | 'ar' | 'both';
  overrides?: Partial<InsertStory>;  // Optional field overrides
}

interface CreateStoryFromBlogResponse {
  story: Story;
  blogPost: CMSBlogPost;  // Updated with linkedNewsletterId reference
}
```

### 13.5 Sync Flow: Story → Spotlight

#### 13.5.1 User Flow
1. Admin views Story in CMS
2. Clicks "Create Spotlight from Story" button
3. System pre-fills Spotlight fields:
   - `title_en/ar` → Spotlight `title`
   - `snippet_en/ar` → Spotlight `subtitle`
   - `imageUrl` → Spotlight `imageUrl`
   - Default CTA text and URL from settings
4. Admin selects placements (home, discover, blog, stock)
5. Admin sets schedule (optional startAt/endAt)
6. Admin saves Spotlight with:
   - `sourceType: 'from_newsletter'`
   - Story's `sourceBlogPostId` → Spotlight `blogPostId` (for traceability)
7. Story is updated with `linkedSpotlightId`

#### 13.5.2 Field Mapping

| Story Field | Spotlight Field | Transformation |
|-------------|-----------------|----------------|
| `title_en` or `title_ar` | `title` | Based on selected locale |
| `snippet_en` or `snippet_ar` | `subtitle` | Truncate to 120 chars |
| `imageUrl` | `imageUrl` | Direct copy |
| - | `ctaText` | From settings: `defaultCtaText_en/ar` |
| - | `ctaUrl` | Constructed from blog slug or story link |
| - | `placements` | From settings: `defaultSpotlightPlacements` |
| `sourceBlogPostId` | `blogPostId` | Pass through for traceability |

#### 13.5.3 API Endpoint

```typescript
// POST /api/spotlight-banners/from-story
interface CreateSpotlightFromStoryRequest {
  storyId: string;
  locale: 'en' | 'ar';
  placements: SpotlightPlacement[];
  startAt?: string;
  endAt?: string;
  overrides?: Partial<InsertSpotlightBanner>;
}

interface CreateSpotlightFromStoryResponse {
  spotlight: SpotlightBanner;
  story: Story;  // Updated with linkedSpotlightId
}
```

### 13.6 Auto-Sync Settings

#### 13.6.1 Newsletter Settings Configuration

```typescript
interface NewsletterSettings {
  // ... other fields
  
  // Auto-sync configuration
  autoActivateSpotlightOnPublish: boolean;  // Auto-activate when blog publishes
  defaultSpotlightPlacements: SpotlightPlacement[];
  defaultCtaText_en: string;
  defaultCtaText_ar: string;
}
```

#### 13.6.2 Auto-Create Spotlight on Blog Publish
When `autoActivateSpotlightOnPublish` is enabled:
1. Blog Post status changes to `published`
2. System checks if Story exists for this Blog
3. If Story exists, create Spotlight automatically
4. Spotlight status set to `active`
5. Audit log entry: `spotlight_auto_created`

### 13.7 Sync Status Indicators

#### 13.7.1 Blog Post Card (in list view)
Display badges:
- 📧 "Has Story" - if Story exists for this blog
- 📢 "Has Spotlight" - if Spotlight exists

#### 13.7.2 Story Card (in list view)
Display badges:
- 📝 "From Blog: {title}" - if `sourceBlogPostId` is set
- 📢 "Has Spotlight" - if `linkedSpotlightId` is set

#### 13.7.3 Spotlight Card (in list view)
Display source badge:
- 📝 "From Blog" - if `sourceType === 'from_blog'`
- 📧 "From Story" - if `sourceType === 'from_newsletter'`
- ✏️ "Manual" - if `sourceType === 'manual'`

### 13.8 Audit Trail

All sync operations are logged:

```typescript
type AuditActionType = 
  | 'spotlight_auto_created'          // Auto-created from blog publish
  | 'newsletter_auto_draft_created'   // Auto-draft when story created
  // ... other actions

interface AuditLog {
  id: string;
  actorUserId: string;
  actorName: string;
  actionType: AuditActionType;
  entityType: 'blog_post' | 'spotlight' | 'newsletter' | 'template' | 'subscriber';
  entityId: string;
  metaJson?: {
    sourceBlogPostId?: string;
    sourceStoryId?: string;
    sourceNewsletterId?: string;
  };
  createdAt: string;
}
```

### 13.9 UI Components

#### 13.9.1 Blog Editor Sync Actions

```typescript
// Sync action buttons in Blog editor toolbar
interface BlogSyncActions {
  createStory: {
    label: "Create Story";
    icon: "mail";
    disabled: boolean;  // Disabled if Story already exists
    tooltip: string;    // "Story already exists" or "Create newsletter story"
  };
  viewStory: {
    label: "View Story";
    icon: "external-link";
    visible: boolean;   // Only if linkedNewsletterId exists
  };
  viewSpotlight: {
    label: "View Spotlight";
    icon: "megaphone";
    visible: boolean;   // Only if linkedSpotlightId exists
  };
}
```

#### 13.9.2 Story Editor Sync Actions

```typescript
// Sync action buttons in Story editor toolbar
interface StorySyncActions {
  createSpotlight: {
    label: "Create Spotlight";
    icon: "megaphone";
    disabled: boolean;  // Disabled if Spotlight already exists
  };
  viewSpotlight: {
    label: "View Spotlight";
    icon: "external-link";
    visible: boolean;   // Only if linkedSpotlightId exists
  };
  viewSourceBlog: {
    label: "View Source Blog";
    icon: "file-text";
    visible: boolean;   // Only if sourceBlogPostId exists
  };
}
```

#### 13.9.3 Sync Modal

When clicking "Create Story" or "Create Spotlight":

```typescript
interface SyncModal {
  title: string;              // "Create Story from Blog" / "Create Spotlight from Story"
  sourcePreview: {
    title: string;
    excerpt: string;
    image: string;
  };
  targetPreview: {
    // Editable fields pre-filled from source
    title: string;
    subtitle: string;
    image: string;
    // Additional required fields
    placements?: SpotlightPlacement[];  // For Spotlight
    whyItMatters?: string;              // For Story
  };
  actions: {
    create: "Create & Open";
    createDraft: "Create as Draft";
    cancel: "Cancel";
  };
}
```

### 13.10 Bidirectional Updates (Optional Enhancement)

#### 13.10.1 Update Propagation Settings

```typescript
interface SyncPropagationSettings {
  // When Blog is updated, prompt to update linked Story
  propagateBlogToStory: 'auto' | 'prompt' | 'manual';
  
  // When Story is updated, prompt to update linked Spotlight
  propagateStoryToSpotlight: 'auto' | 'prompt' | 'manual';
  
  // Fields to propagate
  propagateFields: {
    title: boolean;
    image: boolean;
    excerpt: boolean;
  };
}
```

#### 13.10.2 Update Prompt UI
When source content is updated:
- Show notification: "Source blog was updated. Update linked Story?"
- Options: "Update Now" | "Review Changes" | "Ignore"

---

## Appendix A: API Endpoints

### Stock Pages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stock-pages` | List all stock pages |
| GET | `/api/stock-pages/:id` | Get single stock page |
| POST | `/api/stock-pages` | Create stock page |
| PUT | `/api/stock-pages/:id` | Update stock page |
| DELETE | `/api/stock-pages/:id` | Delete stock page |

### Stock Themes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/discover/themes` | List all themes |
| GET | `/api/discover/themes/:slug` | Get single theme |

### Presence (WebSocket)
| Event | Description |
|-------|-------------|
| `join` | User starts editing content |
| `leave` | User stops editing |
| `update` | User updates position/field |
| `sync` | Full presence state sync |
| `heartbeat` | Keep-alive ping |

---

## Appendix B: File Structure

```
client/src/
├── pages/
│   ├── stocks.tsx              # Stock directory listing
│   ├── stock-detail.tsx        # Individual stock page
│   ├── browse-stocks.tsx       # Full browse with filters
│   ├── stocks-discover.tsx     # Discovery page
│   ├── stock-theme.tsx         # Theme detail page
│   ├── stock-editor.tsx        # Legacy editor
│   ├── admin-stocks.tsx        # Admin stock list
│   └── admin-stock-editor.tsx  # Admin stock editor
├── components/
│   ├── stock-blocks/           # Modular stock page blocks
│   │   ├── AboutCompanyBlock.tsx
│   │   ├── AnalystRatingsBlock.tsx
│   │   ├── EarningsBlock.tsx
│   │   ├── KeyStatisticsBlock.tsx
│   │   ├── TradeWidgetBlock.tsx
│   │   ├── TrendingStocksBlock.tsx
│   │   └── PreviewBanner.tsx
│   ├── stock-preview/          # Preview components
│   │   ├── StockHero.tsx
│   │   ├── StockChartPanel.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── NewsList.tsx
│   │   └── MetricsGrid.tsx
│   ├── StockLogo.tsx
│   ├── SignUpCTA.tsx
│   └── WatchStockModal.tsx
└── lib/
    ├── mockData.ts             # Mock stock data
    ├── marketDataProvider.ts   # Real-time data
    └── discoverData.ts         # Discover page config

shared/
└── schema.ts                   # TypeScript interfaces

server/
├── routes.ts                   # API endpoints
└── storage.ts                  # Data persistence
```

---

## Appendix C: Disclaimer Requirements

All stock pages must include:
1. **Footer Disclaimer**: "Capital at risk. For informational purposes only. Not investment advice."
2. **Risk Warning Box**: Yellow/amber background with detailed risk language
3. **No financial advice**: Content must not constitute financial advice

---

This document provides a comprehensive functional specification for implementing the Stock Pages system. Use it as a reference for building similar functionality in other projects.
