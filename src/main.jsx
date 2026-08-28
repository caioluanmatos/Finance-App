import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>

        <GoogleOAuthProvider
            clientId="977019495248-14a2dhvp6uh2ct3h4hf86c1ejh87222v.apps.googleusercontent.com"
        >

            <App />

        </GoogleOAuthProvider>

    </StrictMode>
);