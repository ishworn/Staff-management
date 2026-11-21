"use client";

import { useState } from "react";
import { PayrollProvider } from "@/context/PayrollContext";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import EmployeesPage from "@/components/EmployeesPage";
import AttendancePage from "@/components/AttendancePage";
import TipsPage from "@/components/TipsPage";
import PayrollPage from "@/components/PayrollPage";
import PayslipsPage from "@/components/PayslipsPage";
import SettingsPage from "@/components/SettingsPage";

type Page =
  | "dashboard"
  | "employees"
  | "attendance"
  | "tips"
  | "payroll"
  | "payslips"
  | "settings";

function App() {
  const [page, setPage] = useState<Page>("dashboard");

  const navigate = (p: string) => setPage(p as Page);

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard onNavigate={navigate} />;
      case "employees":
        return <EmployeesPage />;
      case "attendance":
        return <AttendancePage />;
      case "tips":
        return <TipsPage />;
      case "payroll":
        return <PayrollPage onNavigateToPayslips={() => setPage("payslips")} />;
      case "payslips":
        return <PayslipsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main className="flex-1 overflow-y-auto min-h-screen">{renderPage()}</main>
    </div>
  );
}

export default function Home() {
  return (
    <PayrollProvider>
      <App />
    </PayrollProvider>
  );
}
