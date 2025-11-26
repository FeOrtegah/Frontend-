import React from 'react';
import { render, screen } from '@testing-library/react';
import NewsImage from '../../../components/atoms/NewsImage';

describe('NewsImage Component', () => {
  it('renders image with correct src and alt attributes', () => {
    const testSrc = 'news-image.jpg';
    const testAlt = 'News description';
    
    render(<NewsImage src={testSrc} alt={testAlt} />);
    
    const image = screen.getByAltText(testAlt);
    expect(image).toBeDefined();
    expect(image.src).toContain(testSrc);
    expect(image.className).toBe('card-img-top');
  });

  it('applies correct CSS class', () => {
    render(<NewsImage src="test.jpg" alt="test" />);
    
    const image = screen.getByAltText('test');
    expect(image.className).toBe('card-img-top');
  });

  it('handles empty src and alt attributes', () => {
    render(<NewsImage src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" />);
    
    const image = screen.getByAltText('');
    expect(image).toBeDefined();
  });

  it('renders with special characters in alt text', () => {
    const specialAlt = 'News image with special chars: ñáéíóú';
    
    render(<NewsImage src="test.jpg" alt={specialAlt} />);
    
    const image = screen.getByAltText(specialAlt);
    expect(image).toBeDefined();
  });

  it('renders with undefined src', () => {
    render(<NewsImage src={undefined} alt="test" />);
    
    const image = screen.getByAltText('test');
    expect(image).toBeDefined();
  });
});
