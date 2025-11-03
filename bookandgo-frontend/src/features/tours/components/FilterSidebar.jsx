// src/features/tours/components/FilterSidebar.jsx

import { useState, useEffect } from 'react';
import { DollarSign, Star, Clock, TrendingUp } from 'lucide-react';
import api from '../../../shared/utils/api';

const FilterSidebar = ({ filters, onFilterChange, onApply, onClear }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Filtros</h3>

      {/* Rango de Precios */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          Rango de precio
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Mínimo"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />
          <input
            type="number"
            placeholder="Máximo"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Categorías */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Categoría
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          Calificación mínima
        </label>
        <div className="space-y-2">
          {[5, 4, 3, 2].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating.toString()}
                onChange={(e) => onFilterChange('rating', e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <div className="flex items-center gap-1">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="text-sm text-gray-600">y más</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Duración */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Duración
        </label>
        <select
          value={filters.duration}
          onChange={(e) => onFilterChange('duration', e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        >
          <option value="">Cualquier duración</option>
          <option value="short">Menos de 4 horas</option>
          <option value="medium">4-8 horas</option>
          <option value="day">1 día completo</option>
          <option value="multi">Más de 1 día</option>
        </select>
      </div>

      {/* Dificultad */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Dificultad
        </label>
        <select
          value={filters.difficulty}
          onChange={(e) => onFilterChange('difficulty', e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        >
          <option value="">Cualquier nivel</option>
          <option value="easy">Fácil</option>
          <option value="moderate">Moderado</option>
          <option value="hard">Difícil</option>
        </select>
      </div>

      {/* Ordenar por */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Ordenar por
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        >
          <option value="created_at">Más recientes</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="rating">Mejor calificados</option>
          <option value="popular">Más populares</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onClear}
          className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
        >
          Limpiar
        </button>
        <button
          onClick={onApply}
          className="flex-1 px-4 py-3 bg-gradient-primary text-gray-900 font-bold rounded-xl hover:bg-gradient-secondary transition-all shadow-lg"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;