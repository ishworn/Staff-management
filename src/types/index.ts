export type Department =
  | "Front Desk"
  | "Housekeeping"
  | "Food & Beverage"
  | "Kitchen & Culinary"
  | "Maintenance & Engineering"
  | "Security & Safety"
  | "Management & Admin";

export type EmploymentType =
  | "Full-Time Salaried"
  | "Full-Time Hourly"
  | "Part-Time"
  | "Contract / Seasonal";

export type ShiftType = "Day" | "Evening" | "Night" | "Split";

export type AttendanceStatus = "Present" | "Absent" | "On Leave" | "Half-Day";

export type PayrollStatus = "Draft" | "Under Review" | "Approved" | "Paid";

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  position: string;
  employmentType: EmploymentType;
  joinDate: string;
  baseSalary: number; // Monthly base if salaried, or base monthly equivalent
  hourlyRate: number; // Hourly wage for hourly/overtime calculation
  bankName: string;
  accountNumber: string;
  taxId: string;
  serviceChargePoints: number; // Weight for tip/service charge pool (e.g. 1.0, 1.2, 1.5)
  status: "Active" | "On Leave" | "Terminated";
  avatarBg?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  shiftType: ShiftType;
  checkIn: string; // e.g. "08:00"
  checkOut: string; // e.g. "16:30"
  regularHours: number;
  overtimeHours: number;
  nightShiftHours: number;
  status: AttendanceStatus;
  notes?: string;
}

export interface TipPoolDistribution {
  id: string;
  periodName: string; // e.g. "November 2026"
  totalAmountCollected: number; // Total banquet/F&B service charge & pooled tips
  distributionDate: string;
  method: "Points-Weighted" | "Equal-Split" | "Hours-Worked";
  allocations: {
    employeeId: string;
    points: number;
    hoursWorked?: number;
    amount: number;
  }[];
  status: "Calculated" | "Committed";
}

export interface PayslipItem {
  name: string;
  amount: number;
  category: "earning" | "deduction";
}

export interface Payslip {
  id: string;
  payrollPeriodId: string;
  employeeId: string;
  issueDate: string;
  
  // Earnings
  basePay: number;
  overtimeHours: number;
  overtimePay: number;
  nightDifferentialHours: number;
  nightDifferentialPay: number;
  splitShiftAllowance: number;
  serviceChargeAndTips: number;
  mealAllowance: number;
  housingAllowance: number;
  otherBonuses: number;
  grossPay: number;

  // Deductions
  incomeTax: number;
  providentFundOr401k: number;
  healthInsurance: number;
  salaryAdvanceDeduction: number;
  uniformOrOtherDeductions: number;
  totalDeductions: number;

  // Net Pay
  netPay: number;
  paymentStatus: "Pending" | "Paid";
  paymentDate?: string;
  notes?: string;
}

export interface PayrollPeriod {
  id: string;
  periodName: string; // "November 2026"
  startDate: string;
  endDate: string;
  payDate: string;
  status: PayrollStatus;
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  totalTipsDistributed: number;
  createdAt: string;
  approvedBy?: string;
}

export interface HotelSettings {
  hotelName: string;
  hotelTagline: string;
  hotelAddress: string;
  hotelPhone: string;
  hotelEmail: string;
  taxRegistrationNumber: string;
  currency: string;
  currencySymbol: string;
  overtimeMultiplier: number; // e.g. 1.5
  nightDifferentialPercentage: number; // e.g. 15 (%)
  splitShiftDailyBonus: number; // e.g. 15 ($)
  incomeTaxFlatRate: number; // e.g. 10 (%) or progressive threshold
  providentFundRate: number; // e.g. 5 (%)
  healthInsuranceMonthly: number; // e.g. 75 ($)
  defaultMealAllowanceMonthly: number; // e.g. 120 ($)
}
