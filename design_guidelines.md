# baraka Stock Landing Page CMS - Design Guidelines

## Baraka Design System Theme Tokens

### Source of Truth - Exact Color Values

#### Light Background Layers
| Name | Role | Value |
|------|------|-------|
| bg.light.primary | First layer in light mode | #FFFFFF |
| bg.light.secondary | Second layer in light mode | #F9F9FA |
| bg.light.tertiary | Third layer in light mode | #F2F2F2 |

#### Dark Background Layers
| Name | Role | Value |
|------|------|-------|
| bg.dark.primary | First layer in dark mode | #000000 |
| bg.dark.secondary | Second layer in dark mode | #191919 |
| bg.dark.tertiary | Third layer in dark mode | #303030 |

#### Content Opacity System (Light Mode - Black Base)
| Name | Role | Value |
|------|------|-------|
| content.light.100 | Primary text, icons | rgba(0,0,0,1) |
| content.light.50 | Secondary text | rgba(0,0,0,0.5) |
| content.light.30 | Muted text, icons, dividers | rgba(0,0,0,0.3) |
| content.light.10 | Borders, subtle dividers | rgba(0,0,0,0.1) |

#### Content Opacity System (Dark Mode - White Base)
| Name | Role | Value |
|------|------|-------|
| content.dark.100 | Primary text, icons | rgba(255,255,255,1) |
| content.dark.50 | Secondary text | rgba(255,255,255,0.5) |
| content.dark.30 | Muted text, icons, dividers | rgba(255,255,255,0.3) |
| content.dark.10 | Borders, subtle dividers | rgba(255,255,255,0.1) |

#### Global Neutrals (All Modes)
| Name | Value |
|------|-------|
| neutral.black | #000000 |
| neutral.white | #FFFFFF |

#### Brand & Status Colors (All Modes)
| Name | Role | Value |
|------|------|-------|
| brand.primary | Baraka green, positive indication | #0DDD00 |
| status.errorStrong | Errors, critical notifications | #FF3317 |
| status.errorSoft | Soft errors, negative price indication | #F25C5C |
| status.warning | Warning indications, alerts | #ECC601 |

### CSS Variables Reference

```css
/* Background Layers */
--bg-primary      /* Main page background */
--bg-secondary    /* Cards, elevated surfaces */
--bg-tertiary     /* Nested panels, input backgrounds */

/* Content Opacity */
--content-100     /* Primary text/icons */
--content-50      /* Secondary text */
--content-30      /* Muted text, placeholders */
--content-10      /* Borders, dividers */

/* Brand & Status */
--brand           /* Primary brand green */
--success         /* Positive values (same as brand) */
--error           /* Critical errors */
--error-soft      /* Soft errors, negative price */
--warning         /* Warnings, alerts */

/* Borders & Focus */
--border-color    /* Default border */
--focus-color     /* Focus ring (uses brand) */

/* Shadows & Radius */
--shadow-soft     /* Soft elevation shadow */
--radius-card     /* Card border radius (16px) */
```

### Tailwind Class Usage

```jsx
/* Backgrounds */
className="bg-bg"           // Primary background
className="bg-surface"      // Secondary/card background
className="bg-surface2"     // Tertiary/nested background

/* Text Colors (Content Opacity) */
className="text-content-100"  // Primary text
className="text-content-50"   // Secondary text
className="text-content-30"   // Muted text
className="text-content-10"   // Very subtle text

/* Brand & Status */
className="text-brand"        // Brand green text
className="bg-brand"          // Brand green background
className="text-success"      // Positive value
className="text-error"        // Error text
className="text-errorSoft"    // Soft error/negative
className="text-warning"      // Warning text

/* Cards */
className="bg-surface border border-content-10 rounded-card shadow-soft"

/* Buttons */
className="bg-brand text-white"  // Primary button
```

---

## Design Approach
**System-Based Approach**: Material Design/Enterprise SaaS patterns for this fintech B2B tool. Focus on clarity, professionalism, and data density typical of financial platforms.

## Core Design Principles
- **Dark-first design**: Premium, finance-grade dark theme as default
- **Clean, Modern Fintech SaaS aesthetic**: Professional, trustworthy, data-focused
- **Layered backgrounds**: Use primary/secondary/tertiary for depth
- **Content opacity system**: 100/50/30/10 for text hierarchy
- **Multilingual-first**: Seamless EN/AR switching with proper RTL support
- **Information density**: Efficient use of space for data-heavy interfaces

## Typography System
**Font Stack**: Inter or similar modern sans-serif via Google Fonts
- **Headings**: 
  - H1: text-3xl font-bold (Dashboard titles, page headers)
  - H2: text-2xl font-semibold (Section titles)
  - H3: text-xl font-medium (Subsections, card headers)
- **Body**: text-base (14-16px) for content, forms
- **Labels**: text-sm font-medium (Form labels, metadata)
- **Captions**: text-xs (Hints, timestamps, helper text)
- **Arabic Text**: Ensure proper RTL font rendering with appropriate font-family fallback

### Text Hierarchy with Content Opacity
- **Primary text**: `text-content-100` - Headlines, important content
- **Secondary text**: `text-content-50` - Descriptions, supporting info
- **Tertiary/muted**: `text-content-30` - Timestamps, hints, placeholders
- **Dividers/borders**: `border-content-10` - Subtle separators

## Layout & Spacing System
**Tailwind Spacing Units**: Consistent use of 2, 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-6, mb-8)
- **Container Padding**: px-6 md:px-8 for main content areas
- **Section Spacing**: mb-8 to mb-12 between major sections
- **Component Spacing**: gap-4 for grids, space-y-4 for vertical stacks
- **Form Fields**: mb-6 between field groups, mb-4 between individual inputs

## Component Styling Rules

### Cards
```jsx
<Card className="bg-surface border border-content-10 rounded-card shadow-soft">
```

### Elevated Panels
```jsx
<div className="bg-surface2 p-4 rounded-md">
```

### Primary Buttons
```jsx
<Button className="bg-brand text-white hover:opacity-90">
```

### Text Hierarchy
```jsx
<h2 className="text-content-100">Primary Heading</h2>
<p className="text-content-50">Secondary description text</p>
<span className="text-content-30">Muted helper text</span>
```

### Finance Signal Colors
```jsx
<span className="text-success">+2.45%</span>  // Positive
<span className="text-errorSoft">-1.23%</span> // Negative
```

### Dividers
```jsx
<div className="border-t border-content-10" />
```

## Screen-Specific Layouts

### 1. Login Screen
- **Centered Card Pattern**: Max-width container (max-w-md) vertically and horizontally centered
- **Background**: bg-bg with subtle gradient overlay
- **Card**: bg-surface with rounded-card and shadow-soft
- **Brand**: Baraka green accent on primary button

### 2. CMS Dashboard
**Layout Structure**:
- **Sidebar**: bg-surface with proper border
- **Top Bar**: Full-width header with logo, language toggle, theme toggle, user avatar
- **Main Content**: bg-bg with proper spacing

### 3. Public Pages (/discover, /stocks, /blog, /p/[slug])
- Apply same token system for unified look
- Support RTL when locale=ar
- Theme toggle in header
- All components use semantic tokens

## RTL Support
- **Arabic Views**: Apply dir="rtl" to containers
- **Icons**: Mirror directional icons (arrows, carets)
- **Layout Mirroring**: Sidebar moves to right, preview layout flips entirely
- **Spacing**: Use logical properties where possible

## Theme Toggle
- Supports: "light", "dark", "system"
- Default to system preference
- Persists to localStorage
- Theme toggle visible in:
  - Admin top bar
  - Public page headers

## Images
**No hero images required** - this is a B2B SaaS tool focused on functionality. Use:
- **Brand Logo**: Small baraka logo in headers
- **Asset Thumbnails**: User-uploaded images in Asset Library
- **Chart Placeholders**: Simple line chart SVG
- **Avatar Placeholders**: Generic user avatar icon

## Animations
**Minimal, purposeful only**:
- Tab switching: Simple fade transition (transition-opacity duration-200)
- Preview language toggle: Subtle slide (transition-transform duration-300)
- Hover states: Standard Tailwind hover: transitions
- **No** scroll animations, parallax, or decorative motion
