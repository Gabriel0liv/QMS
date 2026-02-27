import { RouterProvider, Navigate } from 'react-router';
import { router } from './routes';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { AuthLayout } from './components/AuthLayout';

/** Redirect to the correct home after login based on role */
function useHomeRoute(): string {
  const { user } = useAuth();
  switch (user?.role) {
    case "operator": return "/registo-nc";
    case "quality": return "/recepcoes";
    case "production": return "/documentos-tecnicos";
    case "rd": return "/documentos-tecnicos";
    case "admin": return "/gestao-utilizadores";
    default: return "/";
  }
}

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <AuthLayout>
        <Login />
      </AuthLayout>
    );
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Export for use in routes
export { Navigate };