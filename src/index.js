import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { persitor, store } from "./store/configureStore";
import { PersistGate } from 'redux-persist/integration/react';
import Login from "./scenes/auth/Login";
import ErrorBoundary from "./scenes/ErrorBoundary/ErrorBoundary";
import UpdatePassword from "./scenes/auth/UpdatePassword";
import ProtectedComponent from "./tools/ProtectedComponent";
import SpaceSelector from "./scenes/auth/SpaceAuthentication";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persitor}>
        <BrowserRouter>
          <ErrorBoundary>

            <Routes>
              <Route path="/" element={<Login />} />
              {/* <Route path="/*" element={<App />} /> */}
              <Route element={<ProtectedComponent />}>
                <Route path="*" element={<App />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
                <Route path="/select-space" element={<SpaceSelector />} />

              </Route>


            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </PersistGate>
    </Provider>
    {/* <Provider store={store}>
      <PersistGate loading={null} persistor={persitor}>
        <BrowserRouter>
          <ErrorBoundary>

            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<ProtectedComponent />}>
                <Route path="*" element={<App />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
                <Route path="/select-space" element={<SpaceSelector />} />

              </Route>


            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </PersistGate>
    </Provider> */}
  </React.StrictMode>
);
