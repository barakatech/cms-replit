# baraka Stock Landing Page CMS - Design Guidelines

## Design Approach
**System-Based Approach**: Material Design/Enterprise SaaS patterns for this fintech B2B tool. Focus on clarity, professionalism, and data density typical of financial platforms.

## Core Design Principles
- **Clean, Modern Fintech SaaS aesthetic**: Professional, trustworthy, data-focused
- **Neutral color palette**: Light theme with emphasis on readability and hierarchy
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

## Layout & Spacing System
**Tailwind Spacing Units**: Consistent use of 2, 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-6, mb-8)
- **Container Padding**: px-6 md:px-8 for main content areas
- **Section Spacing**: mb-8 to mb-12 between major sections
- **Component Spacing**: gap-4 for grids, space-y-4 for vertical stacks
- **Form Fields**: mb-6 between field groups, mb-4 between individual inputs

## Screen-Specific Layouts

### 1. Login Screen
- **Centered Card Pattern**: Max-width container (max-w-md) vertically and horizontally centered
- **Header**: "baraka CMS" logo/text at top, text-2xl font-bold
- **Form**: Simple vertical stack with generous spacing (space-y-6)
- **Button**: Full-width primary button (w-full)

### 2. CMS Dashboard
**Layout Structure**:
- **Sidebar**: Fixed left sidebar (w-64), light background with nav items
- **Top Bar**: Full-width header with logo, language toggle (EN/AR pill switcher), user avatar
- **Main Content**: Remaining space with px-8 py-6 padding

**Stock Table**:
- **Columns**: Ticker (monospace font), Company Name, Language Icons (flag/globe badges), Status Badge, Last Updated, Edit Button
- **Search Bar**: Top of table, w-full md:w-96, with search icon
- **Row Styling**: Hover states, alternating subtle backgrounds for readability
- **Status Badges**: Pill-shaped with distinct colors (Draft: gray, In Review: yellow, Published: green)

### 3. Stock Page Editor (Core Screen)
**Three-Column Layout**:
- **Left Sidebar** (w-48): Navigation pills for sections (Metadata, Content, Dynamic Data, Internal Linking, Preview)
- **Editor Panel** (flex-1): Form fields with tabs and inputs
- **Preview Panel** (w-1/2 lg:w-2/5): Live public page preview

**Section Implementations**:

**A) Metadata Section**:
- **EN/AR Tabs**: Horizontal tab switcher at top
- **Fields**: Input groups with labels above, character count below (text-xs text-gray-500)
- **Search Preview Card**: Border, rounded corners, padding p-4, showing blue title + gray description exactly as Google displays

**B) Content Section**:
- **Language Tabs**: Prominent EN | AR switcher
- **Rich Text Areas**: Bordered textareas, min-h-32, for each content block
- **RTL Styling**: Arabic tab shows text-right, dir="rtl" on inputs
- **Vertical Stack**: space-y-6 between content blocks

**C) Dynamic Data Section**:
- **Card Grid**: grid-cols-2 md:grid-cols-3 gap-4 for metrics
- **Metric Cards**: p-4, border, rounded, with label (text-sm gray) and value (text-xl font-bold)
- **Sentiment Widget**: Three-segment horizontal bar chart with percentages
- **Chart Placeholder**: Simple static SVG line chart or placeholder image (300x150px)
- **Info Note**: Italic, text-sm, light background callout box

**D) Internal Linking Section**:
- **Two Subsections**: Auto-suggestions (read-only list) and Manual Override
- **Ticker Pills**: Inline-flex badges with × remove button for manual entries
- **Reason Tags**: text-xs badges next to auto-suggested tickers (e.g., "Same sector", "Users also traded")

**E) Action Bar**:
- **Position**: Sticky top of editor or floating bottom bar
- **Buttons**: flex gap-3, primary "Publish", secondary "Save Draft", outline "Submit for Review"
- **Status Badge**: Pill badge showing current state

**Live Preview Panel**:
- **Hero Section**: Stock name (text-3xl), ticker (text-sm monospace), price (large, bold), % change with color coding, "Invest" button
- **Stats Row**: grid-cols-4 for Market Cap, Volume, P/E, Dividend
- **Sentiment Widget**: Horizontal segmented bar (Buy/Hold/Sell percentages)
- **Content Blocks**: space-y-8, proper typography hierarchy
- **Related Stocks**: Horizontal scroll or grid of ticker cards with minimal info
- **Language Toggle**: Top-right corner of preview, EN/AR switcher that flips entire layout to RTL

### 4. Asset Library (Optional)
- **Grid Layout**: grid-cols-3 lg:grid-cols-4 gap-6
- **Asset Tiles**: aspect-square, border, rounded, hover shadow
- **Tile Contents**: Thumbnail/icon, filename (truncated), type badge, public/restricted indicator
- **Upload Button**: Fixed top-right, prominent primary button
- **Side Panel**: Slide-in from right showing asset details, alt-text inputs for EN/AR

## Component Library

**Buttons**:
- Primary: bg-blue-600, white text, px-6 py-2.5, rounded-lg
- Secondary: bg-gray-100, dark text
- Outline: border-2, transparent bg

**Form Inputs**:
- Standard: border, rounded-md, px-4 py-2, focus:ring-2
- Labels: text-sm font-medium mb-2
- Helper text: text-xs text-gray-500 mt-1

**Badges/Pills**:
- Rounded-full px-3 py-1 text-xs font-medium
- Color-coded by status/type

**Cards**:
- border rounded-lg p-6 bg-white shadow-sm

**Navigation**:
- Sidebar items: px-4 py-2 rounded-md, hover bg-gray-100
- Active state: bg-blue-50 text-blue-600

**Tables**:
- Full-width, border-collapse
- Header: bg-gray-50, font-medium, sticky top
- Cells: px-4 py-3, border-b

## RTL Support
- **Arabic Views**: Apply dir="rtl" to containers, text-right alignment, flip padding/margin (pr becomes pl)
- **Icons**: Mirror directional icons (arrows, carets)
- **Layout Mirroring**: Sidebar moves to right, preview layout flips entirely

## Images
**No hero images required** - this is a B2B SaaS tool focused on functionality. Use:
- **Brand Logo**: Small baraka logo in headers (SVG, ~120px wide)
- **Asset Thumbnails**: User-uploaded images in Asset Library
- **Chart Placeholders**: Simple line chart SVG or static image (300x150px) in Dynamic Data section
- **Avatar Placeholders**: Generic user avatar icon in top bar

## Animations
**Minimal, purposeful only**:
- Tab switching: Simple fade transition (transition-opacity duration-200)
- Preview language toggle: Subtle slide (transition-transform duration-300)
- Hover states: Standard Tailwind hover: transitions
- **No** scroll animations, parallax, or decorative motion