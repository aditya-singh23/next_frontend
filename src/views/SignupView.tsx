'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { signupUser, clearErrors } from '@store/slices/authSlice';
import { signupSchema, SignupFormData } from '@validationSchemas/index';
import Button from '@components/Button';
import Input from '@components/Input';
import { ROUTES } from '@constants/index';

const GoogleOAuthButton = dynamic(() => import('@components/GoogleOAuthButton'), {
  loading: () => (
    <button
      disabled
      className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-400 cursor-not-allowed"
    >
      <span className="animate-pulse">Loading...</span>
    </button>
  ),
  ssr: true,
});

export default function SignupView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      await dispatch(signupUser(data)).unwrap();
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push(ROUTES.LOGIN)}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Full Name"
              type="text"
              {...register('name')}
              placeholder="Enter your full name"
              error={errors.name?.message}
              required
            />

            <Input
              label="Email address"
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              error={errors.email?.message}
              required
            />

            <Input
              label="Password"
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              error={errors.password?.message}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              required
            />
          </div>

          <Button type="submit" loading={isLoading} className="w-full">
            Sign up
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <GoogleOAuthButton text="Sign up with Google" />
        </form>

        {/* Login link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push(ROUTES.LOGIN)}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
