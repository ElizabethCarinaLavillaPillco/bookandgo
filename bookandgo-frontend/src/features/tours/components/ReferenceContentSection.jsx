import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, MapPin, Globe2 } from 'lucide-react';

const ReferenceContentSection = () => {
  const [activeTab, setActiveTab] = useState('attractions');

  const tabs = [
    {
      id: 'attractions',
      label: 'Atracciones Turísticas más Populares',
      icon: Landmark,
    },
    {
      id: 'destinations',
      label: 'Destinos más Populares',
      icon: MapPin,
    },
    {
      id: 'countries',
      label: 'Países más Populares',
      icon: Globe2,
    },
  ];

  const content = {
    attractions: [
      { name: 'Machu Picchu', count: 45 },
      { name: 'Líneas de Nazca', count: 23 },
      { name: 'Lago Titicaca', count: 31 },
      { name: 'Cañón del Colca', count: 28 },
      { name: 'Islas Ballestas', count: 19 },
      { name: 'Chan Chan', count: 12 },
      { name: 'Kuelap', count: 15 },
      { name: 'Sacsayhuamán', count: 38 },
      { name: 'Valle Sagrado', count: 42 },
      { name: 'Paracas', count: 27 },
      { name: 'Huacachina', count: 18 },
      { name: 'Montaña de 7 Colores', count: 56 },
      { name: 'Sillustani', count: 14 },
      { name: 'Gocta', count: 11 },
      { name: 'Reserva Nacional de Tambopata', count: 22 },
    ],
    destinations: [
      { name: 'Cusco', count: 145 },
      { name: 'Lima', count: 98 },
      { name: 'Arequipa', count: 67 },
      { name: 'Paracas', count: 52 },
      { name: 'Iquitos', count: 41 },
      { name: 'Puno', count: 38 },
      { name: 'Huaraz', count: 34 },
      { name: 'Trujillo', count: 29 },
      { name: 'Chiclayo', count: 25 },
      { name: 'Ayacucho', count: 21 },
      { name: 'Cajamarca', count: 19 },
      { name: 'Máncora', count: 33 },
      { name: 'Puerto Maldonado', count: 28 },
      { name: 'Huancayo', count: 17 },
      { name: 'Tarapoto', count: 24 },
    ],
    countries: [
      { name: 'Perú', count: 567 },
      { name: 'México', count: 423 },
      { name: 'Argentina', count: 389 },
      { name: 'Colombia', count: 356 },
      { name: 'Chile', count: 298 },
      { name: 'Brasil', count: 445 },
      { name: 'Ecuador', count: 234 },
      { name: 'Bolivia', count: 189 },
      { name: 'Uruguay', count: 145 },
      { name: 'Paraguay', count: 98 },
      { name: 'Venezuela', count: 167 },
      { name: 'Costa Rica', count: 278 },
      { name: 'Panamá', count: 156 },
      { name: 'Guatemala', count: 134 },
      { name: 'Cuba', count: 201 },
    ],
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Título */}
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 text-center animate-fade-in">
          Contenido Referencial
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-gray-900 shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-gray-900' : 'text-primary'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de contenido */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
          {content[activeTab].map((item, index) => (
            <Link
              key={index}
              to={`/tours?${activeTab === 'countries' ? 'country' : 'location'}=${item.name}`}
              className="group bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-primary"
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500">
                {item.count} {item.count === 1 ? 'tour' : 'tours'} y actividades
              </p>

              {/* Indicador de hover */}
              <div className="mt-3 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"></div>
            </Link>
          ))}
        </div>

        {/* Ver más */}
        <div className="text-center mt-12">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-primary text-white hover:text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explorar todos los destinos
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

export default ReferenceContentSection;