import { Link } from 'react-router-dom';
import { Trash2, Edit, Calendar, Users, MapPin, Clock, Check, ShoppingBag } from 'lucide-react';
import useCartStore from '../../../store/cartStore';
import './CartPage.css';

const CartPage = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const groupByDate = () => {
    const grouped = {};
    items.forEach(item => {
      const date = item.bookingDate || 'Sin fecha';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  const groupedItems = groupByDate();
  const subtotal = getTotal();
  const discount = subtotal * 0.05; // 5% descuento ejemplo
  const taxes = (subtotal - discount) * 0.18; // IGV 18%
  const total = subtotal - discount + taxes;

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Sin fecha') return 'Sin fecha';
    const date = new Date(dateString);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
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
        <h1 className="cart-title">Carrito</h1>

        {/* Alert de reserva */}
        <div className="cart-alert">
          <Clock size={20} />
          Tu pedido está reservado durante <strong>24:49 minutos.</strong>
        </div>

        <div className="cart-layout">
          {/* Lista de items */}
          <div className="cart-items">
            {Object.entries(groupedItems).map(([date, dateItems]) => (
              <div key={date} className="date-group">
                <h3 className="date-header">{formatDate(date)}</h3>
                
                {dateItems.map((item) => (
                  <div key={item.tour.id} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.tour.featured_image || 'https://via.placeholder.com/150'} 
                        alt={item.tour.title}
                      />
                    </div>

                    <div className="item-details">
                      <div className="item-header">
                        <h4 className="item-title">{item.tour.title}</h4>
                        <div className="item-badges">
                          {item.tour.badge && (
                            <span className="badge badge-yellow">{item.tour.badge}</span>
                          )}
                          <span className="badge badge-orange">Mejor valorado</span>
                        </div>
                      </div>

                      <div className="item-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="star">★</span>
                          ))}
                        </div>
                        <span className="rating-text">
                          {item.tour.rating} ({item.tour.total_reviews})
                        </span>
                      </div>

                      <div className="item-info-list">
                        <div className="info-item">
                          <MapPin size={16} />
                          <span>{item.tour.title.substring(0, 50)}...</span>
                        </div>
                        <div className="info-item">
                          <Calendar size={16} />
                          <span>{formatDate(item.bookingDate)} - {item.bookingDate?.split('T')[1] || '3:30'}</span>
                        </div>
                        <div className="info-item">
                          <Users size={16} />
                          <span>{item.quantity} adulto{item.quantity > 1 ? 's' : ''}</span>
                        </div>
                        <div className="info-item">
                          <span>Idioma: Español</span>
                        </div>
                        <div className="info-item">
                          <Check size={16} className="check-icon" />
                          <span>Cancelación fácil</span>
                        </div>
                      </div>

                      <div className="item-actions">
                        <button className="action-btn">
                          <Edit size={18} />
                          Modificar
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => removeItem(item.tour.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="item-price">
                      {item.tour.discount_price && (
                        <div className="price-old">S/ {(item.tour.price * item.quantity).toFixed(2)}</div>
                      )}
                      <div className="price-current">
                        S/ {((item.tour.discount_price || item.tour.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Resumen de compra */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Subtotal ({items.length} artículo{items.length > 1 ? 's' : ''})</h3>
              
              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="price-strike">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row discount">
                  <span>Descuento (5%)</span>
                  <span className="price-discount">-S/ {discount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>IGV (18%)</span>
                  <span>S/ {taxes.toFixed(2)}</span>
                </div>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <div className="total-price">
                  <div className="price-big">S/ {(subtotal - discount).toFixed(2)}</div>
                  <div className="price-note">Todos las tasas e impuestos incluidos</div>
                </div>
              </div>

              <button className="btn-primary btn-checkout">
                Tramitar pedido
              </button>

              <div className="payment-info">
                <div className="info-box">
                  <Check size={20} className="check-icon" />
                  <div>
                    <strong>No pagues nada hoy</strong>
                    <p>Reserva ahora y paga después</p>
                  </div>
                </div>

                <div className="info-box">
                  <Check size={20} className="check-icon" />
                  <div>
                    <strong>Cancelación fácil</strong>
                    <p>Hasta 24 horas antes de la actividad</p>
                  </div>
                </div>
              </div>

              <div className="why-book">
                <h4>¿Por qué reservar con nosotros?</h4>
                <ul className="benefits-list">
                  <li>
                    <Check size={16} />
                    Pago seguro
                  </li>
                  <li>
                    <Check size={16} />
                    Sin costes ocultos
                  </li>
                  <li>
                    <Check size={16} />
                    Atención al cliente las 24 h en todo el mundo
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