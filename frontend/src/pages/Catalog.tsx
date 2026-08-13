import React, { useMemo, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import ProductGrid from '../components/product/ProductGrid'
import { products as allProducts } from '../mocks/products'
import { getCategories } from '../services/mockApi'

export default function Catalog(){
  const categories = getCategories()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const products = useMemo(() => {
    return allProducts.filter(p => {
      if (query && !p.titulo.toLowerCase().includes(query.toLowerCase())) return false
      if (category && category !== 'Todas' && p.categoria && p.categoria !== category) return false
      if (priceMin && p.precio < Number(priceMin)) return false
      if (priceMax && p.precio > Number(priceMax)) return false
      if (onlyAvailable && p.stock <= 0) return false
      return true
    })
  }, [query, category, priceMin, priceMax, onlyAvailable])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Catálogo</h1>
          <p className="text-muted mt-2">Explora los productos disponibles</p>
        </header>

        <section className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 bg-white p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-3">Filtros</h4>
            <label className="block text-sm mb-1">Buscar</label>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar..." className="w-full p-2 rounded border border-border mb-3" />

            <label className="block text-sm mb-1">Categoría</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 rounded border border-border mb-3">
              <option value="">Todas</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="block text-sm mb-1">Precio mínimo (MXN)</label>
            <input value={priceMin} onChange={e => setPriceMin(e.target.value)} type="number" className="w-full p-2 rounded border border-border mb-3" />
            <label className="block text-sm mb-1">Precio máximo (MXN)</label>
            <input value={priceMax} onChange={e => setPriceMax(e.target.value)} type="number" className="w-full p-2 rounded border border-border mb-3" />

            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} /> Sólo disponibles</label>
          </div>

          <div className="md:col-span-3">
            <ProductGrid products={products} />
          </div>
        </section>
      </main>
    </div>
  )
}
