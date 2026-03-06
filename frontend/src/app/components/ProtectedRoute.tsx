import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth, UserRole } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

/**
 * A wrapper for routes that checks if the current user has one of the allowed roles.
 * If not, redirects them to their own home page (or login if not authenticated).
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  if (!user) {
    // Should be handled by AppContent, but as a safety measure:
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const isAllowed = hasRole(...allowedRoles);

  if (!isAllowed) {
    // Strict RBAC: Keep them in their designated playground
    // We redirect to the root which App logic will then push to their specific home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
