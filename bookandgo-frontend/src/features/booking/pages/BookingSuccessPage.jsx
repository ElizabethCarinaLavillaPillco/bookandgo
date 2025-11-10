// src/features/booking/pages/BookingSuccessPage.jsx

import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Download, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPaid, bookingsCount } = location.state || {};

  useEffect(() => {
    // Si no hay datos de pago, redirigir
    if (!totalPaid) {
      navigate('/');
      return;
    }

    // Lanzar confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [totalPaid, navigate]);

  if (!totalPaid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-16">
      <div className="container-custom max-w-3xl">
        {/* Animación de éxito */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 animate-bounce-slow">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            ¡Reserva Confirmada! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Tu pago ha sido procesado exitosamente
          </p>
          
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold text-lg">
            <CheckCircle className="w-5 h-5" />
            Pago completado: S/. {totalPaid.toFixed(2)}
          </div>
        </div>

        {/* Tarjeta de confirmación */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 animate-slide-up">
          <div className="text-center mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¿Qué sigue?
            </h2>
            <p className="text-gray-600">
              Hemos enviado la confirmación a tu correo electrónico
            </p>
          </div>

          {/* Información de la reserva */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Confirmación enviada
                </h3>
                <p className="text-sm text-gray-600">
                  Revisa tu correo electrónico para ver los detalles completos de tu reserva
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Prepara tu viaje
                </h3>
                <p className="text-sm text-gray-600">
                  El operador turístico se pondrá en contacto contigo 48 horas antes del tour
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Disfruta tu experiencia
                </h3>
                <p className="text-sm text-gray-600">
                  Llega 15 minutos antes del punto de encuentro con tu confirmación
                </p>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Resumen de tu reserva</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Número de tours:</span>
                <span className="font-semibold text-gray-900">{bookingsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total pagado:</span>
                <span className="font-semibold text-gray-900">S/. {totalPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Método de pago:</span>
                <span className="font-semibold text-gray-900">Tarjeta de crédito</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Confirmado
                </span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/profile/bookings"
              className="flex items-center justify-center gap-2 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-5 h-5" />
              Ver mis reservas
            </Link>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-900 font-bold px-6 py-4 rounded-xl hover:bg-gray-50 transition-all"
            >
              <Download className="w-5 h-5" />
              Descargar confirmación
            </button>
          </div>
        </div>

        {/* Acciones adicionales */}
        <div className="text-center space-y-4">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            Explorar más experiencias
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? Contacta a nuestro equipo de soporte
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;