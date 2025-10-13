import { Link } from 'react-router-dom';
import { MapPin, TrendingUp } from 'lucide-react';

const PopularLocationsSection = () => {
  const locations = [
    {
      name: 'Cusco',
      image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
      experiences: 145,
    },
    {
      name: 'Lima',
      image: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800',
      experiences: 98,
    },
    {
      name: 'Arequipa',
      image: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800',
      experiences: 67,
    },
    {
      name: 'Paracas',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      experiences: 52,
    },
    {
      name: 'Iquitos',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
      experiences: 41,
    },
    {
      name: 'Puno',
      image: 'https://images.unsplash.com/photo-1589986966641-e8c2c7a35fbb?w=800',
      experiences: 38,
    },
    {
      name: 'Huaraz',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      experiences: 34,
    },
    {
      name: 'Trujillo',
      image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800',
      experiences: 29,
    },
    {
      name: 'Chiclayo',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      experiences: 25,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Título */}
        <div className="flex items-center gap-3 mb-12 animate-fade-in">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
            Lugares más visitados
          </h2>
        </div>

        {/* Grid de ubicaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <Link
                key={index}
                to={`/tours?location=${location.name}`}
                className="group flex items-center gap-4 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
            >

              {/* Imagen */}
              <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Contenido */}
              <div className="flex-1 pr-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {location.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {location.experiences} experiencias encontradas
                  </span>
                </div>

                {/* Indicador de hover */}
                <div className="mt-3 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-semibold">Ver tours</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
            </Link>
          ))}
        </div>

        {/* Botón Ver Más */}
        <div className="text-center mt-12">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-primary text-white hover:text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver todos los destinos
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
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularLocationsSection;