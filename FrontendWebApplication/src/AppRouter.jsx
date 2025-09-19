import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Websites from "./pages/Websites";
import Preferences from "./pages/Preferences";
import Agencies from "./pages/Agencies";
import Notes from "./pages/Notes";
import Reports from "./pages/Reports";
import Account from "./pages/Account";
import Billing from "./pages/Billing";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/onboarding"
            element={
              <RequireAuth>
                <Layout>
                  <Onboarding />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout>
                  <Dashboard />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/websites"
            element={
              <RequireAuth>
                <Layout>
                  <Websites />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/preferences"
            element={
              <RequireAuth>
                <Layout>
                  <Preferences />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/agencies"
            element={
              <RequireAuth>
                <Layout>
                  <Agencies />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/notes/:websiteId"
            element={
              <RequireAuth>
                <Layout>
                  <Notes />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/reports"
            element={
              <RequireAuth>
                <Layout>
                  <Reports />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Layout>
                  <Account />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/billing"
            element={
              <RequireAuth>
                <Layout>
                  <Billing />
                </Layout>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
