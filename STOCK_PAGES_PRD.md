# Stock Pages CMS - Product Requirements Document

## Table of Contents
1. [Overview](#1-overview)
2. [Stock Page Management](#2-stock-page-management)
3. [Stock Page Editor](#3-stock-page-editor)
4. [SEO Administration Settings](#4-seo-administration-settings)
5. [Stock Themes Management](#5-stock-themes-management)
6. [Collaborative Editing](#6-collaborative-editing)
7. [Content Syncing: Blog → Stories → Spotlight](#7-content-syncing-blog--stories--spotlight)

---

## 1. Overview

### 1.1 Purpose
This document describes the CMS (Content Management System) functionality for managing Stock Pages, including content creation, SEO configuration, theme management, and content syncing across channels.

### 1.2 Admin Capabilities
- Create, edit, and publish individual stock pages
- Configure SEO settings for stock pages
- Manage stock themes (curated collections)
- See who else is editing in real-time
- Sync content across Blog, Stories, and Spotlight channels

---

## 2. Stock Page Management

### 2.1 Stock List View

**Location:** `/admin/stocks`

**Dashboard Metrics:**
Displayed at the top of the page:
- Total stock pages count
- Published pages count
- Draft pages count
- Currently active editors (updated in real-time)

**Stock Table:**

| Column | What It Shows |
|--------|---------------|
| Ticker | Company logo and ticker symbol |
| Company | English company name |
| Sector | Industry sector (e.g., Technology, Healthcare) |
| Status | Badge showing draft, published, or archived |
| Editors | Avatar icons of users currently editing this page |
| Actions | Preview and Edit buttons |

**Filtering and Search:**
- Search box filters by ticker, company name, or sector
- Status dropdown filters by: All, Draft, Published, Archived
- Clicking any row opens that stock page in the editor

**Actions:**
- "New Stock Page" button creates a blank stock page
- Preview button opens the public page in a new tab (with preview mode if unpublished)
- Edit button opens the stock page editor

### 2.2 Status Workflow

| Status | Meaning | Public Visibility |
|--------|---------|-------------------|
| Draft | Work in progress | Not visible (404) |
| Published | Live on the website | Fully visible |
| Archived | Deprecated/removed | Not visible (404) |

**Status Transitions:**
- New pages start as Draft
- Editor can change status to Published (page goes live)
- Published pages can be changed to Archived (removed from public view)
- Archived pages can be restored to Draft for revision

---

## 3. Stock Page Editor

### 3.1 Editor Location
**URL:** `/admin/stocks/:id/edit`

### 3.2 Content Tab

**Stock Information Section:**

| Field | Required | Description |
|-------|----------|-------------|
| Ticker Symbol | Yes | Stock trading symbol (e.g., "AAPL") |
| Exchange | Yes | Dropdown: NASDAQ, NYSE, or AMEX |
| Sector | Yes | Industry classification |
| URL Slug | Yes | Auto-generated from ticker, can be edited |
| Status | Yes | Dropdown: Draft, Published, Archived |

**Company Names Section:**
| Field | Description |
|-------|-------------|
| English Name | Company name in English |
| Arabic Name | Company name in Arabic (right-to-left input) |

**Descriptions Section:**
| Field | Description |
|-------|-------------|
| English Description | Short company description in English |
| Arabic Description | Short company description in Arabic (right-to-left input) |

**About Company Section:**

| Field | Description |
|-------|-------------|
| CEO | Name of current CEO |
| Employee Count | Number of employees (e.g., "164,000") |
| Headquarters | Company headquarters location |
| Founded | Year the company was established |
| Overview (English) | Rich text editor for detailed company overview |
| Overview (Arabic) | Rich text editor for Arabic overview |
| Investment Thesis (English) | Text explaining why investors might consider this stock |
| Investment Thesis (Arabic) | Arabic version of investment thesis |

**Related Stocks Section:**
| Field | Description |
|-------|-------------|
| Related Tickers | Comma-separated list of related stock tickers for cross-linking |

### 3.3 SEO Tab

**Meta Information:**

| Field | Description |
|-------|-------------|
| Meta Title (English) | Page title shown in browser tab and search results |
| Meta Title (Arabic) | Arabic version of page title |
| Meta Description (English) | Summary shown in search result snippets |
| Meta Description (Arabic) | Arabic version of meta description |

**Open Graph Settings (for social sharing on Facebook, LinkedIn):**

| Field | Description |
|-------|-------------|
| OG Title (English) | Title when page is shared on social media |
| OG Title (Arabic) | Arabic version |
| OG Description (English) | Description when shared |
| OG Description (Arabic) | Arabic version |
| OG Image URL | Image shown when shared on social media |

**Twitter Card Settings:**

| Field | Description |
|-------|-------------|
| Twitter Title (English) | Title when shared on Twitter |
| Twitter Title (Arabic) | Arabic version |
| Twitter Description (English) | Description when shared on Twitter |
| Twitter Description (Arabic) | Arabic version |
| Twitter Image URL | Image shown on Twitter |
| Card Type | Dropdown: Summary or Summary with Large Image |

**Schema.org Settings (for search engine structured data):**

| Field | Description |
|-------|-------------|
| Schema Type | Type of entity (default: Corporation) |
| Ticker Symbol | Stock ticker for structured data |
| Exchange | Stock exchange name |
| Currency | Trading currency (e.g., USD) |

### 3.4 Editor Actions

**Save Button:**
- Saves all changes to the stock page
- Maintains current status (does not auto-publish)

**Preview Button:**
- Opens the stock page in a new browser tab
- Adds preview mode for unpublished pages
- Allows viewing before publishing

**Back Button:**
- Returns to the stock list view
- Prompts to save if there are unsaved changes

---

## 4. SEO Administration Settings

### 4.1 Global SEO Templates

**Location:** Accessible from admin settings or discover settings

**Purpose:** Define default SEO templates that apply to all stock pages, reducing repetitive entry.

**Template Variables:**
Templates can include placeholders that get replaced with actual stock data:

| Variable | Replaced With |
|----------|---------------|
| `{{ticker}}` | Stock ticker symbol |
| `{{companyName}}` | Company name |
| `{{sector}}` | Industry sector |
| `{{exchange}}` | Stock exchange |
| `{{price}}` | Current stock price (dynamic) |

**Meta Title Templates:**

| Field | Example |
|-------|---------|
| English Template | "{{ticker}} Stock - Buy {{companyName}} Shares \| Baraka" |
| Arabic Template | Arabic equivalent with same placeholders |

**Meta Description Templates:**

| Field | Example |
|-------|---------|
| English Template | "Invest in {{companyName}} ({{ticker}}) on Baraka. Get real-time prices, market data, and expert analysis." |
| Arabic Template | Arabic equivalent |

**Open Graph Templates:**

| Field | Description |
|-------|-------------|
| OG Title Template (English) | Default OG title using variables |
| OG Title Template (Arabic) | Arabic version |
| OG Description Template (English) | Default OG description |
| OG Description Template (Arabic) | Arabic version |

### 4.2 Template Override Behavior

**How templates work with individual pages:**
1. When a new stock page is created, template values are applied as defaults
2. Editors can override any template value on the individual page
3. If an individual page field is blank, the template is used
4. If an individual page field has content, that content takes precedence

**Example:**
- Template: "{{ticker}} Stock - Buy {{companyName}} Shares | Baraka"
- For AAPL: "AAPL Stock - Buy Apple Inc Shares | Baraka"
- If editor enters custom title, the custom title is used instead

### 4.3 Schema.org Default Settings

| Setting | Description |
|---------|-------------|
| Default Schema Type | What type of entity stock pages represent (Corporation) |
| Default Currency | Default trading currency (USD) |
| Site Name | Brand name for structured data |

### 4.4 Robots and Indexing Settings

| Setting | Description |
|---------|-------------|
| Index Published Pages | Whether search engines should index published stock pages |
| Index Draft Pages | Whether drafts are indexable (typically No) |
| Canonical URL Pattern | URL pattern for canonical links |

---

## 5. Stock Themes Management

### 5.1 Theme List View

**Location:** `/admin/themes` or within Discover settings

**What It Shows:**
- List of all stock themes
- Theme title and stock count
- Status (draft, published, archived)
- Featured flag indicator
- Edit and preview buttons

### 5.2 Theme Editor

**Basic Information:**

| Field | Description |
|-------|-------------|
| Title (English) | Theme name in English (e.g., "AI Stocks") |
| Title (Arabic) | Theme name in Arabic |
| Slug | URL identifier (e.g., "ai-stocks") |
| Status | Draft, Published, or Archived |
| Featured | Checkbox to feature this theme prominently |
| Is New | Checkbox to show "New" badge |

**Theme Content:**

| Field | Description |
|-------|-------------|
| Short Description (English) | Brief theme description |
| Short Description (Arabic) | Arabic version |
| Long Description (English) | Extended theme explanation |
| Long Description (Arabic) | Arabic version |
| Hero Image | Banner image URL for theme page |
| Icon | Icon identifier for theme |

**Stocks in Theme:**

| Field | Description |
|-------|-------------|
| Tickers | List of stock tickers included in this theme |
| Sort Mode | How stocks are ordered: Manual, By Market Cap, By Volume, By Performance |

**Theme Highlights (Why Invest cards):**
Repeatable section for benefit cards:

| Field | Description |
|-------|-------------|
| Icon | Icon for the highlight card |
| Title (English) | Benefit title |
| Title (Arabic) | Arabic version |
| Description (English) | Benefit explanation |
| Description (Arabic) | Arabic version |

**Theme SEO:**

| Field | Description |
|-------|-------------|
| Meta Title (English/Arabic) | Page title for theme page |
| Meta Description (English/Arabic) | Description for search results |
| Canonical URL | Canonical link for this theme |

---

## 6. Collaborative Editing

### 6.1 Real-Time Presence

**What It Does:**
When multiple editors work on the same stock page simultaneously, the system shows who else is editing.

**Active Editors Bar:**
- Appears at the top of the editor when others are present
- Shows avatar/initial and name of each active editor
- Each editor has a unique color for identification

**How Editors Are Identified:**
- Display name
- Unique color from a preset palette
- Avatar image (if available)

### 6.2 Field-Level Presence

**What It Does:**
Shows which specific field another editor is currently working in.

**Visual Indicators:**
- Colored border around the field being edited
- Small label showing the editor's name
- Color matches the editor's assigned presence color

**Purpose:**
Prevents confusion when multiple people edit the same page, helping editors avoid overwriting each other's work.

### 6.3 Connection Status

**Online Indicator:**
- Green dot or "Connected" status when connection is healthy
- Automatically reconnects if connection drops

**Offline Indicator:**
- Warning message if connection is lost
- Changes may not sync until reconnected

---

## 7. Content Syncing: Blog → Stories → Spotlight

This section describes how content flows between Blog Posts, Stories, and Spotlight Banners to reduce duplicate work.

### 7.1 Content Flow Overview

Content can be repurposed across three channels:

```
Blog Post → Story → Spotlight Banner
   ↓           ↓            ↓
Web/SEO    Newsletter    In-App Banners
Content     Content      (Home, Discover)
```

### 7.2 Content Relationships

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

### 7.3 Syncing Blog to Story

**User Flow:**
1. Editor views a Blog Post in the CMS blog list
2. Clicks "Sync to Stories" button (purple newspaper icon)
3. System creates a new Story as a draft, pre-filled with blog content
4. Editor is notified of successful sync
5. Story appears in Stories management with link back to source blog

**What Gets Copied Automatically:**

| Blog Field | Story Field | How It's Handled |
|------------|-------------|------------------|
| Title (EN/AR) | Title (EN/AR) | Copied directly |
| Excerpt (EN/AR) | Snippet (EN/AR) | Copied, truncated to 200 characters |
| Featured Image | Image | Copied directly |
| Content (EN/AR) | Content (EN/AR) | First portion copied |
| Tags | Tickers | Only valid stock symbols extracted |

**What Editor Must Add:**
- "Why it matters" section (newsletter-specific context)
- Any story-specific edits or refinements

**Button Visibility:**
- "Sync to Stories" button appears only when no Story exists for that blog
- Once synced, button is replaced with "Story" badge linking to the synced Story

### 7.4 Syncing Story to Spotlight

**User Flow:**
1. Editor opens a Story in the CMS
2. Clicks "Create Spotlight" button
3. System creates a new Spotlight as a draft
4. Editor configures placements and schedule
5. Editor activates the Spotlight when ready

**What Gets Copied Automatically:**

| Story Field | Spotlight Field | How It's Handled |
|-------------|-----------------|------------------|
| Title | Headline | Copied for selected language |
| Snippet | Subtitle | Truncated to 120 characters |
| Image | Image | Copied directly |

**What Editor Must Configure:**
- CTA button text
- CTA link or app deep link
- Placements (which screens show the banner)
- Schedule (optional start and end dates)
- Status (draft → active)

### 7.5 One-Click Publishing ("Publish Everywhere")

**Location:** Blog editor toolbar

**What It Does:**
Single button that performs all syncing in one action:
1. Publishes the Blog Post
2. Creates a Story (if one doesn't exist)
3. Creates a Spotlight (if one doesn't exist)
4. Creates a Newsletter draft (if one doesn't exist)

**Result:**
Toast notification shows what was created (e.g., "Created: Published blog, Story, Spotlight, Newsletter")

### 7.6 Status Indicators in CMS

**On Blog Cards (blog list view):**

| Badge | Color | Meaning |
|-------|-------|---------|
| Story | Purple | A Story has been created from this blog |
| Spotlight | Amber | A Spotlight has been created |
| Newsletter | Blue | A Newsletter has been created |

Clicking any badge navigates to that content type's management page.

**On Story Cards (story list view):**
- "From Blog: [title]" indicator if synced from a blog
- "Has Spotlight" badge if a Spotlight was created from it

**On Spotlight Cards (spotlight list view):**
- "From Blog" badge if source was a blog
- "From Story" badge if source was a story
- "Manual" badge if created directly

### 7.7 Sync Button Behavior

**"Sync to Stories" button:**
- Visible: When viewing a blog that has no linked Story
- Hidden: When a Story already exists (replaced with Story badge)
- Disabled: While sync is in progress

**"Create Spotlight" button:**
- Visible: When viewing a Story that has no linked Spotlight
- Hidden: When a Spotlight already exists (replaced with view link)
- Disabled: While creation is in progress

### 7.8 Traceability

**Link Tracking:**
- Each Story records which Blog Post it came from (`sourceBlogPostId`)
- Each Spotlight records whether it came from a Blog or Story
- Links are bidirectional for easy navigation between related content

**Audit Trail:**
All sync operations are logged:
- What was created
- When it was created
- Who initiated the sync
- Source content reference

---

## Appendix: Admin URL Reference

| URL Pattern | Description |
|-------------|-------------|
| `/admin/stocks` | Stock page management list |
| `/admin/stocks/:id/edit` | Stock page editor |
| `/admin/themes` | Stock themes management |
| `/admin/blog` | Blog management (with sync buttons) |
| `/admin/stories` | Stories management |
| `/admin/spotlights` | Spotlight banner management |
| `/admin/discover` | Discover page settings (including SEO templates) |

---

This document describes the CMS administration functionality for managing Stock Pages, SEO settings, and content syncing across channels.
