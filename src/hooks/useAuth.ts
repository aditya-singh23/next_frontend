import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { logout, selectAuth } from '@store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@constants/index';

/**
 * Custom hook for authentication
 * Provides auth state and logout functionality
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector(selectAuth);

  const handleLogout = () => {
    dispatch(logout());
    router.push(ROUTES.LOGIN);
  };

  return {
    ...auth,
    logout: handleLogout,
  };
};
