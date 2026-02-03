import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import AuraHeader from "./components/AuraHeader";
import SidebarAura from "./components/SidebarAura";
import ShadowFeed from "./components/ShadowFeed";
import InvestigationView from "./components/InvestigationView";
import Dashboard from "./components/Dashboard";
import ThreatMap from "./components/ThreatMap";
import Reports from "./components/Reports";
import TestDashboard from "./components/TestDashboard";
import UserManagement from "./components/UserManagement";
import IncidentForm from "./components/IncidentForm";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";

function AuraLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // If not authenticated, redirect to sign in
  if (!isAuthenticated && !loading) {
    return <Navigate to="/signin" replace />;
  }
  
  // Extract the active view from the current path
  const pathMap = {
    "/": "dashboard",
    "/dashboard": "dashboard",
    "/shadow-feed": "shadow-feed",
    "/case-families": "case-families",
    "/threat-map": "threat-map",
    "/reports": "reports",
    "/test-dashboard": "test-dashboard"
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

function AppContent() {
  const { loading } = useAuth();

  // If loading, show a loading screen
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f1a 0%, #0c1422 100%)',
        color: 'white'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AuraLayout><Dashboard /></AuraLayout>
          </ProtectedRoute>
        } />
        <Route path="/shadow-feed" element={
          <ProtectedRoute>
            <AuraLayout><ShadowFeed /></AuraLayout>
          </ProtectedRoute>
        } />
        <Route path="/incident-form" element={
          <ProtectedRoute>
            <AuraLayout><IncidentForm /></AuraLayout>
          </ProtectedRoute>
        } />
        <Route path="/case-families" element={
          <ProtectedRoute>
            <AuraLayout><InvestigationView /></AuraLayout>
          </ProtectedRoute>
        } />
        <Route path="/threat-map" element={
          <ProtectedRoute>
            <AuraLayout><ThreatMap /></AuraLayout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <AuraLayout><Reports /></AuraLayout>
          </ProtectedRoute>
        } />
        <Route path="/test-dashboard" element={
          <ProtectedRoute>
            <AuraLayout><TestDashboard /></AuraLayout>
          </ProtectedRoute>
        } />
        <Route path="/user-management" element={
          <ProtectedRoute>
            <AuraLayout><UserManagement /></AuraLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}