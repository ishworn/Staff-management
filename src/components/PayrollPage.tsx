"use client";

import { useState } from "react";
import { usePayroll } from "@/context/PayrollContext";
import { PayrollPeriod } from "@/types";
import {
  PlusIcon, CalendarIcon, CheckCircleIcon, PlayIcon, RefreshCwIcon, XIcon, CheckIcon
} from "@/components/icons";

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
  "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-blue-50 text-blue-700 border-blue-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function NewPeriodModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, start: string, end: string, pay: string) => void;
}) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");

  const [form, setForm] = useState({
    periodName: `${now.toLocaleString("default", { month: "long" })} ${yyyy}`,
    startDate: `${yyyy}-${mm}-01`,
    endDate: `${yyyy}-${mm}-30`,
    payDate: `${yyyy}-${mm}-30`,
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-zinc-200">
          <h2 className="text-lg font-bold text-zinc-900">Create New Payroll Run</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-100 rounded-lg">
            <XIcon className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Period Name</label>
            <input
              value={form.periodName}
              onChange={(e) => set("periodName", e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Pay Date</label>
            <input
              type="date"
              value={form.payDate}
              onChange={(e) => set("payDate", e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
            Payslips will be auto-generated for all active staff using current attendance data, tip distributions, and configured deduction rules.
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onCreate(form.periodName, form.startDate, form.endDate, form.payDate)}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-sm font-bold text-zinc-900 flex items-center justify-center gap-2"
            >
              <PlayIcon className="w-4 h-4" />
              Create & Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayrollPage({ onNavigateToPayslips }: { onNavigateToPayslips?: () => void }) {
  const {
    payrollPeriods,
    payslips,
    createPayrollRun,
    updatePayrollStatus,
    updatePayrollStatus: advanceStatus,
    generateAllPayslipsForPeriod,
    setActivePeriod,
    activePeriod,
  } = usePayroll();

  const [showNewModal, setShowNewModal] = useState(false);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  const handleCreate = (name: string, start: string, end: string, pay: string) => {
    createPayrollRun(name, start, end, pay);
    setShowNewModal(false);
  };

  const handleAdvance = (period: PayrollPeriod) => {
    const next: Record<string, string> = {
      Draft: "Under Review",
      "Under Review": "Approved",
      Approved: "Paid",
      Paid: "Paid",
    };
    advanceStatus(period.id, next[period.status] as PayrollPeriod["status"]);
  };

  const getAdvanceLabel = (status: string) => {
    const map: Record<string, string> = {
      Draft: "Submit for Review",
      "Under Review": "Approve Payroll",
      Approved: "Mark as Paid",
      Paid: "Paid ✓",
    };
    return map[status] || "";
  };

  const sortedPeriods = [...payrollPeriods].reverse();

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Payroll Runs</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {payrollPeriods.length} total pay periods ·{" "}
            {payrollPeriods.filter((p) => p.status === "Paid").length} disbursed
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold px-4 py-2.5 rounded-lg text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          New Payroll Run
        </button>
      </div>

      {/* Period Cards */}
      <div className="space-y-4">
        {sortedPeriods.map((period) => {
          const periodPayslips = payslips.filter((p) => p.payrollPeriodId === period.id);
          const isActive = activePeriod?.id === period.id;
          const isPaid = period.status === "Paid";

          return (
            <div
              key={period.id}
              className={`bg-white rounded-xl border shadow-sm p-5 ${
                isActive ? "border-amber-300 ring-2 ring-amber-200" : "border-zinc-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPaid ? "bg-emerald-100" : "bg-amber-100"}`}>
                    <CalendarIcon className={`w-5 h-5 ${isPaid ? "text-emerald-600" : "text-amber-600"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-zinc-900">{period.periodName}</h2>
                      {isActive && (
                        <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {period.startDate} → {period.endDate} · Pay date: {period.payDate}
                    </div>
                    {period.approvedBy && (
                      <div className="text-xs text-zinc-400 mt-0.5">
                        Approved by: {period.approvedBy}
                      </div>
                    )}
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[period.status]}`}>
                  {period.status}
                </span>
              </div>

              {/* Financials row */}
              <div className="mt-4 grid grid-cols-5 gap-3">
                {[
                  { label: "Employees", value: period.totalEmployees.toString() },
                  { label: "Gross Pay", value: fmt(period.totalGross) },
                  { label: "Deductions", value: fmt(period.totalDeductions) },
                  { label: "Net Pay", value: fmt(period.totalNet), highlight: true },
                  { label: "Tips Distributed", value: fmt(period.totalTipsDistributed) },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="bg-zinc-50 rounded-lg px-3 py-2.5">
                    <div className="text-xs text-zinc-500 mb-0.5">{label}</div>
                    <div className={`font-bold text-sm ${highlight ? "text-emerald-700" : "text-zinc-900"}`}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payslip progress */}
              {periodPayslips.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                    <span>{periodPayslips.length} payslips generated</span>
                    <span>
                      {periodPayslips.filter((p) => p.paymentStatus === "Paid").length} / {periodPayslips.length} paid
                    </span>
                  </div>
                  <div className="bg-zinc-100 rounded-full h-1.5">
                    <div
                      className="bg-emerald-400 h-1.5 rounded-full transition-all"
                      style={{
                        width: `${(periodPayslips.filter((p) => p.paymentStatus === "Paid").length / periodPayslips.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setActivePeriod(period)}
                  className="text-xs font-medium px-3 py-1.5 border border-zinc-300 hover:bg-zinc-50 rounded-lg text-zinc-700"
                >
                  Set Active
                </button>
                <button
                  onClick={() => {
                    setRegenerating(period.id);
                    setTimeout(() => {
                      generateAllPayslipsForPeriod(period.id);
                      setRegenerating(null);
                    }, 500);
                  }}
                  disabled={regenerating === period.id || isPaid}
                  className="text-xs font-medium px-3 py-1.5 border border-zinc-300 hover:bg-zinc-50 rounded-lg text-zinc-700 disabled:opacity-40 flex items-center gap-1"
                >
                  <RefreshCwIcon className={`w-3.5 h-3.5 ${regenerating === period.id ? "animate-spin" : ""}`} />
                  Regenerate Payslips
                </button>
                {onNavigateToPayslips && (
                  <button
                    onClick={onNavigateToPayslips}
                    className="text-xs font-medium px-3 py-1.5 border border-zinc-300 hover:bg-zinc-50 rounded-lg text-zinc-700"
                  >
                    View Payslips →
                  </button>
                )}
                {!isPaid && (
                  <button
                    onClick={() => handleAdvance(period)}
                    className="text-xs font-semibold px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-900 rounded-lg flex items-center gap-1 ml-auto"
                  >
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    {getAdvanceLabel(period.status)}
                  </button>
                )}
                {isPaid && (
                  <div className="ml-auto flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckIcon className="w-3.5 h-3.5" />
                    Disbursed on {period.payDate}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {payrollPeriods.length === 0 && (
          <div className="bg-white rounded-xl border border-zinc-200 p-16 text-center">
            <CalendarIcon className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <p className="text-zinc-400 font-semibold text-lg">No payroll runs yet</p>
            <p className="text-zinc-300 text-sm mt-1">Create your first payroll period to get started</p>
            <button
              onClick={() => setShowNewModal(true)}
              className="mt-5 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold px-5 py-2.5 rounded-lg text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Create First Payroll Run
            </button>
          </div>
        )}
      </div>

      {showNewModal && (
        <NewPeriodModal onClose={() => setShowNewModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
