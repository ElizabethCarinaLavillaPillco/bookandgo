import { MapPin, Calendar, Search } from 'lucide-react';

const SearchBar = ({ filters, onFilterChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* ¿A dónde vas? */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            ¿A dónde vas?
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Destino o atracción"
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Check In */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Check In
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) => onFilterChange('checkIn', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Check Out */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Check Out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) => onFilterChange('checkOut', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Botón Buscar */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;