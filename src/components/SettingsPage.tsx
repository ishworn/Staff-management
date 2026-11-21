"use client";

import { useState } from "react";
import { usePayroll } from "@/context/PayrollContext";
import { HotelSettings } from "@/types";
import { SettingsIcon, CheckIcon, RefreshCwIcon } from "@/components/icons";

export default function SettingsPage() {
  const { settings, updateSettings, resetToSampleData } = usePayroll();
  const [form, setForm] = useState<HotelSettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const set = (k: keyof HotelSettings, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Configure hotel details, payroll rules, and deduction rates
          </p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-sm text-zinc-500 hover:text-red-600 flex items-center gap-1.5"
        >
          <RefreshCwIcon className="w-4 h-4" />
          Reset to Sample Data
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hotel Information */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <h2 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-zinc-500" />
            Hotel Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">Hotel Name</label>
              <input
                value={form.hotelName}
                onChange={(e) => set("hotelName", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Tagline</label>
              <input
                value={form.hotelTagline}
                onChange={(e) => set("hotelTagline", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Tax Registration #</label>
              <input
                value={form.taxRegistrationNumber}
                onChange={(e) => set("taxRegistrationNumber", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">Address</label>
              <input
                value={form.hotelAddress}
                onChange={(e) => set("hotelAddress", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Phone</label>
              <input
                value={form.hotelPhone}
                onChange={(e) => set("hotelPhone", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Payroll Email</label>
              <input
                type="email"
                value={form.hotelEmail}
                onChange={(e) => set("hotelEmail", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Currency</label>
              <input
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="USD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Currency Symbol</label>
              <input
                value={form.currencySymbol}
                onChange={(e) => set("currencySymbol", e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="$"
              />
            </div>
          </div>
        </div>

        {/* Payroll Rules */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Payroll Calculation Rules</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Overtime Multiplier
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={3}
                  step={0.1}
                  value={form.overtimeMultiplier}
                  onChange={(e) => set("overtimeMultiplier", parseFloat(e.target.value) || 1.5)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">x</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">e.g. 1.5 for time-and-a-half</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Night Differential %
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={form.nightDifferentialPercentage}
                  onChange={(e) => set("nightDifferentialPercentage", parseFloat(e.target.value) || 0)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">%</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">Premium on top of regular hourly rate</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Split Shift Daily Bonus
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
                <input
                  type="number"
                  min={0}
                  value={form.splitShiftDailyBonus}
                  onChange={(e) => set("splitShiftDailyBonus", parseFloat(e.target.value) || 0)}
                  className="w-full border border-zinc-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <p className="text-xs text-zinc-400 mt-1">Per split shift day</p>
            </div>
          </div>
        </div>

        {/* Deduction Rates */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Deduction Rates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Income Tax Rate (flat %)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={50}
                  step={0.5}
                  value={form.incomeTaxFlatRate}
                  onChange={(e) => set("incomeTaxFlatRate", parseFloat(e.target.value) || 0)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Provident Fund / 401k Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={25}
                  step={0.5}
                  value={form.providentFundRate}
                  onChange={(e) => set("providentFundRate", parseFloat(e.target.value) || 0)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Health Insurance ($/month)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
                <input
                  type="number"
                  min={0}
                  value={form.healthInsuranceMonthly}
                  onChange={(e) => set("healthInsuranceMonthly", parseFloat(e.target.value) || 0)}
                  className="w-full border border-zinc-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Default Meal Allowance ($/month)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
                <input
                  type="number"
                  min={0}
                  value={form.defaultMealAllowanceMonthly}
                  onChange={(e) => set("defaultMealAllowanceMonthly", parseFloat(e.target.value) || 0)}
                  className="w-full border border-zinc-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold px-6 py-2.5 rounded-lg text-sm"
          >
            <CheckIcon className="w-4 h-4" />
            Save Settings
          </button>
          {saved && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <CheckIcon className="w-4 h-4" />
              Settings saved successfully!
            </div>
          )}
        </div>
      </form>

      {/* Reset Confirm */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Reset to Sample Data?</h3>
            <p className="text-sm text-zinc-600 mb-5">
              This will reset all employees, payroll data, attendance, and settings back to the
              original sample data. All your changes will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 border border-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setForm({ ...settings });
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
