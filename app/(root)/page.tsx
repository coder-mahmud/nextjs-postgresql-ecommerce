import React from 'react'
import type { Metadata } from "next";
import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.action';
import { mapProducts } from '@/lib/productMapper';



export const metadata: Metadata = {
  title: `Home`,
};


// const delay = (ms: number) => new Promise(resolve => {
//   return setTimeout(resolve, ms)
// })

const HomePage = async () => {
  // await delay(2000)

  const latestProducts = await getLatestProducts();
  // console.log("latestProducts", latestProducts)
  

  const products = mapProducts(latestProducts);




  return (
    <div>
      <ProductList data={products} title="Newest Arrivals" limit={4}/>
    </div>
  )
}

export default HomePage