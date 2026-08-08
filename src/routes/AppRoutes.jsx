import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/Login/Login'
import Cadastro from '../pages/Cadastro/Cadastro'
import Dashboard from "../pages/Dashboard/Dashboard";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/cadastro" element={<Cadastro />} />
               <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />

            </Routes>
            

        </BrowserRouter>
    )
}

export default AppRoutes