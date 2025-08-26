'use server'
import { signInFormSchema, signUpFormSchema } from "../validators"
import { signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { hashSync } from "bcrypt-ts-edge"
import { PrismaClient } from "../generated/prisma"
import { success,z } from "zod"

const prisma = new PrismaClient();

// Sgin in user with creds
export async function signInWithCredentirals(prevState: unknown, formData: FormData){

  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'), 
      password: formData.get('password'),
    });

    const signin = await signIn('credentials', user)
    console.log("signin",signin)
    return {success: true, message:"Signed in successfully"}
  } catch (err) {
    if(isRedirectError(err)){
      console.log("redirect error:", err)
      throw err
    }
    console.log("signin error:", err)
    return {success: false, message:"Invalid email or password!"}
  }

}



export async function signOutUser(){
  await signOut();
}


// Sign up user
export async function signUpUser(prevState:unknown, formData: FormData){
  try {
    // const user = signUpFormSchema.parse({
    //   name: formData.get('name'),
    //   email: formData.get('email'),
    //   password: formData.get('password'),
    //   confirmPassword: formData.get('confirmPassword'),
    // })

    const result = signUpFormSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!result.success) {
      return {
        success: false,
        errors: result.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      };
    }
    const user = result.data;

    const plainPassword = user.password
    user.password = hashSync(user.password,10)
    
    await prisma.user.create({
      data:{
        name:user.name,
        email:user.email,
        password:user.password,
      }
    })

    await signIn('credentials', {
      email: user.email,
      password:plainPassword,
    })

    return {success:true, message:"User registered successfully!"}


  } catch (err:any) {
    if(isRedirectError(err)){
      console.log("redirect error:", err)
      throw err
    }

    console.log("Signup error:", err)

    if (err instanceof z.ZodError) {
      return { success: false, errors: err.issues }
    }
    return {success: false, message:'Something went wrong!'}
  }
} 