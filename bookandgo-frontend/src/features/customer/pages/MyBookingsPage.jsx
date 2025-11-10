// src/features/customer/pages/MyBookingsPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Download,
  Eye
} from 'lucide-react';
import api from '../../../shared/utils/api';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: Clock,
        text: 'Pendiente',
        class: 'bg-yellow-100 text-yellow-700',
      },
      confirmed: {
        icon: CheckCircle,
        text: 'Confirmado',
        class: 'bg-green-100 text-green-700',
      },
      completed: {
        icon: CheckCircle,
        text: 'Completado',
        class: 'bg-blue-100 text-blue-700',
      },
      cancelled: {
        icon: XCircle,
        text: 'Cancelado',
        class: 'bg-red-100 text-red-700',
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();

    switch (filter) {
      case 'upcoming':
        return bookingDate >= today && booking.status !== 'cancelled';
      case 'past':
        return bookingDate < today || booking.status === 'completed';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-gray-600">
            Gestiona y revisa todas tus experiencias reservadas
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-primary text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({bookings.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                filter === 'upcoming'
                  ? 'bg-primary text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Próximas
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                filter === 'past'
                  ? 'bg-primary text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pasadas
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                filter === 'cancelled'
                  ? 'bg-primary text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Canceladas
            </button>
          </div>
        </div>

        {/* Lista de Reservas */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No hay reservas
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Aún no has reservado ninguna experiencia'
                : `No tienes reservas ${filter === 'upcoming' ? 'próximas' : filter === 'past' ? 'pasadas' : 'canceladas'}`
              }
            </p>
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 bg-gradient-primary text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gradient-secondary transition-all"
            >
              Explorar Tours
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Imagen */}
                    <div className="lg:w-64 flex-shrink-0">
                      <img
                        src={booking.tour?.featured_image || 'https://via.placeholder.com/400x300'}
                        alt={booking.tour?.title}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    </div>

                    {/* Información */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {booking.tour?.title}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Total pagado</p>
                          <p className="text-2xl font-black text-primary">
                            S/. {parseFloat(booking.total_price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Detalles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span>
                            {new Date(booking.booking_date).toLocaleDateString('es-PE', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="w-5 h-5 text-primary" />
                          <span>
                            {booking.adults} adulto{booking.adults > 1 ? 's' : ''}
                            {booking.children > 0 && `, ${booking.children} niño${booking.children > 1 ? 's' : ''}`}
                            {booking.infants > 0 && `, ${booking.infants} infante${booking.infants > 1 ? 's' : ''}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span>
                            {booking.tour?.location_city}, {booking.tour?.location_region}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-5 h-5 text-primary" />
                          <span>
                            Código: #{booking.id.toString().padStart(6, '0')}
                          </span>
                        </div>
                      </div>

                      {/* Solicitudes especiales */}
                      {booking.special_requests && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg mb-4">
                          <p className="text-sm text-blue-800">
                            <strong>Solicitud especial:</strong> {booking.special_requests}
                          </p>
                        </div>
                      )}

                      {/* Acciones */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/tours/${booking.tour_id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Tour
                        </Link>

                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-all">
                          <Download className="w-4 h-4" />
                          Descargar
                        </button>

                        {booking.status === 'confirmed' && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-gray-900 font-semibold rounded-xl transition-all">
                            <MessageSquare className="w-4 h-4" />
                            Contactar
                          </button>
                        )}

                        {booking.status === 'confirmed' && new Date(booking.booking_date) > new Date() && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all">
                            <XCircle className="w-4 h-4" />
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline (para reservas confirmadas próximas) */}
                {booking.status === 'confirmed' && new Date(booking.booking_date) > new Date() && (
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Faltan {Math.ceil((new Date(booking.booking_date) - new Date()) / (1000 * 60 * 60 * 24))} días
                        </p>
                        <p className="text-sm text-gray-600">
                          El operador se pondrá en contacto 48 horas antes
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;