"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Employee,
  AttendanceRecord,
  TipPoolDistribution,
  PayrollPeriod,
  Payslip,
  HotelSettings,
  PayrollStatus,
} from "@/types";
import {
  initialEmployees,
  initialAttendanceRecords,
  initialTipPools,
  initialPayrollPeriods,
  initialPayslips,
  initialHotelSettings,
} from "@/data/initialData";

interface PayrollContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  tipPools: TipPoolDistribution[];
  payrollPeriods: PayrollPeriod[];
  payslips: Payslip[];
  settings: HotelSettings;
  activePeriod: PayrollPeriod | null;
  setActivePeriod: (period: PayrollPeriod) => void;

  // Employee actions
  addEmployee: (emp: Omit<Employee, "id" | "employeeCode">) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Attendance actions
  addAttendanceRecord: (record: Omit<AttendanceRecord, "id">) => void;
  deleteAttendanceRecord: (id: string) => void;
  getEmployeeAttendanceSummary: (
    employeeId: string,
    startDate?: string,
    endDate?: string
  ) => {
    totalRegularHours: number;
    totalOvertimeHours: number;
    totalNightHours: number;
    totalSplitShifts: number;
    daysPresent: number;
  };

  // Tip Pool actions
  calculateTipDistribution: (
    periodName: string,
    totalCollected: number,
    method: "Points-Weighted" | "Equal-Split" | "Hours-Worked"
  ) => TipPoolDistribution;
  commitTipDistribution: (distribution: TipPoolDistribution) => void;

  // Payroll actions
  createPayrollRun: (
    periodName: string,
    startDate: string,
    endDate: string,
    payDate: string
  ) => string;
  updatePayrollStatus: (periodId: string, status: PayrollStatus) => void;
  getPayslipsForPeriod: (periodId: string) => Payslip[];
  calculateSinglePayslip: (
    employeeId: string,
    periodId: string,
    options?: {
      bonus?: number;
      advanceDeduction?: number;
      customTips?: number;
    }
  ) => Payslip;
  generateAllPayslipsForPeriod: (periodId: string) => void;

  // Settings action
  updateSettings: (newSettings: Partial<HotelSettings>) => void;
  resetToSampleData: () => void;
}

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EMPLOYEES: "hotel_payroll_employees_v1",
  ATTENDANCE: "hotel_payroll_attendance_v1",
  TIP_POOLS: "hotel_payroll_tip_pools_v1",
  PERIODS: "hotel_payroll_periods_v1",
  PAYSLIPS: "hotel_payroll_payslips_v1",
  SETTINGS: "hotel_payroll_settings_v1",
};

export function PayrollProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [tipPools, setTipPools] = useState<TipPoolDistribution[]>(initialTipPools);
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>(initialPayrollPeriods);
  const [payslips, setPayslips] = useState<Payslip[]>(initialPayslips);
  const [settings, setSettings] = useState<HotelSettings>(initialHotelSettings);
  const [activePeriod, setActivePeriodState] = useState<PayrollPeriod | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load persisted data on client mount
  useEffect(() => {
    try {
      const storedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      const storedAttendance = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      const storedTipPools = localStorage.getItem(STORAGE_KEYS.TIP_POOLS);
      const storedPeriods = localStorage.getItem(STORAGE_KEYS.PERIODS);
      const storedPayslips = localStorage.getItem(STORAGE_KEYS.PAYSLIPS);
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      if (storedEmployees) setEmployees(JSON.parse(storedEmployees));
      if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
      if (storedTipPools) setTipPools(JSON.parse(storedTipPools));
      if (storedPeriods) setPayrollPeriods(JSON.parse(storedPeriods));
      if (storedPayslips) setPayslips(JSON.parse(storedPayslips));
      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    }
    setIsHydrated(true);
  }, []);

  // Save changes to localStorage after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
      localStorage.setItem(STORAGE_KEYS.TIP_POOLS, JSON.stringify(tipPools));
      localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(payrollPeriods));
      localStorage.setItem(STORAGE_KEYS.PAYSLIPS, JSON.stringify(payslips));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to persist state:", e);
    }
  }, [employees, attendance, tipPools, payrollPeriods, payslips, settings, isHydrated]);

  // Set default active period
  useEffect(() => {
    if (payrollPeriods.length > 0 && !activePeriod) {
      setActivePeriodState(payrollPeriods[payrollPeriods.length - 1]);
    }
  }, [payrollPeriods, activePeriod]);

  const setActivePeriod = (period: PayrollPeriod) => {
    setActivePeriodState(period);
  };

  // Employee CRUD
  const addEmployee = (empData: Omit<Employee, "id" | "employeeCode">) => {
    const nextNumber = employees.length + 101;
    const deptPrefix = empData.department.slice(0, 2).toUpperCase();
    const newEmployee: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
      employeeCode: `GH-${deptPrefix}-${nextNumber}`,
      avatarBg: "bg-indigo-600",
    };
    setEmployees((prev) => [newEmployee, ...prev]);
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updatedFields } : emp))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  // Attendance actions
  const addAttendanceRecord = (record: Omit<AttendanceRecord, "id">) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
    };
    setAttendance((prev) => [newRecord, ...prev]);
  };

  const deleteAttendanceRecord = (id: string) => {
    setAttendance((prev) => prev.filter((r) => r.id !== id));
  };

  const getEmployeeAttendanceSummary = (
    employeeId: string,
    _startDate?: string,
    _endDate?: string
  ) => {
    const records = attendance.filter((a) => a.employeeId === employeeId);
    let totalRegularHours = 0;
    let totalOvertimeHours = 0;
    let totalNightHours = 0;
    let totalSplitShifts = 0;
    let daysPresent = 0;

    records.forEach((rec) => {
      if (rec.status === "Present" || rec.status === "Half-Day") {
        daysPresent += rec.status === "Half-Day" ? 0.5 : 1;
        totalRegularHours += rec.regularHours || 0;
        totalOvertimeHours += rec.overtimeHours || 0;
        totalNightHours += rec.nightShiftHours || 0;
        if (rec.shiftType === "Split") {
          totalSplitShifts += 1;
        }
      }
    });

    return {
      totalRegularHours,
      totalOvertimeHours,
      totalNightHours,
      totalSplitShifts,
      daysPresent,
    };
  };

  // Tip Pool calculations
  const calculateTipDistribution = (
    periodName: string,
    totalCollected: number,
    method: "Points-Weighted" | "Equal-Split" | "Hours-Worked"
  ): TipPoolDistribution => {
    const activeStaff = employees.filter((e) => e.status === "Active");
    let allocations: TipPoolDistribution["allocations"] = [];

    if (method === "Points-Weighted") {
      const totalPoints = activeStaff.reduce(
        (sum, emp) => sum + (emp.serviceChargePoints || 1.0),
        0
      );
      allocations = activeStaff.map((emp) => {
        const points = emp.serviceChargePoints || 1.0;
        const share = totalPoints > 0 ? (points / totalPoints) * totalCollected : 0;
        return {
          employeeId: emp.id,
          points,
          amount: Math.round(share * 100) / 100,
        };
      });
    } else if (method === "Equal-Split") {
      const perPerson = activeStaff.length > 0 ? totalCollected / activeStaff.length : 0;
      allocations = activeStaff.map((emp) => ({
        employeeId: emp.id,
        points: 1,
        amount: Math.round(perPerson * 100) / 100,
      }));
    } else {
      // Hours-Worked
      const totalHours = activeStaff.reduce((sum, emp) => {
        const summary = getEmployeeAttendanceSummary(emp.id);
        return sum + (summary.totalRegularHours + summary.totalOvertimeHours || 160);
      }, 0);

      allocations = activeStaff.map((emp) => {
        const summary = getEmployeeAttendanceSummary(emp.id);
        const hours = summary.totalRegularHours + summary.totalOvertimeHours || 160;
        const share = totalHours > 0 ? (hours / totalHours) * totalCollected : 0;
        return {
          employeeId: emp.id,
          points: emp.serviceChargePoints,
          hoursWorked: hours,
          amount: Math.round(share * 100) / 100,
        };
      });
    }

    return {
      id: `tip-dist-${Date.now()}`,
      periodName,
      totalAmountCollected: totalCollected,
      distributionDate: new Date().toISOString().split("T")[0],
      method,
      allocations,
      status: "Calculated",
    };
  };

  const commitTipDistribution = (distribution: TipPoolDistribution) => {
    const committed: TipPoolDistribution = {
      ...distribution,
      status: "Committed",
    };
    setTipPools((prev) => [committed, ...prev.filter((p) => p.id !== committed.id)]);
  };

  // Payroll Calculation engine
  const calculateSinglePayslip = (
    employeeId: string,
    periodId: string,
    options?: {
      bonus?: number;
      advanceDeduction?: number;
      customTips?: number;
    }
  ): Payslip => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) throw new Error("Employee not found");

    const summary = getEmployeeAttendanceSummary(emp.id);
    const hourlyRate = emp.hourlyRate || emp.baseSalary / 160;

    // Overtime
    const overtimeHours = summary.totalOvertimeHours || (emp.employmentType === "Full-Time Hourly" ? 8 : 4);
    const overtimePay = Math.round(overtimeHours * hourlyRate * settings.overtimeMultiplier * 100) / 100;

    // Night Differential
    const nightHours = summary.totalNightHours || (emp.position.toLowerCase().includes("night") ? 60 : 0);
    const nightRate = hourlyRate * (settings.nightDifferentialPercentage / 100);
    const nightDifferentialPay = Math.round(nightHours * nightRate * 100) / 100;

    // Split shift allowance
    const splitShiftCount = summary.totalSplitShifts || (emp.department === "Food & Beverage" ? 4 : 0);
    const splitShiftAllowance = splitShiftCount * settings.splitShiftDailyBonus;

    // Tips and Service Charge Share
    let serviceChargeAndTips = 0;
    if (options?.customTips !== undefined) {
      serviceChargeAndTips = options.customTips;
    } else {
      const activeTip = tipPools.find((t) => t.status === "Committed" || t.status === "Calculated");
      if (activeTip) {
        const alloc = activeTip.allocations.find((a) => a.employeeId === emp.id);
        if (alloc) serviceChargeAndTips = alloc.amount;
      }
      if (!serviceChargeAndTips) {
        serviceChargeAndTips = Math.round((emp.serviceChargePoints || 1) * 1100 * 100) / 100;
      }
    }

    const basePay = emp.baseSalary;
    const mealAllowance = settings.defaultMealAllowanceMonthly;
    const housingAllowance = emp.position.includes("Manager") || emp.position.includes("Chef") ? 250 : 0;
    const otherBonuses = options?.bonus || 0;

    const grossPay =
      Math.round(
        (basePay +
          overtimePay +
          nightDifferentialPay +
          splitShiftAllowance +
          serviceChargeAndTips +
          mealAllowance +
          housingAllowance +
          otherBonuses) *
          100
      ) / 100;

    // Deductions
    const taxableIncome = grossPay;
    const incomeTax = Math.round(taxableIncome * (settings.incomeTaxFlatRate / 100) * 100) / 100;
    const providentFundOr401k = Math.round(basePay * (settings.providentFundRate / 100) * 100) / 100;
    const healthInsurance = settings.healthInsuranceMonthly;
    const salaryAdvanceDeduction = options?.advanceDeduction || 0;
    const uniformOrOtherDeductions = 0;

    const totalDeductions =
      Math.round(
        (incomeTax +
          providentFundOr401k +
          healthInsurance +
          salaryAdvanceDeduction +
          uniformOrOtherDeductions) *
          100
      ) / 100;

    const netPay = Math.round((grossPay - totalDeductions) * 100) / 100;

    return {
      id: `ps-${periodId}-${emp.id}`,
      payrollPeriodId: periodId,
      employeeId: emp.id,
      issueDate: new Date().toISOString().split("T")[0],
      basePay,
      overtimeHours,
      overtimePay,
      nightDifferentialHours: nightHours,
      nightDifferentialPay,
      splitShiftAllowance,
      serviceChargeAndTips,
      mealAllowance,
      housingAllowance,
      otherBonuses,
      grossPay,
      incomeTax,
      providentFundOr401k,
      healthInsurance,
      salaryAdvanceDeduction,
      uniformOrOtherDeductions,
      totalDeductions,
      netPay,
      paymentStatus: "Pending",
    };
  };

  const generateAllPayslipsForPeriod = (periodId: string) => {
    const activeStaff = employees.filter((e) => e.status === "Active");
    const newPayslips: Payslip[] = activeStaff.map((emp) =>
      calculateSinglePayslip(emp.id, periodId)
    );

    setPayslips((prev) => [
      ...newPayslips,
      ...prev.filter((p) => p.payrollPeriodId !== periodId),
    ]);

    // Update period totals
    const totalGross = newPayslips.reduce((sum, p) => sum + p.grossPay, 0);
    const totalDeductions = newPayslips.reduce((sum, p) => sum + p.totalDeductions, 0);
    const totalNet = newPayslips.reduce((sum, p) => sum + p.netPay, 0);
    const totalTips = newPayslips.reduce((sum, p) => sum + p.serviceChargeAndTips, 0);

    setPayrollPeriods((prev) =>
      prev.map((per) =>
        per.id === periodId
          ? {
              ...per,
              totalEmployees: activeStaff.length,
              totalGross: Math.round(totalGross * 100) / 100,
              totalDeductions: Math.round(totalDeductions * 100) / 100,
              totalNet: Math.round(totalNet * 100) / 100,
              totalTipsDistributed: Math.round(totalTips * 100) / 100,
            }
          : per
      )
    );
  };

  const createPayrollRun = (
    periodName: string,
    startDate: string,
    endDate: string,
    payDate: string
  ): string => {
    const periodId = `pay-period-${Date.now()}`;
    const newPeriod: PayrollPeriod = {
      id: periodId,
      periodName,
      startDate,
      endDate,
      payDate,
      status: "Draft",
      totalEmployees: employees.filter((e) => e.status === "Active").length,
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
      totalTipsDistributed: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setPayrollPeriods((prev) => [newPeriod, ...prev]);
    setActivePeriodState(newPeriod);
    generateAllPayslipsForPeriod(periodId);
    return periodId;
  };

  const updatePayrollStatus = (periodId: string, status: PayrollStatus) => {
    setPayrollPeriods((prev) =>
      prev.map((p) => {
        if (p.id === periodId) {
          return {
            ...p,
            status,
            approvedBy: status === "Approved" || status === "Paid" ? "Victoria Sterling (GM)" : undefined,
          };
        }
        return p;
      })
    );

    if (status === "Paid") {
      setPayslips((prev) =>
        prev.map((ps) =>
          ps.payrollPeriodId === periodId
            ? { ...ps, paymentStatus: "Paid", paymentDate: new Date().toISOString().split("T")[0] }
            : ps
        )
      );
    }
  };

  const getPayslipsForPeriod = (periodId: string) => {
    return payslips.filter((p) => p.payrollPeriodId === periodId);
  };

  const updateSettings = (newSettings: Partial<HotelSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToSampleData = () => {
    setEmployees(initialEmployees);
    setAttendance(initialAttendanceRecords);
    setTipPools(initialTipPools);
    setPayrollPeriods(initialPayrollPeriods);
    setPayslips(initialPayslips);
    setSettings(initialHotelSettings);
    setActivePeriodState(initialPayrollPeriods[initialPayrollPeriods.length - 1]);
    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <PayrollContext.Provider
      value={{
        employees,
        attendance,
        tipPools,
        payrollPeriods,
        payslips,
        settings,
        activePeriod,
        setActivePeriod,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addAttendanceRecord,
        deleteAttendanceRecord,
        getEmployeeAttendanceSummary,
        calculateTipDistribution,
        commitTipDistribution,
        createPayrollRun,
        updatePayrollStatus,
        getPayslipsForPeriod,
        calculateSinglePayslip,
        generateAllPayslipsForPeriod,
        updateSettings,
        resetToSampleData,
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
}

export function usePayroll() {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error("usePayroll must be used within a PayrollProvider");
  }
  return context;
}
