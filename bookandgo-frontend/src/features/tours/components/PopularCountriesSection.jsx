import { useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

const PopularCountriesSection = () => {
  const scrollRef = useRef(null);

  const countries = [
    {
      name: 'Perú',
      image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600',
    },
    {
      name: 'México',
      image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600',
    },
    {
      name: 'Argentina',
      image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600',
    },
    {
      name: 'Colombia',
      image: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=600',
    },
    {
      name: 'Chile',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
    },
    {
      name: 'Brasil',
      image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',
    },
  ];

  // Duplicar el array para crear un loop infinito
  const duplicatedCountries = [...countries, ...countries, ...countries];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Velocidad del scroll automático

    const autoScroll = () => {
      scrollPosition += scrollSpeed;
      scrollContainer.scrollLeft = scrollPosition;

      // Reset cuando llegue al final del primer set
      if (scrollPosition >= scrollContainer.scrollWidth / 3) {
        scrollPosition = 0;
      }

      requestAnimationFrame(autoScroll);
    };

    const animationFrame = requestAnimationFrame(autoScroll);

    // Pausar scroll al hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrame);
    };

    const handleMouseLeave = () => {
      requestAnimationFrame(autoScroll);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom">
        {/* Título */}
        <div className="flex items-center gap-3 mb-12 animate-fade-in">
          <Globe className="w-8 h-8 text-primary" />
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
            Países más populares
          </h2>
        </div>

        {/* Carrusel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedCountries.map((country, index) => (
            <div
              key={`${country.name}-${index}`}
              className="flex-shrink-0 w-80 group cursor-pointer"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Imagen */}
                <img
                  src={country.image}
                  alt={country.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                {/* Nombre del país */}
                <div className="absolute top-6 left-6">
                  <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                    <h3 className="text-white font-bold text-2xl">{country.name}</h3>
                  </div>
                </div>

                {/* Botón de acción (aparece al hover) */}
                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-primary hover:bg-primary-dark text-gray-900 font-bold py-4 rounded-xl transition-all">
                    Explorar destinos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicador de scroll */}
        <div className="flex justify-center gap-2 mt-8">
          {countries.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default PopularCountriesSection;