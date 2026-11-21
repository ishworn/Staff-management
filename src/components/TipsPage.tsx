"use client";

import { useState } from "react";
import { usePayroll } from "@/context/PayrollContext";
import { TipPoolDistribution } from "@/types";
import { AwardIcon, CheckIcon, RefreshCwIcon, PlusIcon } from "@/components/icons";

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TipsPage() {
  const { employees, tipPools, calculateTipDistribution, commitTipDistribution } = usePayroll();

  const [totalAmount, setTotalAmount] = useState<number>(15000);
  const [method, setMethod] = useState<TipPoolDistribution["method"]>("Points-Weighted");
  const [periodName, setPeriodName] = useState("November 2026");
  const [preview, setPreview] = useState<TipPoolDistribution | null>(null);
  const [committed, setCommitted] = useState(false);

  const empMap = Object.fromEntries(employees.map((e) => [e.id, e]));

  const handleCalculate = () => {
    const dist = calculateTipDistribution(periodName, totalAmount, method);
    setPreview(dist);
    setCommitted(false);
  };

  const handleCommit = () => {
    if (preview) {
      commitTipDistribution(preview);
      setCommitted(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Tips & Service Charge</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Calculate and distribute pooled gratuities and service charges across staff
        </p>
      </div>

      {/* Distribution Calculator */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
        <h2 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
          <AwardIcon className="w-5 h-5 text-amber-500" />
          Distribution Calculator
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Period Name</label>
            <input
              value={periodName}
              onChange={(e) => setPeriodName(e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="November 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Total Collected ($)</label>
            <input
              type="number"
              min={0}
              step={100}
              value={totalAmount}
              onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Distribution Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as TipPoolDistribution["method"])}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="Points-Weighted">Points-Weighted (by service charge points)</option>
              <option value="Equal-Split">Equal Split (all staff equally)</option>
              <option value="Hours-Worked">Hours-Worked (by attendance hours)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCalculate}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold"
          >
            <RefreshCwIcon className="w-4 h-4" />
            Calculate Preview
          </button>
          {preview && !committed && (
            <button
              onClick={handleCommit}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 px-4 py-2.5 rounded-lg text-sm font-bold"
            >
              <CheckIcon className="w-4 h-4" />
              Commit Distribution
            </button>
          )}
          {committed && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <CheckIcon className="w-4 h-4" />
              Distribution committed successfully!
            </div>
          )}
        </div>
      </div>

      {/* Preview table */}
      {preview && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-zinc-900">Preview — {preview.periodName}</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {preview.method} · Total pool: {fmt(preview.totalAmountCollected)}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                preview.status === "Committed"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {preview.status}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Points</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Share %</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {preview.allocations
                .sort((a, b) => b.amount - a.amount)
                .map((alloc) => {
                  const emp = empMap[alloc.employeeId];
                  if (!emp) return null;
                  const pct = ((alloc.amount / preview.totalAmountCollected) * 100).toFixed(1);
                  return (
                    <tr key={alloc.employeeId} className="hover:bg-zinc-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full ${emp.avatarBg || "bg-zinc-400"} flex items-center justify-center text-white text-xs font-bold`}
                          >
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <span className="font-medium text-zinc-900">
                            {emp.firstName} {emp.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{emp.department}</td>
                      <td className="px-4 py-3 text-zinc-700">{alloc.points}x</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-zinc-100 rounded-full h-1.5 w-24">
                            <div
                              className="bg-amber-400 h-1.5 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-500">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-zinc-900">
                        {fmt(alloc.amount)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr className="bg-zinc-50 border-t border-zinc-200">
                <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-zinc-900">Total Distributed</td>
                <td className="px-4 py-3 text-right font-bold text-zinc-900">
                  {fmt(preview.allocations.reduce((s, a) => s + a.amount, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Historical Tip Pools */}
      <div className="space-y-3">
        <h2 className="font-semibold text-zinc-800 flex items-center gap-2">
          <PlusIcon className="w-4 h-4 text-zinc-400" />
          Historical Distributions
        </h2>
        {tipPools.map((pool) => (
          <div key={pool.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-zinc-900">{pool.periodName}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {pool.method} · {pool.allocations.length} employees · {fmt(pool.totalAmountCollected)} total
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  pool.status === "Committed"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {pool.status}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {pool.allocations
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 8)
                .map((alloc) => {
                  const emp = empMap[alloc.employeeId];
                  if (!emp) return null;
                  return (
                    <div
                      key={alloc.employeeId}
                      className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full ${emp.avatarBg || "bg-zinc-400"} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                        >
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <span className="text-xs text-zinc-700 truncate">{emp.firstName}</span>
                      </div>
                      <span className="text-xs font-semibold text-zinc-900 ml-1">
                        {fmt(alloc.amount)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
        {tipPools.length === 0 && (
          <div className="bg-white rounded-xl border border-zinc-200 p-10 text-center">
            <AwardIcon className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
            <p className="text-zinc-400 font-medium">No tip distributions yet</p>
            <p className="text-zinc-300 text-sm">Use the calculator above to create one</p>
          </div>
        )}
      </div>
    </div>
  );
}
