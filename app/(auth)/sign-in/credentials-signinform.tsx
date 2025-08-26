'use client'
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signInWithCredentirals } from "@/lib/actions/user.actions"
import { useSearchParams } from "next/navigation"


const CredentialSignInForm = () => {

  const [data, action] = useActionState(signInWithCredentirals,{success:false, message:''})

  // console.log("data",data)

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className='w-full' variant='default'>
        {pending ? 'Signing In...' : 'Sign In'}
      </Button>
    );
  };

  return (
    <form className='space-y-6' action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className='space-y-2'>
        <Label htmlFor="email">Email</Label>
        <Input id='email' name='email' type="email" required autoComplete="email" />
      </div>
      <div className='space-y-2'>
        <Label htmlFor="email">Password</Label>
        <Input id='password' name='password' type="password" required autoComplete="password" />
      </div>

      <SignInButton />

      {data && !data.success && (
        <div className="text-center text-destructive">
          {data.message}
        </div>
      )}

      <div className="text-sm text-center text-muted-foreground">
        Don&apos't have an account? <Link href="/sign-up"> Sign up</Link>
      </div>

    </form>
  )
}

export default CredentialSignInForm