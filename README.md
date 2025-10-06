# AWMusic - Privacy-Focused Music Application

Cross-platform music application prioritizing user privacy, offline capabilities, and seamless playback across Android, iOS, Web, and Desktop (Linux/Windows/macOS).

## 🏗️ Monorepo Structure

```
awmusic/
├── packages/
│   ├── mobile/          # React Native/Expo (Android/iOS/Web)
│   ├── desktop/         # Tauri desktop app
│   ├── website/         # Astro marketing website
│   ├── api/             # Backend API (Express/Node.js)
│   └── shared/          # Shared types and utilities
├── scripts/             # Build and transform scripts
├── .ai/                 # AI development instructions
└── package.json         # Root workspace configuration
```

## 📦 Packages

### `@awmusic/mobile`
React Native application built with Expo for Android, iOS, and Web platforms.

**Tech Stack:** Expo, React Native, TypeScript  
**Location:** `packages/mobile/`

```bash
pnpm dev:mobile    # Start development server
pnpm build:mobile  # Build for production
```

### `@awmusic/desktop`
Native desktop application using Tauri for Linux, Windows, and macOS.

**Tech Stack:** Tauri, React, Vite, TypeScript  
**Location:** `packages/desktop/`

```bash
pnpm dev:desktop   # Start Tauri dev mode
pnpm build:desktop # Build native bundles
```

### `@awmusic/website`
Marketing and informational website built with Astro.

**Tech Stack:** Astro, Tailwind CSS, TypeScript  
**Location:** `packages/website/`

```bash
pnpm dev:website   # Start Astro dev server
pnpm build:website # Build static site
```

### `@awmusic/api`
Backend API for music metadata, user preferences, and streaming.

**Tech Stack:** Express, Node.js, TypeScript  
**Location:** `packages/api/`

```bash
pnpm dev:api       # Start API server with hot reload
pnpm build:api     # Build for production
```

### `@awmusic/shared`
Shared TypeScript types and utilities used across all packages.

**Location:** `packages/shared/`

```typescript
import { MusicTrack, SearchResult } from '@awmusic/shared';
```

## 🚀 Getting Started

### Prerequisites
- Node.js ≥18.0.0
- pnpm ≥9.0.0 (install with `npm i -g pnpm`)

### Installation

```bash
# Clone repository
git clone https://github.com/awfixer/awmusic.git
cd awmusic

# Install all dependencies (workspace-aware)
pnpm install
```

### Development

```bash
# Run specific package
pnpm dev:mobile
pnpm dev:desktop
pnpm dev:website
pnpm dev:api

# Type checking across all packages
pnpm type-check

# Lint mobile app
pnpm lint
```

### Building

```bash
# Build all packages
pnpm build:all

# Build specific package
pnpm build:mobile
pnpm build:desktop
pnpm build:website
pnpm build:api
```

## 🎯 Key Features

- **Privacy First** - No tracking, local-first storage, encrypted libraries
- **Cross-Platform** - Android, iOS, Web, Linux, Windows, macOS
- **Offline Support** - Full functionality without internet
- **Quality Ratings** - Track quality scores and ad/tracker detection
- **Multiple Providers** - MusicBrainz, Audius, local library
- **Subscription System** - Stripe integration for premium features
- **AI Metadata** - Claude/xAI for summaries and recommendations

## 🏛️ Architecture

### Shared Types
Common interfaces defined in `@awmusic/shared`:

```typescript
interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  url: string;
  duration: number;
  qualityScore: number;
  adTrackerScore: number;
  metadataBiasScore: number;
}
```

### Platform-Specific Features

- **Mobile:** Expo modules, native APIs, offline storage
- **Desktop:** Tauri file system access, system tray, native playback
- **Web:** Progressive web app, responsive design
- **API:** RESTful endpoints, authentication, Stripe integration

## 📱 Platform Support

| Platform | Status | Package |
|----------|--------|---------|
| Android  | ✅ Primary | `@awmusic/mobile` |
| iOS      | ✅ Primary | `@awmusic/mobile` |
| Web      | ✅ Built-in | `@awmusic/mobile` |
| Linux    | 🔄 Secondary | `@awmusic/desktop` |
| Windows  | 🔄 Secondary | `@awmusic/desktop` |
| macOS    | 🔄 Secondary | `@awmusic/desktop` |

## 🔒 Privacy & Security

- ✅ No telemetry or analytics
- ✅ Local-first data storage
- ✅ Encrypted user libraries
- ✅ Ad/tracker blocking analysis
- ✅ Transparent quality scoring
- ✅ HTTPS-only connections
- ✅ Environment-based secrets

## 🛠️ Development Tools

- **TypeScript** - Type safety across all packages
- **pnpm Workspaces** - Efficient dependency management
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting (website)
- **Expo** - Mobile development platform
- **Tauri** - Desktop bundling
- **Astro** - Static site generation

## 📄 License

AWSOURCE - See LICENSE file for details

## 👤 Author

**awfixer**
- Email: awfixer@awfixer.me
- Website: https://theautist.me

## 🤝 Contributing

This is a personal project. Please open issues for bugs or feature requests.
