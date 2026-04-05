import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useGetDashboardStatsQuery } from "../component/redux/feature/authslice";
import { logout } from "../component/redux/feature/authState";

export const Guard = ({ children }) => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const rehydrated = useSelector((state) => state.user?._persist?.rehydrated);
  const dispatch = useDispatch();

  const { isLoading, isError } = useGetDashboardStatsQuery(undefined, {
    skip: !isAuth,
  });

  if (!rehydrated || isLoading) return null;

  if (isError) {
    dispatch(logout());
    return <Navigate to="/" replace />;
  }

  return isAuth ? children : <Navigate to="/" replace />;
};
