# Windows Things3 Dashboard

A minimal, Things3-inspired task management dashboard for Windows, built with Next.js 15 and Tailwind CSS.

## Features

- View Things3 tasks from Mac via Tailscale
- Minimal, clean UI inspired by Things3 design
- Real-time task updates
- Mock mode for development without Mac API

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3
- **State Management**: Zustand + SWR
- **Testing**: Jest + React Testing Library + Playwright
- **Icons**: Heroicons

## Prerequisites

- Node.js 18+ and npm
- (Optional) Mac running Things3 API server via Tailscale

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your Mac's Tailscale IP:

```env
NEXT_PUBLIC_API_BASE_URL=http://YOUR_MAC_TAILSCALE_IP:8000
NEXT_PUBLIC_MOCK_MODE=false
API_BASE_URL=http://YOUR_MAC_TAILSCALE_IP:8000
```

**Development without Mac API**: Set `NEXT_PUBLIC_MOCK_MODE=true` to use mock data.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run Playwright E2E tests

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Inbox page (default route)
│   └── api/                # Route Handlers (API proxy)
├── components/
│   ├── layout/             # Layout components
│   ├── tasks/              # Task-related components
│   ├── projects/           # Project components
│   ├── ui/                 # Reusable UI primitives
│   └── shared/             # Shared components
├── lib/
│   ├── api/                # API client
│   ├── mock/               # Mock data
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
└── styles/
    └── globals.css         # Global styles + Tailwind imports
```

## Development Guidelines

1. **TypeScript Strict Mode**: All code must pass `npm run type-check` with zero errors
2. **Code Formatting**: Run `npm run format` before committing
3. **Testing**: Write tests alongside implementation
4. **Import Alias**: Use `@/` for imports (e.g., `import { Button } from '@/components/ui/Button'`)

## Implementation Progress

### Track A: Foundation (Sprint 1)

- [x] A-1: Next.js 15 project initialization
- [ ] A-2: Tailwind CSS setup
- [ ] A-3: Heroicons installation
- [ ] A-4: ESLint + Prettier configuration
- [ ] A-5: TypeScript type definitions
- [ ] A-6: Environment variables setup
- [ ] A-7: Base API client
- [ ] A-8: Mock data implementation
- [ ] A-9: Route Handlers implementation
- [ ] A-10: cn utility (clsx + tailwind-merge)
- [ ] A-11: Date formatting utilities
- [ ] A-12: Validation utilities
- [ ] A-13: Jest + RTL setup
- [ ] A-14: MSW handlers

## License

Private project - All rights reserved

## Credits

Inspired by [Things3](https://culturedcode.com/things/) by Cultured Code

---

*Part of Antigravity Life OS - Multi-Agent Development System*
