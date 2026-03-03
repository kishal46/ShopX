import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import PageTopBar from "../components/PageTopBar";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [confirmBox, setConfirmBox] = useState({ show: false, id: null });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  const deleteYes = async () => {
    try {
      await axios.delete(`${API}/api/products/${confirmBox.id}`);
      toast.success("🗑️ Product deleted");
      setConfirmBox({ show: false, id: null });
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const discountPercent = (p) => {
    if (!p.discountPrice) return null;
    return Math.round(100 - (p.discountPrice / p.price) * 100);
  };

  return (
    <Container className="py-4">
      <PageTopBar/>
      <h2 className="mb-4 text-center">Manage Products</h2>

      {/* CUSTOM CONFIRM MODAL */}
      {confirmBox.show && (
        <div style={{
          position:"fixed",
          top:0, left:0, width:"100%", height:"100%",
          background:"rgba(0,0,0,.45)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:2000
        }}>
          <div style={{
            background:"#fff",
            padding:"28px",
            borderRadius:"12px",
            width:"340px",
            textAlign:"center",
            boxShadow:"0 12px 35px rgba(0,0,0,.35)"
          }}>
            <h5 style={{marginBottom:"12px", fontWeight:"700"}}>Are you sure?</h5>
            <p style={{marginBottom:"18px"}}>This product will be deleted permanently.</p>
            <Button variant="danger" style={{marginRight:10}} onClick={deleteYes}>Delete</Button>
            <Button variant="secondary" onClick={() => setConfirmBox({show:false,id:null})}>Cancel</Button>
          </div>
        </div>
      )}

      <Table bordered hover responsive>
        <thead className="table-dark text-center">
          <tr>
            <th>#</th>
            <th>NAME</th>
            <th>CATEGORY</th>
            <th>PRICE</th>
            <th>DISCOUNT</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {products.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              
              <td>
                {p.discountPrice ? (
                  <>
                    <span style={{ fontWeight: 700 }}>₹{p.discountPrice}</span>{" "}
                    <span className="text-muted text-decoration-line-through">
                      ₹{p.price}
                    </span>
                  </>
                ) : (
                  <span>₹{p.price}</span>
                )}
              </td>

              <td>
                {p.discountPrice ? (
                  <Badge bg="success">{discountPercent(p)}% OFF</Badge>
                ) : (
                  "-"
                )}
              </td>

              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmBox({ show: true, id: p._id })}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageProducts;
