import React from 'react';
import { render, screen } from '@testing-library/react';
import NewsList from '../../../components/organisms/NewsList';

describe('NewsList Component', () => {
  const mockNewsData = [
    {
      title: 'Noticia 1',
      description: 'Descripción 1',
      image: 'image1.jpg',
      link: 'https://example.com/1'
    },
    {
      title: 'Noticia 2',
      description: 'Descripción 2', 
      image: 'image2.jpg',
      link: 'https://example.com/2'
    }
  ];

  it('renders correct number of news items', () => {
    const { container } = render(<NewsList newsData={mockNewsData} />);
    
    const newsCards = container.querySelectorAll('.col-md-4');
    expect(newsCards.length).toBe(2);
  });

  it('renders no news message when data is empty', () => {
    render(<NewsList newsData={[]} />);
    
    expect(screen.getByText('No hay noticias disponibles')).toBeDefined();
  });

  it('renders no news message when data is null', () => {
    render(<NewsList newsData={null} />);
    
    expect(screen.getByText('No hay noticias disponibles')).toBeDefined();
  });

  it('renders no news message when data is undefined', () => {
    render(<NewsList newsData={undefined} />);
    
    expect(screen.getByText('No hay noticias disponibles')).toBeDefined();
  });

  it('applies correct grid layout', () => {
    const { container } = render(<NewsList newsData={mockNewsData} />);
    
    const row = container.querySelector('.row');
    expect(row).toBeDefined();
    
    const hasGapClass = row.className.includes('g-4');
    expect(hasGapClass).toBe(true);
  });

  it('handles single news item correctly', () => {
    const singleNews = [mockNewsData[0]];
    const { container } = render(<NewsList newsData={singleNews} />);
    
    const newsCards = container.querySelectorAll('.col-md-4');
    expect(newsCards.length).toBe(1);
  });

  // NUEVO TEST: Verificar que no se rompe con datos inválidos
  it('handles malformed news data gracefully', () => {
    const malformedData = [
      { invalid: 'data' },
      null,
      undefined
    ];
    
    // Should not crash and should show no news message or handle gracefully
    const { container } = render(<NewsList newsData={malformedData} />);
    expect(container).toBeDefined();
  });
});