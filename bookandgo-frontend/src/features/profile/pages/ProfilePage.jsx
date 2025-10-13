import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    country: user?.country || '',
    city: user?.city || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí iría la llamada al API
      // await api.put('/profile', formData);
      
      // Simulación
      setTimeout(() => {
        updateUser({ ...user, ...formData });
        setIsEditing(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      country: user?.country || '',
      city: user?.city || '',
    });
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 animate-fade-in">
            {/* Banner */}
            <div className="h-48 bg-gradient-primary relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
            </div>

            {/* Avatar y info básica */}
            <div className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-end -mt-20 gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl font-black text-gray-900">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200">
                    <Camera className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-black text-gray-900 mb-2">
                    {user?.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    {user?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-sm">{user?.phone}</span>
                      </div>
                    )}
                    {user?.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          {user?.city}, {user?.country}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón editar */}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <Edit2 className="w-5 h-5" />
                    Editar Perfil
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Formulario de edición */}
          {isEditing ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Editar Información Personal
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
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
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
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
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all bg-gray-50"
                      disabled
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    El correo no puede ser modificado
                  </p>
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
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all resize-none"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                {/* País y Ciudad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      País
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all"
                      placeholder="Perú"
                    />
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all"
                      placeholder="Lima"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Vista de información */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Información Personal */}
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Información Personal
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Biografía</p>
                    <p className="text-gray-900">
                      {user?.bio || 'No has agregado una biografía aún.'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                    <p className="text-gray-900">
                      {user?.city && user?.country
                        ? `${user.city}, ${user.country}`
                        : 'No especificado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Miembro desde</p>
                    <p className="text-gray-900">Octubre 2024</p>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  Actividad
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                    <p className="text-3xl font-black text-gray-900 mb-1">0</p>
                    <p className="text-sm text-gray-600">Reservas</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                    <p className="text-3xl font-black text-gray-900 mb-1">0</p>
                    <p className="text-sm text-gray-600">Reseñas</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                    <p className="text-3xl font-black text-gray-900 mb-1">0</p>
                    <p className="text-sm text-gray-600">Favoritos</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                    <p className="text-3xl font-black text-gray-900 mb-1">0</p>
                    <p className="text-sm text-gray-600">Completados</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;