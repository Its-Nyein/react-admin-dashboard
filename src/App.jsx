import { Route, Routes } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import Sidebar from "./components/common/Sidebar";
import ProductPage from "./pages/ProductPage";
import UserPage from "./pages/UserPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import { QueryClientProvider, QueryClient } from "react-query";

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        <Sidebar />

        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
