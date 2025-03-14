import React from 'react';
import { useSelector } from 'react-redux';
import { Route,  Navigate } from 'react-router-dom';
import { routes } from './RolebasedRoutes';
// import Layout from '../components/Layout/Layout';
// import PresentationLayOut from '../components/PresentationMainLayout/PresentationLayOut';

const PrivateRoute = ({ route}) => {
  const {isAuth,user} = useSelector(state=>state.auth); // Get the authentication status

  if (!isAuth) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" />;
  }

  if (routes[user.role]?.some(r => r.path === route.path)) {
    // If the user's role has access, render the component
    return <div >
        <route.element/>
    </div>;
  }
  // If user role doesn't match, redirect to "not found" or "access denied"
  return <Navigate to="/not-found" />;

};

export default PrivateRoute;
