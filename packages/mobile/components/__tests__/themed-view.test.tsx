/**
 * Unit tests for ThemedView component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemedView } from '../themed-view';

describe('ThemedView', () => {
  it('should render children', () => {
    const { getByText } = render(
      <ThemedView>
        <Text>Child Content</Text>
      </ThemedView>
    );
    expect(getByText('Child Content')).toBeTruthy();
  });

  it('should accept custom lightColor prop', () => {
    const { container } = render(
      <ThemedView lightColor="#ffffff">
        <Text>Light Theme</Text>
      </ThemedView>
    );
    expect(container).toBeTruthy();
  });

  it('should accept custom darkColor prop', () => {
    const { container } = render(
      <ThemedView darkColor="#000000">
        <Text>Dark Theme</Text>
      </ThemedView>
    );
    expect(container).toBeTruthy();
  });

  it('should accept custom style prop', () => {
    const customStyle = { padding: 20, margin: 10 };
    const { container } = render(
      <ThemedView style={customStyle}>
        <Text>Styled View</Text>
      </ThemedView>
    );
    expect(container).toBeTruthy();
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <ThemedView>
        <Text>First Child</Text>
        <Text>Second Child</Text>
        <Text>Third Child</Text>
      </ThemedView>
    );
    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
    expect(getByText('Third Child')).toBeTruthy();
  });

  it('should pass through view props', () => {
    const { getByTestId } = render(
      <ThemedView testID="test-view">
        <Text>Test Content</Text>
      </ThemedView>
    );
    expect(getByTestId('test-view')).toBeTruthy();
  });

  it('should handle empty children', () => {
    const { container } = render(<ThemedView />);
    expect(container).toBeTruthy();
  });

  it('should support nested ThemedViews', () => {
    const { getByText } = render(
      <ThemedView>
        <ThemedView>
          <Text>Nested Content</Text>
        </ThemedView>
      </ThemedView>
    );
    expect(getByText('Nested Content')).toBeTruthy();
  });
});
