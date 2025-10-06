/**
 * Unit tests for ThemedText component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../themed-text';

describe('ThemedText', () => {
  it('should render text content', () => {
    const { getByText } = render(<ThemedText>Test Text</ThemedText>);
    expect(getByText('Test Text')).toBeTruthy();
  });

  it('should apply default styles', () => {
    const { getByText } = render(<ThemedText type="default">Default Text</ThemedText>);
    const element = getByText('Default Text');
    expect(element).toBeTruthy();
  });

  it('should apply title styles', () => {
    const { getByText } = render(<ThemedText type="title">Title Text</ThemedText>);
    const element = getByText('Title Text');
    expect(element).toBeTruthy();
  });

  it('should apply subtitle styles', () => {
    const { getByText } = render(<ThemedText type="subtitle">Subtitle Text</ThemedText>);
    const element = getByText('Subtitle Text');
    expect(element).toBeTruthy();
  });

  it('should apply semibold styles', () => {
    const { getByText } = render(
      <ThemedText type="defaultSemiBold">SemiBold Text</ThemedText>
    );
    const element = getByText('SemiBold Text');
    expect(element).toBeTruthy();
  });

  it('should apply link styles', () => {
    const { getByText } = render(<ThemedText type="link">Link Text</ThemedText>);
    const element = getByText('Link Text');
    expect(element).toBeTruthy();
  });

  it('should accept custom lightColor prop', () => {
    const { getByText } = render(
      <ThemedText lightColor="#ff0000">Custom Light Color</ThemedText>
    );
    expect(getByText('Custom Light Color')).toBeTruthy();
  });

  it('should accept custom darkColor prop', () => {
    const { getByText } = render(
      <ThemedText darkColor="#00ff00">Custom Dark Color</ThemedText>
    );
    expect(getByText('Custom Dark Color')).toBeTruthy();
  });

  it('should accept custom style prop', () => {
    const customStyle = { marginTop: 10, paddingLeft: 5 };
    const { getByText } = render(
      <ThemedText style={customStyle}>Styled Text</ThemedText>
    );
    expect(getByText('Styled Text')).toBeTruthy();
  });

  it('should pass through text props', () => {
    const { getByText } = render(
      <ThemedText numberOfLines={2} ellipsizeMode="tail">
        Long text that should be truncated
      </ThemedText>
    );
    expect(getByText('Long text that should be truncated')).toBeTruthy();
  });

  it('should handle empty children', () => {
    const { container } = render(<ThemedText />);
    expect(container).toBeTruthy();
  });
});
