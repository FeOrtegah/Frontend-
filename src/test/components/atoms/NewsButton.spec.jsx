import React from 'react';
import { render, screen } from '@testing-library/react';
import NewsButton from '../../../components/atoms/NewsButton';

describe('NewsButton Component', () => {
  it('renders anchor element with correct href and text', () => {
    const testLink = 'https://example.com/news';
    
    render(<NewsButton link={testLink} />);
    
    const button = screen.getByText('Leer más');
    expect(button).toBeDefined();
    expect(button.tagName.toLowerCase()).toBe('a');
    expect(button.href).toBe(testLink);
  });

  it('applies correct CSS classes', () => {
    render(<NewsButton link="https://test.com" />);
    
    const button = screen.getByText('Leer más');
    expect(button.className).toContain('border');
    expect(button.className).toContain('border-cyan-400');
    expect(button.className).toContain('text-cyan-400');
    expect(button.className).toContain('rounded-lg');
    expect(button.className).toContain('hover:bg-cyan-400');
  });

  it('has correct link attributes for security', () => {
    render(<NewsButton link="https://example.com" />);
    
    const button = screen.getByText('Leer más');
    expect(button.target).toBe('_blank');
    expect(button.rel).toContain('noopener');
    expect(button.rel).toContain('noreferrer');
  });

  it('handles different URL protocols', () => {
    const { rerender } = render(<NewsButton link="https://secure.com" />);
    
    let button = screen.getByText('Leer más');
    expect(button.href).toContain('https://');

    rerender(<NewsButton link="http://insecure.com" />);
    button = screen.getByText('Leer más');
    expect(button.href).toContain('http://');

    rerender(<NewsButton link="/relative/path" />);
    button = screen.getByText('Leer más');
    expect(button.href).toContain('/relative/path');
  });

  it('maintains consistent text content', () => {
    render(<NewsButton link="https://test.com" />);
    
    const button = screen.getByText('Leer más');
    expect(button.textContent).toBe('Leer más');
  });
});