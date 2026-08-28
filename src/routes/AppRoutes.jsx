import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import Dashboard from "../pages/Dashboard/Dashboard";
import Transacoes from "../pages/Transacoes/Transacoes";
import Receitas from "../pages/Receitas/Receitas";
import Despesas from "../pages/Despesas/Despesas";
import Metas from "../pages/Metas/Metas";
import Perfil from "../pages/Perfil/Perfil";
import Recuperacao from "../pages/Recuperacao/recuperacao";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/transacoes"
                    element={<Transacoes />}
                />

                <Route
                    path="/receitas"
                    element={<Receitas />}
                />

                <Route
                    path="/despesas"
                    element={<Despesas />}
                />

                <Route
                    path="/metas"
                    element={<Metas />}
                />

                <Route
                    path="/perfil"
                    element={<Perfil />}
                />

                <Route
                    path="/recuperar-senha"
                    element={<Recuperacao />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;