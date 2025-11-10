// src/features/tours/pages/TourDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Star, MapPin, Clock, Users, Calendar, 
  Check, X, ChevronLeft, ChevronRight, Share2, Shield
} from 'lucide-react';
import api from '../../../shared/utils/api';
import './TourDetailPage.css';

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/tours/${id}`);
      console.log('Tour data:', response.data);
      
      setTour(response.data);
    } catch (err) {
      console.error('Error fetching tour:', err);
      setError('No se pudo cargar el tour');
    } finally {
      setLoading(false);
    }
  };

  // Obtener array de imágenes
  const getImageUrls = () => {
    if (!tour) return [];
    
    const images = [];
    
    // Agregar featured_image primero
    if (tour.featured_image) {
      images.push(tour.featured_image);
    }
    
    // Agregar imágenes adicionales
    if (tour.images && Array.isArray(tour.images)) {
      tour.images.forEach(img => {
        const url = typeof img === 'object' ? img.image_url : img;
        if (url && url !== tour.featured_image) {
          images.push(url);
        }
      });
    }
    
    return images.length > 0 ? images : ['https://via.placeholder.com/800x600'];
  };

  const imageUrls = getImageUrls();

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleReserveNow = () => {
    navigate(`/booking/${tour.id}`);
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles del tour...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Tour no encontrado'}
          </h2>
          <Link to="/tours" className="btn-primary">
            Volver a Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-detail-page">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/tours">Tours</Link>
          <span>/</span>
          <span>{tour.title}</span>
        </div>

        {/* Header */}
        <h1 className="tour-title">{tour.title}</h1>

        <div className="tour-layout">
          {/* Columna Izquierda */}
          <div className="tour-main-content">
            {/* Galería de Imágenes */}
            <div className="image-gallery">
              <div className="main-image-container">
                <img 
                  src={imageUrls[currentImageIndex]} 
                  alt={tour.title}
                  className="main-image"
                />
                
                {imageUrls.length > 1 && (
                  <>
                    <button className="gallery-nav prev" onClick={prevImage}>
                      <ChevronLeft />
                    </button>
                    <button className="gallery-nav next" onClick={nextImage}>
                      <ChevronRight />
                    </button>
                  </>
                )}

                <div className="image-actions">
                  <button className="action-btn">
                    <Share2 size={20} />
                    Compartir
                  </button>
                  <button 
                    className={`action-btn ${isFavorite ? 'active' : ''}`}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    Guardar
                  </button>
                </div>
              </div>

              {imageUrls.length > 1 && (
                <div className="thumbnails">
                  {imageUrls.slice(0, 5).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Vista ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                  {imageUrls.length > 5 && (
                    <div className="thumbnail view-more">
                      <span>+{imageUrls.length - 5}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Características Rápidas */}
            <div className="quick-features">
              <div className="feature-item">
                <Clock className="feature-icon" />
                <div>
                  <div className="feature-label">Duración:</div>
                  <div className="feature-value">
                    {tour.duration_days > 0 && `${tour.duration_days} día${tour.duration_days > 1 ? 's' : ''}`}
                    {tour.duration_days > 0 && tour.duration_hours > 0 && ' y '}
                    {tour.duration_hours > 0 && `${tour.duration_hours} hora${tour.duration_hours > 1 ? 's' : ''}`}
                  </div>
                </div>
              </div>

              <div className="feature-item">
                <MapPin className="feature-icon" />
                <div>
                  <div className="feature-label">Ubicación:</div>
                  <div className="feature-value">
                    {tour.location_city}, {tour.location_region}
                  </div>
                </div>
              </div>

              <div className="feature-item">
                <Users className="feature-icon" />
                <div>
                  <div className="feature-label">Grupo:</div>
                  <div className="feature-value">
                    {tour.min_people} - {tour.max_people} personas
                  </div>
                </div>
              </div>

              <div className="feature-item">
                <Shield className="feature-icon" />
                <div>
                  <div className="feature-label">Dificultad:</div>
                  <div className="feature-value capitalize">
                    {tour.difficulty_level === 'easy' ? 'Fácil' : 
                     tour.difficulty_level === 'moderate' ? 'Moderado' : 'Difícil'}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="content-tabs">
              <div className="tabs-header">
                <button 
                  className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  DESCRIPCIÓN
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('itinerary')}
                >
                  ITINERARIO
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'includes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('includes')}
                >
                  INCLUYE
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'excludes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('excludes')}
                >
                  NO INCLUYE
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('requirements')}
                >
                  REQUISITOS
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'description' && (
                  <div className="content-section">
                    <p className="whitespace-pre-line">{tour.description}</p>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="content-section">
                    <div className="whitespace-pre-line">
                      {tour.itinerary || 'Itinerario no disponible'}
                    </div>
                  </div>
                )}

                {activeTab === 'includes' && (
                  <div className="content-section">
                    <ul className="check-list">
                      {tour.includes ? tour.includes.split('\n').map((item, i) => (
                        item.trim() && (
                          <li key={i}>
                            <Check className="check-icon" />
                            {item.replace(/^[•\-]\s*/, '').trim()}
                          </li>
                        )
                      )) : <li>No hay información disponible</li>}
                    </ul>
                  </div>
                )}

                {activeTab === 'excludes' && (
                  <div className="content-section">
                    <ul className="check-list exclude">
                      {tour.excludes ? tour.excludes.split('\n').map((item, i) => (
                        item.trim() && (
                          <li key={i}>
                            <X className="x-icon" />
                            {item.replace(/^[•\-]\s*/, '').trim()}
                          </li>
                        )
                      )) : <li>No hay información disponible</li>}
                    </ul>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="content-section">
                    <div className="whitespace-pre-line">
                      {tour.requirements || 'No hay requisitos específicos'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Opiniones */}
            <div className="reviews-section">
              <h2>Opiniones</h2>
              
              <div className="reviews-summary">
                <div className="rating-big">
                  <div className="rating-number">{parseFloat(tour.rating || 0).toFixed(1)}</div>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        fill={i < Math.floor(tour.rating || 0) ? "var(--color-primary)" : "none"} 
                        color="var(--color-primary)" 
                        size={20} 
                      />
                    ))}
                  </div>
                  <div className="reviews-count">
                    Según {tour.total_reviews || 0} opiniones
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Reserva */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <div className="price-section">
                <div className="price-label">PRECIO POR PERSONA</div>
                <div className="price-amount">
                  S/. {parseFloat(tour.discount_price || tour.price).toFixed(2)}
                  {tour.discount_price && (
                    <span className="original-price">
                      S/. {parseFloat(tour.price).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="price-note">Impuestos incluidos</div>
              </div>

              <div className="booking-info">
                <p>
                  <Check size={16} className="text-primary" />
                  Pago 100% seguro
                </p>
                <p>
                  <Check size={16} className="text-primary" />
                  Cancelación hasta {tour.cancellation_hours}h antes
                </p>
                <p>
                  <Check size={16} className="text-primary" />
                  Confirmación instantánea
                </p>
              </div>

              <button 
                onClick={handleReserveNow}
                className="w-full flex items-center justify-center gap-2 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                <Calendar className="w-5 h-5" />
                Reservar Ahora
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Selecciona fecha y cantidad en el siguiente paso
              </p>
            </div>

            {/* Info de la Agencia */}
            {tour.agency && (
              <div className="agency-card mt-4">
                <h3>Operado por</h3>
                <div className="agency-info">
                  <div>
                    <h4>{tour.agency.business_name || 'Agencia de Tours'}</h4>
                    <div className="agency-rating">
                      <Star fill="var(--color-primary)" size={16} />
                      <span>{parseFloat(tour.agency.rating || 0).toFixed(1)}</span>
                      <span className="text-gray-500">
                        ({tour.agency.total_reviews || 0} reseñas)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Política de Cancelación */}
            <div className="cancellation-policy mt-4 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-2">Política de Cancelación</h4>
              <p className="text-sm text-gray-600">
                {tour.cancellation_policy || `Cancelación gratuita hasta ${tour.cancellation_hours} horas antes del inicio del tour.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;