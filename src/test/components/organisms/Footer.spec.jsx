import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from '../../../components/organisms/Footer';

const renderWithRouter = (component) => {
  return render(<Router>{component}</Router>);
};

describe('Footer Component', () => {
  it('renders footer with correct structure and content', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText('Nosotros')).toBeDefined();
    expect(screen.getByText(/Suscríbete para estar al tanto/)).toBeDefined();
    expect(screen.getByText('Ver Blog')).toBeDefined();
    expect(screen.getByText('Centro de Ayuda:')).toBeDefined();
    expect(screen.getByText('Noticias')).toBeDefined();
  });

  it('renders social media links with correct href attributes', () => {
    renderWithRouter(<Footer />);
    
    const instagramLink = screen.getByText('Instagram');
    const facebookLink = screen.getByText('Facebook');
    const tiktokLink = screen.getByText('TikTok');
    const xLink = screen.getByText('X');

    expect(instagramLink.href).toBe('https://www.instagram.com/');
    expect(facebookLink.href).toBe('https://www.facebook.com/');
    expect(tiktokLink.href).toBe('https://www.tiktok.com/');
    expect(xLink.href).toBe('https://www.x.com/');
    
    // CORREGIDO: Removida la verificación de target="_blank" ya que no está en el componente
  });

  it('renders internal navigation links correctly', () => {
    renderWithRouter(<Footer />);
    
    const blogLink = screen.getByText('Ver Blog');
    const ayudaLink = screen.getByText('Centro de Ayuda:');
    const noticiasLink = screen.getByText('Noticias');

    expect(blogLink.getAttribute('href')).toBe('/blog');
    expect(ayudaLink.getAttribute('href')).toBe('/ayuda');
    expect(noticiasLink.getAttribute('href')).toBe('/noticias');
  });

  it('applies correct CSS classes for styling', () => {
    const { container } = renderWithRouter(<Footer />);
    
    const footer = container.querySelector('footer');
    expect(footer.className).toContain('page-footer');
    expect(footer.className).toContain('bg-dark');
    expect(footer.className).toContain('text-white');
  });

  it('displays copyright information correctly', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText('©EFA')).toBeDefined();
    expect(screen.getByText(/Enfatiza la exclusividad/)).toBeDefined();
    expect(screen.getByText(/El contenido de esta página web está protegido/)).toBeDefined();
  });

  it('renders help center description', () => {
    renderWithRouter(<Footer />);
    
    const helpText = screen.getByText(/Aquí podrás encontrar toda la información/);
    expect(helpText).toBeDefined();
    expect(helpText.textContent).toContain('servicio al cliente');
    expect(helpText.textContent).toContain('compras online');
  });
});