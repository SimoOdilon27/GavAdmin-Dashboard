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
import UpdatePassword from "./scenes/auth/UpdatePassword";
import Tellers from "./scenes/Admistration/tellers/Tellers";
import TellerForm from "./scenes/Admistration/tellers/TellerForm";
import Pricing from "./scenes/Transactions/pricing/Pricing";
import Charges from "./scenes/Transactions/pricing/Charges";
import GimacWallets from "./scenes/gimacServices/wallet/GimacWallets";
import GimacWalletForm from "./scenes/gimacServices/wallet/GimacWalletForm";
import GimacCountries from "./scenes/gimacServices/countries/GimacCountries";
import GimacCountriesForm from "./scenes/gimacServices/countries/GimacCountriesForm";

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

                {/* <Route path="/*" element={<ErrorFallback />} /> */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/form" element={<Form />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/corporation" element={<Corporation />} />
                <Route path="/bank" element={<Bank />} />
                <Route path="/bankaccount" element={<BankAccounts />} />
                <Route path="/bankinvestment" element={<BankInvestments />} />
                <Route path="/viewtransactions" element={<ViewTransactions />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/bankmapper" element={<BankMapper />} />
                <Route path="/accounts" element={<AllAccounts />} />
                <Route path="/menu-catalog" element={<MenuCatalog />} />
                <Route path="/menu-catalog/add" element={<CatalogForm />} />
                <Route path="/menu-catalog/edit/:id" element={<CatalogForm />} />
                <Route path="/client" element={<Clients />} />
                <Route path="/client/add-client" element={<ClientForm />} />
                <Route path="/client/edit/:msisdn" element={<ClientForm />} />
                <Route path="/cashtransactions" element={<CashOutnIn />} />
                <Route path="/rolemanagement" element={<RoleManagement />} />
                <Route path="/usermanagement" element={<UserManagement />} />
                <Route path="/usermanagement/adduser" element={<UserForm />} />
                <Route path="/tellers" element={<Tellers />} />
                <Route path="/tellers/add" element={<TellerForm />} />
                <Route path="/tellers/edit/:id" element={<TellerForm />} />
                <Route path="/charges" element={<Pricing />} />
                <Route path="/pricing/configure" element={<Charges />} />
                <Route path="/gimac-wallets" element={<GimacWallets />} />
                <Route path="/gimac-wallets/add" element={<GimacWalletForm />} />
                <Route path="/gimac-wallets/edit/:id" element={<GimacWalletForm />} />
                <Route path="/gimac-countries" element={<GimacCountries />} />
                <Route path="/gimac-countries/add" element={<GimacCountriesForm />} />
                <Route path="/gimac-countries/edit/:id" element={<GimacCountriesForm />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>

  );
}

export default App;
