import { Outlet, Navigate } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";

const ProtectedComponent = () => {
    const connectedUsers = useSelector(
        (state) => state,
        shallowEqual
    );

    console.log("connectedUsersRoute", connectedUsers);

    // if (connectedUsers.Authenticated) {
    //     return <ProtectedComponent />
    // } else {
    //     return <Navigate to="/login" />
    // }

    return (
        connectedUsers.users.isAuthenticated ? <Outlet /> : <Navigate to="/" />
    );
};

export default ProtectedComponent;
