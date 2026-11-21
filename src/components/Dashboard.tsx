"use client";

import { usePayroll } from "@/context/PayrollContext";
import {
  UsersIcon,
  DollarSignIcon,
  TrendingUpIcon,
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "@/components/icons";

function fmt(n: number, sym = "$") {
  return sym + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
    "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-blue-50 text-blue-700 border-blue-200",
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        map[status] || "bg-zinc-100 text-zinc-700 border-zinc-200"
      }`}
    >
      {status}
    </span>
  );
}

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { employees, payrollPeriods, payslips, tipPools, settings } = usePayroll();

  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const latestPeriod = payrollPeriods[payrollPeriods.length - 1];
  const previousPeriod = payrollPeriods[payrollPeriods.length - 2];
  const latestPayslips = latestPeriod
    ? payslips.filter((p) => p.payrollPeriodId === latestPeriod.id)
    : [];

  const latestTipPool = tipPools.find((t) => t.status === "Calculated" || t.status === "Committed");

  const deptCounts: Record<string, number> = {};
  employees.forEach((e) => {
    if (e.status === "Active") {
      deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
    }
  });

  const kpis = [
    {
      label: "Active Staff",
      value: activeEmployees.toString(),
      sub: `${employees.filter((e) => e.status === "On Leave").length} on leave`,
      icon: UsersIcon,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-700",
    },
    {
      label: "Gross Payroll (This Month)",
      value: latestPeriod ? fmt(latestPeriod.totalGross) : fmt(0),
      sub: previousPeriod
        ? `Prev: ${fmt(previousPeriod.totalGross)}`
        : "No prior period",
      icon: DollarSignIcon,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Net Payroll (This Month)",
      value: latestPeriod ? fmt(latestPeriod.totalNet) : fmt(0),
      sub: latestPeriod ? `Deductions: ${fmt(latestPeriod.totalDeductions)}` : "",
      icon: TrendingUpIcon,
      color: "bg-violet-500",
      lightColor: "bg-violet-50 text-violet-700",
    },
    {
      label: "Tips & Service Charge",
      value: latestTipPool ? fmt(latestTipPool.totalAmountCollected) : fmt(0),
      sub: latestTipPool ? latestTipPool.periodName : "No tip pools",
      icon: AwardIcon,
      color: "bg-amber-500",
      lightColor: "bg-amber-50 text-amber-700",
    },
  ];

  const workflowSteps = [
    {
      icon: CalendarIcon,
      label: "Payroll Period Created",
      status: latestPeriod ? "done" : "pending",
      description: latestPeriod ? latestPeriod.periodName : "No period",
    },
    {
      icon: ClockIcon,
      label: "Attendance & Shifts Logged",
      status: latestPeriod?.status !== "Draft" ? "done" : "active",
      description: "Hours, overtime & night shifts",
    },
    {
      icon: AwardIcon,
      label: "Tips Calculated & Committed",
      status: latestTipPool?.status === "Committed" ? "done" : "active",
      description: latestTipPool?.method || "Points-Weighted",
    },
    {
      icon: DollarSignIcon,
      label: "Payslips Generated",
      status: latestPayslips.length > 0 ? "done" : "pending",
      description: `${latestPayslips.length} payslips ready`,
    },
    {
      icon: ShieldCheckIcon,
      label: "GM Approval",
      status:
        latestPeriod?.status === "Approved" || latestPeriod?.status === "Paid"
          ? "done"
          : "pending",
      description: latestPeriod?.approvedBy || "Awaiting approval",
    },
    {
      icon: CheckCircleIcon,
      label: "Disbursed & Paid",
      status: latestPeriod?.status === "Paid" ? "done" : "pending",
      description: latestPeriod?.payDate ? `Pay date: ${latestPeriod.payDate}` : "",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Payroll Dashboard</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {settings.hotelName} &mdash; Overview for {latestPeriod?.periodName || "current period"}
          </p>
        </div>
        {latestPeriod && (
          <div className="text-right">
            <StatusBadge status={latestPeriod.status} />
            <p className="text-xs text-zinc-400 mt-1">
              Pay date: {latestPeriod.payDate}
            </p>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon, color, lightColor }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                {label}
              </span>
              <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{value}</div>
            <div className={`mt-2 text-xs font-medium px-2 py-0.5 rounded-full inline-block ${lightColor}`}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Payroll Workflow */}
        <div className="col-span-3 bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-zinc-900">Payroll Workflow</h2>
            {latestPeriod && <StatusBadge status={latestPeriod.status} />}
          </div>
          <div className="space-y-3">
            {workflowSteps.map(({ icon: Icon, label, status, description }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status === "done"
                      ? "bg-emerald-500"
                      : status === "active"
                      ? "bg-amber-500"
                      : "bg-zinc-200"
                  }`}
                >
                  {status === "done" ? (
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  ) : status === "active" ? (
                    <RefreshCwIcon className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      status === "done"
                        ? "text-emerald-700"
                        : status === "active"
                        ? "text-amber-700"
                        : "text-zinc-400"
                    }`}
                  >
                    {label}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">{description}</div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    status === "done"
                      ? "bg-emerald-50 text-emerald-600"
                      : status === "active"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {status === "done" ? "✓ Done" : status === "active" ? "In Progress" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-2 space-y-4">
          {/* Department Breakdown */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
            <h2 className="font-semibold text-zinc-900 mb-4">Staff by Department</h2>
            <div className="space-y-2">
              {Object.entries(deptCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([dept, count]) => (
                  <div key={dept} className="flex items-center gap-2">
                    <div className="text-xs text-zinc-600 w-28 truncate flex-shrink-0">
                      {dept.replace("Management & Admin", "Management").replace("Kitchen & Culinary", "Kitchen")}
                    </div>
                    <div className="flex-1 bg-zinc-100 rounded-full h-2">
                      <div
                        className="bg-amber-400 h-2 rounded-full"
                        style={{ width: `${(count / activeEmployees) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs font-semibold text-zinc-700 w-5 text-right">
                      {count}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Payroll History */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-zinc-900">Pay Run History</h2>
              <button
                onClick={() => onNavigate("payroll")}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium"
              >
                View all →
              </button>
            </div>
            <div className="space-y-3">
              {[...payrollPeriods]
                .reverse()
                .slice(0, 3)
                .map((period) => (
                  <div
                    key={period.id}
                    className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0"
                  >
                    <div>
                      <div className="text-sm font-medium text-zinc-800">
                        {period.periodName}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {period.totalEmployees} staff · {fmt(period.totalNet)} net
                      </div>
                    </div>
                    <StatusBadge status={period.status} />
                  </div>
                ))}
              {payrollPeriods.length === 0 && (
                <p className="text-xs text-zinc-400">No payroll runs yet.</p>
              )}
            </div>
          </div>

          {/* Quick Alerts */}
          {latestPeriod?.status === "Under Review" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-800">
                  Approval Required
                </div>
                <div className="text-xs text-amber-600 mt-0.5">
                  {latestPeriod.periodName} payroll is pending GM approval before disbursement.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
