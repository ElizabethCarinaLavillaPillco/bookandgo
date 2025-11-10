// src/store/cartStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, { ...item, id: Date.now() }],
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateItem: (itemId, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Computed values
      get total() {
        return get().items.reduce((sum, item) => sum + item.total_price, 0);
      },

      get itemCount() {
        return get().items.length;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;