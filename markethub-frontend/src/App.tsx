import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import WalletPage from "./pages/WalletPage";
import OrdersPage from "./pages/OrdersPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import SellerSoldItemsPage from "./pages/SellerSoldItemsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

function Home() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/products" : "/login"} replace />;
}

export default function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<ProductsPage />} />

            <Route element={<RoleRoute allow={["CUSTOMER"]} />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Route>

            <Route element={<RoleRoute allow={["SELLER"]} />}>
              <Route path="/seller" element={<SellerDashboardPage />} />
              <Route path="/seller/sold-items" element={<SellerSoldItemsPage />} />
            </Route>

            <Route element={<RoleRoute allow={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAuthRoute && <Footer />}
    </div>
  );
}
