# Content Syncing - Product Requirements Document

## Table of Contents
1. [Overview](#1-overview)
2. [Blog to Newsletter](#2-blog-to-newsletter)
3. [Blog to Spotlight](#3-blog-to-spotlight)
4. [One-Click Publishing](#4-one-click-publishing)
5. [Status Indicators](#5-status-indicators)
6. [Distribution Logic](#6-distribution-logic)

---

## 1. Overview

### 1.1 Content Flow

```
                    ┌─────────────────┐
                    │    Blog Post    │
                    │  (Source of     │
                    │    Truth)       │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌────────────┐  ┌──────────┐
        │ Website  │  │ Newsletter │  │ Spotlight│
        │  (SEO)   │  │  (Email)   │  │ (In-App) │
        └──────────┘  └────────────┘  └──────────┘
```

### 1.2 Purpose

Blog posts serve as the single source of truth for content. The same blog post can be distributed to multiple channels:

- **Website**: Full article with SEO optimization
- **Newsletter**: Email-friendly summary with CTA to full article
- **Spotlight Banner**: In-app promotional banner linking to content

### 1.3 Key Principles

1. **Single Source of Truth**: Blog post is the canonical content
2. **No Content Duplication**: Channels reference the blog, not copy it
3. **Compliance Gate**: Only approved content can be distributed
4. **Cross-Channel Attribution**: Same blog ID tracks performance everywhere

---

## 2. Blog to Newsletter

### 2.1 User Flow

1. Editor views published Blog Post in CMS
2. Clicks "Add to Newsletter" button
3. System generates newsletter-compatible version
4. Editor reviews and schedules newsletter

### 2.2 Field Mapping

| Blog Field | Newsletter Field | Transformation |
|------------|------------------|----------------|
| Title (EN/AR) | Email Headline | Direct copy |
| Excerpt (EN/AR) | Email Snippet | Truncated to 200 chars max |
| Featured Image | Header Image | Resized for email (600px width) |
| Slug | CTA Link | Full URL generated |

### 2.3 Newsletter-Specific Fields

Editor must configure:
- **CTA Label**: e.g., "Read Full Article", "Learn More"
- **Target Audience**: New Users, Active Traders, Premium, All
- **Schedule**: Send date/time

### 2.4 Automatic Content

System generates:
- Unsubscribe footer
- Tracking pixels for open/click attribution
- Blog post ID embedded for analytics

---

## 3. Blog to Spotlight

### 3.1 User Flow

1. Editor opens Blog Post in CMS
2. Clicks "Create Spotlight" button
3. System creates Spotlight draft with blog content
4. Editor configures placements and schedule

### 3.2 Field Mapping

| Blog Field | Spotlight Field | Transformation |
|------------|-----------------|----------------|
| Title | Headline | Selected language, max 60 chars |
| Excerpt | Subtitle | Truncated to 120 chars |
| Featured Image | Banner Image | Direct copy |
| Slug | Deep Link | Opens blog in-app |

### 3.3 Editor Must Configure

- **CTA Button**: Text and action
- **Placements**: Home, Discover, Portfolio, etc.
- **Schedule**: Start and end dates (optional)
- **Target Audience**: User segments to show banner

### 3.4 Spotlight Behavior

- Respects blog compliance status (won't show if blog unpublished)
- Tracks impressions and clicks back to source blog
- Automatically expires when end date passes

---

## 4. One-Click Publishing

### 4.1 "Publish Everywhere" Button

Single action that distributes approved content across all channels:

```
┌─────────────────────────────────────────────────┐
│         "Publish Everywhere" Button             │
├─────────────────────────────────────────────────┤
│ 1. Set blog status to Published                 │
│ 2. Create Newsletter draft (if none exists)     │
│ 3. Create Spotlight draft (if none exists)      │
│ 4. Show summary of actions taken                │
└─────────────────────────────────────────────────┘
```

### 4.2 Prerequisites

Button only enabled when:
- Blog has title and content
- Compliance status is "Approved"
- Blog is not already published

### 4.3 Result Notification

Toast notification displays outcomes:
- "Published blog to website"
- "Created newsletter draft"
- "Created spotlight draft"

---

## 5. Status Indicators

### 5.1 On Blog Cards

| Badge | Color | Meaning |
|-------|-------|---------|
| Newsletter | Blue | Newsletter created from blog |
| Spotlight | Amber | Spotlight banner exists |
| Published | Green | Live on website |

### 5.2 Indicator States

```
Blog Card:
┌────────────────────────────────────────┐
│ Understanding Market Volatility        │
│ Published Feb 3, 2026                  │
│                                        │
│ [Newsletter ✓]  [Spotlight ✓]          │
└────────────────────────────────────────┘
```

### 5.3 Traceability

- Newsletters track source Blog Post ID
- Spotlights track source Blog Post ID
- All sync operations logged with timestamp and user

---

## 6. Distribution Logic

### 6.1 Availability Rules

Content appears on channels only when:

| Condition | Website | Newsletter | Spotlight |
|-----------|---------|------------|-----------|
| Blog Published | ✓ Required | ✓ Required | ✓ Required |
| Compliance Approved | ✓ Required | ✓ Required | ✓ Required |
| Within Schedule | N/A | ✓ If scheduled | ✓ If scheduled |

### 6.2 API Endpoints

**App Discover / Spotlight API**
- Fetches active spotlights
- Filters by placement, audience, language
- Returns blog deep link for each spotlight

**Newsletter Content API**
- Fetches approved blog content for email
- Filters by audience and language
- Includes tracking IDs for attribution

### 6.3 Analytics Attribution

Same blog ID used across all channels enables:
- Website page views
- Email open rates
- Email click-through rates
- Spotlight impressions
- Spotlight click-through rates
- Cross-channel performance comparison

---

## 7. Compliance Integration

### 7.1 Pre-Distribution Check

Before content can be distributed to any channel:

1. Blog must pass compliance review
2. No prohibited terms (checked by Content Score Panel)
3. Required disclaimers present for financial content

### 7.2 Compliance Status Flow

```
Draft → Pending Review → Approved → Can Distribute
                      ↘ Rejected → Cannot Distribute
```

### 7.3 Blocking Rules

- Newsletter cannot be sent if source blog is rejected
- Spotlight cannot go live if source blog is unpublished
- Updating blog to "rejected" automatically hides associated spotlights

---

This document describes how blog posts are distributed to Newsletter and Spotlight channels without duplicating content.
