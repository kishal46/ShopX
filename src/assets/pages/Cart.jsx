import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Cart.css";
import PageTopBar from "../components/PageTopBar";

const Cart = () => {

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // ==========================
  // LOAD CART
  // ==========================
  useEffect(() => {
    loadCart();
  }, []);

  const normalizeCart = (items) => {
    return items
      .filter((item) => item && item.name)
      .map((item) => ({
        ...item,
        cartId: item.cartId || item._id || item.id, // ⭐ stable id
        qty: Number(item.qty || item.quantity || 1),
      }));
  };

  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    const normalized = normalizeCart(stored);

    setCart(normalized);
    calculateTotal(normalized);
  };

  // ==========================
  // SAVE CART (IMPORTANT FIX)
  // ==========================
  const saveCart = (items) => {
    setCart(items);
    calculateTotal(items);

    // ⭐ Always save normalized cart
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // ==========================
  // TOTAL CALCULATION
  // ==========================
  const calculateTotal = (items) => {

    const totalValue = items.reduce((sum, i) => {

      const price = i.discountPrice
        ? Number(i.discountPrice)
        : Number(i.price || 0);

      return sum + price * i.qty;
    }, 0);

    setTotal(totalValue);
  };

  // ==========================
  // REMOVE ITEM
  // ==========================
  const removeFromCart = (cartId) => {

    const updated = cart.filter((item) => item.cartId !== cartId);

    saveCart(updated); // ⭐ single source update
  };

  // ==========================
  // UPDATE QTY
  // ==========================
  const updateQuantity = (cartId, newQty) => {

    if (newQty < 1) newQty = 1;

    const updated = cart.map((item) =>
      item.cartId === cartId
        ? { ...item, qty: newQty }
        : item
    );

    saveCart(updated);
  };

  // ==========================
  // EMPTY UI
  // ==========================
  if (cart.length === 0) {
    return (
      <Container className="text-center py-5">
      <PageTopBar/>
        <h4>No items added to cart yet 🛒</h4>
        <Link to="/shop">
          <Button className="mt-3" variant="dark">
            Shop Now
          </Button>
        </Link>
      </Container>
    );
  }

  // ==========================
  // UI
  // ==========================
  return (
    <Container className="cart-page py-4">
      <PageTopBar/>
      <h2 className="mb-4 text-center">🛒 Your Cart</h2>

      {cart.map((item) => {

        const finalPrice = item.discountPrice
          ? Number(item.discountPrice)
          : Number(item.price || 0);

        return (
          <div
            key={item.cartId}
            className="d-flex align-items-center justify-content-between border p-3 mb-2 rounded"
          >
            <div>
              <strong>{item.name}</strong>

              <p className="mb-0 text-muted">

                {item.discountPrice ? (
                  <>
                    <span style={{textDecoration:"line-through", marginRight:6}}>
                      ₹{Number(item.price).toFixed(2)}
                    </span>
                    <span className="fw-bold text-success">
                      ₹{Number(item.discountPrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>₹{Number(item.price).toFixed(2)}</>
                )}

                {" "}×{" "}

                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e)=>
                    updateQuantity(item.cartId, Number(e.target.value))
                  }
                  style={{
                    width:60,
                    textAlign:"center",
                    borderRadius:6,
                    border:"1px solid #ccc"
                  }}
                />
              </p>
            </div>

            <div className="text-end">
              <p className="fw-bold mb-1">
                ₹{(finalPrice * item.qty).toFixed(2)}
              </p>

              <Button
                size="sm"
                variant="outline-danger"
                onClick={()=>removeFromCart(item.cartId)}
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}

      <div className="text-end mt-4 border-top pt-3">
        <h4>Total: ₹{Number(total).toFixed(2)}</h4>

        <Link to="/checkout">
          <Button className="mt-3" variant="dark">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default Cart;
