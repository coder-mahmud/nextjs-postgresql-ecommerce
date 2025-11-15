'use client'
import { useRouter } from 'next/navigation'
import { CartItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from "sonner"
import { addItemToCart } from '@/lib/actions/cart.action'
import Link from 'next/link'




import React from 'react'

const AddToCart = ({item}: {item:CartItem}) => {
  // console.log("Cart Item", item)

  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item)

    if(!res?.success){
     return toast.error(res?.message)
    }

    // toast.success(res.message)
    toast.success(res.message , {
      action:<Button className='bg-primary text-white'> <Link href="/cart">Go to Cart</Link> </Button>,
    });
  }

  return (
    <>
      <Button className='w-full' type='button' onClick={handleAddToCart}>+ Add To Cart</Button>
    </>
  )
}

export default AddToCart