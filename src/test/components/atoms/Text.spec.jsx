import React from 'react';
import { render, screen } from '@testing-library/react';
import Text from '../../../components/atoms/Text';

describe('Text Component', () => {
  it('renders paragraph by default with correct content', () => {
    const testContent = 'Hello World';
    
    render(<Text>{testContent}</Text>);
    
    const paragraph = screen.getByText(testContent);
    expect(paragraph).toBeDefined();
    expect(paragraph.tagName.toLowerCase()).toBe('p');
  });

  it('renders different HTML tags based on variant prop', () => {
    const { rerender } = render(<Text variant="h1">Heading</Text>);
    
    let heading = screen.getByText('Heading');
    expect(heading.tagName.toLowerCase()).toBe('h1');

    rerender(<Text variant="span">Span text</Text>);
    let span = screen.getByText('Span text');
    expect(span.tagName.toLowerCase()).toBe('span');

    rerender(<Text variant="div">Div content</Text>);
    let div = screen.getByText('Div content');
    expect(div.tagName.toLowerCase()).toBe('div');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-text-class';
    
    render(<Text className={customClass}>Test text</Text>);
    
    const text = screen.getByText('Test text');
    expect(text.className).toBe(customClass);
  });

  it('renders without className when not provided', () => {
    render(<Text>Test text</Text>);
    
    const text = screen.getByText('Test text');
    expect(text.className).toBe('');
  });

  it('handles empty children gracefully', () => {
    const { container } = render(<Text></Text>);
    const text = container.querySelector('p');
    expect(text).toBeDefined();
    expect(text.textContent).toBe('');
  });

  it('handles null and undefined children', () => {
    const { container } = render(<Text>{null}</Text>);
    const text = container.querySelector('p');
    expect(text).toBeDefined();
    expect(text.textContent).toBe('');
    
    const { container: container2 } = render(<Text>{undefined}</Text>);
    const text2 = container2.querySelector('p');
    expect(text2).toBeDefined();
    expect(text2.textContent).toBe('');
  });

  it('handles number as children', () => {
    render(<Text>{42}</Text>);
    
    const text = screen.getByText('42');
    expect(text).toBeDefined();
    expect(text.tagName.toLowerCase()).toBe('p');
  });

});
