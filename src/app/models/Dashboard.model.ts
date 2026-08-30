export class DashboardDto {
  currentMonth: CurrentMonth = new CurrentMonth();
  monthlySummary: MonthlySummary = new MonthlySummary();
  categoryBreakdowns: CategoryBreakdownDto[] = [];
  budgets: BudgetDashboardDto[] = [];
  recentExpenses: DashboardExpense[] = [];
  topExpenses: DashboardExpense[] = [];
  budgetWarnings: BudgetDashboardDto[] = [];
  numberOfTransactions: number = 0;
}

export class CurrentMonth {
  year: number = 0;
  month: number = 0;
}

export class MonthlySummary {
  totalAmount: number = 0;
  previousMonthAmount: number = 0;
  changePercent: number = 0;
}

export class CategoryBreakdownDto {
  categoryName: string = '';
  categoryColor: string = '';
  amount: number = 0;
  percentage: number = 0;
}

export class BudgetDashboardDto {
  categoryName: string = '';
  categoryColor: string = '';
  limitAmount: number = 0;
  spentAmount: number = 0;
  remainingAmount: number = 0;
  //state: BudgetState = BudgetState.Normal;
  state: string = '';
}

export class DashboardExpense {
  description: string = '';
  amount: number = 0;
  date: Date = new Date();
  categoryName: string = '';
}

export enum BudgetState {
  // Ide jönnek az enum értékei a C# kód alapján, pl.:
  Normal = 0,
  Warning = 1,
  Exceeded = 2,
  Empty,
}
