import React from 'react'

type Product = {
  id: string;
  titulo: string;
  precio: number;
  stock: number;
  archivo_url?: string;
}

export default function ProductCard({product}:{product:Product}){
  return (
    <div className="bg-surface border border-border rounded-lg p-4 shadow-sm">
      <div className="w-full h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
        <img src={product.archivo_url || '/placeholder.png'} alt={product.titulo} className="object-cover h-full w-full rounded-md" />
      </div>
      <h4 className="text-base font-semibold text-text">{product.titulo}</h4>
      <p className="text-sm text-muted mt-1">${product.precio.toFixed(2)}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-sm ${product.stock>0? 'bg-success text-white':'bg-gray-200 text-muted'}`}>
          {product.stock>0? 'En stock':'Agotado'}
        </span>
        <button className="bg-primary text-white px-3 py-1 rounded">Agregar</button>
      </div>
    </div>
  )
}
