'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { resetPassword, clearErrors, clearMessages } from '@store/slices/authSlice';
import { resetPasswordSchema, ResetPasswordFormData } from '@validationSchemas/index';
import Button from '@components/Button';
import Input from '@components/Input';
import { ROUTES } from '@constants/index';

export default function ResetPasswordView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, resetPasswordMessage } = useAppSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await dispatch(resetPassword(data)).unwrap();
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      console.error('Reset password failed:', err);
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
            Enter the code sent to your email and your new password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {resetPasswordMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{resetPasswordMessage}</p>
              <p className="text-xs text-gray-600 mt-1">Redirecting to login...</p>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              error={errors.email?.message}
              required
            />

            <Input
              label="OTP Code"
              type="text"
              {...register('otp')}
              placeholder="Enter 6-digit code"
              error={errors.otp?.message}
              required
            />

            <Input
              label="New Password"
              type="password"
              {...register('newPassword')}
              placeholder="Enter new password"
              error={errors.newPassword?.message}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              {...register('confirmNewPassword')}
              placeholder="Confirm new password"
              error={errors.confirmNewPassword?.message}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push(ROUTES.FORGOT_PASSWORD)}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              ← Resend code
            </button>
          </div>

          <Button type="submit" loading={isLoading} className="w-full">
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
}
