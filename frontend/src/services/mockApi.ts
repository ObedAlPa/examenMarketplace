import { products } from '../mocks/products'

export function getFeaturedProducts(){
  return products.slice(0,6)
}

export function getCategories(){
  // derive categories from product list for mock
  return ['Electrónica','Computación','Hogar','Ropa','Deportes','Libros']
}
