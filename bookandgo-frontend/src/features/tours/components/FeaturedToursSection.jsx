import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import TourCard from './TourCard';
import api from '../../../shared/utils/api';

const FeaturedToursSection = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        const response = await api.get('/tours/featured');
        setTours(response.data.slice(0, 10)); // Mostrar solo 10 tours
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  // Data de ejemplo por si falla el backend
  const exampleTours = [
    {
      id: 1,
      title: 'RUTA AL VALLE DEL COLCA Y DOMA...',
      category: { name: 'Aventura' },
      featured_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      duration_days: 0,
      duration_hours: 9,
      rating: 4.5,
      total_reviews: 50,
      price: 500,
      discount_price: 420,
    },
    {
      id: 2,
      title: 'CAMINO INCA CLÁSICO 4 DÍAS',
      category: { name: 'Aventura' },
      featured_image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
      duration_days: 4,
      duration_hours: 0,
      rating: 4.9,
      total_reviews: 87,
      price: 650,
      discount_price: 580,
    },
    // Agregar más tours de ejemplo...
  ];

  const displayTours = tours.length > 0 ? tours : exampleTours;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando experiencias...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Título */}
        <div className="flex items-center gap-3 mb-12 animate-fade-in">
          <Sparkles className="w-8 h-8 text-primary" />
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
            Experiencias más buscadas
          </h2>
        </div>

        {/* Grid de tours - 2 filas x 5 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {displayTours.map((tour, index) => (
            <div
              key={tour.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <TourCard tour={tour} />
            </div>
          ))}
        </div>

        {/* Ver más */}
        <div className="text-center mt-12">
          <a
            href="/tours"
            className="inline-flex items-center gap-2 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver todas las experiencias
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedToursSection;