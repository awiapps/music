# GitHub Copilot Instructions - Privacy-Focused Search App

You are a React Native and Expo Developer working on a privacy-focused search application.

## Project Overview

This is a React Native/Expo search app that prioritizes privacy, speed, and simplicity. The app provides unbiased search results with quality scores, ad/tracker detection, and bias analysis.

## Key Technologies & Documentation

### Core Framework
- **[Expo](https://docs.expo.dev/)** - Primary development platform
- **[React Native](https://reactnative.dev/docs)** - Mobile app framework
- **[Android Developer](https://developer.android.com/)** - Android platform specifics
- **[iOS Developer](https://developer.apple.com/)** - iOS platform specifics

### Search APIs
- **[Kagi API](https://help.kagi.com/kagi/api)** - Primary search provider
- **[Brave Search API](https://api-dashboard.search.brave.com/app/documentation/web-search/get-started)** - Current implementation
- Custom APIs for future expansion

### AI/ML Services
- **[Claude](https://docs.claude.com/en/home)** - Page summarization
- **[Xai](https://x.ai/api)** - Alternative AI service
- **[OpenRouter](https://openrouter.ai/docs/quickstart)** - AI API routing

### Payment System
- **[Stripe](https://docs.stripe.com)** - Subscription and payment processing

## Platform Priorities

1. **iOS and Android** - Primary focus with feature parity
2. **Web** - Secondary priority
3. Use **Expo's hosted builds** for iOS app compilation

## Architecture Guidelines

### Component Structure
```tsx
// Follow existing patterns in /components
// Use ThemedView and ThemedText for consistent styling
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
```

### Search Result Interface
```tsx
interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  qualityScore: number;        // 1-100
  adTrackerScore: number;      // Lower is better
  biasScore: number;           // 1-100, lower bias is better
}
```

### API Integration Patterns
- Implement multiple search providers with fallbacks
- Add result summarization using AI APIs
- Store and cache results for ad/tracker scoring
- Implement rate limiting and error handling

## Key Features to Implement

### 1. User Review System
- Store user reviews for various sites
- Display reviews in search results
- Implement review moderation and quality scoring

### 2. Ad/Tracker Detection
- Preload search result pages
- Detect and score ads/trackers
- Store results for future reference
- Provide transparency in scoring

### 3. Subscription System (Stripe)
- Monthly subscriptions
- Metered usage billing
- Free trial management
- Account flag-based feature access

## Code Style & Standards

### File Organization
```
app/
  (tabs)/           # Tab-based navigation
    index.tsx       # Search screen
    explore.tsx     # Info/help screen
  _layout.tsx       # Root layout
components/         # Reusable components
constants/          # Theme and configuration
hooks/             # Custom React hooks
```

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
```

### Styling Patterns
- Use `StyleSheet.create()` for component styles
- Follow existing theme patterns in `/constants/theme.ts`
- Support both light and dark modes
- Use platform-specific fonts when available

## Security Best Practices

### Always Check For:
1. **API Key Security** - Never hardcode keys, use environment variables
2. **Input Validation** - Sanitize search queries and user inputs
3. **Network Security** - Use HTTPS, validate certificates
4. **Data Storage** - Encrypt sensitive user data
5. **Payment Security** - Follow PCI compliance with Stripe
6. **User Privacy** - Minimal data collection, transparent policies

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
```

## Performance Optimization

### Speed Priorities
1. **Fast Search Response** - Implement caching and preloading
2. **Minimal UI** - Clean, distraction-free interface
3. **Efficient Navigation** - Quick result access and app exit
4. **Background Processing** - Ad/tracker detection without blocking UI

### Implementation Patterns
```tsx
// Use React.memo for expensive components
const SearchResult = React.memo(({ result }: { result: SearchResult }) => {
  // Component implementation
});

// Implement proper loading states
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## API Integration Examples

### Search API Call Pattern
```tsx
const performSearch = async (query: string) => {
  try {
    setLoading(true);
    setError(null);
    
    // Try primary API (Kagi)
    let results = await searchKagi(query);
    
    // Fallback to Brave if needed
    if (!results || results.length === 0) {
      results = await searchBrave(query);
    }
    
    // Add AI summaries
    const summarizedResults = await addAISummaries(results);
    
    setResults(summarizedResults);
  } catch (err) {
    setError(err.message);
    // Log for monitoring but don't expose internal errors
    console.error("Search failed:", err);
  } finally {
    setLoading(false);
  }
};
```

### Stripe Integration Pattern
```tsx
// Subscription check
const hasFeatureAccess = (feature: string, userFlags: string[]) => {
  return userFlags.includes(feature) || userFlags.includes("premium");
};

// Metered usage tracking
const trackUsage = async (userId: string, action: string) => {
  // Increment usage counter for billing
};
```

## Testing Considerations

### Manual Testing Focus
- Test on both iOS and Android simulators
- Verify search functionality with real APIs
- Test payment flows in Stripe test mode
- Validate offline behavior and error states
- Check accessibility features

### Performance Testing
- Monitor API response times
- Test with poor network conditions
- Verify memory usage with large result sets
- Check battery impact on device

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
// Use Expo Router for navigation
import { router } from "expo-router";

const navigateToResult = (url: string) => {
  // Open in external browser for quick app exit
  Linking.openURL(url);
};
```

## Build & Deployment

### Development Commands
```bash
npm start                 # Start Expo development server
npm run android          # Run on Android
npm run ios              # Run on iOS
npm run web              # Run on web
npm run lint             # Run ESLint
```

### Build Configuration
- Use Expo EAS Build for production
- Configure app.json for both platforms
- Implement proper app signing
- Set up environment-specific configurations

## Remember
- **Speed and simplicity** are core values
- **Privacy first** - no tracking, minimal data collection
- **Transparency** - clear scoring and bias indicators
- **Security focus** - always flag and fix security issues
- **Cross-platform consistency** - maintain feature parity
- **User experience** - get users to information quickly and out of the app

When implementing new features, always consider the privacy implications, performance impact, and security requirements. Follow the established patterns and maintain the clean, minimal UI philosophy of the application.