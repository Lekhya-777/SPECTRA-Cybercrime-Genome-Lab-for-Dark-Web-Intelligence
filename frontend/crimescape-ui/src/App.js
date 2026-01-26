import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import AuraHeader from "./components/AuraHeader";
import SidebarAura from "./components/SidebarAura";
import ShadowFeed from "./components/ShadowFeed";
import InvestigationView from "./components/InvestigationView";
import Dashboard from "./components/Dashboard";
import ThreatMap from "./components/ThreatMap";
import Reports from "./components/Reports";
import Home from "./pages/Home";

function AuraLayout({ children }) {
  const location = useLocation();
  
  // Extract the active view from the current path
  const pathMap = {
    "/": "dashboard",
    "/dashboard": "dashboard",
    "/shadow-feed": "shadow-feed",
    "/case-families": "case-families",
    "/threat-map": "threat-map",
    "/reports": "reports"
  };
  
  const activeView = pathMap[location.pathname] || "dashboard";

  return (
    <div className="app-container">
      <AuraHeader />
      <div className="main-layout">
        <aside className="left-panel">
          <SidebarAura activeView={activeView} onSelectView={() => {}} />
        </aside>

        <main className="center-canvas">
          {children}
        </main>

        <aside className="right-panel">
          <InvestigationView />
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<AuraLayout><Dashboard /></AuraLayout>} />
        <Route path="/shadow-feed" element={<AuraLayout><ShadowFeed /></AuraLayout>} />
        <Route path="/case-families" element={<AuraLayout><InvestigationView /></AuraLayout>} />
        <Route path="/threat-map" element={<AuraLayout><ThreatMap /></AuraLayout>} />
        <Route path="/reports" element={<AuraLayout><Reports /></AuraLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
