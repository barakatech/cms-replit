# baraka Stock Landing Page CMS

## Overview
The baraka Stock Landing Page CMS is a multilingual Content Management System designed for fintech applications. It supports over 10,000 stock pages in English (LTR) and Arabic (RTL), integrating real-time market data widgets with editorial content. The system also includes modules for managing bonds and cryptocurrencies, ensuring compliance, and automating content marketing through newsletters and spotlights. Its core purpose is to provide a robust, scalable, and compliant platform for financial content dissemination. The project aims to expand its content management capabilities to include various financial instruments and provide comprehensive market data integration.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is a React single-page application built with TypeScript, utilizing Wouter for routing, TanStack React Query for server state management, and React useState for local state. UI components are built with shadcn/ui, based on Radix UI primitives, and styled using Tailwind CSS with custom properties for theming. Vite is used as the build tool for development and production.

### Backend Architecture
The backend is built with Node.js and Express, providing RESTful API endpoints. TypeScript execution in development uses `tsx`, while production builds are bundled with esbuild. Vite middleware integrates the frontend development server.

### Data Layer
Drizzle ORM with a PostgreSQL dialect is used for database interaction. Shared type definitions and schemas are located in `shared/schema.ts`, with Zod schemas generated from Drizzle for validation. An abstract `IStorage` interface allows for flexible storage implementations.

### Project Structure
The project is organized into `client/src` for the React frontend, `server/` for the Express backend, `shared/` for shared types and schemas, and `migrations/` for Drizzle database migrations.

### Design System
The design system follows Material Design/Enterprise SaaS patterns, emphasizing a fintech B2B aesthetic. It uses the Inter font family with RTL support, a neutral color palette defined by CSS custom properties, and a consistent spacing system based on Tailwind units.

### Core Features and Modules
- **Stock Page Management**: Includes metadata, content blocks, SEO, and live preview.
- **Content Marketing Automation**: Newsletter, Spotlight, and Blog Sync modules with block-based content editing, scheduling, subscriber management, and public API access.
- **Compliance Scanner**: Manages compliance rules (60+ rules across categories), scans content (blog posts, custom text, URLs) for issues, and includes a review workflow. Features SSRF protection for URL scanning.
- **Bond Pages Module**: Comprehensive CMS for fixed income investments, with multi-dimensional filtering, dual-mode editor (Simple/Pro), 11 bond-specific block types, and compliance integration. Public landing and detail pages display bond metrics and content.
- **Crypto Pages Module**: Full CMS for cryptocurrencies, featuring multi-dimensional filtering, dual-mode editor (Simple/Pro), flexible page module configuration for layout, SEO, and compliance integration. Includes an immutable slug system and publish gating. Aggregates live market data from CoinGecko and Binance, with detailed public display pages.
- **Newsletter Block System**: Template-based architecture with 12 custom content block types, inline search for stocks/articles, and dynamic block management.

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `@neondatabase/serverless`.
- **Drizzle Kit**: Used for database migrations and schema management.

### UI Libraries
- **Radix UI**: Foundational primitive UI components.
- **Lucide React**: Icon library.
- **shadcn/ui**: Component library built on Radix UI.
- **class-variance-authority**: Utility for managing component variants.
- **embla-carousel-react**: Carousel functionality.
- **react-day-picker**: Date picker component.
- **vaul**: Drawer component.
- **react-resizable-panels**: Resizable panel layouts.
- **recharts**: Charting library for data visualization.
- **cmdk**: Command palette component.

### Form Handling
- **react-hook-form**: Manages form state.
- **@hookform/resolvers**: Integrates Zod for form validation.
- **zod**: Schema validation library.

### Third-Party APIs/Services
- **CoinGecko**: Primary provider for cryptocurrency market data.
- **Binance**: Provides trading information (order book, trades, candlestick data).
- **CoinCap**: Fallback provider for cryptocurrency market data.
- **CryptoCompare**: Source for crypto news aggregation (with RSS fallback).

### Development Tools
- **Replit plugins**: For development environment enhancements.
- **TypeScript**: Ensures type safety across the application.