import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, Star, MapPin, Clock, Users, Calendar, 
  Check, X, ChevronLeft, ChevronRight, Share2,
  Mountain, Utensils, Camera, Shield
} from 'lucide-react';
import useCartStore from '../../../store/cartStore';
import './TourDetailPage.css';

const TourDetailPage = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchTourDetail();
  }, [id]);

  const fetchTourDetail = async () => {
    setLoading(true);
    try {
      // const response = await api.get(`/tours/${id}`);
      // setTour(response.data);
      
      // Datos de ejemplo
      setTour({
        id: 1,
        title: 'Excursión a Rainbow Mountain Día Completo Opcional Valle Rojo',
        description: 'En este emocionante tour de un día, comenzaremos con el recojo en tu hotel en Cusco para trasladarnos en nuestro cómodo transporte hacia Pitumarca, Moray y las Minas de Sal de Maras, donde podremos admirar impresionantes ruinas incas y aprender sobre su historia. Luego, disfrutaremos de un delicioso almuerzo en Urubamba antes de continuar hacia Ollantaytambo, otro importante sitio arqueológico.',
        featured_image: 'https://images.unsplash.com/photo-1531068atu-5c5272a41129?w=1200',
        images: [
          'https://images.unsplash.com/photo-1531068-5c5272a41129?w=800',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
          'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800',
          'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800',
        ],
        price: 320,
        duration_days: 1,
        duration_hours: 0,
        max_people: 15,
        rating: 4.9,
        total_reviews: 2752,
        difficulty_level: 'moderate',
        location_city: 'Cusco',
        category: { name: 'Cultura y Aventura' },
        agency: {
          business_name: 'Inca Adventures SAC',
          rating: 4.8,
          total_reviews: 156,
        },
        itinerary: `▸ Día 1: VALLE SACRADO Y CONEXION
En este emocionante tour de un día, comenzaremos con el recojo en tu hotel en Cusco para trasladarnos en nuestro cómodo transporte hacia Pitumarca, Moray y las Minas de Sal de Maras.

Por la tarde, abordaremos el tren en Ollantaytambo hacia Aguas Calientes, el pueblo base de Machupicchu. En Aguas Calientes, te llevaremos al hotel Machupicchu Inn para el check-in y un breve descanso.

▸ Día 2: VISITA A MACHUPICCHU
A las 7:00 PM, nuestro guía ofrecerá una interesante charla informativa sobre la visita a Machupicchu.`,
        includes: '• Guía profesional bilingüe\n• Entrada a Rainbow Mountain\n• Transporte completo\n• Desayuno y almuerzo\n• Bastones de trekking\n• Kit de primeros auxilios',
        excludes: '• Propinas\n• Bebidas alcohólicas\n• Seguro de viaje personal\n• Gastos personales',
        requirements: '• Buen estado físico\n• Aclimatación previa de 2 días en Cusco\n• Ropa abrigada y protector solar',
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === tour.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? tour.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando detalles del tour...</p>
      </div>
    );
  }

  if (!tour) {
    return <div className="error-container">Tour no encontrado</div>;
  }

  const totalPrice = tour.price * numberOfPeople;

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
                  src={tour.images[currentImageIndex]} 
                  alt={tour.title}
                  className="main-image"
                />
                
                {/* Botones de navegación */}
                <button className="gallery-nav prev" onClick={prevImage}>
                  <ChevronLeft />
                </button>
                <button className="gallery-nav next" onClick={nextImage}>
                  <ChevronRight />
                </button>

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

              {/* Miniaturas */}
              <div className="thumbnails">
                {tour.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Vista ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
                <div className="thumbnail view-more">
                  <span>Ver más</span>
                </div>
              </div>
            </div>

            {/* Características Rápidas */}
            <div className="quick-features">
              <div className="feature-item">
                <Clock className="feature-icon" />
                <div>
                  <div className="feature-label">Duración:</div>
                  <div className="feature-value">
                    {tour.duration_days} días {tour.duration_hours} noches
                  </div>
                </div>
              </div>

              <div className="feature-item">
                <Mountain className="feature-icon" />
                <div>
                  <div className="feature-label">Altura Máxima:</div>
                  <div className="feature-value">5000 msnm</div>
                </div>
              </div>

              <div className="feature-item">
                <MapPin className="feature-icon" />
                <div>
                  <div className="feature-label">Tipo De Tours:</div>
                  <div className="feature-value">{tour.category.name}</div>
                </div>
              </div>

              <div className="feature-item">
                <Shield className="feature-icon" />
                <div>
                  <div className="feature-label">Dificultad</div>
                  <div className="feature-value">Moderado</div>
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
                  className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('faqs')}
                >
                  FAQs
                </button>
                <button className="tab-btn">
                  Descargar Itinerario
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'description' && (
                  <div className="content-section">
                    <p>{tour.description}</p>
                    <p className="mt-4">{tour.itinerary}</p>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="content-section">
                    <div className="itinerary-day">
                      <h3>▸ Día 1: VALLE SACRADO Y CONEXION</h3>
                      <p>{tour.description}</p>
                    </div>
                    <div className="itinerary-day">
                      <h3>▸ Día 2: VISITA A MACHUPICCHU</h3>
                      <p>A las 7:00 PM, nuestro guía ofrecerá una interesante charla informativa sobre la visita a Machupicchu. Finalmente, disfrutarás de tiempo libre para explorar la majestuosidad de la Ciudadela Inca al día siguiente.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'includes' && (
                  <div className="content-section">
                    <ul className="check-list">
                      {tour.includes.split('\n').map((item, i) => (
                        <li key={i}>
                          <Check className="check-icon" />
                          {item.replace('•', '').trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'not-includes' && (
                  <div className="content-section">
                    <ul className="check-list exclude">
                      {tour.excludes.split('\n').map((item, i) => (
                        <li key={i}>
                          <X className="x-icon" />
                          {item.replace('•', '').trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'faqs' && (
                  <div className="content-section">
                    <div className="faq-item">
                      <h4>¿Qué debo llevar?</h4>
                      <p>Ropa abrigada, protector solar, agua, cámara fotográfica.</p>
                    </div>
                    <div className="faq-item">
                      <h4>¿Es apto para niños?</h4>
                      <p>Sí, a partir de 8 años con supervisión.</p>
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
                  <div className="rating-number">4,9</div>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill="var(--color-primary)" color="var(--color-primary)" size={20} />
                    ))}
                  </div>
                  <div className="reviews-count">Según 2752 opiniones</div>
                </div>

                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="rating-bar-item">
                      <span>{stars} estrellas</span>
                      <div className="bar">
                        <div className="bar-fill" style={{ width: `${stars * 18}%` }}></div>
                      </div>
                      <span className="count">{2595 - (stars * 100)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de reseñas */}
              <div className="reviews-list">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <div className="stars-small">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} fill="var(--color-primary)" color="var(--color-primary)" size={16} />
                        ))}
                      </div>
                      <span className="review-date">5 set 2024</span>
                    </div>
                    <h4>Me encantó la...</h4>
                    <p className="review-text">
                      Me encantó la experiencia, muy difícil subir a la montaña, pero siempre mi guía Wally estuvo al pendiente y logré llegar a los miradores.
                    </p>
                    <div className="review-actions">
                      <button className="review-btn">👍</button>
                      <button className="review-btn">👎</button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-outline">Mostrar 10 opiniones más</button>
            </div>

            {/* Otras Sugerencias */}
            <div className="related-tours">
              <h2>Otras sugerencias</h2>
              <div className="related-grid">
                {/* Aquí irían los tours relacionados */}
              </div>
            </div>
          </div>

          {/* Columna Derecha - Reserva */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <div className="price-section">
                <div className="price-label">TOTAL ESTIMADO</div>
                <div className="price-amount">S/ {totalPrice}</div>
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

              <button className="btn-primary w-full" onClick={() => alert('Próximamente: Verificar disponibilidad')}>
                Comprobar disponibilidad
              </button>

              <div className="booking-info">
                <p>
                  <Check size={16} className="text-primary" />
                  Quedan <strong>4 cupos</strong> para el <strong>15 de agosto</strong> en Lima
                </p>
                <p>
                  <Check size={16} className="text-primary" />
                  Pago 100% seguro: tarjeta, Yape o transferencia
                </p>
              </div>

              <button className="btn-secondary w-full mb-2" onClick={handleAddToCart}>
                Agregar a tus paquetes
              </button>

              <button className="btn-primary w-full" onClick={handleReserveNow}>
                Reservar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;