import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, Loader2, Calendar } from 'lucide-react';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const isAgency = searchParams.get('type') === 'agency';
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Datos, 2: Términos
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: isAgency ? 'agency' : 'customer',
    // Campos adicionales para agencia
    business_name: '',
    ruc_tax_id: '',
    address: '',
    city: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';

    // Validaciones adicionales para agencias
    if (isAgency) {
      if (!formData.business_name.trim()) newErrors.business_name = 'Razón social requerida';
      if (!formData.ruc_tax_id.trim()) newErrors.ruc_tax_id = 'RUC requerido';
      if (!formData.address.trim()) newErrors.address = 'Dirección requerida';
      if (!formData.city.trim()) newErrors.city = 'Ciudad requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  if (step === 2) {
    return <TermsAndConditionsStep formData={formData} onBack={() => setStep(1)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
            <UserPlus className="w-10 h-10 text-gray-900" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            {isAgency ? 'Regístrate como Proveedor' : 'Terminar de registrarme'}
          </h2>
          <p className="text-gray-600">
            {isAgency
              ? 'Completa el formulario para unirte a nuestra red de agencias'
              : 'Completa tus datos para crear tu cuenta'}
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
          <form onSubmit={handleNext} className="space-y-6">
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                  placeholder="+51 999 999 999"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Campos adicionales para agencias */}
            {isAgency && (
              <>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Datos de la Agencia</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.business_name ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    placeholder="Nombre de la empresa"
                  />
                  {errors.business_name && <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    RUC
                  </label>
                  <input
                    type="text"
                    name="ruc_tax_id"
                    value={formData.ruc_tax_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.ruc_tax_id ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    placeholder="20123456789"
                    maxLength="11"
                  />
                  {errors.ruc_tax_id && <p className="mt-1 text-sm text-red-600">{errors.ruc_tax_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.address ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    placeholder="Av. Principal 123"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.city ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    placeholder="Lima"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>
              </>
            )}

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.password_confirmation ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
              )}
            </div>

            {/* Botón Continuar */}
            <button
              type="submit"
              className="w-full bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Continuar
            </button>
          </form>

          {/* Link a login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-bold">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Términos y Condiciones
const TermsAndConditionsStep = ({ formData, onBack }) => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) return;

    setLoading(true);
    // Aquí iría la lógica de registro con el backend
    // Por ahora simulamos un registro exitoso
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Nuestro compromiso de la comunidad
          </h2>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Book&Go es una comunidad a la que todos pueden pertenecer
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Para garantizar esto, te pedimos que te comprometas con lo siguiente:
            </p>

            <div className="mt-6 space-y-4">
              <p className="text-gray-700">
                Acepto tratar a todos en la comunidad de Book&Go con respeto y sin prejuicios, sin importar la raza, religión, nacionalidad, etnia, discapacidad, sexo, identidad de género, orientación sexual o edad.
              </p>
            </div>
          </div>

          {/* Términos y condiciones */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h4 className="font-bold text-gray-900 mb-3">Términos legales</h4>
            <div className="bg-gray-50 rounded-xl p-6 max-h-64 overflow-y-auto custom-scrollbar">
              <div className="space-y-4 text-sm text-gray-600">
                <p className="font-semibold text-gray-900">1. Aceptación de términos</p>
                <p>
                  Al crear una cuenta en Book&Go, aceptas cumplir con nuestros términos y condiciones, así como nuestras políticas de privacidad.
                </p>

                <p className="font-semibold text-gray-900">2. Uso del servicio</p>
                <p>
                  Te comprometes a utilizar nuestros servicios de manera responsable y legal. No está permitido publicar contenido ofensivo, engañoso o que viole derechos de terceros.
                </p>

                <p className="font-semibold text-gray-900">3. Política de cancelación</p>
                <p>
                  Las reservas pueden cancelarse según las políticas específicas de cada tour. Los reembolsos están sujetos a las condiciones establecidas por cada agencia.
                </p>

                <p className="font-semibold text-gray-900">4. Privacidad de datos</p>
                <p>
                  Tus datos personales serán tratados conforme a nuestra política de privacidad. No compartiremos tu información con terceros sin tu consentimiento.
                </p>

                <p className="font-semibold text-gray-900">5. Responsabilidad</p>
                <p>
                  Book&Go actúa como intermediario entre turistas y agencias. Las agencias son responsables de la calidad y cumplimiento de los servicios ofrecidos.
                </p>

                <p className="font-semibold text-gray-900">6. Modificaciones</p>
                <p>
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de nuestros canales oficiales.
                </p>
              </div>
            </div>
          </div>

          {/* Checkbox de aceptación */}
          <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary cursor-pointer transition-all mb-6">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-primary focus:ring-primary rounded"
            />
            <span className="text-sm text-gray-700">
              Acepto los{' '}
              <Link to="/terms" className="text-primary hover:underline font-semibold">
                términos y condiciones
              </Link>
              , la{' '}
              <Link to="/privacy" className="text-primary hover:underline font-semibold">
                política de privacidad
              </Link>{' '}
              y el acuerdo de la comunidad de Book&Go.
            </span>
          </label>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all"
            >
              Rechazar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!accepted || loading}
              className="flex-1 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Aceptar y continuar'
              )}
            </button>
          </div>

          {/* Nota legal */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            Book&Go se toma muy en serio el incumplimiento de estos términos, y estas violaciones pueden dar lugar a la suspensión o eliminación de tu cuenta si verificamos su validez.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;