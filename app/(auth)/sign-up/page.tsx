import { Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, } from '@/components/ui/card'
import Link from 'next/link'
import { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import SignUpForm from './sign-up-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'


export const metadata:Metadata = {
  title: "Sign up"
}


const SignUpPage = async (props:{
  searchParams:Promise<{callbackUrl:string}>
}) => {

  const {callbackUrl} = await props.searchParams

  const session = await auth();
  //console.log("session", session)

  


  if(session){
    return redirect(callbackUrl || '/')
  }
  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
        
          <Link href='/' className='flex flex-center'>
            <Image src="/images/logo.svg"  width={100} height={100} alt="Logo" priority={true} />
            
          </Link>
        </CardHeader>
        <CardTitle className='text-center'>Sign up</CardTitle>

        <CardDescription className='text-center'>Enter your information below to sign up.</CardDescription>

        <CardContent className='space-y-4'>
          <SignUpForm />
        </CardContent>


      </Card>







    </div>
  )
}

export default SignUpPage