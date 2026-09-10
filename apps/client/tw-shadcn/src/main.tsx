import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./pages/home.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AboutPage from "./pages/about.tsx";
import Form from "./pages/form/index.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/form",
    Component: Form,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
