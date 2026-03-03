import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <Container className="text-center py-5">
      <h2>🎉 Order Confirmed!</h2>
      <p>Your order has been placed successfully. You will receive an email soon.</p>
      <Button as={Link} to="/products" variant="dark">
        Continue Shopping
      </Button>
    </Container>
  );
};

export default OrderSuccess;
