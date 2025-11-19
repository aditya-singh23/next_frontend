import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '@store/store';

/**
 * Custom hook for typed selector
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
