import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [expanded, setExpanded] = useState(false);

  const isAdmin = user?.name?.toLowerCase() === "admin";

  // ✅ COMPLETE FIX — avoids null crash
  useEffect(() => {
    const nav = document.querySelector(".main-navbar");
    if (!nav) return; // 💥 prevents classList error

    const handleScroll = () => {
      if (window.scrollY > 20) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      fixed="top"
      className="main-navbar"
    >
      <Container fluid>

        <LinkContainer to="/" onClick={() => setExpanded(false)}>
          <Navbar.Brand className="fw-bold">🛍️ ShopX</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle
          onClick={() => setExpanded(!expanded)}
          className="border-0"
        />

        <Navbar.Collapse>
          <Nav className="ms-auto navbar-links">

            <LinkContainer to="/" onClick={() => setExpanded(false)}>
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/shop" onClick={() => setExpanded(false)}>
              <Nav.Link>Shop</Nav.Link>
            </LinkContainer>
            

            {/* CART (NOT ADMIN) */}
            {!isAdmin && (
              <LinkContainer to="/cart" onClick={() => setExpanded(false)}>
                <Nav.Link>
                  Cart{" "}
                  {itemCount > 0 && (
                    <span className="cart-pill">{itemCount}</span>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}
            <LinkContainer to="/contact" onClick={() => setExpanded(false)}>
  <Nav.Link>Contact</Nav.Link>
</LinkContainer>

            {/* ACCOUNT */}
            {user ? (
              <NavDropdown title={user?.name} align="end">

                {isAdmin ? (
                  <>
                    <LinkContainer to="/admin/add-product" onClick={() => setExpanded(false)}>
                      <NavDropdown.Item>Add Product</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/admin/trending" onClick={() => setExpanded(false)}>
                      <NavDropdown.Item>Trending Products</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/admin/manage-products" onClick={() => setExpanded(false)}>
                      <NavDropdown.Item>Manage Products</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/admin/hero" onClick={() => setExpanded(false)}>
                      <NavDropdown.Item>Manage Hero Banner</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Divider />

                    <NavDropdown.Item
                      onClick={() => {
                        logout();
                        setExpanded(false);
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <LinkContainer to="/orders" onClick={() => setExpanded(false)}>
                      <NavDropdown.Item>My Orders</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Divider />

                    <NavDropdown.Item
                      onClick={() => {
                        logout();
                        setExpanded(false);
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </>
                )}

              </NavDropdown>
            ) : (
              <NavDropdown title="Account" align="end">
                <LinkContainer to="/login" onClick={() => setExpanded(false)}>
                  <NavDropdown.Item>Login</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/signup" onClick={() => setExpanded(false)}>
                  <NavDropdown.Item>Sign Up</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
