import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
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

                {/* HOME */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* LOGIN */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* CADASTRO */}
                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />

                {/* RECUPERAÇÃO DE SENHA */}
                <Route
                    path="/recuperar-senha"
                    element={<Recuperacao />}
                />

                {/* DASHBOARD */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* TRANSAÇÕES */}
                <Route
                    path="/transacoes"
                    element={<Transacoes />}
                />

                {/* RECEITAS */}
                <Route
                    path="/receitas"
                    element={<Receitas />}
                />

                {/* DESPESAS */}
                <Route
                    path="/despesas"
                    element={<Despesas />}
                />

                {/* METAS */}
                <Route
                    path="/metas"
                    element={<Metas />}
                />

                {/* PERFIL */}
                <Route
                    path="/perfil"
                    element={<Perfil />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;