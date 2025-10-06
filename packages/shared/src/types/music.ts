/**
 * Core music track interface used across all platforms
 */
export interface MusicTrack {
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

/**
 * Music provider types
 */
export type MusicProvider = 'musicbrainz' | 'audius' | 'local';

/**
 * Search result interface
 */
export interface SearchResult {
  tracks: MusicTrack[];
  provider: MusicProvider;
  query: string;
  timestamp: number;
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  quality: 'low' | 'medium' | 'high';
  privacyMode: boolean;
  offlineOnly: boolean;
}

/**
 * Subscription tiers
 */
export type SubscriptionTier = 'free' | 'premium' | 'pro';

/**
 * User subscription info
 */
export interface Subscription {
  tier: SubscriptionTier;
  features: string[];
  expiresAt?: Date;
  isActive: boolean;
}
