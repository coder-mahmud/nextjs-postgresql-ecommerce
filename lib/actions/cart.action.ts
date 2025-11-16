'use server'
import { cookies } from "next/headers"
import { Cart, CartItem } from "@/types"
import { prisma } from "../dbConnect"
import { auth } from "@/auth"
import { convertToPlainObject, round2 } from "../utils"
import { cartItemSchema, inserCartSchema } from "../validators"
import { RouteKind } from "next/dist/server/route-kind"
import { use } from "react"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

//Calculart cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice =  round2(
    items.reduce((acc,item) => (acc + +item.price) * item.qty ,0)
  );

  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10 );
  const taxPrice = round2(0.15 * itemsPrice );
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice : itemsPrice.toFixed(2),
    shippingPrice : shippingPrice.toFixed(2),
    taxPrice : taxPrice.toFixed(2),
    totalPrice : totalPrice.toFixed(2),

  }
}

export async function addItemToCart(data:CartItem){

  try {

    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    // console.log("sessionCartId", sessionCartId)
    if(!sessionCartId){
      throw new Error('Cart session not found!')
    }

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined
    // console.log("userId", userId)
    
    //Get existing cart
    const cart = await getMyCart();
    
    //Validate new cart item
    const item = cartItemSchema.parse(data)

    //Get the new product from db
    const product =  await prisma.product.findFirst({
      where: {id: item.productId}
    })
    // console.log("product", product)

    if(!product){
      throw new Error("Product not found!")
    }

    if(!cart){
      console.log("Cart not found and creating one!")
      const newCart = inserCartSchema.parse({
        userId:userId,
        items:[item],
        sessionCartId: sessionCartId,
        ...calcPrice([item])
      })
      // console.log("New cart:", newCart)

      //Add to DB
      const insertedCart =  await prisma.cart.create({
        data:newCart
      })

      //Revalidate product page
      revalidatePath(`/products/${product.slug}`)

      return {
        success:true,
        message:`${product.name} added to cart!`
      }


    }else{
      // console.log("Cart found!")
      // Check if item is alreay in the cart
      const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId );
      // console.log("existItem",existItem)
      
      if(existItem){
        //check stock
        if(product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock")
        }
        // Increase the qty on cart
        let foundItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId );
        foundItem!.qty = existItem.qty + 1

        // console.log("Cart", cart)

      }else{
        //Check stock
        if(product.stock < 1) throw new Error("Not enough stock!");


        //Add item to cart.items
        cart.items.push(item)
      }
      
      //Save to db
      await prisma.cart.update({
        where:{id:cart.id},
        data:{
          items: cart.items,
          ...calcPrice(cart.items as CartItem[])

        }
      })

      // revalidate path
      revalidatePath(`/products/${product.slug}`)


      return {
        success:true,
        message:`${product.name} ${existItem ? 'Updated in ' : 'added to '}cart`
      }
    }


    
  } catch (error:any) {
    return {
      success:false,
      // message: 'Something went wrong'
      message: error?.message
    }
  }
}



export async function getMyCart(){
  const sessionCartId = (await cookies()).get('sessionCartId')?.value
  if(!sessionCartId){
    throw new Error('Cart session not found!')
  }

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined

  //get cart from db 
  const cart = await prisma.cart.findFirst({
    where: {sessionCartId:sessionCartId}
  });
  
  if(!cart){
    return undefined
  }

  console.log("Cart:",cart)
  if(userId && !cart.userId){
    // console.log("Cart userid not set yet")
    // user exists but cart does not have added one yet.
    await prisma.cart.update({
      where:{id: cart.id},
      data:{
        userId: userId
      }
    })
  }

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),


  })

}


export async function removeItemFromCart(productId : string){
  try {

    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if(!sessionCartId){
      throw new Error('Cart session not found!')
    }
  
    // Get Prduct from db
    const product = await prisma.product.findFirst({
      where:{id: productId}
    })

    if(!product) throw new Error("Product not found!")
    
    // GET user cart
    const cart = await getMyCart();
    if(!cart) throw new Error("Cart not found!")

    // Check for item
    const exist = (cart.items as CartItem[]).find(item => item.productId === productId)
    const preserved = structuredClone(exist);
    if(!exist) throw new Error("Item not found!")

    // Check if only 1 in aty

    if(exist.qty === 1){
      cart.items = (cart.items as CartItem[]).filter(item => item.productId !== exist.productId)
    }else{
      //Decrease qty
      (cart.items as CartItem[]).find(item => item.productId === productId)!.qty = exist.qty - 1
    }

    //Update cart in db
    await prisma.cart.update({
      where:{id: cart.id},
      data:{
        items: cart.items,
        ...calcPrice(cart.items as CartItem[])
      }
    })

    revalidatePath((`/products/${product.slug}`))

    return {success: true, message: preserved!.qty === 1 ? `${product.name} was removed from cart` :  `${product.name} was updated in cart`}

  } catch (error : any) {
    return {success: false, message: error.message}
  }
}