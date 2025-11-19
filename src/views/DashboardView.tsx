'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';
import { getUsers, loadMoreUsers, logout } from '@store/slices/authSlice';
import Button from '@components/Button';
import { ROUTES } from '@constants/index';

export default function DashboardView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, users, usersHasMore, usersPage, isLoading, isAuthenticated } = useAppSelector(
    state => state.auth
  );

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState<'all' | 'local' | 'google'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  // Prevent duplicate API calls in React Strict Mode (development only)
  const hasFetchedUsers = useRef(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    // Load initial users only once
    if (!hasFetchedUsers.current) {
      hasFetchedUsers.current = true;
      dispatch(getUsers({ page: 1, limit: 20 }));
    }
  }, [dispatch, isAuthenticated, router]);

  const handleLoadMore = () => {
    if (!isLoading && usersHasMore) {
      dispatch(loadMoreUsers({ page: usersPage + 1, limit: 20 }));
    }
  };

  const { loadMoreRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: usersHasMore,
    isLoading,
  });

  const handleLogout = () => {
    dispatch(logout());
    router.push(ROUTES.LOGIN);
  };

  // Filter and search users
  const filteredUsers = useMemo(() => {
    const normalizedSearch = debouncedSearchQuery.toLowerCase();

    return users.filter(u => {
      // Search filter (name or email)
      const matchesSearch =
        normalizedSearch === '' ||
        u.name.toLowerCase().includes(normalizedSearch) ||
        u.email.toLowerCase().includes(normalizedSearch);

      // Provider filter
      const matchesProvider = providerFilter === 'all' || u.provider === providerFilter;

      // Verified filter
      const matchesVerified =
        verifiedFilter === 'all' ||
        (verifiedFilter === 'verified' && u.emailVerified) ||
        (verifiedFilter === 'unverified' && !u.emailVerified);

      return matchesSearch && matchesProvider && matchesVerified;
    });
  }, [users, debouncedSearchQuery, providerFilter, verifiedFilter]);

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setProviderFilter('all');
    setVerifiedFilter('all');
  };

  const hasActiveFilters =
    searchQuery !== '' || providerFilter !== 'all' || verifiedFilter !== 'all';

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-medium text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Provider</p>
              <p className="text-lg font-medium text-gray-900 capitalize">{user?.provider}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email Verified</p>
              <p className="text-lg font-medium text-gray-900">
                {user?.emailVerified ? '✓ Yes' : '✗ No'}
              </p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Search and Filter Section */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title and Count */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {filteredUsers.length} of {users.length} users
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:max-w-2xl">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Provider Filter */}
                <select
                  value={providerFilter}
                  onChange={e => setProviderFilter(e.target.value as 'all' | 'local' | 'google')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All Providers</option>
                  <option value="local">Local</option>
                  <option value="google">Google</option>
                </select>

                {/* Verified Filter */}
                <select
                  value={verifiedFilter}
                  onChange={e =>
                    setVerifiedFilter(e.target.value as 'all' | 'verified' | 'unverified')
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredUsers.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {hasActiveFilters ? 'Try adjusting your search or filters' : 'No users available'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.profilePicture ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.profilePicture}
                                alt={user.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.provider === 'google'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.emailVerified ? (
                          <span className="text-green-600 flex items-center">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-400 flex items-center">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Infinite Scroll Trigger - Only show when no filters active */}
              {!hasActiveFilters && usersHasMore && (
                <div ref={loadMoreRef} className="py-4 text-center border-t border-gray-200">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-2 text-gray-600">Loading more users...</span>
                    </div>
                  ) : (
                    <p className="text-gray-500">Scroll to load more</p>
                  )}
                </div>
              )}

              {!hasActiveFilters && !usersHasMore && users.length > 0 && (
                <div className="py-4 text-center border-t border-gray-200">
                  <p className="text-gray-500">All users loaded</p>
                </div>
              )}

              {hasActiveFilters && filteredUsers.length > 0 && (
                <div className="py-4 text-center border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Filtering {filteredUsers.length} of {users.length} total users
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
