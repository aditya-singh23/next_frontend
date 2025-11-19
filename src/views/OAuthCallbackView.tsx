'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@hooks/index';
import { googleOAuthSuccess } from '@store/slices/authSlice';
import { ROUTES } from '@constants/index';
import { User } from '@interfaces/index';

export default function OAuthCallbackView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      router.push(`${ROUTES.LOGIN}?error=${error}`);
      return;
    }

    if (token && userStr) {
      try {
        const user: User = JSON.parse(decodeURIComponent(userStr));
        dispatch(googleOAuthSuccess({ token, user }));
        router.push(ROUTES.DASHBOARD);
      } catch (err) {
        console.error('Failed to parse user data:', err);
        router.push(`${ROUTES.LOGIN}?error=invalid_data`);
      }
    } else {
      router.push(`${ROUTES.LOGIN}?error=missing_data`);
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}
