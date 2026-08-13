import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Account from './pages/Account'
import Orders from './pages/Orders'
import { AuthProvider } from './context/AuthContext'

export default function App(){
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/catalog' element={<Catalog/>} />
        <Route path='/product/:id' element={<ProductDetail/>} />
        <Route path='/auth/login' element={<Login/>} />
        <Route path='/auth/register' element={<Register/>} />
        <Route path='/account' element={<Account/>} />
        <Route path='/orders' element={<Orders/>} />
      </Routes>
    </AuthProvider>
  )
}
