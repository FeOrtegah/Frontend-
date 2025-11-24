// src/components/organisms/Modal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const ModalComponent = ({
  isOpen,
  onClose,
  onSubmit,
  inputsConfig,
  title = "Crear Nuevo Elemento",
  submitText = "Crear",
  loading = false,
  initialData = {}
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initialFormData = {};
      inputsConfig.forEach(input => {
        initialFormData[input.name] = initialData[input.name] || 
          (input.type === 'checkbox' ? false : '');
      });
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen, inputsConfig, initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    inputsConfig.forEach(input => {
      if (input.required && !formData[input.name]) {
        newErrors[input.name] = `${input.placeholder || input.name} es requerido`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const renderInput = (input) => {
    const commonProps = {
      name: input.name,
      value: formData[input.name] || '',
      onChange: handleInputChange,
      className: input.className || '',
      required: input.required,
      disabled: loading
    };

    switch (input.type) {
      case 'textarea':
        return (
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={input.placeholder}
            {...commonProps}
          />
        );

      case 'select':
        return (
          <Form.Select {...commonProps}>
            <option value="">Selecciona una opción</option>
            {input.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );

      case 'checkbox':
        return (
          <Form.Check
            type="checkbox"
            label={input.label}
            checked={formData[input.name] || false}
            onChange={handleInputChange}
            name={input.name}
            disabled={loading}
          />
        );

      case 'number':
        return (
          <Form.Control
            type="number"
            placeholder={input.placeholder}
            {...commonProps}
          />
        );

      case 'url':
        return (
          <Form.Control
            type="url"
            placeholder={input.placeholder}
            {...commonProps}
          />
        );

      default:
        return (
          <Form.Control
            type="text"
            placeholder={input.placeholder}
            {...commonProps}
          />
        );
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger">
              Por favor, completa todos los campos requeridos correctamente.
            </Alert>
          )}

          <div className="row">
            {inputsConfig.map((input) => (
              <div 
                key={input.name} 
                className={input.fullWidth ? 'col-12' : 'col-md-6'}
              >
                <Form.Group className="mb-3">
                  <Form.Label>
                    {input.label || input.placeholder}
                    {input.required && <span className="text-danger"> *</span>}
                  </Form.Label>
                  {renderInput(input)}
                  {errors[input.name] && (
                    <Form.Text className="text-danger">
                      {errors[input.name]}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Creando...
              </>
            ) : (
              submitText
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// ✅ Asegúrate de que tenga export default
export default ModalComponent;