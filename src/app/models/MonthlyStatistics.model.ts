import { BudgetDashboardDto, CategoryBreakdownDto } from './Dashboard.model';

export class MonthlyStatisticsDto {
  totalSpendings: number = 0;
  averageDailySpendings: number = 0;
  numberOfActiveBudgets: number = 0;
  numberOfTransactions: number = 0;
  budgets: BudgetDashboardDto[] = [];
  categoryBreakdowns: CategoryBreakdownDto[] = [];
}
