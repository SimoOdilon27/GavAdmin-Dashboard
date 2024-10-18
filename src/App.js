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
import BankAccounts from "./scenes/bankDetails/accounts/ViewBankAccounts";
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

import CorporationForm from "./scenes/Admistration/corporation/CorporationForm";
import ViewCorporationDetails from "./scenes/Admistration/corporation/ViewCorporationDetails";
import BankForm from "./scenes/Admistration/bank/BankForm";
import ViewBankDetails from "./scenes/Admistration/bank/ViewBankDetails";
import ViewBranchesDetails from "./scenes/Admistration/branches/ViewBranchesDetails";
import BranchesForm from "./scenes/Admistration/branches/BranchesForm";
import ViewTellerDetails from "./scenes/Admistration/tellers/ViewTellerDetails";
import ViewAccountDetails from "./scenes/bankDetails/accounts/ViewAccountDetails";
import ViewClientDetails from "./scenes/GavClients/ViewClientDetails";
import ConfigureCharges from "./scenes/Transactions/pricing/ChargesConfigurations/ConfigureCharges";
import AccountTypeForm from "./scenes/settings/accounType/AccountTypeForm";
import AccountType from "./scenes/settings/accounType/AccountType";

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
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
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
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <Corporation />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/corporation/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <CorporationForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/corporation/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <CorporationForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/corporation/view/:accounts"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <ViewCorporationDetails />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/bank"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <Bank />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/bank/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <BankForm />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/bank/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <BankForm />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/bank/view/:accounts"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <ViewBankDetails />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/bankaccount"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <BankAccounts />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/bankaccount/view/:accountId"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <ViewAccountDetails />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/bankinvestment"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <BankInvestments />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/viewtransactions"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER", "TELLER"]}>
                      <ViewTransactions />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/branches"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <Branches />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/branches/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <BranchesForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/branches/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <BranchesForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/branches/view/:accounts"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <ViewBranchesDetails />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/tellers"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <Tellers />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/tellers/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <TellerForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/tellers/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <TellerForm />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/tellers/view/:accountId"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <ViewTellerDetails />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/bankmapper"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <BankMapper />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/accounts"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <AllAccounts />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/menu-catalog"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <MenuCatalog />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/menu-catalog/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <CatalogForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/menu-catalog/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <CatalogForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/client"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <Clients />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/client/add-client"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <ClientForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/client/edit/:msisdn"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <ClientForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/client/view/:msisdn"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <ViewClientDetails />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/cashtransactions"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER", "TELLER"]}>
                      <CashOutnIn />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/rolemanagement"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <RoleManagement />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/usermanagement"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <UserManagement />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/usermanagement/adduser"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <UserForm />
                    </RoleProtectedComponent>
                  }
                />

                <Route
                  path="/charges"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <Pricing />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/pricing/configure"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <Charges />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/pricing/configurecharges"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <ConfigureCharges />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-wallets"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <GimacWallets />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-wallets/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <GimacWalletForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-wallets/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <GimacWalletForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-countries"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <GimacCountries />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-countries/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <GimacCountriesForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/gimac-countries/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <GimacCountriesForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/accounttype"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <AccountType />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/accounttype/add"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
                      <AccountTypeForm />
                    </RoleProtectedComponent>
                  }
                />
                <Route
                  path="/accounttype/edit/:id"
                  element={
                    <RoleProtectedComponent allowedRoles={['ADMIN', "USER"]}>
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
