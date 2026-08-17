import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DashboardDto } from '../../../models/Dashboard.model';
import { Chart } from 'chart.js';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-large-cards',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './dashboard-large-cards.html',
  styleUrl: './dashboard-large-cards.css',
})
export class DashboardLargeCards implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  dashboardData = input<DashboardDto>();
  dashboardChartData: DataChart[] = [];
  public budgetChart: any;
  public categoryChart: any;

  @ViewChild('budgetChart') budgetChartRef!: ElementRef;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef;

  ngOnInit(): void {
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

    this.createBudgetChart();
    this.createCategoryChart();
    this.cdr.detectChanges();
  }

  private createBudgetChart(): void {
    const canvas = document.getElementById('BudgetChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas nem található');
      return;
    }

    if (this.budgetChart) {
      this.budgetChart.destroy();
    }

    const customLabelsPlugin = {
      id: 'customLabelsPlugin',
      afterDatasetsDraw: (chart: any) => {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);

        meta.data.forEach((bar: any, index: number) => {
          const item = this.dashboardChartData[index];
          if (!item) return;

          const { y, base } = bar;
          const barHeight = bar.height || 8;

          const textY = y - barHeight / 2 - 10;
          const textX = base;

          ctx.save();

          // 1. DINAMIKUS PÖTTY RAJZOLÁSA
          const radius = 4;
          const dotX = textX + radius;
          const dotY = textY;

          ctx.beginPath();
          ctx.arc(dotX, dotY, radius, 0, 2 * Math.PI);
          ctx.fillStyle = item.categoryColor;
          ctx.fill();

          // 2. FEHÉR SZÖVEG RAJZOLÁSA
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '17px sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';

          const labelPadding = 10;
          ctx.fillText(
            `${item.categoryName} (${item.categorySpent} Ft / ${item.categoryLimit} Ft)`,
            dotX + radius + labelPadding,
            dotY,
          );

          ctx.restore();
        });
      },
    };

    this.budgetChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.dashboardChartData.map(
          (b) => `${b.categoryName} (${b.categorySpent} Ft / ${b.categoryLimit} Ft)`,
        ),
        datasets: [
          {
            data: this.dashboardChartData.map((b) => b.categorySpent),
            backgroundColor: this.dashboardChartData.map((b) =>
              b.categoryLimit - b.categorySpent <= 0
                ? 'red'
                : b.categoryLimit * 0.8 <= b.categorySpent
                  ? 'yellow'
                  : 'green',
            ),
            barThickness: 6,
            // A sorköz növelése itt marad
            categoryPercentage: 0.5,
            barPercentage: 0.8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: {
          padding: {
            top: 25,
          },
        },
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            //ticks: { color: '#aaa' },
            display: false,
          },
          y: {
            grid: { display: false },
            display: false,
          },
        },
      },
      plugins: [customLabelsPlugin],
    });
  }

  private createCategoryChart(): void {
    const canvas = document.getElementById('CategoryChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas nem található');
      return;
    }
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    const config: any = {
      type: 'doughnut',
      data: {
        labels: this.dashboardData()?.categoryBreakdowns.map((b) => b.categoryName),
        datasets: [
          {
            label: 'Kategóriák',
            data: this.dashboardData()?.categoryBreakdowns.map((b) => b.amount),
            backgroundColor: this.dashboardData()?.categoryBreakdowns.map((b) => b.categoryColor),
            borderRadius: 0,
            borderWidth: 1,
            borderColor: 'rgb(31, 30, 30);',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    this.categoryChart = new Chart(
      document.getElementById('CategoryChart') as HTMLCanvasElement,
      config,
    );
  }
}

class DataChart {
  categoryName: string = '';
  categoryColor: string = '';
  categorySpent: number = 0;
  categoryLimit: number = 0;
}
