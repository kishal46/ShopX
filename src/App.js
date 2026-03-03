import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Context
import { AuthProvider } from "./assets/context/AuthContext";
import { CartProvider } from "./assets/context/CartContext";

// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Footer from "./assets/components/Footer";
import AdminRoute from "./assets/components/AdminRoute"; 

// Pages
import Home from "./assets/pages/Home";
import Shop from "./assets/pages/Shop";
import Login from "./assets/pages/Login";
import Signup from "./assets/pages/Signup";
import Cart from "./assets/pages/Cart";
import Checkout from "./assets/pages/Checkout";
import Orders from "./assets/pages/Orders";
import OrderSuccess from "./assets/pages/OrderSuccess";
import ForgotPassword from "./assets/pages/ForgotPassword";
import ResetPassword from "./assets/pages/ResetPassword";
import Contact from "./assets/pages/Contact";
import ProductView from "./assets/pages/ProductView";

// Admin Pages
import AddProduct from "./assets/pages/AddProduct";
import ManageProducts from "./assets/pages/ManageProducts";
import AdminHero from "./assets/pages/AdminHero";
import AdminTrending from "./assets/pages/AdminTrending";  

// Socket
import socket from "./assets/socket";

function App() {

  useEffect(() => {
    socket.on("newUser", (data) => {
      toast.info(`New user signed up: ${data.name} (${data.email})`);
    });

    return () => socket.off("newUser");
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <main style={{ paddingTop: 70 }}>
            <Routes>

              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/contact" element={<Contact />} /> 
              <Route path="/product/:id" element={<ProductView />} />
              {/* ADMIN ROUTES */}
              <Route
                path="/admin/add-product"
                element={
                  <AdminRoute>
                    <AddProduct />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/manage-products"
                element={
                  <AdminRoute>
                    <ManageProducts />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/hero"
                element={
                  <AdminRoute>
                    <AdminHero />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/trending"
                element={
                  <AdminRoute>
                    <AdminTrending />
                  </AdminRoute>
                }
              />

            </Routes>
          </main>

          <Footer />
          <ToastContainer position="top-right" autoClose={2500} />

        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
