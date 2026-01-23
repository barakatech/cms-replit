# Content Syncing - Product Requirements Document

## Table of Contents
1. [Overview](#1-overview)
2. [Syncing Blog to Story](#2-syncing-blog-to-story)
3. [Syncing Story to Spotlight](#3-syncing-story-to-spotlight)
4. [One-Click Publishing](#4-one-click-publishing)
5. [Status Indicators](#5-status-indicators)

---

## 1. Overview

### 1.1 Content Flow

```
Blog Post → Story → Spotlight Banner
   ↓           ↓            ↓
Web/SEO    Newsletter    In-App Banners
```

### 1.2 Purpose

Content can be repurposed across three channels to reduce duplicate work:
- **Blog Post**: Full articles for website (SEO content)
- **Story**: Newsletter-ready content
- **Spotlight Banner**: In-app promotional banners

---

## 2. Syncing Blog to Story

### 2.1 User Flow

1. Editor views Blog Post in CMS
2. Clicks "Sync to Stories" button (purple newspaper icon)
3. System creates Story draft pre-filled with blog content
4. Editor receives success notification

### 2.2 Field Mapping

| Blog Field | Story Field | Notes |
|------------|-------------|-------|
| Title (EN/AR) | Title (EN/AR) | Direct copy |
| Excerpt (EN/AR) | Snippet (EN/AR) | Truncated to 200 chars |
| Featured Image | Image | Direct copy |
| Content (EN/AR) | Content (EN/AR) | First portion |
| Tags | Tickers | Valid symbols only |

### 2.3 Editor Must Add

- "Why it matters" section

### 2.4 Button Behavior

- Visible when no Story exists for blog
- Hidden when Story exists (replaced with badge linking to Story)

---

## 3. Syncing Story to Spotlight

### 3.1 User Flow

1. Editor opens Story in CMS
2. Clicks "Create Spotlight" button
3. System creates Spotlight draft
4. Editor configures placements and schedule

### 3.2 Field Mapping

| Story Field | Spotlight Field | Notes |
|-------------|-----------------|-------|
| Title | Headline | Selected language |
| Snippet | Subtitle | Truncated to 120 chars |
| Image | Image | Direct copy |

### 3.3 Editor Must Configure

- CTA button text and link
- Placements (home, discover, etc.)
- Schedule (optional start/end dates)

---

## 4. One-Click Publishing

### 4.1 "Publish Everywhere" Button

Single button that performs all syncing:
1. Publishes Blog Post
2. Creates Story (if none exists)
3. Creates Spotlight (if none exists)
4. Creates Newsletter draft (if none exists)

### 4.2 Result

Toast notification shows what was created (e.g., "Created: Published blog, Story, Spotlight, Newsletter")

---

## 5. Status Indicators

### 5.1 On Blog Cards

| Badge | Color | Meaning |
|-------|-------|---------|
| Story | Purple | Story exists |
| Spotlight | Amber | Spotlight exists |
| Newsletter | Blue | Newsletter exists |

### 5.2 On Story Cards

- "From Blog" indicator if synced from blog
- "Has Spotlight" badge if Spotlight created

### 5.3 On Spotlight Cards

- Source badge: "From Blog", "From Story", or "Manual"

### 5.4 Traceability

- Stories track source Blog Post
- Spotlights track source (Blog or Story)
- All sync operations are logged with timestamp and user

---

This document describes content syncing functionality between Blog, Stories, and Spotlight channels.
