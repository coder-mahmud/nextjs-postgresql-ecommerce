'use client'
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signUpUser } from "@/lib/actions/user.actions"
import { useSearchParams } from "next/navigation"


const SignUpForm = () => {

  const [data, action] = useActionState(signUpUser,{success:false, message:''})

  // console.log("data",data)

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className='w-full' variant='default'>
        {pending ? 'Submitting...' : 'Sign Up'}
      </Button>
    );
  };

  return (
    <form className='space-y-6' action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className='space-y-2'>
        <Label htmlFor="name">Name</Label>
        <Input id='name' name='name' type="text" required autoComplete="name" />
      </div>
      <div className='space-y-2'>
        <Label htmlFor="email">Email</Label>
        <Input id='email' name='email' type="email" required autoComplete="email" />
      </div>
      <div className='space-y-2'>
        <Label htmlFor="password">Password</Label>
        <Input id='password' name='password' type="password" required autoComplete="password" />
      </div>
      <div className='space-y-2'>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id='confirmPassword' name='confirmPassword' type="password" required autoComplete="confirmPassword" />
      </div>

      <SignUpButton />

      {/* {data && !data.success && (
        <div className="text-center text-destructive">
          {data.message}
        </div>
      )} */}

      {data && !data.success && data.errors && (
        <ul className="text-destructive text-sm space-y-1">
          {data.errors.map((err: any, i: number) => (
            <li key={i}>{err.message}</li>
          ))}
        </ul>
      )}

      {data && !data.success && data.message && !data.errors && (
        <div className="text-destructive text-sm">{data.message}</div>
      )}




      <div className="text-sm text-center text-muted-foreground">
        Already have an account? <Link href="/sign-in"> Sign in</Link>
      </div>

    </form>
  )
}

export default SignUpForm