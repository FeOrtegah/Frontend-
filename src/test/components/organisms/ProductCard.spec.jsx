import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import ProductCard from '../../../components/organisms/ProductCard';

// Componente envolvente para mockear useNavigate
const MockRouter = ({ children, mockNavigate }) => {
  const router = createMemoryRouter(
    [{ path: '*', element: children }],
    { initialEntries: ['/'] }
  );
  router.navigate = mockNavigate; // Inyectamos el mock de navigate
  return <RouterProvider router={router} />;
};

describe('ProductCard Component', () => {
  const mockNavigate = jasmine.createSpy('navigate');

  const mockProduct = {
    id: 1,
    name: 'Producto Test',
    description: 'Descripción test',
    price: 10000,
    image: 'test.jpg',
  };

  it('renderiza el título del producto', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard product={mockProduct} />
      </MockRouter>
    );
    expect(screen.getByText(mockProduct.name)).toBeTruthy();
  });

  it('renderiza la descripción del producto', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard product={mockProduct} />
      </MockRouter>
    );
    // Ignora espacios y saltos de línea
    expect(
      screen.getByText((content) =>
        content.replace(/\s/g, '').includes(mockProduct.description.replace(/\s/g, ''))
      )
    ).toBeTruthy();
  });

  it('renderiza el precio del producto', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard product={mockProduct} />
      </MockRouter>
    );
    const precioFormateado = `$${mockProduct.price.toLocaleString()}`;
    expect(
      screen.getByText((content) =>
        content.replace(/\s/g, '').includes(precioFormateado.replace(/\s/g, ''))
      )
    ).toBeTruthy();
  });

  it('renderiza la imagen del producto', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard product={mockProduct} />
      </MockRouter>
    );
    // Corregido: React-Bootstrap Card.Img no establece alt, buscamos por role y src
    const image = screen.getByRole('img');
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe(mockProduct.image);
  });

  it('renderiza el botón de detalles', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard product={mockProduct} />
      </MockRouter>
    );
    // Corregido: buscar botón por role y texto (insensible a mayúsculas/minúsculas)
    const button = screen.getByRole('button', { name: /ver detalle/i });
    expect(button).toBeTruthy();
    expect(button).toHaveClass('btn-dark');
  });

  it('navega a detalles al hacer click en el botón', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard product={mockProduct} />
      </MockRouter>
    );
    const button = screen.getByRole('button', { name: /ver detalle/i });
    fireEvent.click(button);
    // Comprobamos href del <a> envolvente
    const link = button.closest('a');
    expect(link.getAttribute('href')).toBe(`/producto/${mockProduct.id}`);
  });
});
