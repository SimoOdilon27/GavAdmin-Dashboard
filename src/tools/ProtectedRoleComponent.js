import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RoleProtectedComponent = ({ allowedRoles, children }) => {
    const connectedUsers = useSelector((state) => state);

    const role = connectedUsers.roles;

    if (!allowedRoles.some(r => role.includes(r))) {
        // If the user does not have the required role, redirect to error page
        return <Navigate to="/error" />;
    }

    return <>{children}</>;
};

export default RoleProtectedComponent;
