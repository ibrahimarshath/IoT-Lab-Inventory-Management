import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { ComponentsManagement } from "./components/ComponentsManagement";
import { BorrowingManagement } from "./components/BorrowingManagement";
import { Inventory } from "./components/Inventory";
import { SmartLabControl } from "./components/SmartLabControl";
import { ActivityLogs } from "./components/ActivityLogs";
import { UserComponentSearch } from "./components/UserComponentSearch";
import { UserBorrowings } from "./components/UserBorrowings";
import { Cart } from "./components/Cart";
import { BorrowRequests } from "./components/BorrowRequests";
import { Profile } from "./components/Profile";
import { Login } from "./components/Login";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { LayoutDashboard, Package, ArrowLeftRight, ShoppingCart, Lightbulb, Activity, Search, LogOut, ClipboardList, Boxes } from "lucide-react";
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState("user");
  const [username, setUsername] = useState("");
  const [currentView, setCurrentView] = useState("dashboard");
  const [currentUserView, setCurrentUserView] = useState("search");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cart, setCart] = useState([]);
  const handleLogin = (loginMode, loginUsername) => {
    setMode(loginMode);
    setUsername(loginUsername);
    setIsLoggedIn(true);
    if (loginMode === "admin") {
      setCurrentView("dashboard");
    } else {
      setCurrentUserView("search");
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setMode("user");
    setCurrentView("dashboard");
    setCurrentUserView("search");
  };
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }
  const adminNavigation = [{
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  }, {
    id: "components",
    label: "Components",
    icon: Package
  }, {
    id: "borrowing",
    label: "Borrow & Return",
    icon: ArrowLeftRight
  }, {
    id: "borrow-requests",
    label: "Borrow Requests",
    icon: ClipboardList
  }, {
    id: "inventory",
    label: "Inventory",
    icon: Boxes
  }, {
    id: "smartlab",
    label: "Smart Lab",
    icon: Lightbulb
  }, {
    id: "logs",
    label: "Activity Logs",
    icon: Activity
  }];
  const userNavigation = [{
    id: "search",
    label: "Browse Components",
    icon: Search
  }, {
    id: "my-borrowings",
    label: "My Borrowings",
    icon: Package
  }];
  const renderAdminView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={view => setCurrentView(view === "requests" ? "borrow-requests" : view)} />;
      case "components":
        return <ComponentsManagement />;
      case "borrowing":
        return <BorrowingManagement />;
      case "borrow-requests":
        return <BorrowRequests adminUsername={username} />;
      case "inventory":
        return <Inventory />;
      case "smartlab":
        return <SmartLabControl />;
      case "logs":
        return <ActivityLogs />;
      case "profile":
        return <Profile mode="admin" username={username} />;
      default:
        return <Dashboard onNavigate={view => setCurrentView(view === "requests" ? "borrow-requests" : view)} />;
    }
  };
  const renderUserView = () => {
    switch (currentUserView) {
      case "search":
        return <UserComponentSearch cart={cart} setCart={setCart} />;
      case "cart":
        return <Cart username={username} cart={cart} setCart={setCart} />;
      case "my-borrowings":
        return <UserBorrowings />;
      case "profile":
        return <Profile mode="user" username={username} />;
      default:
        return <UserComponentSearch cart={cart} setCart={setCart} />;
    }
  };
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <div className="flex h-screen bg-gray-50">
      <Toaster />
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${sidebarOpen ? "w-64" : "w-16"}`}>
        <div className={`p-4 border-b border-gray-200 ${sidebarOpen ? "" : "px-3"}`}>
          {sidebarOpen ? <>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-gray-900">IoT Lab</h1>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {mode === "admin" ? "Admin Portal" : "User Portal"}
              </p>
            </> : <div className="flex justify-center">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
            </div>}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {mode === "admin" ? adminNavigation.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return <button key={item.id} onClick={() => setCurrentView(item.id)} title={!sidebarOpen ? item.label : ""} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-700 hover:bg-gray-100 border border-transparent"} ${!sidebarOpen ? "justify-center px-2" : ""}`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>;
        }) : userNavigation.map(item => {
          const Icon = item.icon;
          const isActive = currentUserView === item.id;
          return <button key={item.id} onClick={() => setCurrentUserView(item.id)} title={!sidebarOpen ? item.label : ""} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-700 hover:bg-gray-100 border border-transparent"} ${!sidebarOpen ? "justify-center px-2" : ""}`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>;
        })}
        </nav>

        {/* User Info and Logout */}
        <div className={`p-4 border-t border-gray-200 space-y-3 ${!sidebarOpen ? "px-2" : ""}`}>
          {sidebarOpen ? <>
              <button onClick={() => mode === "admin" ? setCurrentView("profile") : setCurrentUserView("profile")} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${mode === "admin" ? "bg-purple-600 text-white" : "bg-blue-600 text-white"}`}>
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-gray-900">
                    {username}
                  </p>
                  <p className="text-xs text-gray-600">
                    {mode === "admin" ? "admin@iotlab.edu" : `${username.toLowerCase().replace(" ", ".")}@student.edu`}
                  </p>
                </div>
              </button>

              <Button variant="outline" className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </> : <button onClick={handleLogout} title="Logout" className="w-full flex justify-center p-2 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-red-600" />
            </button>}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} title={sidebarOpen ? "Hide main menu" : "Show main menu"} className="p-2 rounded-full hover:bg-gray-100 transition-colors group relative">
              <div className="flex flex-col gap-1">
                <span className="w-5 h-0.5 bg-gray-700 transition-all group-hover:bg-gray-900"></span>
                <span className="w-5 h-0.5 bg-gray-700 transition-all group-hover:bg-gray-900"></span>
                <span className="w-5 h-0.5 bg-gray-700 transition-all group-hover:bg-gray-900"></span>
              </div>
            </button>

            <h2 className="text-gray-900">
              {mode === "admin" ? "Admin Portal" : "User Portal"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Cart Badge - Only for users */}
            {mode === "user" && <button onClick={() => setCurrentUserView("cart")} className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors" title="View Cart">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {totalCartItems > 0 && <span className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center px-1.5 bg-blue-600 text-white text-xs rounded-full">
                    {totalCartItems}
                  </span>}
              </button>}

            {/* Profile Badge */}
            <button onClick={() => mode === "admin" ? setCurrentView("profile") : setCurrentUserView("profile")} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${mode === "admin" ? "bg-purple-600 text-white" : "bg-blue-600 text-white"}`}>
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-900">
                  {username}
                </p>
                <p className="text-xs text-gray-500">
                  {mode === "admin" ? "admin@iotlab.edu" : `${username.toLowerCase().replace(" ", ".")}@student.edu`}
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {mode === "admin" ? renderAdminView() : renderUserView()}
        </div>
      </main>
    </div>;
}