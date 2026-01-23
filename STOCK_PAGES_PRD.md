# Stock Pages CMS - Product Requirements Document

## 1. Stock Page Management

### 1.1 Purpose
The Stock Page Management system allows content editors to create and maintain individual pages for each stock/company. Each stock page contains company information, investment content, and SEO metadata.

### 1.2 Core Workflows

**Creating a New Stock Page:**
1. Editor clicks "New Stock Page"
2. System generates a new stock record with status = "draft"
3. Editor is redirected to the Stock Page Editor
4. Editor fills in required fields (ticker, exchange, company name)
5. Editor saves the page - it remains as draft until explicitly published

**Publishing a Stock Page:**
1. Editor changes status from "draft" to "published"
2. System validates all required fields are complete
3. If validation passes, the page becomes publicly accessible at `/stocks/{slug}`
4. If validation fails, system shows which fields are missing

**Archiving a Stock Page:**
1. Editor changes status to "archived"
2. System removes the page from public access (returns 404)
3. The stock record is preserved in the database for potential restoration

### 1.3 Status Behavior

| Status | What Happens |
|--------|--------------|
| Draft | Page is not accessible to public. URL returns 404. Only visible in CMS. |
| Published | Page is live. URL renders the stock page. Indexed by search engines. |
| Archived | Page is removed from public. URL returns 404. Record preserved for restoration. |

---

## 2. Stock Page Editor

### 2.1 Data Structure

A stock page consists of:
- **Identifiers**: ticker symbol, exchange, URL slug
- **Company Info**: names, descriptions, CEO, headquarters, founded year, employee count
- **Content**: overview text, investment thesis (both bilingual EN/AR)
- **Relationships**: related stock tickers for cross-linking
- **SEO Metadata**: meta tags, Open Graph, Twitter Cards, Schema.org (see Section 3)

### 2.2 URL Slug Generation

**How it works:**
1. When ticker is entered, system auto-generates slug: `AAPL` → `aapl`
2. Editor can manually override the slug
3. Slug must be unique across all stock pages
4. Changing slug on a published page should trigger a redirect from old URL

### 2.3 Bilingual Content

**How it works:**
- All text fields have English and Arabic versions
- Arabic fields use RTL (right-to-left) text direction
- Both versions are stored independently
- Public page renders based on user's language preference

### 2.4 Related Stocks

**How it works:**
1. Editor enters comma-separated ticker symbols (e.g., "MSFT, GOOGL, META")
2. System validates each ticker exists in the database
3. On public page, related stocks are displayed as clickable links
4. Relationship is one-way (adding GOOGL to AAPL doesn't add AAPL to GOOGL)

---

## 3. SEO System: Templates vs Individual Overrides

### 3.1 The Problem This Solves

With thousands of stock pages, manually entering SEO metadata for each would be:
- Time-consuming
- Inconsistent
- Error-prone

**Solution:** A template system that auto-generates SEO values, with the ability to override specific pages when needed.

### 3.2 How Templates Work

**SEO Administration Settings** (global level) defines templates like:
```
Meta Title Template: "{{ticker}} Stock - Buy {{companyName}} Shares | Baraka"
```

**When a stock page is rendered**, the system:
1. Checks if the individual page has a custom meta title
2. If yes → use the custom value
3. If no → use the template, replacing variables with actual data

**Example Resolution:**
- Template: `"{{ticker}} Stock - Buy {{companyName}} Shares | Baraka"`
- Stock: ticker=AAPL, companyName=Apple Inc
- Result: `"AAPL Stock - Buy Apple Inc Shares | Baraka"`

### 3.3 Available Template Variables

| Variable | Source | Example Value |
|----------|--------|---------------|
| `{{ticker}}` | Stock record | "AAPL" |
| `{{companyName}}` | Stock record (uses language preference) | "Apple Inc" |
| `{{sector}}` | Stock record | "Technology" |
| `{{exchange}}` | Stock record | "NASDAQ" |
| `{{price}}` | Real-time market data API | "178.50" |

### 3.4 Resolution Priority (Most to Least Specific)

```
1. Individual Stock Page Override (if field is filled)
      ↓ (if empty)
2. Global SEO Template (with variable substitution)
      ↓ (if template is empty)
3. Fallback Default (hardcoded sensible default)
```

### 3.5 SEO Administration Settings Screen

**Purpose:** Configure global templates that apply to ALL stock pages unless overridden.

**What editors configure here:**

| Setting | What It Controls |
|---------|------------------|
| Meta Title Template (EN/AR) | Default title for browser tab and search results |
| Meta Description Template (EN/AR) | Default description shown in search snippets |
| OG Title Template (EN/AR) | Default title when shared on Facebook/LinkedIn |
| OG Description Template (EN/AR) | Default description for social sharing |
| Default OG Image | Fallback image for social sharing |
| Twitter Card Type | Summary vs Summary with Large Image |
| Schema.org Type | Entity type (Corporation, Organization, etc.) |
| Default Currency | For structured data (USD, AED, etc.) |

**When to use this screen:**
- Initial setup: Define templates before creating stock pages
- Brand changes: Update all stock page SEO at once by changing templates
- SEO optimization: A/B test different title/description patterns

### 3.6 Individual Stock Page SEO Tab

**Purpose:** Override global templates for specific stocks that need custom SEO.

**When to override:**
- High-priority stocks that need unique messaging
- Stocks with special promotions
- Stocks where auto-generated text doesn't read well
- Custom social sharing images for specific companies

**How overrides work:**
1. Editor opens stock page → SEO tab
2. Each field shows the current resolved value (either from template or previous override)
3. Editor enters custom value → this value takes precedence over template
4. To revert to template → editor clears the field (empty = use template)

### 3.7 SEO Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  SEO ADMINISTRATION SETTINGS                 │
│  (Global Templates with {{variables}})                       │
│                                                              │
│  Meta Title Template: "{{ticker}} - {{companyName}} | Baraka"│
│  Meta Desc Template:  "Invest in {{companyName}} today..."   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    STOCK PAGE RECORD                         │
│  (Individual data + optional SEO overrides)                  │
│                                                              │
│  ticker: "AAPL"                                              │
│  companyName: "Apple Inc"                                    │
│  metaTitleOverride: null  ← empty means use template         │
│  metaDescOverride: "Custom description for Apple..."         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SEO RESOLUTION ENGINE                     │
│  (Runs when page is rendered)                                │
│                                                              │
│  For each SEO field:                                         │
│    1. Check if override exists → use it                      │
│    2. Else, get template → substitute variables → use it     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    RENDERED HTML HEAD                        │
│                                                              │
│  <title>AAPL - Apple Inc | Baraka</title>  ← from template   │
│  <meta name="description" content="Custom description...">  │
│                                        ↑ from override       │
└─────────────────────────────────────────────────────────────┘
```

### 3.8 Schema.org Structured Data

**What it is:** Machine-readable data that helps search engines understand the page content.

**How it works:**
1. SEO Admin Settings defines default schema type (e.g., Corporation)
2. When stock page renders, system generates JSON-LD structured data
3. Data includes: company name, ticker, exchange, stock price, currency
4. Search engines use this for rich snippets (stock prices in search results)

**Example output:**
```json
{
  "@context": "https://schema.org",
  "@type": "Corporation",
  "name": "Apple Inc",
  "tickerSymbol": "AAPL",
  "exchange": "NASDAQ"
}
```

### 3.9 Indexing Controls

**What editors configure:**
- Index Published Pages: Should search engines index published stock pages? (typically Yes)
- Index Draft Pages: Should drafts be indexed? (typically No, enforced via meta robots tag)
- Canonical URL Pattern: Define the authoritative URL format to prevent duplicate content issues

**How it works:**
- Published pages get `<meta name="robots" content="index, follow">`
- Draft/Archived pages get `<meta name="robots" content="noindex, nofollow">`
- All pages include `<link rel="canonical" href="...">` based on pattern

---

## 4. Implementation Considerations

### 4.1 Performance

- Template resolution should be cached per stock page
- Cache should invalidate when: template changes, stock data changes, or override is added
- Real-time price variable (`{{price}}`) requires special handling (short TTL cache or SSR)

### 4.2 Validation

- Ticker symbol: uppercase letters only, 1-5 characters
- URL slug: lowercase, alphanumeric, hyphens allowed, unique constraint
- Meta title: max 60 characters recommended
- Meta description: max 160 characters recommended
- Image URLs: must be valid HTTPS URLs

### 4.3 Database Relationships

```
SEO_Settings (singleton)
  - metaTitleTemplateEN
  - metaTitleTemplateAR
  - metaDescTemplateEN
  - metaDescTemplateAR
  - ogTitleTemplateEN
  - ogTitleTemplateAR
  - defaultOgImage
  - defaultSchemaType
  - defaultCurrency
  - indexPublished
  - indexDrafts
  - canonicalPattern

Stock_Page (one per stock)
  - id
  - ticker
  - slug
  - exchange
  - status
  - companyNameEN, companyNameAR
  - descriptionEN, descriptionAR
  - ceo, headquarters, founded, employeeCount
  - overviewEN, overviewAR
  - investmentThesisEN, investmentThesisAR
  - relatedTickers[]
  - metaTitleOverrideEN, metaTitleOverrideAR  ← null = use template
  - metaDescOverrideEN, metaDescOverrideAR
  - ogTitleOverrideEN, ogTitleOverrideAR
  - ogDescOverrideEN, ogDescOverrideAR
  - ogImageOverride
  - twitterTitleOverrideEN, twitterTitleOverrideAR
  - twitterDescOverrideEN, twitterDescOverrideAR
  - twitterImageOverride
```

---

This document describes the functional behavior of the Stock Pages CMS, with focus on how SEO templates and individual overrides work together.
