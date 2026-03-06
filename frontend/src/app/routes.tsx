import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout }        from "./components/MainLayout";
import { RegistoNC }         from "./pages/RegistoNC";
import { Recepcoes }          from "./pages/Recepcoes";
import { DocumentosTecnicos } from "./pages/DocumentosTecnicos";
import { Retrabalho }         from "./pages/Retrabalho";
import { CatalogoDefeitos }   from "./pages/CatalogoDefeitos";
import { ValidacaoNC }        from "./pages/ValidacaoNC";
import { Assinaturas }        from "./pages/Assinaturas";
import { GestaoUtilizadores } from "./pages/GestaoUtilizadores";
import { EstadoSistema }      from "./pages/EstadoSistema";
import { ProtectedRoute }    from "./components/ProtectedRoute";
import { useAuth }           from "./context/AuthContext";

/** Redirects users to their specific home page based on role */
function HomeRedirect() {
  const { user } = useAuth();
  switch (user?.role) {
    case "operator":   return <Navigate to="/registo-nc" replace />;
    case "quality":    return <Navigate to="/recepcoes" replace />;
    case "production": return <Navigate to="/documentos-tecnicos" replace />;
    case "rd":         return <Navigate to="/documentos-tecnicos" replace />;
    case "admin":      return <Navigate to="/gestao-utilizadores" replace />;
    default:           return <Navigate to="/registo-nc" replace />;
  }
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true,             element: <HomeRedirect /> },
      
      { path: "registo-nc",          element: <ProtectedRoute allowedRoles={["operator"]}><RegistoNC /></ProtectedRoute> },
      
      { path: "recepcoes",           element: <ProtectedRoute allowedRoles={["quality"]}><Recepcoes /></ProtectedRoute> },
      { path: "retrabalho",          element: <ProtectedRoute allowedRoles={["quality"]}><Retrabalho /></ProtectedRoute> },
      { path: "catalogo-defeitos",   element: <ProtectedRoute allowedRoles={["quality"]}><CatalogoDefeitos /></ProtectedRoute> },
      { path: "validacao-nc",        element: <ProtectedRoute allowedRoles={["quality"]}><ValidacaoNC /></ProtectedRoute> },
      
      { path: "documentos-tecnicos", element: <ProtectedRoute allowedRoles={["quality", "production", "rd"]}><DocumentosTecnicos /></ProtectedRoute> },
      { path: "assinaturas",         element: <ProtectedRoute allowedRoles={["quality", "production", "rd"]}><Assinaturas /></ProtectedRoute> },
      
      { path: "gestao-utilizadores", element: <ProtectedRoute allowedRoles={["admin"]}><GestaoUtilizadores /></ProtectedRoute> },
      { path: "estado-sistema",      element: <ProtectedRoute allowedRoles={["admin"]}><EstadoSistema /></ProtectedRoute> },
    ],
  },
]);