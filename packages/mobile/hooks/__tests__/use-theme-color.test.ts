/**
 * Unit tests for useThemeColor hook
 */

import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../use-theme-color';
import { useColorScheme } from '../use-color-scheme';

// Mock useColorScheme
jest.mock('../use-color-scheme');

describe('useThemeColor', () => {
  const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return light color when light theme is active', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#ffffff', dark: '#000000' }, 'background')
    );

    expect(result.current).toBe('#ffffff');
  });

  it('should return dark color when dark theme is active', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#ffffff', dark: '#000000' }, 'background')
    );

    expect(result.current).toBe('#000000');
  });

  it('should fall back to theme colors when no props provided', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBeDefined();
  });

  it('should default to light theme when colorScheme is null', () => {
    mockUseColorScheme.mockReturnValue(null);

    const { result } = renderHook(() =>
      useThemeColor({ light: '#aaaaaa', dark: '#bbbbbb' }, 'background')
    );

    expect(result.current).toBe('#aaaaaa');
  });

  it('should prioritize props over theme constants', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#custom', dark: '#dark' }, 'background')
    );

    expect(result.current).toBe('#custom');
  });

  it('should handle only light color prop', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#lightonly' }, 'background')
    );

    expect(result.current).toBe('#lightonly');
  });

  it('should handle only dark color prop', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({ dark: '#darkonly' }, 'background')
    );

    expect(result.current).toBe('#darkonly');
  });
});
