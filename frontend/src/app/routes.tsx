import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout }        from "./components/MainLayout";
import { ChaoFabrica }       from "./pages/ChaoFabrica";
import { Recepcoes }          from "./pages/Recepcoes";
import { DocumentosTecnicos } from "./pages/DocumentosTecnicos";
import { Retrabalho }         from "./pages/Retrabalho";
import { CatalogoDefeitos }   from "./pages/CatalogoDefeitos";
import { ValidacaoNC }        from "./pages/ValidacaoNC";
import { Assinaturas }        from "./pages/Assinaturas";
import { GestaoUtilizadores } from "./pages/GestaoUtilizadores";
import { EstadoSistema }      from "./pages/EstadoSistema";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true,             element: <Navigate to="/chao-fabrica" replace /> },
      { path: "chao-fabrica",        Component: ChaoFabrica },
      { path: "recepcoes",           Component: Recepcoes },
      { path: "documentos-tecnicos", Component: DocumentosTecnicos },
      { path: "retrabalho",          Component: Retrabalho },
      { path: "catalogo-defeitos",   Component: CatalogoDefeitos },
      { path: "validacao-nc",        Component: ValidacaoNC },
      { path: "assinaturas",         Component: Assinaturas },
      { path: "gestao-utilizadores", Component: GestaoUtilizadores },
      { path: "estado-sistema",      Component: EstadoSistema },
    ],
  },
]);