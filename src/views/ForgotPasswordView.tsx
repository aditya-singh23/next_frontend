'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { forgotPassword, clearErrors, clearMessages } from '@store/slices/authSlice';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@validationSchemas/index';
import Button from '@components/Button';
import Input from '@components/Input';
import { ROUTES } from '@constants/index';

export default function ForgotPasswordView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, forgotPasswordMessage } = useAppSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await dispatch(forgotPassword(data)).unwrap();
    } catch (err) {
      console.error('Forgot password failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {forgotPasswordMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{forgotPasswordMessage}</p>
              <button
                type="button"
                onClick={() => router.push(ROUTES.RESET_PASSWORD)}
                className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Go to reset password →
              </button>
            </div>
          )}

          <Input
            label="Email address"
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            error={errors.email?.message}
            required
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push(ROUTES.LOGIN)}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              ← Back to login
            </button>
          </div>

          <Button type="submit" loading={isLoading} className="w-full">
            Send reset code
          </Button>
        </form>
      </div>
    </div>
  );
}
