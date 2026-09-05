import { ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { ChartService } from '../../../../shared/services/chart.service';
import { MonthlyStatisticsDto } from '../../../../models/MonthlyStatistics.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-monthly-large-cards',
  templateUrl: './monthly-large-cards.html',
  styleUrl: './monthly-large-cards.css',
})
export class MonthlyLargeCards implements OnDestroy {
  private readonly chartService = inject(ChartService);
  monthlyStats = input<MonthlyStatisticsDto>();
  dashboardChartData: DataChart[] = [];
  public budgetChart!: Chart;
  public categoryChart: Chart | undefined;

  constructor() {
    effect(() => {
      const stats = this.monthlyStats()!;

      this.dashboardChartData = [];
      stats!.budgets.forEach((b) => {
        let dataChartItem: DataChart = {
          categoryName: b.categoryName,
          categoryColor: b.categoryColor,
          categoryLimit: b.limitAmount,
          categorySpent: b.spentAmount,
        };
        this.dashboardChartData.push(dataChartItem);
      });
      this.budgetChart = this.chartService.createBudgetChart1(this.dashboardChartData)!;
      this.chartService.createCategoryChart3(stats!);
    });
  }

  ngOnDestroy(): void {
    if (this.budgetChart) {
      this.budgetChart.destroy();
    }

    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
  }
}

class DataChart {
  categoryName: string = '';
  categoryColor: string = '';
  categorySpent: number = 0;
  categoryLimit: number = 0;
}
