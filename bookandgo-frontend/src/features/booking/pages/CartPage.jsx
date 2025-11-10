// src/features/booking/pages/CartPage.jsx

import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Calendar, Users, MapPin, Clock, Check, ShoppingBag, AlertCircle } from 'lucide-react';
import useCartStore from '../../../store/cartStore';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, getTotal } = useCartStore();

  // Calcular totales
  const subtotal = getTotal();
  const discount = 0; // Sin descuento por ahora
  const taxes = 0; // Sin impuestos por ahora
  const total = subtotal - discount + taxes;

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container-custom">
          <div className="empty-state">
            <ShoppingBag size={80} className="empty-icon" />
            <h2>Tu carrito está vacío</h2>
            <p>Explora nuestros tours y comienza a planificar tu próxima aventura</p>
            <Link to="/tours" className="btn-primary">
              Explorar Tours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h1 className="cart-title">Carrito de Compras</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-semibold"
          >
            Limpiar carrito
          </button>
        </div>

        {/* Alert de reserva */}
        <div className="cart-alert">
          <Clock size={20} />
          <span>Completa tu reserva para asegurar tu lugar</span>
        </div>

        <div className="cart-layout">
          {/* Lista de items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.tour_image || 'https://via.placeholder.com/150'} 
                    alt={item.tour_title}
                  />
                </div>

                <div className="item-details">
                  <div className="item-header">
                    <h4 className="item-title">{item.tour_title}</h4>
                  </div>

                  <div className="item-info-list">
                    <div className="info-item">
                      <Calendar size={16} />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <div className="info-item">
                      <Users size={16} />
                      <span>
                        {item.adults} adulto{item.adults > 1 ? 's' : ''}
                        {item.children > 0 && `, ${item.children} niño${item.children > 1 ? 's' : ''}`}
                        {item.infants > 0 && `, ${item.infants} infante${item.infants > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    {item.special_requests && (
                      <div className="info-item">
                        <AlertCircle size={16} />
                        <span className="text-sm text-gray-600">
                          Solicitud especial: {item.special_requests}
                        </span>
                      </div>
                    )}
                    <div className="info-item">
                      <Check size={16} className="check-icon" />
                      <span>Cancelación gratuita</span>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button 
                      className="action-btn delete"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={18} />
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="item-price">
                  <div className="price-current">
                    S/. {item.total_price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen de compra */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen del Pedido</h3>
              
              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'tour' : 'tours'})</span>
                  <span>S/. {subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Descuento</span>
                    <span className="price-discount">-S/. {discount.toFixed(2)}</span>
                  </div>
                )}

                {taxes > 0 && (
                  <div className="summary-row">
                    <span>Impuestos</span>
                    <span>S/. {taxes.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="summary-total">
                <span>Total</span>
                <div className="total-price">
                  <div className="price-big">S/. {total.toFixed(2)}</div>
                  <div className="price-note">Todos los cargos incluidos</div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="btn-primary btn-checkout"
              >
                Proceder al Pago
              </button>

              <div className="payment-info">
                <div className="info-box">
                  <Check size={20} className="check-icon" />
                  <div>
                    <strong>Pago Seguro</strong>
                    <p>Tus datos están protegidos</p>
                  </div>
                </div>

                <div className="info-box">
                  <Check size={20} className="check-icon" />
                  <div>
                    <strong>Cancelación Flexible</strong>
                    <p>Hasta 24 horas antes</p>
                  </div>
                </div>
              </div>

              <div className="why-book">
                <h4>¿Por qué reservar con nosotros?</h4>
                <ul className="benefits-list">
                  <li>
                    <Check size={16} />
                    Pago 100% seguro
                  </li>
                  <li>
                    <Check size={16} />
                    Mejor precio garantizado
                  </li>
                  <li>
                    <Check size={16} />
                    Atención al cliente 24/7
                  </li>
                  <li>
                    <Check size={16} />
                    Confirmación instantánea
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;