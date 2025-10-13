import { Shield, Gift, Calendar } from 'lucide-react';

const WhyUsSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Tus Mejores Aliados',
      description:
        'Trabajamos con las agencias más confiables y verificadas del Perú. Tu seguridad y satisfacción son nuestra prioridad.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Gift,
      title: 'Gana Recompensas',
      description:
        'Acumula puntos con cada reserva y canjéalos por descuentos exclusivos en tus próximas aventuras.',
      color: 'from-primary to-secondary',
    },
    {
      icon: Calendar,
      title: 'Planifica a tu Manera',
      description:
        'Reserva con flexibilidad, modifica tus planes cuando lo necesites y disfruta sin preocupaciones.',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Título */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            ¿Por qué reservar con nosotros?
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Icono con gradiente */}
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                {/* Línea decorativa */}
                <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;