import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'

export default function App(){
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/catalog' element={<Catalog/>} />
      {/* product detail added in separate commit */}
    </Routes>
  )
}
