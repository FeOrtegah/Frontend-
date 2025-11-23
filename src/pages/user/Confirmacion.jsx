import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Confirmacion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { venta, carrito, total } = location.state || {};

    if (!venta) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning">
                    <h4>No hay información de venta</h4>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card border-success">
                        <div className="card-header bg-success text-white text-center">
                            <h3>✅ ¡Compra Exitosa!</h3>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <h4>Gracias por tu compra</h4>
                                <p className="text-muted">Tu pedido ha sido procesado correctamente</p>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h5>Información de la Venta</h5>
                                    <p><strong>Número de Venta:</strong> {venta.numeroVenta}</p>
                                    <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                                    <p><strong>Estado:</strong> <span className="badge bg-warning">{venta.estado?.nombre || 'PENDIENTE'}</span></p>
                                </div>
                                <div className="col-md-6">
                                    <h5>Método de Pago</h5>
                                    <p>{venta.metodoPago?.nombre || 'Tarjeta'}</p>
                                    <h5>Total</h5>
                                    <h4 className="text-success">${total?.toLocaleString()}</h4>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5>Productos Comprados</h5>
                                {carrito?.map(item => (
                                    <div key={item.id} className="d-flex justify-content-between border-bottom py-2">
                                        <div>
                                            <strong>{item.name}</strong>
                                            <br />
                                            <small className="text-muted">
                                                {item.cantidad} x ${item.price.toLocaleString()}
                                            </small>
                                        </div>
                                        <strong>${(item.price * item.cantidad).toLocaleString()}</strong>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center">
                                <button 
                                    className="btn btn-primary me-2"
                                    onClick={() => navigate('/micuenta')}
                                >
                                    Ver Mis Compras
                                </button>
                                <button 
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/hombre')}
                                >
                                    Seguir Comprando
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmacion;