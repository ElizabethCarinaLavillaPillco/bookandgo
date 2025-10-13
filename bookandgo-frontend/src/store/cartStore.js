import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (tour, quantity = 1, bookingDate) => {
        const items = get().items;
        const existingItem = items.find(item => item.tour.id === tour.id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.tour.id === tour.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                tour,
                quantity,
                bookingDate: bookingDate || null,
                addedAt: new Date().toISOString(),
              },
            ],
          });
        }
      },

      removeItem: (tourId) => {
        set({
          items: get().items.filter(item => item.tour.id !== tourId),
        });
      },

      updateQuantity: (tourId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(tourId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.tour.id === tourId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.tour.discount_price || item.tour.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;