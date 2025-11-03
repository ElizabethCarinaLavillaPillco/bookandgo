import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

// Layouts
import MainLayout from './shared/components/Layout/MainLayout';

// Pages
import HomePage from './features/tours/pages/HomePage';
import ToursPage from './features/tours/pages/ToursPage';
import TourDetailPage from './features/tours/pages/TourDetailPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import CartPage from './features/booking/pages/CartPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="tours" element={<ToursPage />} />
            <Route path="tours/:id" element={<TourDetailPage />} /> {/* 👈 AGREGA ESTA LÍNEA */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="become-agency" element={<RegisterPage />} />

            {/* Rutas protegidas */}
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas protegidas se agregarán después */}
            {/* <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;