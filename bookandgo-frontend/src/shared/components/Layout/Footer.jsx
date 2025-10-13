import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Clock 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Columna 1: Marca */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-xl font-black text-gray-900">B&G</span>
              </div>
              <span className="text-xl font-black text-white">
                BOOK<span className="text-primary">&</span>GO
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Tu marketplace de viajes confiable. Conectamos turistas con las mejores agencias para crear experiencias inolvidables.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-all group"
              >
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-all group"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-all group"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-all group"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
              </a>
            </div>
          </div>

          {/* Columna 2: Links Rápidos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Acerca de Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Servicios
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Políticas y Términos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Políticas y Términos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/payments"
                  className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Pagos con Tarjeta
                </Link>
              </li>
              <li>
                <Link
                  to="/license"
                  className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Licencia
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Términos
                </Link>
              </li>
              <li>
                <Link
                  to="/conditions"
                  className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contáctanos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contáctanos</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href="mailto:info@bookandgo.com"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    info@bookandgo.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a
                    href="tel:+51987654321"
                    className="text-gray-400 hover:text-primary transition-colors block"
                  >
                    +51 987 654 321
                  </a>
                  <a
                    href="tel:+51987654322"
                    className="text-gray-400 hover:text-primary transition-colors block"
                  >
                    +51 987 654 322
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Av. Principal 123, Lima, Perú
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Lun - Vie: 9:00 AM - 6:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 BOOK&GO. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/terms"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Términos de Servicio
              </Link>
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                to="/cookies"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;