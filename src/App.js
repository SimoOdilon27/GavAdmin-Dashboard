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
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>

  );
}

export default App;
