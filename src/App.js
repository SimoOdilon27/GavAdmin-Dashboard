import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Form from "./scenes/form";

import FAQ from "./scenes/faq";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Corporation from "./scenes/Admistration/corporation/Corporation";
import Login from "./scenes/auth/Login";
import Bank from "./scenes/Admistration/bank/Bank";
import BankAccounts from "./scenes/bankDetails/ViewBankAccounts";
import BankInvestments from "./scenes/bankDetails/BankInvestments";
import ViewTransactions from "./scenes/Transactions/ViewTransactions";
import Branches from "./scenes/Admistration/branches/Branches";
import BankMapper from "./scenes/Admistration/bankmapper/BankMapper";
import MenuCatalog from "./scenes/settings/menucatalog/MenuCatalog";
import CatalogForm from "./scenes/settings/menucatalog/CatalogForm";
import Clients from "./scenes/GavClients/Clients";
import ClientForm from "./scenes/GavClients/ClientForm";
import ErrorFallback from "./scenes/ErrorBoundary/ErrorPage";
import CashOutnIn from "./scenes/Transactions/CashOutnIn";
import AllAccounts from "./scenes/bankDetails/allAccounts/AllAccounts";
import RoleManagement from "./scenes/settings/rolemanagement/RoleManagement";
import UserManagement from "./scenes/settings/Usermanagement/UserManagement";
import UserForm from "./scenes/settings/Usermanagement/UserForm";
import Tellers from "./scenes/Admistration/tellers/Tellers";
import TellerForm from "./scenes/Admistration/tellers/TellerForm";
import Pricing from "./scenes/Transactions/pricing/Pricing";
import Charges from "./scenes/Transactions/pricing/Charges";
import GimacWallets from "./scenes/gimacServices/wallet/GimacWallets";
import GimacWalletForm from "./scenes/gimacServices/wallet/GimacWalletForm";
import GimacCountries from "./scenes/gimacServices/countries/GimacCountries";
import GimacCountriesForm from "./scenes/gimacServices/countries/GimacCountriesForm";
import RoleProtectedComponent from "./tools/ProtectedRoleComponent";
import AccountType from "./scenes/bankDetails/accounType/AccountType";
import AccountTypeForm from "./scenes/bankDetails/accounType/AccountTypeForm";
import CorporationForm from "./scenes/Admistration/corporation/CorporationForm";
import ViewCorporationDetails from "./scenes/Admistration/corporation/ViewCorporationDetails";
import BankForm from "./scenes/Admistration/bank/BankForm";
import ViewBankDetails from "./scenes/Admistration/bank/ViewBankDetails";
import ViewBranchesDetails from "./scenes/Admistration/branches/ViewBranchesDetails";
import BranchesForm from "./scenes/Admistration/branches/BranchesForm";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (

    <>

      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">



            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="*" element={<Dashboard />} />

                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/team"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <Team />
                    </RoleProtectedComponent>
                  }
                />
                <Route path="/form" element={<Form />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route
                  path="/corporation"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <Corporation />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/corporation/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <CorporationForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/corporation/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <CorporationForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/corporation/view/:accounts"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <ViewCorporationDetails />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/bank"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <Bank />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/bank/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <BankForm />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/bank/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <BankForm />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/bank/view/:accounts"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <ViewBankDetails />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/bankaccount"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <BankAccounts />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/bankinvestment"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <BankInvestments />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/viewtransactions"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "TELLER"]}>
                      <ViewTransactions />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/branches"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <Branches />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/branches/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <BranchesForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/branches/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <BranchesForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/branches/view/:accounts"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <ViewBranchesDetails />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/bankmapper"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <BankMapper />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/accounts"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <AllAccounts />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/menu-catalog"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <MenuCatalog />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/menu-catalog/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <CatalogForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/menu-catalog/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <CatalogForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/client"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <Clients />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/client/add-client"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <ClientForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/client/edit/:msisdn"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <ClientForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/cashtransactions"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "TELLER"]}>
                      <CashOutnIn />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/rolemanagement"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <RoleManagement />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/usermanagement"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <UserManagement />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/usermanagement/adduser"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <UserForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/tellers"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <Tellers />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/tellers/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <TellerForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/tellers/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <TellerForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/charges"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <Pricing />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/pricing/configure"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <Charges />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-wallets"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <GimacWallets />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-wallets/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <GimacWalletForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-wallets/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <GimacWalletForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-countries"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <GimacCountries />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-countries/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <GimacCountriesForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-countries/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <GimacCountriesForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/accounttype"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <AccountType />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/accounttype/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <AccountTypeForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/accounttype/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN']}>
                      <AccountTypeForm />
                    </RoleProtectedComponent>
                  }
                />
              </Routes>
              {/* <Routes>
                <Route path="*" element={<Dashboard />} />
              </Routes> */}
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>

  );
}

export default App;
