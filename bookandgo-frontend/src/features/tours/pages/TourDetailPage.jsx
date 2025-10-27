import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, Star, MapPin, Clock, Users, Calendar, 
  Check, X, ChevronLeft, ChevronRight, Share2,
  Mountain, Shield
} from 'lucide-react';
import useCartStore from '../../../store/cartStore';
import { toursApi } from '../../../shared/utils/api';
import './TourDetailPage.css';

const TourDetailPage = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 👈 AGREGADO
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCartStore();

  // 👇 FUNCIÓN ÚNICA Y CORRECTA
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching tour:', id); // Debug
        
        const response = await toursApi.show(id);
        console.log('Tour data:', response.data); // Debug
        
        setTour(response.data);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('No se pudo cargar el tour');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTour();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedDate) {
      alert('Por favor selecciona una fecha');
      return;
    }
    addItem(tour, numberOfPeople, selectedDate);
    alert('Tour agregado al carrito');
  };

  const handleReserveNow = () => {
    handleAddToCart();
    window.location.href = '/cart';
  };

  // 👇 Función para obtener array de imágenes (maneja tanto objetos como strings)
  const getImageUrls = () => {
    if (!tour) return [];
    
    // Si tour.images es array de objetos con image_url
    if (tour.images && Array.isArray(tour.images) && tour.images.length > 0) {
      if (typeof tour.images[0] === 'object') {
        return tour.images.map(img => img.image_url);
      }
      return tour.images;
    }
    
    // Si solo tiene featured_image
    return tour.featured_image ? [tour.featured_image] : [];
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

  // 👇 ESTADOS DE CARGA Y ERROR
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando detalles del tour...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <Link to="/tours" className="btn-primary mt-4">
          Volver a Tours
        </Link>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="error-container">
        <h2>Tour no encontrado</h2>
        <Link to="/tours" className="btn-primary mt-4">
          Volver a Tours
        </Link>
      </div>
    );
  }

  const totalPrice = (tour.discount_price || tour.price) * numberOfPeople;

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
          {/* Columna Izquierda - Galería e Información */}
          <div className="tour-main-content">
            {/* Galería de Imágenes */}
            <div className="image-gallery">
              <div className="main-image-container">
                <img 
                  src={imageUrls[currentImageIndex] || 'https://via.placeholder.com/800x600'} 
                  alt={tour.title}
                  className="main-image"
                />
                
                {/* Botones de navegación - solo si hay más de 1 imagen */}
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

                {/* Botones de acción */}
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
                    Añadir a la lista de deseos
                  </button>
                </div>
              </div>

              {/* Miniaturas - solo si hay más de 1 imagen */}
              {imageUrls.length > 1 && (
                <div className="thumbnails">
                  {imageUrls.slice(0, 4).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Vista ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                  {imageUrls.length > 4 && (
                    <div className="thumbnail view-more">
                      <span>+{imageUrls.length - 4}</span>
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
                    {tour.duration_days > 0
                      ? `${tour.duration_days} ${tour.duration_days === 1 ? 'día' : 'días'}`
                      : `${tour.duration_hours} horas`}
                  </div>
                </div>
              </div>

              <div className="feature-item">
                <MapPin className="feature-icon" />
                <div>
                  <div className="feature-label">Ubicación:</div>
                  <div className="feature-value">
                    {tour.location_city}, {tour.location_country}
                  </div>
                </div>
              </div>

              <div className="feature-item">
                <Users className="feature-icon" />
                <div>
                  <div className="feature-label">Grupo máximo:</div>
                  <div className="feature-value">{tour.max_people} personas</div>
                </div>
              </div>

              <div className="feature-item">
                <Shield className="feature-icon" />
                <div>
                  <div className="feature-label">Dificultad:</div>
                  <div className="feature-value capitalize">
                    {tour.difficulty_level || 'Moderado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs de Contenido */}
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
                  className={`tab-btn ${activeTab === 'not-includes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('not-includes')}
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
                        <li key={i}>
                          <Check className="check-icon" />
                          {item.replace('•', '').trim()}
                        </li>
                      )) : <li>No hay información disponible</li>}
                    </ul>
                  </div>
                )}

                {activeTab === 'not-includes' && (
                  <div className="content-section">
                    <ul className="check-list exclude">
                      {tour.excludes ? tour.excludes.split('\n').map((item, i) => (
                        <li key={i}>
                          <X className="x-icon" />
                          {item.replace('•', '').trim()}
                        </li>
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
                  <div className="rating-number">{tour.rating || 0}</div>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        fill={i < Math.floor(tour.rating) ? "var(--color-primary)" : "none"} 
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
                  S/ {tour.discount_price || tour.price}
                  {tour.discount_price && (
                    <span className="original-price">S/ {tour.price}</span>
                  )}
                </div>
                <div className="price-note">impuestos incluidos</div>
              </div>

              <div className="booking-controls">
                <div className="control-group">
                  <label>
                    <Users size={18} />
                    Personas
                  </label>
                  <div className="counter">
                    <button onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}>−</button>
                    <span>{numberOfPeople}</span>
                    <button onClick={() => setNumberOfPeople(Math.min(tour.max_people, numberOfPeople + 1))}>+</button>
                  </div>
                </div>

                <div className="control-group">
                  <label>
                    <Calendar size={18} />
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="price-section mt-4">
                <div className="price-label">TOTAL</div>
                <div className="price-amount">S/ {totalPrice.toFixed(2)}</div>
              </div>

              <div className="booking-info">
                <p>
                  <Check size={16} className="text-primary" />
                  Pago 100% seguro
                </p>
                <p>
                  <Check size={16} className="text-primary" />
                  Cancelación flexible
                </p>
              </div>

              <button className="btn-secondary w-full mb-2" onClick={handleAddToCart}>
                Agregar al carrito
              </button>

              <button className="btn-primary w-full" onClick={handleReserveNow}>
                Reservar ahora
              </button>
            </div>

            {/* Info de la Agencia */}
            {tour.agency && (
              <div className="agency-card mt-4">
                <h3>Operado por</h3>
                <div className="agency-info">
                  {tour.agency.logo && (
                    <img src={tour.agency.logo} alt={tour.agency.business_name} />
                  )}
                  <div>
                    <h4>{tour.agency.business_name}</h4>
                    <div className="agency-rating">
                      <Star fill="var(--color-primary)" size={16} />
                      <span>{tour.agency.rating}</span>
                      <span className="text-gray-500">
                        ({tour.agency.total_reviews} reseñas)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;