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
import CreateMenuForm from "./scenes/settings/menucatalog/menuItemManagement/CreateMenu";
import SpaceForm from "./scenes/settings/Usermanagement/spaceManagement/SpaceForm";
import SpaceManagement from "./scenes/settings/Usermanagement/spaceManagement/SpaceManagement";
import TypeManagement from "./scenes/settings/Usermanagement/typeManagement/TypeManagement";
import SpaceSelector from "./scenes/auth/SpaceAuthentication";

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
                <Route path="/team" element={<Team />} />
                <Route path="/createMenu" element={<CreateMenuForm />} />
                <Route path="/form" element={<Form />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/corporation" element={<Corporation />} />
                <Route path="/corporation/add" element={<CorporationForm />} />
                <Route path="/corporation/edit/:id" element={<CorporationForm />} />
                <Route path="/corporation/view/:accounts" element={<ViewCorporationDetails />} />
                <Route path="/bank" element={<Bank />} />
                <Route path="/bank/edit/:id" element={<BankForm />} />
                <Route path="/bank/add" element={<BankForm />} />
                <Route path="/bank/view/:accounts" element={<ViewBankDetails />} />
                <Route path="/bankaccount" element={<BankAccounts />} />
                <Route path="/bankaccount/view/:accountId" element={<ViewAccountDetails />} />
                <Route path="/bankinvestment" element={<BankInvestments />} />
                <Route path="/viewtransactions" element={<ViewTransactions />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/branches/add" element={<BranchesForm />} />
                <Route path="/branches/edit/:id" element={<BranchesForm />} />
                <Route path="/branches/view/:accounts" element={<ViewBranchesDetails />} />
                <Route path="/tellers" element={<Tellers />} />
                <Route path="/tellers/add" element={<TellerForm />} />
                <Route path="/tellers/edit/:id" element={<TellerForm />} />
                <Route path="/tellers/view/:accountId" element={<ViewTellerDetails />} />
                <Route path="/bankmapper" element={<BankMapper />} />
                <Route path="/accounts" element={<AllAccounts />} />
                <Route path="/menu-catalog" element={<MenuCatalog />} />
                <Route path="/menu-catalog/add" element={<CatalogForm />} />
                <Route path="/menu-catalog/edit/:id" element={<CatalogForm />} />
                <Route path="/client" element={<Clients />} />
                <Route path="/client/add-client" element={<ClientForm />} />
                <Route path="/client/edit/:msisdn" element={<ClientForm />} />
                <Route path="/client/view/:msisdn" element={<ViewClientDetails />} />
                <Route path="/cashtransactions" element={<CashOutnIn />} />
                <Route path="/rolemanagement" element={<RoleManagement />} />
                <Route path="/usermanagement" element={<UserManagement />} />
                <Route path="/usermanagement/adduser" element={<UserForm />} />
                <Route path="/charges" element={<Pricing />} />
                <Route path="/pricing/configure" element={<Charges />} />
                <Route path="/pricing/configurecharges" element={<ConfigureCharges />} />
                <Route path="/gimac-wallets" element={<GimacWallets />} />
                <Route path="/gimac-wallets/add" element={<GimacWalletForm />} />
                <Route path="/gimac-wallets/edit/:id" element={<GimacWalletForm />} />
                <Route path="/gimac-countries" element={<GimacCountries />} />
                <Route path="/gimac-countries/add" element={<GimacCountriesForm />} />
                <Route path="/gimac-countries/edit/:id" element={<GimacCountriesForm />} />
                <Route path="/accounttype" element={<AccountType />} />
                <Route path="/accounttype/add" element={<AccountTypeForm />} />
                <Route path="/accounttype/edit/:id" element={<AccountTypeForm />} />
                <Route path="/space-management" element={<SpaceManagement />} />
                <Route path="/space-management/add" element={<SpaceForm />} />
                <Route path="/space-management/edit/:id" element={<SpaceForm />} />
                <Route path="/type-management" element={<TypeManagement />} />
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
