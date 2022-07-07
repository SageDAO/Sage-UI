import React from 'react';
import { Role } from '@prisma/client';
import { useGetUserQuery } from '@/store/usersReducer';
import { DashBoardPage } from '@/components/Dashboard/DashboardPage';
import LoaderDots from '@/components/LoaderDots';

export default function dashboard() {
  const isAdmin = (user: any) => {
    return user && Role.ADMIN == user.role;
  };
  const { data: user, isFetching: isFetchingUser } = useGetUserQuery();
  if (isFetchingUser) {
    return <LoaderDots />;
  }
  if (!isAdmin(user)) {
    return <div style={{ margin: '25px' }}>Please connect with an admin wallet</div>;
  }
  return <DashBoardPage />;
}