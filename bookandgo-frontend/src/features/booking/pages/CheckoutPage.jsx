// src/features/booking/pages/CheckoutPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Lock, 
  AlertCircle,
  Loader2,
  Calendar,
  Users
} from 'lucide-react';
import useCartStore from '../../../store/cartStore';
import useAuthStore from '../../../store/authStore';
import api from '../../../shared/utils/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const total = getTotal();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardData({ ...cardData, expiryDate: formatted });
  };

  const validateCard = () => {
    const errors = [];
    
    const cardNumberDigits = cardData.cardNumber.replace(/\s/g, '');
    if (cardNumberDigits.length !== 16) {
      errors.push('Número de tarjeta debe tener 16 dígitos');
    }

    if (!cardData.cardName.trim()) {
      errors.push('Nombre en la tarjeta es requerido');
    }

    if (cardData.expiryDate.length !== 5) {
      errors.push('Fecha de expiración inválida');
    }

    if (cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      errors.push('CVV debe tener 3 o 4 dígitos');
    }

    return errors;
  };

  const handlePayment = async () => {
    setError(null);

    // Validar tarjeta
    const validationErrors = validateCard();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoading(true);

    try {
      // Simular procesamiento de pago (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Creating bookings...', items); // Debug

      // Crear bookings en el backend
      const bookingPromises = items.map(item => 
        api.post('/bookings', {
          tour_id: item.tour_id,
          booking_date: item.date,
          adults: item.adults,
          children: item.children || 0,
          infants: item.infants || 0,
          special_requests: item.special_requests || '',
          total_price: item.total_price,
          payment_method: paymentMethod,
        })
      );

      const responses = await Promise.all(bookingPromises);
      console.log('Bookings created:', responses); // Debug

      // Limpiar carrito
      clearCart();

      // Redirigir a página de éxito
      navigate('/booking/success', { 
        state: { 
          totalPaid: total,
          bookingsCount: items.length 
        } 
      });

    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err.response?.data?.message || 'Error al procesar el pago. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getCardBrand = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Tarjeta';
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        <h1 className="text-3xl font-black text-gray-900 mb-8">
          Finalizar Reserva
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario de Pago */}
          <div className="lg:col-span-2 space-y-6">
            {/* Métodos de Pago */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Método de Pago
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-all">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-primary"
                  />
                  <CreditCard className="w-6 h-6 text-gray-600" />
                  <span className="font-semibold text-gray-900">
                    Tarjeta de Crédito/Débito
                  </span>
                </label>

                <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-all">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-primary"
                  />
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    P
                  </div>
                  <span className="font-semibold text-gray-900">PayPal</span>
                </label>
              </div>
            </div>

            {/* Formulario de Tarjeta */}
            {paymentMethod === 'card' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Información de la Tarjeta
                </h2>

                {/* Tarjeta Visual */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-8">
                      <div className="text-xs opacity-70 mb-1">Número de Tarjeta</div>
                      <div className="text-xl font-mono tracking-wider">
                        {cardData.cardNumber || '•••• •••• •••• ••••'}
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-70 mb-1">Titular</div>
                        <div className="font-semibold">
                          {cardData.cardName || 'NOMBRE APELLIDO'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs opacity-70 mb-1">Vence</div>
                        <div className="font-mono">
                          {cardData.expiryDate || 'MM/AA'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {getCardBrand(cardData.cardNumber)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Formulario */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-mono"
                      maxLength="19"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre en la Tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardData.cardName}
                      onChange={(e) => setCardData({ ...cardData, cardName: e.target.value.toUpperCase() })}
                      placeholder="JUAN PÉREZ"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fecha de Expiración
                      </label>
                      <input
                        type="text"
                        value={cardData.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-mono"
                        maxLength="5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-mono"
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4" />
                  <span>Tus datos están protegidos y encriptados</span>
                </div>
              </div>
            )}

            {/* PayPal */}
            {paymentMethod === 'paypal' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    P
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Pago con PayPal
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Serás redirigido a PayPal para completar tu pago de forma segura
                  </p>
                  <p className="text-sm text-gray-500">
                    (Esto es una simulación - No se procesará ningún pago real)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Resumen de la Reserva
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {items.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-3">
                      <img
                        src={item.tour_image || 'https://via.placeholder.com/100'}
                        alt={item.tour_title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {item.tour_title}
                        </h4>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString('es-PE', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {item.adults} adulto{item.adults > 1 ? 's' : ''}
                        {item.children > 0 && `, ${item.children} niño${item.children > 1 ? 's' : ''}`}
                        {item.infants > 0 && `, ${item.infants} infante${item.infants > 1 ? 's' : ''}`}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-gray-900">
                        S/. {parseFloat(item.total_price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">S/. {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Impuestos y cargos</span>
                  <span className="font-semibold">S/. 0.00</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-xl font-black text-gray-900">Total</span>
                  <span className="text-2xl font-black text-primary">
                    S/. {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botón de Pago */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pagar S/. {total.toFixed(2)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                ⚠️ Este es un pago simulado. No se procesarán cargos reales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;