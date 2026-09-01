import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import { DashboardDto } from '../../../models/Dashboard.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChartService } from '../../../shared/services/chart.service';

@Component({
  selector: 'app-dashboard-large-cards',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './dashboard-large-cards.html',
  styleUrl: './dashboard-large-cards.css',
})
export class DashboardLargeCards implements AfterViewInit, OnDestroy {
  private readonly chartService = inject(ChartService);
  private cdr = inject(ChangeDetectorRef);
  dashboardData = input<DashboardDto>();
  dashboardChartData: DataChart[] = [];
  public budgetChart: any;
  public categoryChart: any;

  ngAfterViewInit(): void {
    this.dashboardChartData = [];
    this.dashboardData()!.budgets.forEach((b) => {
      let dataChartItem: DataChart = {
        categoryName: b.categoryName,
        categoryColor: b.categoryColor,
        categoryLimit: b.limitAmount,
        categorySpent: b.spentAmount,
      };
      this.dashboardChartData.push(dataChartItem);
    });

    this.chartService.createBudgetChart(this.budgetChart, this.dashboardChartData);
    this.chartService.createCategoryChart(this.categoryChart, this.dashboardData()!);

    this.cdr.detectChanges();
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
