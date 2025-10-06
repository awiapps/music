# Instructions - Privacy-Focused Music App (AWMusic)

You are a React Native, Expo, Tauri, and Full-Stack Developer working on a privacy-focused music application called AWMusic.

## Project Overview
AWMusic is a cross-platform music app that prioritizes user privacy, offline capabilities, and seamless playback. It enables music discovery, local library management, streaming from privacy-respecting sources, with quality ratings, metadata analysis, and ad/tracker blocking. The app supports mobile (Android/iOS), web, and desktop (Linux/Windows/macOS) with a shared codebase where possible.

## Key Technologies & Documentation
### Core Framework
- **[Expo](https://docs.expo.dev/)** - Primary development platform for mobile and web
- **[React Native](https://reactnative.dev/docs)** - Mobile app framework
- **[Tauri](https://tauri.app/v1/guides/)** - Desktop app bundling (Linux/Windows/macOS)
- **[Android Developer](https://developer.android.com/)** - Android platform specifics
- **[iOS Developer](https://developer.apple.com/)** - iOS platform specifics
- **[Web Standards](https://developer.mozilla.org/en-US/docs/Web)** - Web platform compatibility

### Music APIs & Services
- **[MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API)** - Primary metadata provider
- **[Audius API](https://docs.audius.org/api)** - Decentralized streaming (current implementation)
- Custom APIs for local library integration and future expansions

### AI/ML Services
- **[Claude](https://docs.anthropic.com/claude/docs)** - Metadata summarization and playlist suggestions
- **[xAI API](https://x.ai/api)** - Alternative AI service for analysis
- **[OpenRouter](https://openrouter.ai/docs/quickstart)** - AI API routing

### Payment System
- **[Stripe](https://docs.stripe.com)** - Subscription and payment processing

### Backend & API Setup
- Monorepo structure with a shared `/api` or `/backend` directory
- Import backend logic (e.g., Node.js/Express or Rust for Tauri) into main codebase
- Supports Android/iOS/Web via Expo modules; Tauri uses Rust backend for desktop-specific features like file system access

## Platform Priorities
1. **Android and iOS** - Primary focus with feature parity using Expo
2. **Web** - Built-in via Expo for the website (awmusic.app or similar)
3. **Desktop (Linux/Windows/macOS)** - Secondary; use Tauri for native bundles from transformed web/mobile codebase
4. Use **Expo's hosted builds** for iOS compilation; **Tauri CLI** for desktop builds

## Architecture Guidelines
### Component Structure
Follow a monorepo layout:
```
awmusic/
  app/ # Main React Native/Expo codebase (mobile/web)
    (tabs)/ # Tab-based navigation
      index.tsx # Library/home screen
      search.tsx # Music discovery screen
    _layout.tsx # Root layout
  api/ # Shared backend/API setup (Node.js/Rust modules)
    index.ts # API server/entrypoint
    routes/ # Music metadata, user prefs routes
  desktop/ # Tauri-specific directory
    src-tauri/ # Rust backend
    transform.js # Script to adapt main codebase for Tauri
    tauri.conf.json # Desktop config
  components/ # Reusable UI components (shared across platforms)
  constants/ # Theme and configuration
  hooks/ # Custom React hooks
```
- Use ThemedView and ThemedText for consistent styling across platforms
```tsx
import { ThemedText } from "@/components/themed-text";
import { ThemedText } from "@/components/themed-view";
```

### Music Track Interface
```tsx
interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  url: string; // Local or streaming URL
  duration: number; // Seconds
  qualityScore: number; // 1-100 (audio/metadata quality)
  adTrackerScore: number; // Lower is better (streaming source analysis)
  metadataBiasScore: number; // 1-100, lower bias in recommendations is better
}
```

### API Integration Patterns
- Import `/api` backend into main codebase for shared logic (e.g., via Expo config plugins for native)
- Implement multiple music providers with fallbacks
- Add AI summaries for track metadata/playlists
- Cache local library and offline tracks
- Platform-specific: Use Tauri's file system API for desktop local storage
- Implement rate limiting, error handling, and privacy-preserving logging

## Key Features to Implement
### 1. User Review System
- Store user ratings/reviews for tracks/artists
- Display in library/search results
- Implement moderation and quality scoring via backend `/api`

### 2. Ad/Tracker Detection
- Analyze streaming sources/metadata endpoints
- Score and block trackers
- Store results in local encrypted storage
- Provide transparency in scoring (e.g., via UI indicators)

### 3. Subscription System (Stripe)
- Monthly subscriptions for premium streaming/features
- Metered usage billing (e.g., data usage)
- Free trial management
- Account flag-based feature access (shared via backend)

### 4. Cross-Platform Transformations
- **Desktop Transform Script** (`desktop/transform.js`): Adapt main codebase (e.g., replace Expo modules with Tauri equivalents, bundle web assets) into Tauri-compatible frontend; invoke Rust backend for native features like system tray playback
- Build command: `node desktop/transform.js && tauri build` for Linux/Windows/macOS bundles

## Code Style & Standards
### File Organization
See monorepo layout above. Ensure shared components work on web/mobile/desktop post-transform.

### Import Conventions
```tsx
// React Native imports first
import { StyleSheet, View } from "react-native";
import { useState } from "react";
// Expo imports
import { Link } from "expo-router";
// Local imports with @ alias
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
// Backend imports (platform-aware)
import { fetchTracks } from "@/api/music"; // Imported from /api
// Tauri-specific (post-transform)
import { invoke } from "@tauri-apps/api/tauri";
```

### Styling Patterns
- Use `StyleSheet.create()` for component styles
- Follow existing theme patterns in `/constants/theme.ts`
- Support light/dark modes; adapt for desktop via CSS-in-JS if needed post-transform
- Use platform-specific fonts (e.g., SF Pro for iOS/macOS)

## Security Best Practices
### Always Check For:
1. **API Key Security** - Never hardcode keys; use environment variables (e.g., `.env` for Expo, `tauri.conf.json` for desktop)
2. **Input Validation** - Sanitize search queries, track metadata, user inputs
3. **Network Security** - Use HTTPS; validate certificates in backend
4. **Data Storage** - Encrypt local music library/user data (e.g., Expo SecureStore, Tauri keyring)
5. **Payment Security** - Follow PCI compliance with Stripe
6. **User Privacy** - Minimal data collection; no telemetry; transparent policies

### Security Patterns
```tsx
// Environment variable usage
const apiKey = process.env.EXPO_PUBLIC_API_KEY;
if (!apiKey) {
  throw new Error("API key not configured");
}
// Input sanitization
const sanitizeQuery = (query: string): string => {
  return query.trim().replace(/[<>]/g, "");
};
// Tauri-specific secure storage
import { getClient } from "@tauri-apps/api/http";
const secureFetch = async (url: string) => {
  return getClient().get(url, { headers: { Authorization: `Bearer ${apiKey}` } });
};
```

## Performance Optimization
### Speed Priorities
1. **Fast Playback/Discovery** - Implement offline caching and preloading
2. **Minimal UI** - Clean, distraction-free interface for library/search
3. **Efficient Navigation** - Quick track access and cross-platform consistency
4. **Background Processing** - Playback and metadata fetch without blocking UI (use Expo TaskManager for mobile, Tauri workers for desktop)

### Implementation Patterns
```tsx
// Use React.memo for expensive components (e.g., track lists)
const TrackItem = React.memo(({ track }: { track: MusicTrack }) => {
  // Component implementation
});
// Implement proper loading states
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## API Integration Examples
### Music API Call Pattern (Shared Backend)
```tsx
// Imported from /api/music.ts
const performSearch = async (query: string) => {
  try {
    setLoading(true);
    setError(null);

    // Try primary API (MusicBrainz)
    let tracks = await fetchMusicBrainz(query);

    // Fallback to Audius if needed
    if (!tracks || tracks.length === 0) {
      tracks = await fetchAudius(query);
    }

    // Add AI summaries
    const enhancedTracks = await addAIMetadata(tracks);

    setTracks(enhancedTracks);
  } catch (err) {
    setError(err.message);
    console.error("Search failed:", err);
  } finally {
    setLoading(false);
  }
};
```

### Stripe Integration Pattern
```tsx
// Subscription check (backend-synced)
const hasFeatureAccess = (feature: string, userFlags: string[]) => {
  return userFlags.includes(feature) || userFlags.includes("premium");
};
// Metered usage tracking
const trackUsage = async (userId: string, action: string) => {
  // Increment via /api/usage endpoint
};
```

### Tauri Backend Example (desktop/src-tauri/src/main.rs)
```rust
#[tauri::command]
fn get_local_library() -> Result<Vec<Track>, String> {
    // Rust logic for file system access
    // Return JSON-serialized tracks
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_local_library])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Testing Considerations
### Manual Testing Focus
- Test on Android/iOS simulators, web browser, and Tauri dev mode
- Verify music playback with real APIs (offline mocks)
- Test payment flows in Stripe test mode
- Validate cross-platform: Run transform script and build desktop bundles
- Check accessibility (e.g., VoiceOver on iOS/macOS)
- Test poor network/offline behavior

### Performance Testing
- Monitor API response times and playback latency
- Test with large libraries (e.g., 10k tracks)
- Verify memory/battery on mobile; CPU on desktop
- Simulate network conditions across platforms

## Common Patterns & Utilities
### Error Boundary Pattern
```tsx
const ErrorFallback = ({ error, resetError }) => (
  <ThemedView style={styles.errorContainer}>
    <ThemedText>Something went wrong: {error.message}</ThemedText>
    <Button title="Try Again" onPress={resetError} />
  </ThemedView>
);
```

### Navigation Pattern
```tsx
// Use Expo Router for mobile/web; adapt for Tauri routing
import { router } from "expo-router";
const navigateToAlbum = (albumId: string) => {
  router.push(`/album/${albumId}`);
};
// Desktop: Use Tauri window management for multi-window playback
```

## Build & Deployment
### Development Commands
```bash
npm start # Start Expo dev server (mobile/web)
npm run android # Run on Android
npm run ios # Run on iOS
npm run web # Run on web (website)
node desktop/transform.js && tauri dev # Desktop dev mode
npm run lint # Run ESLint across monorepo
```

### Build Configuration
- Use Expo EAS Build for mobile production
- Tauri for desktop: `tauri build` post-transform for Linux/Windows/macOS
- Configure `app.json` for Expo platforms; `tauri.conf.json` for desktop
- Implement app signing and environment configs (dev/prod)
- Website: Deploy web build to hosting (e.g., Vercel/Netlify)

## Remember
- **Privacy first** - No tracking, local-first storage, encrypted libraries
- **Cross-platform efficiency** - Shared codebase with minimal transforms
- **Speed and simplicity** - Fast playback, minimal UI, quick exits to system players if needed
- **Transparency** - Clear quality/ad scores, source indicators
- **Security focus** - Flag issues in backend imports and Tauri native code
- **Consistency** - Feature parity via monorepo; test transforms thoroughly
- **User experience** - Seamless discovery/playback across devices

When implementing new features, always consider privacy implications (e.g., no cloud sync without consent), performance impact on battery/CPU, and security in backend/Tauri integrations. Follow established patterns and maintain the clean, minimal UI philosophy.
