"use client";

import { useState } from "react";
import { usePayroll } from "@/context/PayrollContext";
import { Employee, Department, EmploymentType } from "@/types";
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
  CheckIcon,
} from "@/components/icons";

const DEPARTMENTS: Department[] = [
  "Front Desk",
  "Housekeeping",
  "Food & Beverage",
  "Kitchen & Culinary",
  "Maintenance & Engineering",
  "Security & Safety",
  "Management & Admin",
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-Time Salaried",
  "Full-Time Hourly",
  "Part-Time",
  "Contract / Seasonal",
];

const AVATAR_COLORS = [
  "bg-blue-600","bg-indigo-600","bg-violet-600","bg-purple-600",
  "bg-pink-600","bg-rose-600","bg-red-600","bg-orange-600",
  "bg-amber-600","bg-yellow-600","bg-teal-600","bg-emerald-600",
  "bg-green-600","bg-cyan-600","bg-slate-700","bg-zinc-700",
];

function getInitials(first: string, last: string) {
  return (first[0] || "") + (last[0] || "");
}

function StatusChip({ status }: { status: Employee["status"] }) {
  const map: Record<Employee["status"], string> = {
    Active: "bg-emerald-100 text-emerald-700",
    "On Leave": "bg-amber-100 text-amber-700",
    Terminated: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}

type FormData = Omit<Employee, "id" | "employeeCode">;

function blankForm(): FormData {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "Front Desk",
    position: "",
    employmentType: "Full-Time Salaried",
    joinDate: new Date().toISOString().split("T")[0],
    baseSalary: 3000,
    hourlyRate: 18,
    bankName: "",
    accountNumber: "",
    taxId: "",
    serviceChargePoints: 1.0,
    status: "Active",
    avatarBg: "bg-indigo-600",
  };
}

interface EmployeeFormProps {
  initial?: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  title: string;
}

function EmployeeForm({ initial, onSave, onCancel, title }: EmployeeFormProps) {
  const [form, setForm] = useState<FormData>(initial || blankForm());

  const set = (key: keyof FormData, val: FormData[keyof FormData]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
          <button onClick={onCancel} className="p-1.5 hover:bg-zinc-100 rounded-lg">
            <XIcon className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Avatar color picker */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Avatar Color</label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => set("avatarBg", color)}
                  className={`w-7 h-7 rounded-full ${color} ring-2 ring-offset-1 ${
                    form.avatarBg === color ? "ring-zinc-800" : "ring-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                First Name *
              </label>
              <input
                required
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Elena"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Last Name *
              </label>
              <input
                required
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Rostova"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Department *</label>
              <select
                value={form.department}
                onChange={(e) => set("department", e.target.value as Department)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Position *</label>
              <input
                required
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Front Office Manager"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Employment Type *</label>
              <select
                value={form.employmentType}
                onChange={(e) => set("employmentType", e.target.value as EmploymentType)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Join Date *</label>
              <input
                required
                type="date"
                value={form.joinDate}
                onChange={(e) => set("joinDate", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Base Salary ($/mo) *</label>
              <input
                required
                type="number"
                min={0}
                value={form.baseSalary}
                onChange={(e) => set("baseSalary", parseFloat(e.target.value) || 0)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Hourly Rate ($/hr)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.hourlyRate}
                onChange={(e) => set("hourlyRate", parseFloat(e.target.value) || 0)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Service Charge Points</label>
              <input
                type="number"
                min={0}
                max={3}
                step={0.1}
                value={form.serviceChargePoints}
                onChange={(e) => set("serviceChargePoints", parseFloat(e.target.value) || 1)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Bank Name</label>
              <input
                value={form.bankName}
                onChange={(e) => set("bankName", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Account Number</label>
              <input
                value={form.accountNumber}
                onChange={(e) => set("accountNumber", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="**** 1234"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Tax ID</label>
              <input
                value={form.taxId}
                onChange={(e) => set("taxId", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as Employee["status"])}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-sm font-bold text-zinc-900 flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-4 h-4" />
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = usePayroll();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<"All" | Department>("All");
  const [modal, setModal] = useState<"add" | { emp: Employee } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q) ||
      e.employeeCode.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q);
    const matchDept = deptFilter === "All" || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Staff Directory</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {employees.filter((e) => e.status === "Active").length} active ·{" "}
            {employees.length} total employees
          </p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold px-4 py-2.5 rounded-lg text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <SearchIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-56"
            placeholder="Search staff..."
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value as "All" | Department)}
          className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="bg-white border border-zinc-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-11 h-11 rounded-xl ${emp.avatarBg || "bg-zinc-600"} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
              >
                {getInitials(emp.firstName, emp.lastName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-900 text-sm">
                    {emp.firstName} {emp.lastName}
                  </span>
                  <StatusChip status={emp.status} />
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 truncate">{emp.position}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{emp.employeeCode}</div>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Department</span>
                <span className="font-medium text-zinc-700">{emp.department}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Employment</span>
                <span className="font-medium text-zinc-700">{emp.employmentType}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Base Salary</span>
                <span className="font-semibold text-zinc-900">
                  ${emp.baseSalary.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Service Charge Points</span>
                <span className="font-medium text-zinc-700">{emp.serviceChargePoints}x</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex gap-2">
              <button
                onClick={() => setModal({ emp })}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 rounded-lg border border-zinc-200"
              >
                <EditIcon className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(emp.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 flex flex-col items-center justify-center text-zinc-400">
            <UsersIcon className="w-10 h-10 mb-3 text-zinc-300" />
            <p className="font-medium">No employees found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal === "add" && (
        <EmployeeForm
          title="Add New Employee"
          onCancel={() => setModal(null)}
          onSave={(data) => {
            addEmployee(data);
            setModal(null);
          }}
        />
      )}
      {modal && modal !== "add" && (
        <EmployeeForm
          title={`Edit — ${modal.emp.firstName} ${modal.emp.lastName}`}
          initial={modal.emp}
          onCancel={() => setModal(null)}
          onSave={(data) => {
            updateEmployee(modal.emp.id, data);
            setModal(null);
          }}
        />
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Delete Employee?</h3>
            <p className="text-sm text-zinc-600 mb-5">
              This will permanently remove the employee and all associated records. This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 border border-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteEmployee(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
