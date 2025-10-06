/**
 * Unit tests for music types
 */

import { describe, it, expect } from 'vitest';
import type { MusicTrack, SearchResult, UserPreferences, Subscription } from './music';

describe('MusicTrack Type', () => {
  it('should create a valid MusicTrack object', () => {
    const track: MusicTrack = {
      id: 'track-123',
      title: 'Test Song',
      artist: 'Test Artist',
      album: 'Test Album',
      url: 'https://example.com/track.mp3',
      duration: 180,
      qualityScore: 85,
      adTrackerScore: 10,
      metadataBiasScore: 20,
    };

    expect(track.id).toBe('track-123');
    expect(track.duration).toBe(180);
    expect(track.qualityScore).toBeGreaterThanOrEqual(1);
    expect(track.qualityScore).toBeLessThanOrEqual(100);
  });

  it('should validate quality scores are within range', () => {
    const track: MusicTrack = {
      id: 'track-456',
      title: 'High Quality Track',
      artist: 'Artist',
      album: 'Album',
      url: 'local://music/track.flac',
      duration: 240,
      qualityScore: 95,
      adTrackerScore: 0,
      metadataBiasScore: 5,
    };

    expect(track.qualityScore).toBeGreaterThanOrEqual(1);
    expect(track.qualityScore).toBeLessThanOrEqual(100);
    expect(track.adTrackerScore).toBeGreaterThanOrEqual(0);
    expect(track.metadataBiasScore).toBeLessThanOrEqual(100);
  });
});

describe('SearchResult Type', () => {
  it('should create a valid SearchResult object', () => {
    const result: SearchResult = {
      tracks: [
        {
          id: 'track-1',
          title: 'Song 1',
          artist: 'Artist 1',
          album: 'Album 1',
          url: 'https://example.com/1.mp3',
          duration: 200,
          qualityScore: 80,
          adTrackerScore: 15,
          metadataBiasScore: 25,
        },
      ],
      provider: 'musicbrainz',
      query: 'test search',
      timestamp: Date.now(),
    };

    expect(result.tracks).toHaveLength(1);
    expect(result.provider).toBe('musicbrainz');
    expect(result.query).toBe('test search');
    expect(result.timestamp).toBeGreaterThan(0);
  });

  it('should support multiple providers', () => {
    const providers: Array<'musicbrainz' | 'audius' | 'local'> = [
      'musicbrainz',
      'audius',
      'local',
    ];

    providers.forEach((provider) => {
      const result: SearchResult = {
        tracks: [],
        provider,
        query: 'test',
        timestamp: Date.now(),
      };

      expect(result.provider).toBe(provider);
    });
  });
});

describe('UserPreferences Type', () => {
  it('should create valid user preferences', () => {
    const prefs: UserPreferences = {
      theme: 'dark',
      quality: 'high',
      privacyMode: true,
      offlineOnly: false,
    };

    expect(prefs.theme).toBe('dark');
    expect(prefs.quality).toBe('high');
    expect(prefs.privacyMode).toBe(true);
    expect(prefs.offlineOnly).toBe(false);
  });

  it('should support all theme options', () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];

    themes.forEach((theme) => {
      const prefs: UserPreferences = {
        theme,
        quality: 'medium',
        privacyMode: false,
        offlineOnly: false,
      };

      expect(prefs.theme).toBe(theme);
    });
  });

  it('should support all quality options', () => {
    const qualities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

    qualities.forEach((quality) => {
      const prefs: UserPreferences = {
        theme: 'system',
        quality,
        privacyMode: false,
        offlineOnly: false,
      };

      expect(prefs.quality).toBe(quality);
    });
  });
});

describe('Subscription Type', () => {
  it('should create a free subscription', () => {
    const sub: Subscription = {
      tier: 'free',
      features: ['basic-playback', 'local-library'],
      isActive: true,
    };

    expect(sub.tier).toBe('free');
    expect(sub.features).toContain('basic-playback');
    expect(sub.isActive).toBe(true);
    expect(sub.expiresAt).toBeUndefined();
  });

  it('should create a premium subscription with expiry', () => {
    const expiryDate = new Date('2025-12-31');
    const sub: Subscription = {
      tier: 'premium',
      features: ['ad-free', 'high-quality', 'offline-mode'],
      expiresAt: expiryDate,
      isActive: true,
    };

    expect(sub.tier).toBe('premium');
    expect(sub.features).toHaveLength(3);
    expect(sub.expiresAt).toEqual(expiryDate);
    expect(sub.isActive).toBe(true);
  });

  it('should support all subscription tiers', () => {
    const tiers: Array<'free' | 'premium' | 'pro'> = ['free', 'premium', 'pro'];

    tiers.forEach((tier) => {
      const sub: Subscription = {
        tier,
        features: [],
        isActive: true,
      };

      expect(sub.tier).toBe(tier);
    });
  });
});
