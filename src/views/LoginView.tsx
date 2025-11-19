'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { loginUser, clearErrors } from '@store/slices/authSlice';
import { loginSchema, LoginFormData } from '@validationSchemas/index';
import Button from '@components/Button';
import Input from '@components/Input';
import GoogleOAuthButton from '@components/GoogleOAuthButton';
import { ROUTES } from '@constants/index';

export default function LoginView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
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

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => router.push(ROUTES.SIGNUP)}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
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
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => router.push(ROUTES.FORGOT_PASSWORD)}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <Button type="submit" loading={isLoading} className="w-full">
            Sign in
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
          <GoogleOAuthButton />
        </form>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push(ROUTES.SIGNUP)}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
