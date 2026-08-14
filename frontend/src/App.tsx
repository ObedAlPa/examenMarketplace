import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Account from './pages/Account'
import AddressBook from './pages/AddressBook'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminProducts from './pages/AdminProducts'
import AdminCategories from './pages/AdminCategories'
import AdminUsersOrders from './pages/AdminUsersOrders'
import AdminUsers from './pages/AdminUsers'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

export default function App(){
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path='/' element={<Navigate to='/auth/login' replace />} />
          <Route path='/home' element={<Home/>} />
          <Route path='/catalog' element={<Catalog/>} />
          <Route path='/product/:id' element={<ProductDetail/>} />
          <Route path='/auth/login' element={<Login/>} />
          <Route path='/auth/register' element={<Register/>} />
          <Route path='/account' element={<Account/>} />
          <Route path='/orders' element={<Orders/>} />
          <Route path='/orders/:id' element={<OrderDetail/>} />
          <Route path='/account/addresses' element={<AddressBook/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/checkout' element={<Checkout/>} />

          {/* Admin (mock) */}
          <Route path='/admin/products' element={<AdminProducts/>} />
          <Route path='/admin/categories' element={<AdminCategories/>} />
          <Route path='/admin/users-orders' element={<AdminUsersOrders/>} />
          <Route path='/admin/users' element={<AdminUsers/>} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
