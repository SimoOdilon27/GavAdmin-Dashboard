import { Outlet, Navigate } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";

const ProtectedComponent = () => {
    const connectedUsers = useSelector(
        (state) => state,
        shallowEqual
    );

    console.log("connectedUsersRoute", connectedUsers);

    return (
        connectedUsers.isAuthenticated ? <Outlet /> : <Navigate to="/" />
    );
};

export default ProtectedComponent;
