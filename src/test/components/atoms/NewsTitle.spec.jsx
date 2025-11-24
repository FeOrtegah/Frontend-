import React from 'react';
import { render, screen } from '@testing-library/react';
import NewsTitle from '../../../components/atoms/NewsTitle';

describe('NewsTitle Component', () => {
  it('renders h3 element with correct content', () => {
    const titleText = 'Breaking News Title';
    
    render(<NewsTitle>{titleText}</NewsTitle>);
    
    const title = screen.getByText(titleText);
    expect(title).toBeDefined();
    expect(title.tagName.toLowerCase()).toBe('h3');
  });

  it('applies correct CSS classes', () => {
    render(<NewsTitle>Test Title</NewsTitle>);
    
    const title = screen.getByText('Test Title');
    expect(title.className).toContain('text-lg');
    expect(title.className).toContain('font-semibold');
    expect(title.className).toContain('text-cyan-400');
    expect(title.className).toContain('mb-2');
  });

  it('handles empty children', () => {
    const { container } = render(<NewsTitle></NewsTitle>);
    
    // CORREGIDO: Usar container.querySelector en lugar de getByText para elementos vacíos
    const title = container.querySelector('h3');
    expect(title).toBeDefined();
    expect(title.textContent).toBe('');
  });

  it('renders with React elements as children', () => {
    render(
      <NewsTitle>
        <span>Special</span> News Title
      </NewsTitle>
    );
    
    const title = screen.getByText(/News Title/);
    expect(title).toBeDefined();
    // CORREGIDO: Verificar que contiene el span de manera más específica
    const span = screen.getByText('Special');
    expect(span.tagName.toLowerCase()).toBe('span');
  });
});