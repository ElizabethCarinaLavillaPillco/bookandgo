import { useState } from 'react';
import { Star, DollarSign, Clock, Tag, ChevronDown, ChevronUp } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onApply, onClear }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    rating: true,
    duration: true,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const categories = [
    { id: 1, name: 'Aventura', count: 145 },
    { id: 2, name: 'Cultural', count: 98 },
    { id: 3, name: 'Naturaleza', count: 87 },
    { id: 4, name: 'Gastronomía', count: 56 },
    { id: 5, name: 'Playas', count: 42 },
  ];

  const durations = [
    { value: '1', label: 'Menos de 4 horas' },
    { value: '4', label: '4-8 horas' },
    { value: '8', label: 'Día completo (8+ horas)' },
    { value: '24', label: 'Multi-día' },
  ];

  const ratings = [5, 4, 3, 2, 1];

  const FilterSection = ({ title, icon: Icon, section, children }) => (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {expandedSections[section] && <div className="space-y-3">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900">Filtros</h2>
        <button
          onClick={onClear}
          className="text-sm text-primary hover:text-primary-dark font-semibold transition-colors"
        >
          Limpiar todo
        </button>
      </div>

      {/* Rango de Precios */}
      <FilterSection title="Precio" icon={DollarSign} section="price">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio mínimo (S/.)
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio máximo (S/.)
            </label>
            <input
              type="number"
              placeholder="1000"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>
      </FilterSection>

      {/* Categorías */}
      <FilterSection title="Categorías" icon={Tag} section="category">
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={filters.category === category.id.toString()}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                  {category.name}
                </span>
              </div>
              <span className="text-sm text-gray-400">({category.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Calificación */}
      <FilterSection title="Calificación" icon={Star} section="rating">
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating.toString()}
                onChange={(e) => onFilterChange('rating', e.target.value)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? 'fill-primary text-primary'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-700 font-medium">
                  {rating === 5 ? 'Excelente' : `${rating}+ estrellas`}
                </span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Duración */}
      <FilterSection title="Duración" icon={Clock} section="duration">
        <div className="space-y-2">
          {durations.map((duration) => (
            <label
              key={duration.value}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="duration"
                value={duration.value}
                checked={filters.duration === duration.value}
                onChange={(e) => onFilterChange('duration', e.target.value)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-gray-700 font-medium">{duration.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Botón Aplicar Filtros */}
      <button
        onClick={onApply}
        className="w-full bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Aplicar Filtros
      </button>
    </div>
  );
};

export default FilterSidebar;