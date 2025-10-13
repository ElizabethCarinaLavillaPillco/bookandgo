import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import TourCard from '../components/TourCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import api from '../../../shared/utils/api';

const ToursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Estados de filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('from') || '',
    checkOut: searchParams.get('to') || '',
    minPrice: '',
    maxPrice: '',
    category: '',
    rating: '',
    duration: '',
  });

  useEffect(() => {
    fetchTours();
  }, [searchParams]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tours', {
        params: {
          search: searchParams.get('search'),
          location: searchParams.get('location'),
          from: searchParams.get('from'),
          to: searchParams.get('to'),
          min_price: filters.minPrice,
          max_price: filters.maxPrice,
          category_id: filters.category,
          per_page: 15,
        },
      });
      setTours(response.data.data || response.data);
      setTotalResults(response.data.total || response.data.length);
    } catch (error) {
      console.error('Error fetching tours:', error);
      // Datos de ejemplo si falla el backend
      setTours(exampleTours);
      setTotalResults(exampleTours.length);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      checkIn: '',
      checkOut: '',
      minPrice: '',
      maxPrice: '',
      category: '',
      rating: '',
      duration: '',
    });
    setSearchParams({});
  };

  // Tours de ejemplo
  const exampleTours = [
    {
      id: 1,
      title: 'TOUR EN CUATRIMOTO AL VALLE ROJO Y LA MONTAÑA ARCOÍRIS CON COMIDAS INCLUIDAS',
      category: { name: 'Aventura' },
      featured_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      duration_days: 1,
      duration_hours: 0,
      rating: 4.6,
      total_reviews: 28,
      price: 80,
      discount_price: 64,
      location_city: 'Cusco',
      badge: 'Nuestra elección',
    },
    {
      id: 2,
      title: 'CUSCO: TOUR DE MEDIO DÍA POR LA CIUDAD CON SACSAYHUAMÁN Y QENQO',
      category: { name: 'Cultural' },
      featured_image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
      duration_hours: 5,
      rating: 4.6,
      total_reviews: 365,
      price: 72,
      discount_price: 51,
      location_city: 'Cusco',
    },
    {
      id: 3,
      title: 'CUSCO: EXCURSIÓN A CABALLO A LOS TEMPLOS INCAS Y MIRADORES',
      category: { name: 'Aventura' },
      featured_image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800',
      duration_hours: 3.5,
      rating: 0,
      total_reviews: 0,
      price: 60,
      location_city: 'Cusco',
      badge: 'Nueva actividad',
    },
    {
      id: 4,
      title: 'TOUR PRIVADO DE MEDIO DÍA A MACHU PICCHU, PERÚ',
      category: { name: 'Cultural' },
      featured_image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
      duration_hours: 3,
      rating: 4.8,
      total_reviews: 105,
      price: 199,
      location_city: 'Cusco',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de búsqueda superior */}
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="container-custom py-4">
          <SearchBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={applyFilters}
          />
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar de Filtros - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-36">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={applyFilters}
                onClear={clearFilters}
              />
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            {/* Header con resultados y botón de filtros móvil */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                  {filters.location || 'Todas las atracciones'}
                </h1>
                <p className="text-gray-600">
                  {loading ? 'Cargando...' : `${totalResults} experiencias encontradas`}
                </p>
              </div>

              {/* Botón filtros móvil */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-white border-2 border-gray-300 px-4 py-2 rounded-lg hover:border-primary transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
              </button>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-56 bg-gray-200"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tours.length > 0 ? (
              <>
                {/* Grid de Tours */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>

                {/* Botón Ver Más */}
                <div className="text-center mt-12">
                  <button className="bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl">
                    Ver más
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="mb-4">
                  <Search className="w-16 h-16 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar tus filtros o buscar algo diferente
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar de Filtros - Móvil */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold">Filtros</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={() => {
                  applyFilters();
                  setShowFilters(false);
                }}
                onClear={clearFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToursPage;