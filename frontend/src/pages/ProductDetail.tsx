import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import productService from '../services/productService'
import { normalizeDriveImageUrl } from '../utils/image'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState<any | null>(null)
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  useEffect(() => {
    productService.getProductById(id).then(setProduct)
  }, [id])

  const handleAdd = () => {
    if (!product) return
    addItem({ id: product.id, titulo: product.titulo, precio: Number(product.precio), archivo_url: product.archivo_url })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (!product) return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">Producto no encontrado</main>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                <img src={normalizeDriveImageUrl(product.archivo_url)} alt={product.titulo} className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="md:col-span-2">
              <h1 className="text-2xl font-bold">{product.titulo}</h1>
              <p className="text-muted mt-2">Categoría: {product.categoria || 'General'}</p>
              <p className="mt-4 text-lg font-semibold text-primary">{formatPrice(product.precio)}</p>
              <p className="mt-3">{product.descripcion || 'Sin descripción disponible.'}</p>

              <div className="mt-6 flex items-center gap-4">
                <span className={`px-3 py-1 rounded ${product.stock>0? 'bg-success text-white':'bg-gray-200 text-muted'}`}>
                  {product.stock>0? `En stock (${product.stock})` : 'Agotado'}
                </span>
                <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded">{added ? 'Agregado ✓' : 'Agregar al carrito'}</button>
              </div>

              <div className="mt-6 bg-surface p-4 rounded border border-border">
                <h4 className="font-semibold">Vendedor</h4>
                <p className="text-sm text-muted">Información de contacto no disponible en mock</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
