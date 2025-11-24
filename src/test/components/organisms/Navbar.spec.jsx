import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../../../components/organisms/Navbar';

const renderWithRouter = (component) => {
  return render(<Router>{component}</Router>);
};

describe('Navbar Component', () => {
  const mockCarrito = [
    { id: 1, name: 'Producto 1' },
    { id: 2, name: 'Producto 2' }
  ];

  const emptyCarrito = [];

  it('renders navbar with all main elements', () => {
    renderWithRouter(<Navbar carrito={emptyCarrito} />);
    
    // Elementos principales deben existir
    expect(screen.getByAltText('Logo EFA')).toBeDefined();
    expect(screen.getByText('perm_identity')).toBeDefined();
    expect(screen.getByText('shopping_cart')).toBeDefined();
    expect(screen.getByText('Categorías')).toBeDefined();
  });

  it('shows cart badge when carrito has items', () => {
    renderWithRouter(<Navbar carrito={mockCarrito} />);
    expect(screen.getByText('2')).toBeDefined();
  });

  it('does not show cart badge when carrito is empty', () => {
    renderWithRouter(<Navbar carrito={emptyCarrito} />);
    expect(screen.queryByText('2')).toBeNull();
  });

  it('renders all main categories in offcanvas', () => {
    renderWithRouter(<Navbar carrito={emptyCarrito} />);
    
    const categories = ['Hombre', 'Mujer', 'Infantil', 'Ver mi cuenta'];
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeDefined();
    });
  });

  it('toggles submenu visibility when category is clicked', () => {
    renderWithRouter(<Navbar carrito={emptyCarrito} />);
    
    // Initially no submenu items visible
    expect(screen.queryByText('Poleras')).toBeNull();
    
    // Click Hombre category
    fireEvent.click(screen.getByText('Hombre'));
    
    // Submenu items should appear
    expect(screen.getByText('Poleras')).toBeDefined();
    expect(screen.getByText('Pantalones')).toBeDefined();
    expect(screen.getByText('Chaquetas')).toBeDefined();
    expect(screen.getByText('Ver todo')).toBeDefined();
  });

  it('has correct navigation links', () => {
    renderWithRouter(<Navbar carrito={emptyCarrito} />);
    
    // Open Hombre submenu to access links
    fireEvent.click(screen.getByText('Hombre'));
    
    const polerasLink = screen.getByText('Poleras');
    expect(polerasLink.getAttribute('href')).toBe('/hombre?categoria=poleras');
  });

  // NUEVO TEST: Verificar estructura básica sin conflictos
  it('renders without console errors', () => {
    const originalError = console.error;
    console.error = jasmine.createSpy('error');
    
    renderWithRouter(<Navbar carrito={emptyCarrito} />);
    
    expect(console.error).not.toHaveBeenCalled();
    console.error = originalError;
  });
});