export class YearlyStatisticsDto {
  totalThisYear: number = 0;
  monthlyAverage: number = 0;
  peakMonth: MonthlySpendingTrend = new MonthlySpendingTrend();
  quietestMonth: MonthlySpendingTrend = new MonthlySpendingTrend();
  monthlySpendingTrend: MonthlySpendingTrend[] = [];
  topCategories: CategorySpending[] = [];
}

export class MonthlySpendingTrend {
  amount: number = 0;
  month: string = '';
}

export class CategorySpending {
  amount: number = 0;
  category: string = '';
}
