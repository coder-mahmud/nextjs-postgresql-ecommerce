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
import CredentialSignInForm from './credentials-signinform'
import { auth, signIn } from '@/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'


export const metadata:Metadata = {
  title: "Sign in"
}


const SignInPage = async (props:{
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
        <CardTitle className='text-center'>Sign in</CardTitle>

        <CardDescription className='text-center'>Sign in to your account</CardDescription>

        <CardContent className='space-y-4'>
          <CredentialSignInForm />
        </CardContent>


      </Card>

      <form
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <div className="flex justify-center mt-11">
          <Button className='cursor-pointer hover:text-black hover:bg-white border border-black  transition-all duration-300 mx-auto'>Signin with Google</Button>
        </div>
      </form>





    </div>
  )
}

export default SignInPage