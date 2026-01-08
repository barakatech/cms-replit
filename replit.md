# baraka Stock Landing Page CMS

## Overview

A multilingual Content Management System (CMS) for managing stock landing pages for the baraka fintech application. The system supports 10,000+ stock pages with English (LTR) and Arabic (RTL) language support, combining real-time market data widgets with long-form editorial content.

The CMS provides:
- Stock page management with metadata, content blocks, and SEO configuration
- Live preview functionality with language switching
- Internal linking between related stocks
- Asset library for images, videos, and documents
- Blog and banner management modules
- **Newsletter + Spotlight + Blog Sync Module**: Content marketing automation with:
  - Newsletter management with templates and block-based content editing
  - Spotlight banners with scheduling and multi-placement targeting
  - Automatic spotlight/newsletter creation when blog posts are published
  - Subscriber management with CSV import
  - Public API endpoints for content consumption
  - Audit logging for all content operations

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React single-page application with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React useState for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Development**: tsx for TypeScript execution, Vite middleware for frontend
- **Production**: esbuild bundles server, Vite builds frontend to `dist/public`

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for shared type definitions
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Storage Interface**: Abstract `IStorage` interface with in-memory implementation (database can be connected later)

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route page components
│   ├── lib/             # Utilities and mock data
│   └── hooks/           # Custom React hooks
├── server/              # Express backend
├── shared/              # Shared types and schemas
└── migrations/          # Drizzle database migrations
```

### Design System
- Material Design/Enterprise SaaS patterns for fintech B2B aesthetic
- Inter font family with RTL support for Arabic
- Neutral color palette with CSS custom properties
- Consistent spacing system using Tailwind units (2, 4, 6, 8, 12, 16, 24)

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `@neondatabase/serverless`
- **Drizzle Kit**: Database migrations and schema management
- **Connection**: Requires `DATABASE_URL` environment variable

### UI Libraries
- **Radix UI**: Full primitive component suite (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Calendar/date picker
- **vaul**: Drawer component
- **react-resizable-panels**: Resizable panel layouts
- **recharts**: Charting library
- **cmdk**: Command palette

### Form Handling
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod resolver for validation
- **zod**: Schema validation

### Development Tools
- **Replit plugins**: Runtime error overlay, cartographer, dev banner
- **TypeScript**: Full type coverage across client/server/shared