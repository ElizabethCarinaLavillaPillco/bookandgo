// src/features/booking/components/GuestSelector.jsx

import { Minus, Plus } from 'lucide-react';

const GuestSelector = ({
  adults,
  children,
  infants,
  minPeople,
  maxPeople,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
}) => {
  const totalGuests = adults + children + infants;

  const canIncrement = (type) => {
    if (type === 'infants') return true; // Infantes no cuentan para el límite
    return totalGuests < maxPeople;
  };

  const canDecrement = (type, current) => {
    if (current <= 0) return false;
    if (type === 'adults' && current <= 1) return false; // Mínimo 1 adulto
    return true;
  };

  return (
    <div className="space-y-4">
      {/* Adultos */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="font-bold text-gray-900">Adultos</p>
          <p className="text-sm text-gray-600">Mayores de 18 años</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => canDecrement('adults', adults) && onAdultsChange(adults - 1)}
            disabled={!canDecrement('adults', adults)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-12 text-center font-bold text-lg">{adults}</span>
          
          <button
            onClick={() => canIncrement('adults') && onAdultsChange(adults + 1)}
            disabled={!canIncrement('adults')}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Niños */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="font-bold text-gray-900">Niños</p>
          <p className="text-sm text-gray-600">2-17 años (50% descuento)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => canDecrement('children', children) && onChildrenChange(children - 1)}
            disabled={!canDecrement('children', children)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-12 text-center font-bold text-lg">{children}</span>
          
          <button
            onClick={() => canIncrement('children') && onChildrenChange(children + 1)}
            disabled={!canIncrement('children')}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Infantes */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="font-bold text-gray-900">Infantes</p>
          <p className="text-sm text-gray-600">Menores de 2 años (Gratis)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => canDecrement('infants', infants) && onInfantsChange(infants - 1)}
            disabled={!canDecrement('infants', infants)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-12 text-center font-bold text-lg">{infants}</span>
          
          <button
            onClick={() => onInfantsChange(infants + 1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-primary hover:text-primary transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advertencia de límite */}
      {totalGuests >= maxPeople && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-lg">
          <p className="text-sm text-orange-700">
            Has alcanzado la capacidad máxima de {maxPeople} personas para este tour
          </p>
        </div>
      )}

      {totalGuests < minPeople && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg">
          <p className="text-sm text-blue-700">
            Se requiere un mínimo de {minPeople} personas para este tour
          </p>
        </div>
      )}
    </div>
  );
};

export default GuestSelector;