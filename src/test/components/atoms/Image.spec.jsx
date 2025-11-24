import React from 'react';
import { render, screen } from '@testing-library/react';
import Image from '../../../components/atoms/Image';

describe('Image Component', () => {
  it('renders image with correct src and alt attributes', () => {
    const testSrc = 'test-image.jpg';
    const testAlt = 'Test image description';
    
    render(<Image src={testSrc} alt={testAlt} />);
    
    const image = screen.getByAltText(testAlt);
    expect(image).toBeDefined();
    expect(image.src).toContain(testSrc);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-image-class';
    
    render(<Image src="test.jpg" alt="test" className={customClass} />);
    
    const image = screen.getByAltText('test');
    expect(image.className).toBe(customClass);
  });

  it('renders without className when not provided', () => {
    render(<Image src="test.jpg" alt="test" />);
    
    const image = screen.getByAltText('test');
    expect(image.className).toBe('');
  });
});