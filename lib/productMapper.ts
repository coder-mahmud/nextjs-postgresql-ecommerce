// lib/mapProduct.ts
import { Decimal } from "@prisma/client/runtime/library";
import { Product } from "@/types";

// Single product mapping
export function mapProduct(product: any): Product {
  return {
    ...product,
    price: product.price instanceof Decimal ? product.price.toFixed(2) : String(product.price),
    rating: product.rating instanceof Decimal ? product.rating.toString() : String(product.rating),
    createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : String(product.createdAt),
  };
}

// Map an array of products
export function mapProducts(products: any[]): Product[] {
  return products.map(mapProduct);
}
