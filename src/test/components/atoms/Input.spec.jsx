import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from '../../../components/atoms/Input';

describe('Input Component', () => {
  it('renders text input by default', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDefined();
    expect(input.type).toBe('text');
  });

  it('renders different input types correctly', () => {
    const { rerender } = render(<Input type="email" />);
    
    let input = screen.getByRole('textbox');
    expect(input.type).toBe('email');

    // Usar getByRole para password también
    rerender(<Input type="password" />);
    input = screen.getByDisplayValue(''); // Buscar por valor vacío
    expect(input.type).toBe('password');
  });

  it('applies custom className', () => {
    const customClass = 'custom-input-class';
    
    render(<Input className={customClass} />);
    
    const input = screen.getByRole('textbox');
    expect(input.className).toContain(customClass);
  });

  it('passes additional props to Form.Control', () => {
    const placeholder = 'Enter text here';
    const disabled = true;
    
    render(
      <Input 
        placeholder={placeholder} 
        disabled={disabled}
        data-testid="custom-input"
      />
    );
    
    const input = screen.getByTestId('custom-input');
    expect(input.placeholder).toBe(placeholder);
    expect(input.disabled).toBe(true);
  });

  it('renders textarea when type is textarea', () => {
    render(<Input type="textarea" />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
  });
});