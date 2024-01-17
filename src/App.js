import React, { useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import ProductDetailPage from './pages/ProductDetailPage';
import Protected from './features/auth/Protected';
import { fetchItemsByUserIdAsync } from './features/Cart/EcomCartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from './features/auth/AuthSlice';
import PageNotFound from './pages/404';
import OrderSuccessPage from './pages/OrderSucessPage';
import { fetchLoggedInUserAsync } from './features/user/userSlice';
import UserProfilePage from './pages/UserProfilePage';
import UserOrderPage from './pages/UserOrderPage';
import Logout from './features/auth/Logout';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProtectedAdmin from './features/auth/ProtectedAdmin';
import AdminHome from './pages/AdminHome';
import AdminProductDetailPage from './pages/AdminProductDetailPage';
import AdminProductFormPage from './pages/AdminProductFormPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import EcomNavBar from './features/navBar/EcomNavBar';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected><Home></Home></Protected>,
  },
  {
    path: '/admin',
    element: (
      <ProtectedAdmin>
        <AdminHome></AdminHome>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/login",
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/signup",
    element: <SignupPage></SignupPage>,
  },
  {
    path: "/cart",
    element: <Protected><EcomNavBar><CartPage></CartPage></EcomNavBar></Protected>,
  },
  {
    path: "/checkout",
    element: <Protected><EcomNavBar><Checkout></Checkout></EcomNavBar></Protected>,
  },
  {
    path: "/productdetail/:id",
    element: <Protected> <ProductDetailPage></ProductDetailPage></Protected>,
  },
  {
    path: '/admin/product-detail/:id',
    element: (
      <ProtectedAdmin>
        <AdminProductDetailPage></AdminProductDetailPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/product-form',
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/orders',
    element: (
      <ProtectedAdmin>
        <AdminOrdersPage></AdminOrdersPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/product-form/edit/:id',
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "*",
    element: <PageNotFound></PageNotFound> 
  },
  {
    path: "/orderSuccess/:id",
    element: <OrderSuccessPage></OrderSuccessPage> 
  },
  {
    path: '/profile',
    element: (<Protected><UserProfilePage></UserProfilePage>{' '}</Protected>
    ),
  },
  {
    path: '/orders',
    element: <Protected><UserOrderPage></UserOrderPage></Protected>
  },
  {
    path: '/logout',
    element: <Protected><Logout></Logout></Protected>
  },
  {
    path: '/forgotpassword',
    element: <ForgotPasswordPage></ForgotPasswordPage>
  },
]);

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(()=>{
    if(user){
      dispatch(fetchItemsByUserIdAsync());
      dispatch(fetchLoggedInUserAsync(user));
    }
  },[dispatch,user])
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
