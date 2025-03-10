import { useEffect, useState } from "react";
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
import RoleForm from "./scenes/settings/rolemanagement/RoleForm";
import AssignRoleMenu from "./scenes/settings/rolemanagement/AssignRoleMenu";
import AssignUsertoSpace from "./scenes/settings/Usermanagement/AssignUsertoSpace";
import ProtectedRoute from "./tools/ProtectedRouteComponent";
import Menus from "./scenes/settings/menucatalog/menuItemManagement/Menus";
import UserSubMenuForm from "./scenes/settings/menucatalog/menuItemManagement/UserSubMenuForm";
import BankServices from "./scenes/bankServices/bankServiceTypes/BankServiceTypes";
import BankServicesForm from "./scenes/bankServices/bankServiceTypes/BankServicesTypesForm";
import BankServiceConfigForm from "./scenes/bankServices/bankServicesConfigs/BankServiceConfigForm";
import BankServiceConfigs from "./scenes/bankServices/bankServicesConfigs/BankServiceConfigs";
import { useDispatch } from "react-redux";
import Partners from "./scenes/pricing/partners/Partners";
import TaxesConfig from "./scenes/pricing/taxes/TaxesConfig";
import OperationConfig from "./scenes/pricing/operationConfig/OperationConfig";
import ChargesPricing from "./scenes/Transactions/pricing/Charges";
import Charges from "./scenes/pricing/charges/Charges";
import ClientApproval from "./scenes/GavClients/clientApproval/ClientApproval";
import ChargesForm from "./scenes/pricing/charges/ChargesForm";
import OperationConfigTypeForm from "./scenes/pricing/operationConfig/OperationConfigTypeForm";
import OperationConfigForm from "./scenes/pricing/operationConfig/OperationConfigForm";
import PartnerForm from "./scenes/pricing/partners/PartnerForm";
import TaxConfigForm from "./scenes/pricing/taxes/TaxConfigForm";
import ViewOperationConfigDetails from "./scenes/pricing/operationConfig/ViewOperationConfigDetails";
import ViewChargeDetails from "./scenes/pricing/charges/ViewChargeDetails";
import ViewTaxConfigDetails from "./scenes/pricing/taxes/ViewTaxConfigDetails";
import OtherBankInvestments from "./scenes/bankDetails/OtherBankInvestments";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const dispatch = useDispatch();

  // Sync color mode with Redux store when it changes
  useEffect(() => {
    dispatch({
      type: 'SET_COLOR_MODE',
      colorMode: theme.palette.mode
    });
  }, [theme.palette.mode, dispatch]);

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
                <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
                <Route path="/createMenu" element={<ProtectedRoute><CreateMenuForm /></ProtectedRoute>} />
                <Route path="/form" element={<ProtectedRoute><Form /></ProtectedRoute>} />
                <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/corporation" element={<ProtectedRoute><Corporation /></ProtectedRoute>} />
                <Route path="/corporation/add" element={<ProtectedRoute><CorporationForm /></ProtectedRoute>} />
                <Route path="/corporation/edit/:id" element={<ProtectedRoute><CorporationForm /></ProtectedRoute>} />
                <Route path="/corporation/view/:accounts" element={<ProtectedRoute><ViewCorporationDetails /></ProtectedRoute>} />
                <Route path="/bank" element={<ProtectedRoute><Bank /></ProtectedRoute>} />
                <Route path="/bank/edit/:id" element={<ProtectedRoute><BankForm /></ProtectedRoute>} />
                <Route path="/bank/add" element={<ProtectedRoute><BankForm /></ProtectedRoute>} />
                <Route path="/bank/view/:accounts" element={<ProtectedRoute><ViewBankDetails /></ProtectedRoute>} />
                <Route path="/bankaccount" element={<ProtectedRoute><BankAccounts /></ProtectedRoute>} />
                <Route path="/bankaccount/view/:accountId" element={<ProtectedRoute><ViewAccountDetails /></ProtectedRoute>} />
                <Route path="/bankinvestment" element={<ProtectedRoute><BankInvestments /></ProtectedRoute>} />
                <Route path="/otherbankinvestment" element={<ProtectedRoute><OtherBankInvestments /></ProtectedRoute>} />
                <Route path="/viewtransactions" element={<ProtectedRoute><ViewTransactions /></ProtectedRoute>} />
                <Route path="/branches" element={<ProtectedRoute><Branches /></ProtectedRoute>} />
                <Route path="/branches/add" element={<ProtectedRoute><BranchesForm /></ProtectedRoute>} />
                <Route path="/branches/edit/:id" element={<ProtectedRoute><BranchesForm /></ProtectedRoute>} />
                <Route path="/branches/view/:accounts" element={<ProtectedRoute><ViewBranchesDetails /></ProtectedRoute>} />
                <Route path="/tellers" element={<ProtectedRoute><Tellers /></ProtectedRoute>} />
                <Route path="/tellers/add" element={<ProtectedRoute><TellerForm /></ProtectedRoute>} />
                <Route path="/tellers/edit/:id" element={<ProtectedRoute><TellerForm /></ProtectedRoute>} />
                <Route path="/tellers/view/:accountId" element={<ProtectedRoute><ViewTellerDetails /></ProtectedRoute>} />
                <Route path="/bankmapper" element={<ProtectedRoute><BankMapper /></ProtectedRoute>} />
                <Route path="/accounts" element={<ProtectedRoute><AllAccounts /></ProtectedRoute>} />
                <Route path="/menu-catalog" element={<ProtectedRoute><MenuCatalog /></ProtectedRoute>} />
                <Route path="/menu-catalog/add" element={<ProtectedRoute><CatalogForm /></ProtectedRoute>} />
                <Route path="/menu-catalog/edit/:id" element={<ProtectedRoute><CatalogForm /></ProtectedRoute>} />
                <Route path="/clientapproval" element={<ProtectedRoute><ClientApproval /></ProtectedRoute>} />
                <Route path="/client" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                <Route path="/client/add-client" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
                <Route path="/client/edit/:msisdn" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
                <Route path="/client/view/:msisdn" element={<ProtectedRoute><ViewClientDetails /></ProtectedRoute>} />
                <Route path="/cashtransactions" element={<ProtectedRoute><CashOutnIn /></ProtectedRoute>} />
                <Route path="/rolemanagement" element={<ProtectedRoute><RoleManagement /></ProtectedRoute>} />
                <Route path="/rolemanagement/addrole" element={<ProtectedRoute><RoleForm /></ProtectedRoute>} />
                <Route path="/rolemanagement/edit/:id" element={<ProtectedRoute><RoleForm /></ProtectedRoute>} />
                <Route path="/rolemanagement/assignmenu/:roleName" element={<ProtectedRoute><AssignRoleMenu /></ProtectedRoute>} />
                <Route path="/usermanagement" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="/usermanagement/adduser" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
                <Route path="/usermanagement/userconfig/:userName" element={<ProtectedRoute><AssignUsertoSpace /></ProtectedRoute>} />
                <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
                <Route path="/pricing/configure" element={<ProtectedRoute><ChargesPricing /></ProtectedRoute>} />
                <Route path="/pricing/configurecharges" element={<ProtectedRoute><ConfigureCharges /></ProtectedRoute>} />
                <Route path="/gimac-wallets" element={<ProtectedRoute><GimacWallets /></ProtectedRoute>} />
                <Route path="/gimac-wallets/add" element={<ProtectedRoute><GimacWalletForm /></ProtectedRoute>} />
                <Route path="/gimac-wallets/edit/:id" element={<ProtectedRoute><GimacWalletForm /></ProtectedRoute>} />
                <Route path="/gimac-countries" element={<ProtectedRoute><GimacCountries /></ProtectedRoute>} />
                <Route path="/gimac-countries/add" element={<ProtectedRoute><GimacCountriesForm /></ProtectedRoute>} />
                <Route path="/gimac-countries/edit/:id" element={<ProtectedRoute><GimacCountriesForm /></ProtectedRoute>} />
                <Route path="/accounttype" element={<ProtectedRoute><AccountType /></ProtectedRoute>} />
                <Route path="/accounttype/add" element={<ProtectedRoute><AccountTypeForm /></ProtectedRoute>} />
                <Route path="/accounttype/edit/:id" element={<ProtectedRoute><AccountTypeForm /></ProtectedRoute>} />
                <Route path="/space-management" element={<ProtectedRoute><SpaceManagement /></ProtectedRoute>} />
                <Route path="/space-management/add" element={<ProtectedRoute><SpaceForm /></ProtectedRoute>} />
                <Route path="/space-management/edit/:id" element={<ProtectedRoute><SpaceForm /></ProtectedRoute>} />
                <Route path="/type-management" element={<ProtectedRoute><TypeManagement /></ProtectedRoute>} />
                <Route path="/menus" element={<ProtectedRoute><Menus /></ProtectedRoute>} />
                <Route path="/menus/createmenu" element={<ProtectedRoute><CreateMenuForm /></ProtectedRoute>} />
                <Route path="/menus/submenuform" element={<ProtectedRoute><UserSubMenuForm /></ProtectedRoute>} />
                <Route path="/menus/submenuform/:id" element={<ProtectedRoute><UserSubMenuForm /></ProtectedRoute>} />
                <Route path="/menus/editmenu/:id" element={<ProtectedRoute><CreateMenuForm /></ProtectedRoute>} />
                <Route path="/bankservices" element={<ProtectedRoute><BankServices /></ProtectedRoute>} />
                <Route path="/bankservices/add" element={<ProtectedRoute><BankServicesForm /></ProtectedRoute>} />
                <Route path="/bankservices/edit/:serviceName" element={<ProtectedRoute><BankServicesForm /></ProtectedRoute>} />
                <Route path="/bankservicesconfigs" element={<ProtectedRoute><BankServiceConfigs /></ProtectedRoute>} />
                <Route path="/bankserviceconfigs/add" element={<ProtectedRoute><BankServiceConfigForm /></ProtectedRoute>} />
                <Route path="/bankservicesconfigs/edit/:id" element={<ProtectedRoute><BankServiceConfigForm /></ProtectedRoute>} />
                <Route path="/charges" element={<ProtectedRoute><Charges /></ProtectedRoute>} />
                <Route path="/charges/add" element={<ProtectedRoute><ChargesForm /></ProtectedRoute>} />
                <Route path="/charges/edit/:id" element={<ProtectedRoute><ChargesForm /></ProtectedRoute>} />
                <Route path="/charges/view/:id" element={<ProtectedRoute><ViewChargeDetails /></ProtectedRoute>} />
                <Route path="/operationconfigurations" element={<ProtectedRoute><OperationConfig /></ProtectedRoute>} />
                <Route path="/operationconfigurations/addoperationtype" element={<ProtectedRoute><OperationConfigTypeForm /></ProtectedRoute>} />
                <Route path="/operationconfigurations/addoperationconfig" element={<ProtectedRoute><OperationConfigForm /></ProtectedRoute>} />
                <Route path="/operationconfigurations/editoperationconfig/:id" element={<ProtectedRoute><OperationConfigForm /></ProtectedRoute>} />
                <Route path="/operationconfigurations/viewoperationconfig/:id" element={<ProtectedRoute><ViewOperationConfigDetails /></ProtectedRoute>} />
                <Route path="/operationconfigurations/editoperationtype/:id" element={<ProtectedRoute><OperationConfigTypeForm /></ProtectedRoute>} />
                <Route path="/taxconfigurations" element={<ProtectedRoute><TaxesConfig /></ProtectedRoute>} />
                <Route path="/taxconfigurations/add" element={<ProtectedRoute><TaxConfigForm /></ProtectedRoute>} />
                <Route path="/taxconfigurations/edit/:id" element={<ProtectedRoute><TaxConfigForm /></ProtectedRoute>} />
                <Route path="/taxconfigurations/view/:id" element={<ProtectedRoute><ViewTaxConfigDetails /></ProtectedRoute>} />
                <Route path="/partners" element={<ProtectedRoute><Partners /></ProtectedRoute>} />
                <Route path="/partners/add" element={<ProtectedRoute><PartnerForm /></ProtectedRoute>} />
                <Route path="/partners/edit/:id" element={<ProtectedRoute><PartnerForm /></ProtectedRoute>} />

              </Routes>

              {/* <Routes>
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
                <Route path="/otherbankinvestment" element={<OtherBankInvestments />} />
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
                <Route path="/clientapproval" element={<ClientApproval />} />
                <Route path="/client" element={<Clients />} />
                <Route path="/client/add-client" element={<ClientForm />} />
                <Route path="/client/edit/:msisdn" element={<ClientForm />} />
                <Route path="/client/view/:msisdn" element={<ViewClientDetails />} />
                <Route path="/cashtransactions" element={<CashOutnIn />} />
                <Route path="/rolemanagement" element={<RoleManagement />} />
                <Route path="/rolemanagement/addrole" element={<RoleForm />} />
                <Route path="/rolemanagement/edit/:id" element={<RoleForm />} />
                <Route path="/rolemanagement/assignmenu/:roleName" element={<AssignRoleMenu />} />
                <Route path="/usermanagement" element={<UserManagement />} />
                <Route path="/usermanagement/adduser" element={<UserForm />} />
                <Route path="/usermanagement/userconfig/:userName" element={<AssignUsertoSpace />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/pricing/configure" element={<ChargesPricing />} />
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
                <Route path="/menus" element={<Menus />} />
                <Route path="/menus/createmenu" element={<CreateMenuForm />} />
                <Route path="/menus/submenuform" element={<UserSubMenuForm />} />
                <Route path="/menus/submenuform/:id" element={<UserSubMenuForm />} />
                <Route path="/menus/editmenu/:id" element={<CreateMenuForm />} />
                <Route path="/bankservices" element={<BankServices />} />
                <Route path="/bankservices/add" element={<BankServicesForm />} />
                <Route path="/bankservices/edit/:serviceName" element={<BankServicesForm />} />
                <Route path="/bankservicesconfigs" element={<BankServiceConfigs />} />
                <Route path="/bankserviceconfigs/add" element={<BankServiceConfigForm />} />
                <Route path="/bankservicesconfigs/edit/:id" element={<BankServiceConfigForm />} />
                <Route path="/charges" element={<Charges />} />
                <Route path="/charges/add" element={<ChargesForm />} />
                <Route path="/charges/edit/:id" element={<ChargesForm />} />
                <Route path="/charges/view/:id" element={<ViewChargeDetails />} />
                <Route path="/operationconfigurations" element={<OperationConfig />} />
                <Route path="/operationconfigurations/addoperationtype" element={<OperationConfigTypeForm />} />
                <Route path="/operationconfigurations/addoperationconfig" element={<OperationConfigForm />} />
                <Route path="/operationconfigurations/editoperationconfig/:id" element={<OperationConfigForm />} />
                <Route path="/operationconfigurations/viewoperationconfig/:id" element={<ViewOperationConfigDetails />} />
                <Route path="/operationconfigurations/editoperationtype/:id" element={<OperationConfigTypeForm />} />
                <Route path="/taxconfigurations" element={<TaxesConfig />} />
                <Route path="/taxconfigurations/add" element={<TaxConfigForm />} />
                <Route path="/taxconfigurations/edit/:id" element={<TaxConfigForm />} />
                <Route path="/taxconfigurations/view/:id" element={<ViewTaxConfigDetails />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/partners/add" element={<PartnerForm />} />
                <Route path="/partners/edit/:id" element={<PartnerForm />} />
              </Routes> */}

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
