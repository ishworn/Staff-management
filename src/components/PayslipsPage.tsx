"use client";

import { useState } from "react";
import { usePayroll } from "@/context/PayrollContext";
import { Payslip } from "@/types";
import {
  FileTextIcon,
  PrinterIcon,
  SearchIcon,
  EyeIcon,
  XIcon,
  CheckCircleIcon,
} from "@/components/icons";

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function PayslipModal({
  payslip,
  onClose,
}: {
  payslip: Payslip;
  onClose: () => void;
}) {
  const { employees, payrollPeriods, settings } = usePayroll();
  const emp = employees.find((e) => e.id === payslip.employeeId);
  const period = payrollPeriods.find((p) => p.id === payslip.payrollPeriodId);

  if (!emp) return null;

  const earnings = [
    { label: "Base Salary", amount: payslip.basePay },
    { label: `Overtime (${payslip.overtimeHours}h × ${settings.overtimeMultiplier}x)`, amount: payslip.overtimePay },
    { label: `Night Differential (${payslip.nightDifferentialHours}h × ${settings.nightDifferentialPercentage}%)`, amount: payslip.nightDifferentialPay },
    { label: "Split Shift Allowance", amount: payslip.splitShiftAllowance },
    { label: "Service Charge & Tips", amount: payslip.serviceChargeAndTips },
    { label: "Meal Allowance", amount: payslip.mealAllowance },
    { label: "Housing Allowance", amount: payslip.housingAllowance },
    { label: "Other Bonuses", amount: payslip.otherBonuses },
  ].filter((e) => e.amount > 0);

  const deductions = [
    { label: `Income Tax (${settings.incomeTaxFlatRate}%)`, amount: payslip.incomeTax },
    { label: `Provident Fund / 401k (${settings.providentFundRate}%)`, amount: payslip.providentFundOr401k },
    { label: "Health Insurance", amount: payslip.healthInsurance },
    { label: "Salary Advance Deduction", amount: payslip.salaryAdvanceDeduction },
    { label: "Other Deductions", amount: payslip.uniformOrOtherDeductions },
  ].filter((d) => d.amount > 0);

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4" id="payslip-print-area">
        {/* Payslip Header */}
        <div className="bg-zinc-900 text-white rounded-t-2xl px-7 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold">{settings.hotelName}</h1>
              <p className="text-zinc-400 text-xs mt-0.5">{settings.hotelAddress}</p>
              <p className="text-zinc-400 text-xs">{settings.hotelEmail} · {settings.hotelPhone}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg print:hidden"
            >
              <XIcon className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">
                Payslip
              </div>
              <div className="text-2xl font-bold">{period?.periodName}</div>
              <div className="text-zinc-400 text-xs mt-1">
                Issue date: {payslip.issueDate} · Pay date: {period?.payDate}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  payslip.paymentStatus === "Paid"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                <CheckCircleIcon className="w-3.5 h-3.5" />
                {payslip.paymentStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div className="px-7 py-5 border-b border-zinc-200 flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-xl ${emp.avatarBg || "bg-zinc-600"} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}
          >
            {emp.firstName[0]}{emp.lastName[0]}
          </div>
          <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-1">
            <div>
              <div className="text-xs text-zinc-400">Full Name</div>
              <div className="text-sm font-semibold text-zinc-900">
                {emp.firstName} {emp.lastName}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Employee Code</div>
              <div className="text-sm font-semibold text-zinc-900">{emp.employeeCode}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Position</div>
              <div className="text-sm font-semibold text-zinc-900">{emp.position}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Department</div>
              <div className="text-sm font-semibold text-zinc-900">{emp.department}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Employment Type</div>
              <div className="text-sm font-semibold text-zinc-900">{emp.employmentType}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Bank Account</div>
              <div className="text-sm font-semibold text-zinc-900">
                {emp.bankName} {emp.accountNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="px-7 py-5 grid grid-cols-2 gap-6">
          {/* Earnings */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">
              Earnings
            </h3>
            <div className="space-y-2">
              {earnings.map(({ label, amount }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-zinc-600">{label}</span>
                  <span className="font-medium text-zinc-900">{fmt(amount)}</span>
                </div>
              ))}
              <div className="border-t border-zinc-200 pt-2 flex justify-between">
                <span className="font-bold text-zinc-900">Gross Pay</span>
                <span className="font-bold text-zinc-900">{fmt(payslip.grossPay)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">
              Deductions
            </h3>
            <div className="space-y-2">
              {deductions.map(({ label, amount }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-zinc-600">{label}</span>
                  <span className="font-medium text-red-600">- {fmt(amount)}</span>
                </div>
              ))}
              <div className="border-t border-zinc-200 pt-2 flex justify-between">
                <span className="font-bold text-zinc-900">Total Deductions</span>
                <span className="font-bold text-red-600">- {fmt(payslip.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="mx-7 mb-5 bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">
              Net Pay
            </div>
            <div className="text-3xl font-bold text-emerald-700 mt-0.5">{fmt(payslip.netPay)}</div>
          </div>
          {payslip.paymentDate && (
            <div className="text-right">
              <div className="text-xs text-emerald-600">Payment Date</div>
              <div className="font-semibold text-emerald-700">{payslip.paymentDate}</div>
            </div>
          )}
        </div>

        {payslip.notes && (
          <div className="mx-7 mb-5 text-xs text-zinc-500 bg-zinc-50 rounded-lg p-3">
            <span className="font-semibold">Notes: </span>{payslip.notes}
          </div>
        )}

        {/* Footer */}
        <div className="px-7 pb-6 flex items-center justify-between print:hidden">
          <div className="text-xs text-zinc-400">
            Tax ID: {emp.taxId} · Registration: {settings.taxRegistrationNumber}
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            data-print-hidden="false"
          >
            <PrinterIcon className="w-4 h-4" />
            Print / Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PayslipsPage() {
  const { employees, payslips, payrollPeriods, activePeriod } = usePayroll();
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(
    activePeriod?.id || payrollPeriods[payrollPeriods.length - 1]?.id || ""
  );
  const [search, setSearch] = useState("");
  const [viewingPayslip, setViewingPayslip] = useState<Payslip | null>(null);

  const empMap = Object.fromEntries(employees.map((e) => [e.id, e]));

  const periodPayslips = payslips.filter((p) => p.payrollPeriodId === selectedPeriodId);
  const filtered = periodPayslips.filter((p) => {
    const emp = empMap[p.employeeId];
    if (!emp) return false;
    const q = search.toLowerCase();
    return (
      !q ||
      emp.firstName.toLowerCase().includes(q) ||
      emp.lastName.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q)
    );
  });

  const selectedPeriod = payrollPeriods.find((p) => p.id === selectedPeriodId);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Payslips</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {filtered.length} payslips for{" "}
            {selectedPeriod?.periodName || "selected period"}
          </p>
        </div>
      </div>

      {/* Period & Search Controls */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={selectedPeriodId}
          onChange={(e) => setSelectedPeriodId(e.target.value)}
          className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {[...payrollPeriods].reverse().map((p) => (
            <option key={p.id} value={p.id}>
              {p.periodName} — {p.status}
            </option>
          ))}
        </select>
        <div className="relative">
          <SearchIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or department..."
            className="pl-9 pr-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-56"
          />
        </div>
      </div>

      {/* Summary row */}
      {selectedPeriod && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Gross", value: fmt(selectedPeriod.totalGross), color: "text-zinc-900" },
            { label: "Total Deductions", value: fmt(selectedPeriod.totalDeductions), color: "text-red-600" },
            { label: "Total Net Pay", value: fmt(selectedPeriod.totalNet), color: "text-emerald-700" },
            {
              label: "Paid Out",
              value: `${periodPayslips.filter((p) => p.paymentStatus === "Paid").length} / ${periodPayslips.length}`,
              color: "text-blue-700",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="text-xs text-zinc-500 mb-1">{label}</div>
              <div className={`text-lg font-bold ${color}`}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Payslips Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Employee</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Department</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Gross</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Deductions</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Net Pay</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((ps) => {
              const emp = empMap[ps.employeeId];
              if (!emp) return null;
              return (
                <tr key={ps.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full ${emp.avatarBg || "bg-zinc-400"} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-xs text-zinc-400">{emp.employeeCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{emp.department}</td>
                  <td className="px-4 py-3 text-right font-medium text-zinc-900">
                    {fmt(ps.grossPay)}
                  </td>
                  <td className="px-4 py-3 text-right text-red-600">
                    - {fmt(ps.totalDeductions)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-700">
                    {fmt(ps.netPay)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        ps.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {ps.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setViewingPayslip(ps)}
                      className="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <FileTextIcon className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                  <p className="text-zinc-400 font-medium">
                    {payrollPeriods.length === 0
                      ? "No payroll periods exist yet"
                      : "No payslips for this period"}
                  </p>
                  <p className="text-zinc-300 text-xs mt-1">
                    Generate payslips from the Payroll Runs page
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewingPayslip && (
        <PayslipModal
          payslip={viewingPayslip}
          onClose={() => setViewingPayslip(null)}
        />
      )}
    </div>
  );
}
