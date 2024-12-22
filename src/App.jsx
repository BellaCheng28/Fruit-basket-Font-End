
import { createContext,useEffect, useState } from "react"; 
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import * as authService from "../src/services/authService"; //
import ProductList from "./components/ProductList/ProductList";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import ProductForm from"./components/ProductForm/ProductForm"
import * as productService from "./services/productService";
import ReviewForm from "./components/ReviewForm/ReviewForm";
import Orders from "./components/Orders/Orders";
import ShoppingCart from "./components/ShoppingCart.jsx/ShoppingCart";
import * as orderService from"./services/orderService"

export const AuthedUserContext = createContext(null); // set the initial value of the context to null
export const cartContext = createContext();


const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [products, setProducts] = useState([]);
  const[cart,setCart]=useState([])
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token"); // 从 localStorage 获取 token
    if (token) {
      const currentUser = authService.getUser(); // 使用 token 获取用户信息
      setUser(currentUser); // 设置用户信息
    }
  }, []);

  const  addToCart =(product,quantity)=>{
    setCart((prevCart)=>{
      const existingProduct = prevCart.find(
        (item) => item.product._id === product._id
      );
      if (existingProduct) {
        console.log(`Updated quantity for ${product.name}`);
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };
  const removeFromCart =(productId)=>{
    setCart((prevCart)=>prevCart.filter((item)=>(
      item.product_id !== productId
    ))
  )
  };
  const clearCart=()=>setCart([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.allProducts();
        setProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

 useEffect(() => {
  const fetchOrders = async()=>{
   try {
     const orders = await orderService.allOrders();
     setOrders(orders);
   } catch (error) {
   }
  }
   fetchOrders();

 },[]);



  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  const isAdmin = user && user.role === "admin";
  const isCustomer = user && user.role === "customer";

  return (
    <AuthedUserContext.Provider
      value={{
        user,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      <NavBar handleSignout={handleSignout} />
      <Routes>
        {/* public Routes: */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Landing />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList products={products} />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/products/productId/reviews" element={<ReviewForm />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/orders" element={<Orders/>} />
        

        {/* customer Routes: */}
        {isCustomer && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
          </>
        )}
        {/* admin Routes */}
        {isAdmin && (
          <>
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route
              path="/products/:productId/edit"
              element={
                <ProductForm products={products} setProducts={setProducts} />
              }
            />
            <Route
              path="/products/new"
              element={
                <ProductForm products={products} setProducts={setProducts} />
              }
            />

            <Route path="/orders" />
          </>
        )}

        <Route path="/signup" element={<SignupForm setUser={setUser} />} />
        <Route path="/signin" element={<SigninForm setUser={setUser} />} />
      </Routes>
    </AuthedUserContext.Provider>
  );
};

export default App;
