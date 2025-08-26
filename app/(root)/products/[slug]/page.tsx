import React from 'react'
import { getProductBySlug } from '@/lib/actions/product.action'
import { notFound } from 'next/navigation'
import { mapProduct } from '@/lib/productMapper'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumberWithDecimal } from '@/lib/utils'
import ProductImages from '@/components/shared/product/product-images'




const ProductPage = async (props:{params:Promise<{slug:string}>}) => {
  const {slug} = await props.params
  const prismaProduct = await getProductBySlug(slug);
  if(!prismaProduct) notFound()
  const product = mapProduct(prismaProduct)
// console.log("mappedProd",mappedProd)
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2"><ProductImages images={product.images} /></div>
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p className="">
                {product.brand} {product.category}
              </p>
              <h1 className='h3-bold'>{product.name}</h1>
              <p className="">{product.rating} of {product.numReviews}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3"></div>
              <p className="w-24 rounded-full bg-green-100 text-green-500 px-5 py-2">${formatNumberWithDecimal(+product.price)}</p>
            </div>

            <div className="mt-10">

              <p className="font-semibold">Description</p>
              <p className="">{product.description}</p>
              
            </div>

          </div>
          <div className="col-span-1">
            <Card>
              <CardContent className='p-4'>
                
                <div className="mb-2 flex justify-between">
                  <p>Price:</p>
                  <p>${formatNumberWithDecimal(+product.price)}</p>
                  
                </div>

                <div className="mb-2 flex justify-between">
                  <p>Status:</p>
                  <p>{product.stock > 0 ? (<Badge variant='outline'>In Stock</Badge>) : (<Badge variant='destructive'>Out of stock</Badge>)}</p>
                  
                </div>

                {product.stock > 0 && (
                  <div className="flex flex-center">
                    <Button className='w-full'>Add to cart</Button>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductPage