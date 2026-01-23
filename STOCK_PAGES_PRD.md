# Stock Pages - Product Requirements Document

## Table of Contents
1. [Overview](#1-overview)
2. [Stock Page Information](#2-stock-page-information)
3. [Public Stock Pages](#3-public-stock-pages)
4. [Admin Stock Management](#4-admin-stock-management)
5. [Stock Discovery & Browsing](#5-stock-discovery--browsing)
6. [Stock Themes](#6-stock-themes)
7. [SEO & Social Sharing](#7-seo--social-sharing)
8. [Language & RTL Support](#8-language--rtl-support)
9. [Real-Time Market Data](#9-real-time-market-data)
10. [Related Stocks](#10-related-stocks)
11. [Collaborative Editing](#11-collaborative-editing)
12. [Additional Features](#12-additional-features)
13. [Content Syncing: Blog → Stories → Spotlight](#13-content-syncing-blog--stories--spotlight)

---

## 1. Overview

### 1.1 Purpose
The Stock Pages system is a CMS-driven platform for creating and managing individual stock landing pages. These pages provide investors with company information, market data, analyst ratings, and educational content.

### 1.2 Core Capabilities
- **Individual Stock Pages**: Detailed pages for each stock with company info, pricing, charts, and analysis
- **Stock Directory**: Searchable, filterable list of all available stocks
- **Stock Discovery**: Curated experience with trending stocks, gainers, losers, and themes
- **Stock Themes**: Collections of stocks grouped by investment themes (e.g., AI Stocks, EV Stocks)
- **Admin CMS**: Content management for creating and editing stock pages
- **Multi-language**: English and Arabic with right-to-left layout support
- **SEO Optimization**: Meta tags, social sharing cards, and structured data markup
- **Live Market Data**: Real-time price, change, volume, and performance information

### 1.3 Key User Journeys

**Investor Journey:**
User browses stocks → Visits Discover or Browse page → Selects a stock → Views Stock Detail page → Clicks CTA to trade

**Editor Journey:**
Admin opens CMS → Creates/edits stock page → Previews content → Publishes page

**Theme Exploration:**
User visits Discover page → Browses investment themes → Opens theme page → Explores individual stocks in that theme

---

## 2. Stock Page Information

### 2.1 Basic Stock Information
Each stock page contains the following information:

| Field | Description |
|-------|-------------|
| Ticker Symbol | The stock's trading symbol (e.g., "AAPL") |
| URL Slug | URL-friendly identifier (e.g., "apple-inc") |
| Company Name | Full company name in English and Arabic |
| Description | Short company description in both languages |
| Rich Content | Detailed content about the company in both languages |
| Sector | Industry classification (e.g., "Technology", "Healthcare") |
| Exchange | Stock exchange (NASDAQ, NYSE, AMEX) |
| Currency | Trading currency (typically USD) |
| Tags | Categorization labels for filtering |
| Status | Draft, Published, or Archived |
| Related Tickers | Other stocks to cross-link |

### 2.2 Company Details
Additional company information captured:

| Field | Description |
|-------|-------------|
| CEO | Current chief executive officer |
| Employee Count | Number of employees (e.g., "164,000") |
| Headquarters | Company location |
| Founded | Year the company was established |

### 2.3 Content Sections
Stock pages support multiple content sections:

- **Overview**: General company description and business model
- **Investment Thesis**: Reasons why investors might consider this stock
- **Risk Factors**: Potential risks and concerns
- **Key Highlights**: Bullet points of important facts
- **FAQs**: Common questions and answers about the stock

### 2.4 Dynamic Market Data
Real-time data displayed on stock pages:

| Data Point | Description |
|------------|-------------|
| Current Price | Latest stock price |
| Price Change | How much the price changed (dollar amount and percentage) |
| Market Cap | Total market capitalization |
| Volume | Daily trading volume |
| P/E Ratio | Price-to-earnings ratio |
| EPS | Earnings per share |
| Dividend Yield | Annual dividend percentage |
| Analyst Sentiment | Buy/Hold/Sell ratings distribution |
| Performance | Returns over 1 day, 1 week, 1 month, 1 year |

---

## 3. Public Stock Pages

### 3.1 Stock Detail Page

**URL Structure:**
- Primary format: `/stocks/{ticker}` (e.g., `/stocks/aapl`)
- Alternative format: `/stocks/{slug}` (e.g., `/stocks/apple-inc`)

**Page Layout:**
The page uses a two-column layout with the main content taking 8 columns and a sidebar taking 4 columns.

**Main Content Sections (top to bottom):**

1. **Hero Section**
   - Company logo
   - Ticker symbol with exchange badge
   - Company name
   - Current price with change indicator (green for positive, red for negative)
   - Percentage change with trend arrow

2. **Price Chart Panel**
   - Interactive chart
   - Timeframe buttons: 1D, 1W, 1M, 3M, 1Y, ALL
   - Volume display option

3. **About Company**
   - Company overview text
   - Company metadata (CEO, employees, headquarters, founded year)
   - Investment thesis section
   - Risk factors (expandable/collapsible)

4. **Key Statistics**
   - Market Cap
   - Trading Volume
   - P/E Ratio
   - Earnings Per Share
   - Dividend Yield
   - 52-Week High/Low

5. **Analyst Ratings**
   - Visual bar showing Buy/Hold/Sell distribution
   - Consensus rating label
   - Price target (if available)

6. **Earnings**
   - Next earnings date
   - Historical earnings chart
   - Revenue trends

7. **News**
   - Recent news articles about the stock
   - Source and timestamp for each article

8. **FAQ Section**
   - Accordion-style expandable questions and answers

9. **Similar Stocks**
   - Grid of related stock cards for navigation

**Sidebar Sections:**

1. **Trade Widget**
   - Buy/Trade button linking to app download
   - Add to Watchlist option
   - Share buttons

2. **Trending Stocks**
   - List of popular stocks (excluding the current one)

### 3.2 Sticky Header Behavior
When the user scrolls down more than 100 pixels:
- Header condenses to show: ticker symbol, current price, change percentage
- Quick navigation links appear to jump to page sections

### 3.3 Section Navigation
Anchor links allow quick jumps to: About | Statistics | Ratings | Earnings | News | FAQ

### 3.4 Page States

| State | Behavior |
|-------|----------|
| Published | Full page is visible to the public |
| Draft | Returns 404 for public visitors; visible in admin preview |
| Archived | Returns 404 for public visitors |
| Not Found | Shows "Stock not found" message with link to browse all stocks |

### 3.5 Preview Mode
Editors can preview unpublished pages by adding `?preview=1` to the URL. A preview banner appears at the top of the page. Language can be overridden using `?locale=ar` or `?locale=en`.

---

## 4. Admin Stock Management

### 4.1 Stock List View

**Location:** `/admin/stocks`

**Dashboard Metrics:**
- Total stock pages count
- Published pages count
- Draft pages count
- Currently active editors (real-time)

**Stock Table Columns:**
| Column | Content |
|--------|---------|
| Ticker | Company logo and ticker symbol |
| Company | English company name |
| Sector | Industry sector |
| Status | Badge showing draft/published/archived |
| Editors | Avatars of users currently editing this page |
| Actions | Preview and Edit buttons |

**Features:**
- Search by ticker, company name, or sector
- Filter by status (draft, published, archived)
- Click any row to open the editor
- "New Stock Page" button to create a new page

### 4.2 Stock Editor

**Location:** `/admin/stocks/:id/edit`

**Content Tab:**
- **Stock Information**
  - Ticker Symbol (required)
  - Exchange selection (NASDAQ/NYSE/AMEX)
  - Sector
  - URL Slug (auto-generated from ticker, editable)
  - Status dropdown

- **Company Names**
  - English name
  - Arabic name (right-to-left input)

- **Descriptions**
  - English description
  - Arabic description (right-to-left input)

- **About Company**
  - CEO name
  - Employee count
  - Headquarters
  - Founded year
  - Overview (rich text editor for English)
  - Overview (rich text editor for Arabic)
  - Investment Thesis (English)
  - Investment Thesis (Arabic)

- **Related Stocks**
  - Comma-separated list of related tickers

**SEO Tab:**
- Meta title (English and Arabic)
- Meta description (English and Arabic)
- Open Graph title, description, and image URL
- Twitter Card title, description, image, and card type
- Schema.org settings (type, ticker, exchange, currency)

**Collaborative Features:**
- Real-time indicators showing who else is editing
- Avatars and names of active editors
- Visual highlighting of fields being edited by others
- Connection status indicator (online/offline)

**Actions:**
- Save (saves as draft or published based on status)
- Preview (opens page in new tab with preview mode)
- Back to list

---

## 5. Stock Discovery & Browsing

### 5.1 Browse Stocks Page

**Location:** `/browse-stocks`

**Features:**
- **Search Bar**: Filter stocks by ticker or company name
- **Sector Filters**: Clickable badges to filter by industry
- **Sort Options**: Sort by Ticker, Name, or Sector
- **View Toggle**: Switch between grid and list views

**Grid View:**
Stock cards displaying: logo, ticker with exchange badge, company name, sector badge

**List View:**
Alphabetically grouped by first letter with sticky letter headers. Each row shows logo, ticker, company name, and sector.

**Theme Integration:**
When no filters are active, a "Browse by Theme" section appears linking to theme pages.

### 5.2 Stocks Discover Page

**Location:** `/discover`

**Hero Section:**
- Configurable title and subtitle
- Global search bar with autocomplete suggestions
- Quick filter chips: Trending | Most Viewed | Top Gainers | Top Losers | Newly Added

**Trending Stocks Section:**
- Horizontally scrollable cards
- Mini sparkline charts (optional, configurable)
- Price and change percentage display

**Biggest Movers Section:**
Two-column layout:
- **Gainers Column**: Top 5 stocks with highest positive change, ranked
- **Losers Column**: Top 5 stocks with highest negative change, ranked

**Stock Themes Section:**
- Grid of theme cards
- Featured theme badges
- Stock count per theme
- Sample ticker previews

**Featured Stocks Section:**
- Curated grid of stock cards
- Tickers configured by admin

### 5.3 Discover Page Configuration
Admins can configure:
- Hero title and subtitle (both languages)
- Which tickers appear in trending, gainers, losers, and featured sections
- Whether sparkline charts are shown
- Which sections are visible (offers, themes, trending, featured, price alerts, learn, newsletter, disclosures)

---

## 6. Stock Themes

### 6.1 Theme Information

Each theme contains:

| Field | Description |
|-------|-------------|
| Title | Theme name (English and Arabic) |
| Slug | URL identifier (e.g., "ai-stocks") |
| Short Description | Brief theme description |
| Long Description | Extended theme explanation |
| Tickers | List of stocks in this theme |
| Hero Image | Banner image for the theme page |
| Icon | Visual icon representing the theme |
| Badges | Display badges (e.g., "Popular", "New") |
| Highlights | "Why invest" benefit cards |
| Sort Mode | How stocks are ordered: manual, by market cap, volume, or performance |
| Related Blog Tags | Tags to link related blog content |
| Status | Draft, Published, or Archived |
| Featured Flag | Whether theme appears prominently |
| New Flag | Whether "New" badge is shown |

### 6.2 Theme Page

**Location:** `/stocks/themes/:slug`

**Layout:**

1. **Header**
   - Theme icon
   - Theme title
   - Badges (New, Featured, custom)
   - Short description
   - Number of stocks in theme

2. **Highlights Section** (if configured)
   - "Why invest in [Theme]?" heading
   - Three-column grid of benefit cards
   - Each card has: icon, title, description

3. **Stocks Grid**
   - Card for each ticker in the theme
   - "Live" badge if stock page exists and is published
   - "Coming Soon" badge if no page exists yet
   - "View Stock Page" button (disabled if page doesn't exist)

4. **CTA Section**
   - "Ready to invest in [Theme]?" heading
   - App download button

5. **Learn More Section**
   - Links to related blog articles

---

## 7. SEO & Social Sharing

### 7.1 Meta Tags

Each stock page has configurable:
- **Page Title**: Appears in browser tab and search results
- **Meta Description**: Appears in search result snippets
- **Canonical URL**: Prevents duplicate content issues
- **Robots Directives**: Control whether page is indexed/followed

### 7.2 Template Variables

SEO fields can use dynamic placeholders that get replaced with actual values:
- `{{ticker}}` → Stock ticker symbol
- `{{companyName}}` → Company name
- `{{sector}}` → Industry sector
- `{{exchange}}` → Stock exchange
- `{{price}}` → Current stock price

**Example template:**
Title: "{{ticker}} Stock - Buy {{companyName}} Shares | Baraka"

### 7.3 Open Graph (Facebook/LinkedIn Sharing)

When someone shares a stock page on social media, the following information appears:
- Title
- Description
- Preview image
- Site name
- URL

### 7.4 Twitter Cards

When shared on Twitter:
- Card type (summary or large image)
- Title
- Description
- Preview image

### 7.5 Structured Data (Schema.org)

Stock pages include structured data that helps search engines understand the content:
- Company type (Corporation)
- Company name
- Ticker symbol
- Stock exchange
- Currency
- Page description

---

## 8. Language & RTL Support

### 8.1 Language Toggle
- Toggle button in header switches between English (EN) and Arabic (AR)
- User preference is saved and remembered
- URL parameter `?locale=ar` can override the setting

### 8.2 Right-to-Left Layout
When Arabic is selected:
- Text aligns to the right
- Layout direction reverses (sidebars swap sides)
- Directional icons rotate appropriately
- Numbers and prices maintain left-to-right display

### 8.3 Bilingual Content
All content fields exist in both languages:
- Titles, descriptions, and body content
- SEO metadata
- UI labels

### 8.4 Number Formatting
- Currency displays with proper symbols
- Percentages show appropriate decimal places
- Large numbers use locale-appropriate separators

---

## 9. Real-Time Market Data

### 9.1 Data Points Available
- Current stock price
- Price change (absolute and percentage)
- Trading volume
- Market capitalization
- Mini sparkline charts (recent price movement)
- Last update timestamp

### 9.2 Update Behavior
- **Initial Load**: Fetches data for all visible stocks
- **Periodic Refresh**: Updates every 30-60 seconds
- **On-Demand**: Refreshes when user focuses on price areas

### 9.3 Price Display
- **Positive changes**: Green text with up arrow
- **Negative changes**: Red text with down arrow
- **Animated transitions**: Smooth updates when prices change

---

## 10. Related Stocks

### 10.1 How Related Stocks Are Determined

**Automatic Suggestions:**
- Same sector/industry
- Similar market capitalization
- Frequently traded together by users
- Competitors in the same space

**Manual Curation:**
Editors can specify related tickers directly in the stock editor.

### 10.2 Display
- "Similar Stocks" section on each stock page
- Grid of 4 stock cards
- Clicking a card navigates to that stock's page

---

## 11. Collaborative Editing

### 11.1 Real-Time Presence

When multiple editors work on the same stock page:
- Each editor sees who else is currently editing
- Editors are identified by name and a unique color
- An "Active Editors" bar shows all current participants

### 11.2 Field-Level Awareness
- Visual indicator shows which specific field another editor is working in
- Prevents confusion about who is editing what

### 11.3 Connection Status
- Online/offline indicator shows connection health
- Reconnects automatically if connection drops

### 11.4 Color Coding
Each editor is assigned a unique color from a palette. This color appears in their avatar and any field indicators.

---

## 12. Additional Features

### 12.1 Stock Watch Subscriptions
Users can subscribe to receive updates about specific stocks:
- Email address and mobile number
- Selected stock ticker
- Update frequency: daily, weekly, or monthly
- Language preference

### 12.2 Price Alert Subscriptions
Users can subscribe to receive price movement alerts:
- Email address
- List of tickers to watch
- Alert frequency: instant, daily, or weekly
- Language preference

### 12.3 Stock Logo Display
- Shows company logo from CDN when available
- Falls back to first two letters of ticker if no logo exists
- Rounded container with subtle background

### 12.4 Sign-Up CTA
- Dynamic call-to-action text based on context
- Supports ticker-specific messaging: "Trade AAPL"
- Links to app download
- Mobile: Platform-specific deep links (iOS/Android)
- Desktop: QR code modal for mobile download

### 12.5 Mobile Install Banner
- Sticky banner prompting mobile users to install the app
- Configurable visibility per page
- Frequency capping (e.g., show once every 7 days)
- Platform-aware deep links

### 12.6 Page Builder Blocks
Stock pages are composed of modular blocks that can be:
- Enabled or disabled
- Reordered
- Customized with specific settings

**Available Block Types:**
- Stock Header (hero with logo, ticker, price)
- Price Snapshot (current price display)
- Price Chart (interactive chart)
- Key Statistics (market metrics)
- About Company (overview and details)
- Analyst Ratings (sentiment display)
- Earnings (earnings data and chart)
- News (recent articles)
- FAQ (questions and answers)
- Trade Widget (CTA and actions)
- Similar Stocks (related stock cards)

---

## 13. Content Syncing: Blog → Stories → Spotlight

This section describes how content flows between Blog Posts, Stories, and Spotlight Banners to reduce duplicate work and maintain consistent messaging.

### 13.1 Content Flow Overview

Content can be repurposed across three channels:

```
Blog Post → Story → Spotlight Banner
   ↓           ↓            ↓
Web/SEO    Newsletter    In-App Banners
Content     Content      (Home, Discover)
```

### 13.2 Content Relationships

**Blog Post** (source content)
- Full articles for the website
- Detailed content with SEO optimization
- Can be synced to create a Story

**Story** (intermediate format)
- Newsletter-ready content
- Shorter format with "Why it matters" section
- Tracks which Blog Post it came from
- Can be synced to create a Spotlight

**Spotlight Banner** (promotional content)
- In-app banner format
- Short headline and subtitle
- Configurable placements (home screen, discover page, etc.)
- Tracks its source (Blog or Story)

### 13.3 Syncing Blog to Story

**User Flow:**
1. Editor opens a Blog Post in the CMS
2. Clicks "Sync to Stories" button (purple newspaper icon)
3. System creates a new Story pre-filled with blog content:
   - Title copied to Story title (both languages)
   - Excerpt copied to Story snippet (truncated to 200 characters)
   - Featured image copied to Story image
   - First portion of content copied to Story content
   - Stock tickers extracted from tags
4. Story is created as a draft
5. Editor can review and add "Why it matters" section
6. Story is linked back to the source Blog Post

**What Gets Copied:**
| Blog Field | Story Field | Notes |
|------------|-------------|-------|
| Title (EN/AR) | Title (EN/AR) | Direct copy |
| Excerpt (EN/AR) | Snippet (EN/AR) | Truncated to 200 characters |
| Featured Image | Image | Direct copy |
| Content (EN/AR) | Content (EN/AR) | First 500 characters or 2 paragraphs |
| Tags | Tickers | Only valid stock symbols |

**What Editor Must Add:**
- "Why it matters" section (required for newsletters)
- Any story-specific edits

### 13.4 Syncing Story to Spotlight

**User Flow:**
1. Editor opens a Story in the CMS
2. Clicks "Create Spotlight" button
3. System creates a new Spotlight pre-filled:
   - Story title becomes Spotlight headline
   - Story snippet becomes subtitle (truncated to 120 characters)
   - Story image becomes Spotlight image
   - Default CTA text and URL from settings
4. Editor selects where the banner appears (home, discover, blog, stock pages)
5. Editor optionally sets schedule (start and end dates)
6. Spotlight is linked back to the source Story (and original Blog if applicable)

**What Gets Copied:**
| Story Field | Spotlight Field | Notes |
|-------------|-----------------|-------|
| Title | Headline | Based on selected language |
| Snippet | Subtitle | Truncated to 120 characters |
| Image | Image | Direct copy |

**What Editor Configures:**
- CTA button text
- CTA link/deep link
- Placements (which screens show the banner)
- Schedule (optional start/end dates)

### 13.5 One-Click Publishing

The "Publish Everywhere" button in the Blog editor performs all syncing in one action:
1. Publishes the Blog Post
2. Creates a Story (if one doesn't exist)
3. Creates a Spotlight (if one doesn't exist)
4. Creates a Newsletter draft (if one doesn't exist)

### 13.6 Status Indicators

**On Blog Cards:**
- Purple "Story" badge: A Story exists for this blog
- Amber "Spotlight" badge: A Spotlight exists
- Blue "Newsletter" badge: A Newsletter exists

**On Story Cards:**
- "From Blog: [title]" indicator if synced from a blog
- "Has Spotlight" badge if a Spotlight was created

**On Spotlight Cards:**
- "From Blog" badge if source was a blog
- "From Story" badge if source was a story
- "Manual" badge if created directly

### 13.7 Sync Button Visibility

**"Sync to Stories" button appears when:**
- Viewing a Blog Post
- No Story exists for that Blog yet

**"Create Spotlight" button appears when:**
- Viewing a Story
- No Spotlight exists for that Story yet

**Buttons are hidden when:**
- Linked content already exists (replaced by view/navigate links)

### 13.8 Auto-Sync Settings (Optional)

Administrators can configure automatic syncing:
- **Auto-create Spotlight on Blog publish**: When enabled, publishing a blog automatically creates and activates a Spotlight
- **Default placements**: Which screens new Spotlights appear on by default
- **Default CTA text**: Standard button text for auto-created Spotlights

### 13.9 Update Propagation (Optional Enhancement)

When source content is updated, the system can:
- **Prompt mode**: Ask editor if linked content should be updated
- **Auto mode**: Automatically update linked content
- **Manual mode**: Require editor to manually update linked content

Configurable per field (title, image, excerpt).

---

## Appendix A: URL Reference

### Stock Pages
| URL Pattern | Description |
|-------------|-------------|
| `/stocks` | Stock directory listing |
| `/stocks/:ticker` | Individual stock page |
| `/browse-stocks` | Full browse with filters |
| `/discover` | Discovery page with themes and movers |
| `/stocks/themes/:slug` | Theme detail page |

### Admin Pages
| URL Pattern | Description |
|-------------|-------------|
| `/admin/stocks` | Stock page management list |
| `/admin/stocks/:id/edit` | Stock page editor |
| `/admin/blog` | Blog management |
| `/admin/stories` | Stories management |
| `/admin/spotlights` | Spotlight banner management |

---

## Appendix B: Disclaimer Requirements

All stock pages must include:
1. **Footer Disclaimer**: "Capital at risk. For informational purposes only. Not investment advice."
2. **Risk Warning**: Prominently displayed risk language
3. **No Financial Advice**: Content must not constitute financial advice

---

This document provides the functional specification for the Stock Pages system. It describes what the system does and how users interact with it, serving as a reference for understanding system behavior.
