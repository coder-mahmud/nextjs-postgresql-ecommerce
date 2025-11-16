'use client'
import { useRouter } from 'next/navigation'
import { Cart, CartItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus, Minus, Loader } from 'lucide-react'
import { toast } from "sonner"
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action'
import Link from 'next/link'
import { useTransition } from 'react'




import React from 'react'
import { start } from 'repl'

const AddToCart = ({item, cart}: {item:CartItem; cart? : Cart}) => {
  // console.log("Cart Item", item)

  const router = useRouter();
  const [isPending, startTransition] = useTransition()

  const handleAddToCart = async () => {
    startTransition ( async () => {
      
      const res = await addItemToCart(item)

      if(!res?.success){
       toast.error(res?.message)
      }else{
        // toast.success(res.message)
        toast.success(res.message , {
          action:<Button className='bg-primary text-white'> <Link href="/cart">Go to Cart</Link> </Button>,
        });
      }
  
      


    })

  }

  const handleRemoveFromCart = async () => {

    startTransition ( async () => {

      const res =  await removeItemFromCart(item.productId)
      // console.log("Remove result:", res)
      if(!res?.success){
        toast.error(res?.message)
       }else{
        // toast.success(res.message)
        toast.success(res.message , {
          action:<Button className='bg-primary text-white'> <Link href="/cart">Go to Cart</Link> </Button>,
        });
       }
   
       

    })
    
  }

  // Check if item is in cart 
  const existItem = cart && cart.items.find(x => x.productId === item.productId)
  return (
    <>
      {existItem ? (
        <div className="">
          <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
            {isPending ? <Loader className='h-4 w-4 animate-spin' /> : <Minus className='h-4 w-4' />}
          </Button>
          <span className="px-2">{existItem.qty}</span>
          <Button type='button' variant='outline' onClick={handleAddToCart}>
            {isPending ? <Loader className='h-4 w-4 animate-spin' /> : <Plus className='h-4 w-4' />}
            
          </Button>
        </div>
      ) : 
        isPending ? <Loader className='h-4 w-4 animate-spin' /> : <Button className='w-full' type='button' onClick={handleAddToCart}>+ Add To Cart</Button>
      
      
      }
    </>
  )
}

export default AddToCart