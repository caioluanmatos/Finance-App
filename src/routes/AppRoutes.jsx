import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import Dashboard from "../pages/Dashboard/Dashboard";
import Transacoes from "../pages/Transacoes/Transacoes";
import Receitas from "../pages/Receitas/Receitas";

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

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;