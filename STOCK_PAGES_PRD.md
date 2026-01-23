# Stock Pages CMS - Product Requirements Document

## Table of Contents
1. [Stock Page Management](#1-stock-page-management)
2. [Stock Page Editor](#2-stock-page-editor)
3. [SEO Administration Settings](#3-seo-administration-settings)
4. [Content Syncing: Blog → Stories → Spotlight](#4-content-syncing-blog--stories--spotlight)

---

## 1. Stock Page Management

### 1.1 Stock List View

**Location:** `/admin/stocks`

**Dashboard Metrics:**
- Total stock pages count
- Published pages count
- Draft pages count
- Currently active editors

**Stock Table:**

| Column | What It Shows |
|--------|---------------|
| Ticker | Company logo and ticker symbol |
| Company | English company name |
| Sector | Industry sector |
| Status | Badge: draft, published, or archived |
| Editors | Avatars of users currently editing |
| Actions | Preview and Edit buttons |

**Features:**
- Search by ticker, company name, or sector
- Filter by status
- Click any row to open editor
- "New Stock Page" button

### 1.2 Status Workflow

| Status | Public Visibility |
|--------|-------------------|
| Draft | Not visible (404) |
| Published | Visible |
| Archived | Not visible (404) |

---

## 2. Stock Page Editor

**Location:** `/admin/stocks/:id/edit`

### 2.1 Content Tab

**Stock Information:**

| Field | Required | Description |
|-------|----------|-------------|
| Ticker Symbol | Yes | Trading symbol (e.g., "AAPL") |
| Exchange | Yes | NASDAQ, NYSE, or AMEX |
| Sector | Yes | Industry classification |
| URL Slug | Yes | Auto-generated, editable |
| Status | Yes | Draft, Published, Archived |

**Company Names:**

| Field | Description |
|-------|-------------|
| English Name | Company name in English |
| Arabic Name | Company name in Arabic (RTL) |

**Descriptions:**

| Field | Description |
|-------|-------------|
| English Description | Short description |
| Arabic Description | Short description (RTL) |

**About Company:**

| Field | Description |
|-------|-------------|
| CEO | Current CEO name |
| Employee Count | Number of employees |
| Headquarters | Location |
| Founded | Year established |
| Overview (EN) | Rich text company overview |
| Overview (AR) | Arabic version |
| Investment Thesis (EN) | Why investors might consider |
| Investment Thesis (AR) | Arabic version |

**Related Stocks:**

| Field | Description |
|-------|-------------|
| Related Tickers | Comma-separated ticker list |

### 2.2 SEO Tab

**Meta Information:**

| Field | Description |
|-------|-------------|
| Meta Title (EN) | Browser tab and search results title |
| Meta Title (AR) | Arabic version |
| Meta Description (EN) | Search result snippet |
| Meta Description (AR) | Arabic version |

**Open Graph (Facebook, LinkedIn):**

| Field | Description |
|-------|-------------|
| OG Title (EN/AR) | Social sharing title |
| OG Description (EN/AR) | Social sharing description |
| OG Image URL | Social sharing image |

**Twitter Cards:**

| Field | Description |
|-------|-------------|
| Twitter Title (EN/AR) | Twitter sharing title |
| Twitter Description (EN/AR) | Twitter sharing description |
| Twitter Image URL | Twitter image |
| Card Type | Summary or Large Image |

**Schema.org:**

| Field | Description |
|-------|-------------|
| Schema Type | Entity type (Corporation) |
| Ticker Symbol | For structured data |
| Exchange | Exchange name |
| Currency | Trading currency |

### 2.3 Editor Actions

- **Save**: Saves changes, maintains current status
- **Preview**: Opens page in new tab with preview mode
- **Back**: Returns to stock list

---

## 3. SEO Administration Settings

### 3.1 Global SEO Templates

**Purpose:** Default SEO values applied to all stock pages to reduce repetitive entry.

**Template Variables:**

| Variable | Replaced With |
|----------|---------------|
| `{{ticker}}` | Stock ticker symbol |
| `{{companyName}}` | Company name |
| `{{sector}}` | Industry sector |
| `{{exchange}}` | Stock exchange |
| `{{price}}` | Current stock price |

### 3.2 Configurable Templates

**Meta Title Templates:**

| Field | Example |
|-------|---------|
| English | "{{ticker}} Stock - Buy {{companyName}} Shares \| Baraka" |
| Arabic | Arabic equivalent with placeholders |

**Meta Description Templates:**

| Field | Example |
|-------|---------|
| English | "Invest in {{companyName}} ({{ticker}}) on Baraka. Get real-time prices and expert analysis." |
| Arabic | Arabic equivalent |

**Open Graph Templates:**

| Field | Description |
|-------|-------------|
| OG Title Template (EN/AR) | Default social title |
| OG Description Template (EN/AR) | Default social description |

### 3.3 Template Override Behavior

1. New stock pages use template values as defaults
2. Editors can override any value on individual pages
3. Blank fields use the template
4. Filled fields take precedence over template

### 3.4 Schema.org Defaults

| Setting | Description |
|---------|-------------|
| Default Schema Type | Corporation |
| Default Currency | USD |
| Site Name | Brand name for structured data |

### 3.5 Indexing Settings

| Setting | Description |
|---------|-------------|
| Index Published Pages | Yes/No |
| Index Draft Pages | Typically No |
| Canonical URL Pattern | URL pattern for canonical links |

---

## 4. Content Syncing: Blog → Stories → Spotlight

### 4.1 Content Flow

```
Blog Post → Story → Spotlight Banner
   ↓           ↓            ↓
Web/SEO    Newsletter    In-App Banners
```

### 4.2 Syncing Blog to Story

**Flow:**
1. Editor views Blog Post in CMS
2. Clicks "Sync to Stories" button (purple newspaper icon)
3. System creates Story draft pre-filled with blog content
4. Editor receives success notification

**What Gets Copied:**

| Blog Field | Story Field | Notes |
|------------|-------------|-------|
| Title (EN/AR) | Title (EN/AR) | Direct copy |
| Excerpt (EN/AR) | Snippet (EN/AR) | Truncated to 200 chars |
| Featured Image | Image | Direct copy |
| Content (EN/AR) | Content (EN/AR) | First portion |
| Tags | Tickers | Valid symbols only |

**Editor Must Add:**
- "Why it matters" section

**Button Visibility:**
- Visible when no Story exists for blog
- Hidden when Story exists (replaced with badge)

### 4.3 Syncing Story to Spotlight

**Flow:**
1. Editor opens Story in CMS
2. Clicks "Create Spotlight" button
3. System creates Spotlight draft
4. Editor configures placements and schedule

**What Gets Copied:**

| Story Field | Spotlight Field | Notes |
|-------------|-----------------|-------|
| Title | Headline | Selected language |
| Snippet | Subtitle | Truncated to 120 chars |
| Image | Image | Direct copy |

**Editor Must Configure:**
- CTA button text and link
- Placements (home, discover, etc.)
- Schedule (optional)

### 4.4 One-Click Publishing

**"Publish Everywhere" button does:**
1. Publishes Blog Post
2. Creates Story (if none exists)
3. Creates Spotlight (if none exists)
4. Creates Newsletter draft (if none exists)

### 4.5 Status Indicators

**On Blog Cards:**

| Badge | Color | Meaning |
|-------|-------|---------|
| Story | Purple | Story exists |
| Spotlight | Amber | Spotlight exists |
| Newsletter | Blue | Newsletter exists |

**On Story Cards:**
- "From Blog" indicator if synced from blog
- "Has Spotlight" badge if Spotlight created

**On Spotlight Cards:**
- Source badge: "From Blog", "From Story", or "Manual"

### 4.6 Traceability

- Stories track source Blog Post
- Spotlights track source (Blog or Story)
- All sync operations are logged with timestamp and user

---

This document describes CMS functionality for Stock Page management, SEO settings, and content syncing.
