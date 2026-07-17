import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/Login/Login'
import Cadastro from '../pages/Cadastro/Cadastro'

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/cadastro" element={<Cadastro />} />
                <Route
                    path="/"
                    element={<Login />}
                />

            </Routes>
            

        </BrowserRouter>
    )
}

export default AppRoutes