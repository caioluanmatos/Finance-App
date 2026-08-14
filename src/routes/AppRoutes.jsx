import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/Login/Login'
import Cadastro from '../pages/Cadastro/Cadastro'
import Dashboard from "../pages/Dashboard/Dashboard";
import Transacoes from "../pages/Transacoes/Transacoes";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/cadastro" element={<Cadastro />} />
               <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transacoes" element={<Transacoes />} />
                

            </Routes>
            

        </BrowserRouter>
    )
}

export default AppRoutes