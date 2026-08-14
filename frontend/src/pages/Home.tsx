import { useEffect, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import ProductGrid from '../components/product/ProductGrid'
import productService from '../services/productService'
import { Link } from 'react-router-dom'

export default function Home(){
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState<string[]>([])

  // El backend devuelve categorías como objetos {id, nombre, slug} y el mock
  // como strings; normalizamos a string para no crashear el render.
  const categoryName = (c: any) => (typeof c === 'string' ? c : (c && c.nombre) || '')

  useEffect(() => {
    productService.getFeaturedProducts().then(setProducts)
    productService.getCategories().then(setCategories)
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold">Categorías</h2>
          <div className="flex gap-3 mt-3">
            {categories.map(c => {
              const name = categoryName(c)
              return (
                <Link key={name} to={`/catalog?category=${encodeURIComponent(name)}`} className="px-3 py-1 rounded bg-white border border-border text-muted">{name}</Link>
              )
            })}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold">Productos destacados</h2>
          <ProductGrid products={products} />
        </section>

        <section className="mt-12">
          <h3 className="text-xl font-semibold">Quiénes somos</h3>
          <p className="text-muted mt-2">TenoMerca — Compras con alma mexicana. Plataforma educativa para el examen.</p>
        </section>
      </main>
    </div>
  )
}
