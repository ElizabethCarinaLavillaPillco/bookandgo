import { Link } from 'react-router-dom';
import { Heart, Star, Clock } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../../store/authStore';

const TourCard = ({ tour }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleFavorite = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Redirigir a login
      return;
    }
    setIsFavorite(!isFavorite);
    // Aquí iría la lógica para agregar/quitar de favoritos en el backend
  };

  const discount = tour.discount_price
    ? Math.round(((tour.price - tour.discount_price) / tour.price) * 100)
    : 0;

  return (
    <Link
      to={`/tours/${tour.id}`}
      className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
    >
      {/* Imagen */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={tour.featured_image || 'https://via.placeholder.com/400x300'}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badge especial (Nuestra elección, Nueva actividad, etc.) */}
        {tour.badge && (
          <div className="absolute top-4 left-4 bg-gray-900 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-lg">
            {tour.badge}
          </div>
        )}

        {/* Badge de descuento */}
        {discount > 0 && (
          <div className="absolute top-4 right-14 bg-secondary text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg">
            -{discount}%
          </div>
        )}

        {/* Botón de favorito */}
        <button
          onClick={handleFavorite}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Categoría */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase">
            {tour.category?.name || 'Excursión de 1 día'}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors uppercase">
          {tour.title}
        </h3>

        {/* Duración */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {tour.duration_days > 0
              ? `${tour.duration_days} ${tour.duration_days === 1 ? 'día' : 'días'}`
              : `${tour.duration_hours} horas`}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(tour.rating)
                    ? 'fill-primary text-primary'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {tour.rating?.toFixed(1)} ({tour.total_reviews || 0})
          </span>
        </div>

        {/* Precio */}
        <div className="border-t pt-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Desde</p>
              {tour.discount_price ? (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    S/. {tour.price?.toFixed(2)}
                  </p>
                  <p className="text-2xl font-black text-red-600">
                    S/. {tour.discount_price?.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-black text-gray-900">
                  S/. {tour.price?.toFixed(2)}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">por persona</p>
            </div>

            {/* Indicador de hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-primary text-gray-900 p-2 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;