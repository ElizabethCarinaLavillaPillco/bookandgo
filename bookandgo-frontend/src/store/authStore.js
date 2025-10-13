import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,

      // Derivado
      isAuthenticated: false,

      // Iniciar sesión
      login: (userData, token) => {
        set({
          user: userData,
          token,
          isAuthenticated: true,
        })
      },

      // Cerrar sesión
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      // Actualizar datos de usuario
      updateUser: (updatedUser) => {
        const currentUser = get().user
        set({
          user: { ...currentUser, ...updatedUser },
        })
      },
    }),
    {
      name: 'auth-storage', // nombre en localStorage
    }
  )
)

export default useAuthStore
