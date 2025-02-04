'use client'

import SigninForm from '@/features/auth/components/SigninForm'
import { useAuthStore } from '@/stores/authStore';
import { initializeTheme } from '@/stores/themeStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthPage = () => {
  const isAuth = useAuthStore((state) => state.isAuth);

  const router = useRouter();

  useEffect(() => {
    initializeTheme()
    if (isAuth) {
      router.push("/dashboard");
    }
  }, [router, isAuth]);

  return (
    <section className='flex h-screen'>
      <div className="flex-1 hidden md:block ">
        <Image
          src={'/assets/bg.svg'}
          width="760"
          height="960"
          alt="Login background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className='flex flex-1 justify-center items-center flex-col py-10 bg-background'>
        <SigninForm />
      </div>
    </section>
  )
}

export default AuthPage