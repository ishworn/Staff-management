"use client";

import { useState } from "react";
import { usePayroll } from "@/context/PayrollContext";
import { AttendanceRecord, ShiftType, AttendanceStatus } from "@/types";
import { PlusIcon, TrashIcon, ClockIcon, XIcon, CheckIcon } from "@/components/icons";

const SHIFT_COLORS: Record<ShiftType, string> = {
  Day: "bg-blue-100 text-blue-700",
  Evening: "bg-purple-100 text-purple-700",
  Night: "bg-zinc-800 text-zinc-100",
  Split: "bg-amber-100 text-amber-700",
};

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-100 text-emerald-700",
  Absent: "bg-red-100 text-red-700",
  "On Leave": "bg-amber-100 text-amber-700",
  "Half-Day": "bg-blue-100 text-blue-700",
};

function AddRecordModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (record: Omit<AttendanceRecord, "id">) => void;
}) {
  const { employees } = usePayroll();
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    shiftType: "Day" as ShiftType,
    checkIn: "08:00",
    checkOut: "16:00",
    regularHours: 8,
    overtimeHours: 0,
    nightShiftHours: 0,
    status: "Present" as AttendanceStatus,
    notes: "",
  });

  const set = (k: string, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-zinc-200">
          <h2 className="text-lg font-bold text-zinc-900">Log Attendance Record</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-100 rounded-lg">
            <XIcon className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Employee *</label>
              <select
                required
                value={form.employeeId}
                onChange={(e) => set("employeeId", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Date *</label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Shift Type *</label>
              <select
                value={form.shiftType}
                onChange={(e) => set("shiftType", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {(["Day", "Evening", "Night", "Split"] as ShiftType[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Status *</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {(["Present","Absent","On Leave","Half-Day"] as AttendanceStatus[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Check In</label>
              <input
                type="time"
                value={form.checkIn}
                onChange={(e) => set("checkIn", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Check Out</label>
              <input
                type="time"
                value={form.checkOut}
                onChange={(e) => set("checkOut", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Regular Hrs</label>
              <input
                type="number"
                min={0}
                max={12}
                step={0.5}
                value={form.regularHours}
                onChange={(e) => set("regularHours", parseFloat(e.target.value) || 0)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Overtime Hrs</label>
              <input
                type="number"
                min={0}
                max={8}
                step={0.5}
                value={form.overtimeHours}
                onChange={(e) => set("overtimeHours", parseFloat(e.target.value) || 0)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Night Hrs</label>
              <input
                type="number"
                min={0}
                max={12}
                step={0.5}
                value={form.nightShiftHours}
                onChange={(e) => set("nightShiftHours", parseFloat(e.target.value) || 0)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Notes</label>
            <input
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="e.g. VIP arrival, event coverage..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-sm font-bold text-zinc-900 flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-4 h-4" />
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const { employees, attendance, addAttendanceRecord, deleteAttendanceRecord, getEmployeeAttendanceSummary } =
    usePayroll();
  const [showModal, setShowModal] = useState(false);
  const [empFilter, setEmpFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"log" | "summary">("log");

  const empMap = Object.fromEntries(employees.map((e) => [e.id, e]));

  const filtered = empFilter === "All"
    ? attendance
    : attendance.filter((a) => a.employeeId === empFilter);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Attendance & Shifts</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {attendance.length} records logged across all staff
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold px-4 py-2.5 rounded-lg text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Log Attendance
        </button>
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex gap-1 bg-zinc-100 p-1 rounded-lg">
          {(["log", "summary"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === mode
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {mode === "log" ? "Attendance Log" : "Monthly Summary"}
            </button>
          ))}
        </div>
        <select
          value={empFilter}
          onChange={(e) => setEmpFilter(e.target.value)}
          className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="All">All Staff</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>
      </div>

      {viewMode === "log" ? (
        /* Attendance Log Table */
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Shift</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Hours</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Notes</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {sorted.map((rec) => {
                const emp = empMap[rec.employeeId];
                return (
                  <tr key={rec.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full ${emp?.avatarBg || "bg-zinc-400"} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                        >
                          {emp ? emp.firstName[0] + emp.lastName[0] : "?"}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900">
                            {emp ? `${emp.firstName} ${emp.lastName}` : "Unknown"}
                          </div>
                          <div className="text-xs text-zinc-400">{emp?.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-700 font-medium">{rec.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SHIFT_COLORS[rec.shiftType]}`}>
                        {rec.shiftType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-zinc-900 font-medium">{rec.regularHours}h regular</div>
                      <div className="text-xs text-zinc-400">
                        {rec.overtimeHours > 0 && `+${rec.overtimeHours}h OT · `}
                        {rec.nightShiftHours > 0 && `${rec.nightShiftHours}h night`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[rec.status]}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500 max-w-xs truncate">{rec.notes || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteAttendanceRecord(rec.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <ClockIcon className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                    <p className="text-zinc-400 font-medium">No attendance records yet</p>
                    <p className="text-zinc-300 text-xs mt-1">Use &ldquo;Log Attendance&rdquo; to add entries</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Monthly Summary */
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Days Present</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Regular Hrs</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Overtime Hrs</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Night Hrs</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Split Shifts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {employees.map((emp) => {
                const summary = getEmployeeAttendanceSummary(emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full ${emp.avatarBg || "bg-zinc-400"} flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-zinc-400">{emp.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">{summary.daysPresent}</td>
                    <td className="px-4 py-3 text-zinc-700">{summary.totalRegularHours}h</td>
                    <td className="px-4 py-3">
                      <span className={summary.totalOvertimeHours > 0 ? "text-amber-700 font-semibold" : "text-zinc-400"}>
                        {summary.totalOvertimeHours}h
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={summary.totalNightHours > 0 ? "text-purple-700 font-semibold" : "text-zinc-400"}>
                        {summary.totalNightHours}h
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={summary.totalSplitShifts > 0 ? "text-blue-700 font-semibold" : "text-zinc-400"}>
                        {summary.totalSplitShifts}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AddRecordModal
          onClose={() => setShowModal(false)}
          onSave={(rec) => {
            addAttendanceRecord(rec);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
