import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { UserIcon } from 'lucide-react'
import { auth } from '@/auth'
import { signOutUser } from '@/lib/actions/user.actions'
import { DropdownMenu,DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Astloch } from 'next/font/google'


const UserButton = async () => {
  const session = await auth()
  // console.log("Session from user-button file", session)

  if(!session) {
    return (
      <Button asChild>
        <Link href='/sign-in'>
          <UserIcon /> Sign in
        </Link>
      </Button>
    )
  }
  const userImg = session.user?.image;
  const firstInit = session.user?.name?.charAt(0).toUpperCase() ?? 'U';
  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button variant='ghost' className='relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200'>{userImg ? <Image className='min-w-8 h-8 block' src={userImg} alt="user image" width={32} height={32} />  : firstInit}</Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem className='p-0 mb-1'>
            <form action={signOutUser}>
              <Button className='w-full py-4 px-2 h-4 justify-start' variant='ghost'>Sign out</Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserButton