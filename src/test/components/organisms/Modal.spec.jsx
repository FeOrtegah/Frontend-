import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalComponent from '../../../components/organisms/Modal';

const STABLE_INPUTS_CONFIG = [
  {
    name: 'title',
    type: 'text',
    placeholder: 'Título',
    required: true,
    label: 'Título del elemento'
  },
  {
    name: 'description', 
    type: 'textarea',
    placeholder: 'Descripción',
    required: false
  }
];

describe('ModalComponent', () => {
  let mockOnClose;
  let mockOnSubmit;

  beforeEach(() => {
    mockOnClose = jasmine.createSpy('onClose');
    mockOnSubmit = jasmine.createSpy('onSubmit');
  });

  afterEach(() => {
    mockOnClose.calls.reset();
    mockOnSubmit.calls.reset();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <ModalComponent
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        inputsConfig={STABLE_INPUTS_CONFIG}
      />
    );

    expect(screen.getByText('Crear Nuevo Elemento')).toBeDefined();
    expect(screen.getByPlaceholderText('Título')).toBeDefined();
    expect(screen.getByPlaceholderText('Descripción')).toBeDefined();
  });

  it('does not render modal when isOpen is false', () => {
    render(
      <ModalComponent
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        inputsConfig={STABLE_INPUTS_CONFIG}
      />
    );

    expect(screen.queryByText('Crear Nuevo Elemento')).toBeNull();
  });

  it('renders custom title and submit text', () => {
    render(
      <ModalComponent
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        inputsConfig={STABLE_INPUTS_CONFIG}
        title="Editar Elemento"
        submitText="Actualizar"
      />
    );

    expect(screen.getByText('Editar Elemento')).toBeDefined();
    expect(screen.getByText('Actualizar')).toBeDefined();
  });

  it('handles input changes', () => {
    render(
      <ModalComponent
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        inputsConfig={STABLE_INPUTS_CONFIG}
      />
    );

    const titleInput = screen.getByPlaceholderText('Título');
    fireEvent.change(titleInput, { target: { value: 'Nuevo título' } });

    expect(titleInput.value).toBe('Nuevo título');
  });

  it('shows required field indicator', () => {
    render(
      <ModalComponent
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        inputsConfig={STABLE_INPUTS_CONFIG}
      />
    );

    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeDefined();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <ModalComponent
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        inputsConfig={STABLE_INPUTS_CONFIG}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
