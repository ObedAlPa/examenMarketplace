import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'

export default function App(){
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/catalog' element={<Catalog/>} />
      <Route path='/product/:id' element={<ProductDetail/>} />
    </Routes>
  )
}
