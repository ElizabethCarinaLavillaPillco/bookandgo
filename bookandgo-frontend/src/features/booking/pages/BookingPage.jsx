// src/features/booking/pages/BookingPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  AlertCircle,
  ShoppingCart,
  ArrowLeft
} from 'lucide-react';
import api from '../../../shared/utils/api';
import useCartStore from '../../../store/cartStore';
import useAuthStore from '../../../store/authStore';
import DateSelector from '../components/DateSelector';
import GuestSelector from '../components/GuestSelector';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [bookingData, setBookingData] = useState({
    date: '',
    adults: 2,
    children: 0,
    infants: 0,
    specialRequests: '',
  });

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      const response = await api.get(`/tours/${id}`);
      setTour(response.data);
    } catch (error) {
      console.error('Error fetching tour:', error);
      setError('Error al cargar el tour');
    } finally {
      setLoading(false);
    }
  };

  const totalGuests = bookingData.adults + bookingData.children;
  
  const calculatePrice = () => {
    if (!tour) return 0;
    const basePrice = parseFloat(tour.discount_price || tour.price);
    // Adultos: precio completo, Niños: 50%, Infantes: gratis
    const total = (basePrice * bookingData.adults) + (basePrice * 0.5 * bookingData.children);
    return total;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${id}` } });
      return;
    }

    if (!bookingData.date) {
      setError('Por favor selecciona una fecha');
      return;
    }

    if (totalGuests < tour.min_people) {
      setError(`Mínimo ${tour.min_people} personas requeridas`);
      return;
    }

    if (totalGuests > tour.max_people) {
      setError(`Máximo ${tour.max_people} personas permitidas`);
      return;
    }

    const cartItem = {
      tour_id: tour.id,
      tour_title: tour.title,
      tour_image: tour.featured_image,
      date: bookingData.date,
      adults: bookingData.adults,
      children: bookingData.children,
      infants: bookingData.infants,
      special_requests: bookingData.specialRequests,
      price_per_adult: parseFloat(tour.discount_price || tour.price),
      total_price: calculatePrice(),
    };

    console.log('Adding to cart:', cartItem); // Debug
    addItem(cartItem);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour no encontrado</h2>
          <button
            onClick={() => navigate('/tours')}
            className="btn-primary"
          >
            Ver todos los tours
          </button>
        </div>
      </div>
    );
  }

  const basePrice = parseFloat(tour.discount_price || tour.price);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(`/tours/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al tour
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-black text-gray-900 mb-6">
                Reserva tu Experiencia
              </h1>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Selector de Fecha */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  <Calendar className="w-5 h-5 inline mr-2 text-primary" />
                  Selecciona la fecha
                </label>
                <DateSelector
                  value={bookingData.date}
                  onChange={(date) => {
                    setBookingData({ ...bookingData, date });
                    setError(null); // Limpiar error al seleccionar fecha
                  }}
                  minDate={new Date()}
                />
              </div>

              {/* Selector de Huéspedes */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  <Users className="w-5 h-5 inline mr-2 text-primary" />
                  Número de personas
                </label>
                <GuestSelector
                  adults={bookingData.adults}
                  children={bookingData.children}
                  infants={bookingData.infants}
                  minPeople={tour.min_people}
                  maxPeople={tour.max_people}
                  onAdultsChange={(adults) => {
                    setBookingData({ ...bookingData, adults });
                    setError(null);
                  }}
                  onChildrenChange={(children) => {
                    setBookingData({ ...bookingData, children });
                    setError(null);
                  }}
                  onInfantsChange={(infants) => {
                    setBookingData({ ...bookingData, infants });
                  }}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Capacidad: {tour.min_people} - {tour.max_people} personas
                </p>
              </div>

              {/* Solicitudes Especiales */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  Solicitudes Especiales (Opcional)
                </label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
                  placeholder="Ej: Restricciones dietéticas, necesidades de accesibilidad, celebración especial..."
                />
              </div>

              {/* Info del Tour */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                <h3 className="font-bold text-gray-900 mb-4">Información del Tour</h3>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>
                    Duración: 
                    {tour.duration_days > 0 && ` ${tour.duration_days} día${tour.duration_days > 1 ? 's' : ''}`}
                    {tour.duration_days > 0 && tour.duration_hours > 0 && ' y'}
                    {tour.duration_hours > 0 && ` ${tour.duration_hours} hora${tour.duration_hours > 1 ? 's' : ''}`}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{tour.location_city}, {tour.location_region}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-primary" />
                  <span>
                    Dificultad: {
                      tour.difficulty_level === 'easy' ? 'Fácil' : 
                      tour.difficulty_level === 'moderate' ? 'Moderado' : 
                      'Difícil'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Imagen del Tour */}
              <img
                src={tour.featured_image || 'https://via.placeholder.com/400x300'}
                alt={tour.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />

              <h3 className="font-bold text-gray-900 text-lg mb-4">
                {tour.title}
              </h3>

              {/* Desglose de Precios */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {bookingData.adults > 0 && (
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span>
                      S/. {basePrice.toFixed(2)} x {bookingData.adults} adulto{bookingData.adults > 1 ? 's' : ''}
                    </span>
                    <span className="font-semibold">
                      S/. {(basePrice * bookingData.adults).toFixed(2)}
                    </span>
                  </div>
                )}
                
                {bookingData.children > 0 && (
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span>
                      S/. {(basePrice * 0.5).toFixed(2)} x {bookingData.children} niño{bookingData.children > 1 ? 's' : ''}
                    </span>
                    <span className="font-semibold">
                      S/. {(basePrice * 0.5 * bookingData.children).toFixed(2)}
                    </span>
                  </div>
                )}

                {bookingData.infants > 0 && (
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span>{bookingData.infants} infante{bookingData.infants > 1 ? 's' : ''}</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-black text-gray-900">Total</span>
                <span className="text-3xl font-black text-primary">
                  S/. {calculatePrice().toFixed(2)}
                </span>
              </div>

              {/* Botón Agregar al Carrito */}
              <button
                onClick={handleAddToCart}
                disabled={!bookingData.date || loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Agregar al Carrito
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Cancelación gratuita hasta {tour.cancellation_hours} horas antes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;