"use client";

import { usePayroll } from "@/context/PayrollContext";
import {
  HotelIcon,
  UsersIcon,
  ClockIcon,
  AwardIcon,
  FileTextIcon,
  SettingsIcon,
  DollarSignIcon,
  CalendarIcon,
} from "@/components/icons";

type Page =
  | "dashboard"
  | "employees"
  | "attendance"
  | "tips"
  | "payroll"
  | "payslips"
  | "settings";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: HotelIcon },
  { id: "employees" as Page, label: "Staff Directory", icon: UsersIcon },
  { id: "attendance" as Page, label: "Attendance & Shifts", icon: ClockIcon },
  { id: "tips" as Page, label: "Tips & Service Charge", icon: AwardIcon },
  { id: "payroll" as Page, label: "Payroll Runs", icon: CalendarIcon },
  { id: "payslips" as Page, label: "Payslips", icon: FileTextIcon },
  { id: "settings" as Page, label: "Settings", icon: SettingsIcon },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { settings } = usePayroll();

  return (
    <aside className="w-64 min-h-screen bg-zinc-900 flex flex-col shadow-xl flex-shrink-0">
      {/* Logo & Hotel Name */}
      <div className="px-5 py-6 border-b border-zinc-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
            <DollarSignIcon className="w-5 h-5 text-zinc-900" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-bold text-sm leading-tight truncate">
              {settings.hotelName.split(" ").slice(0, 2).join(" ")}
            </div>
            <div className="text-zinc-400 text-xs mt-0.5">Payroll Management</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-amber-500 text-zinc-900 shadow-lg shadow-amber-500/20"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0 w-5 h-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-zinc-700/50">
        <div className="text-zinc-500 text-xs">
          <div className="font-medium text-zinc-400">Payroll System v2.0</div>
          <div className="mt-0.5">© 2026 Hotel Management</div>
        </div>
      </div>
    </aside>
  );
}
