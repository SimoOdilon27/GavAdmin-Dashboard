import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';



const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    // Retrieve user's allowed routes from Redux store
    const userMenus = useSelector((state) => state.users.menus);

    // Check if the current route is allowed
    const isRouteAllowed = (currentPath) => {
        // Normalize the path (remove query parameters, etc.)
        const normalizedPath = currentPath.split('?')[0];

        // Flatten all routes from all menu items
        const allowedRoutes = userMenus.flatMap((menu) =>
            menu.subItemList.map((subItem) => subItem.route)
        );

        // Check if the current path matches any allowed route
        return allowedRoutes.some((allowedRoute) =>
            normalizedPath.startsWith(allowedRoute)
        );
    };

    // Check if route is allowed
    if (!isRouteAllowed(location.pathname)) {
        // Redirect to dashboard or unauthorized page
        return <Navigate to="/dashboard" replace state={{ from: location }} />;
    }

    // Render children if route is allowed
    return <>{children}</>;
};

export default ProtectedRoute;