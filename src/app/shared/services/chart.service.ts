import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardDto } from '../../models/Dashboard.model';
import { MonthlyStatisticsDto } from '../../models/MonthlyStatistics.model';

@Injectable({ providedIn: 'root' })
export class ChartService {
  public createBudgetChart(dashboardChartData: DataChart[]): Chart | null {
    const canvas = this.destroyExistingChart('BudgetChart');
    if (!canvas) return null;

    const customLabelsPlugin = {
      id: 'customLabelsPlugin',
      afterDatasetsDraw: (chart: any) => {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(1);

        meta.data.forEach((bar: any, index: number) => {
          const item = dashboardChartData[index];
          if (!item) return;

          const { y, base } = bar;
          const barThickness = bar.height ?? 6;
          const textY = y - barThickness / 2 - 12;
          const textX = base;

          ctx.save();

          const radius = 4;
          const dotX = textX + radius;
          const dotY = textY;

          ctx.beginPath();
          ctx.arc(dotX, dotY, radius, 0, 2 * Math.PI);
          ctx.fillStyle = item.categoryColor || '#FFFFFF';
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';

          const labelPadding = 8;
          ctx.fillText(
            `${item.categoryName} (${item.categorySpent} Ft / ${item.categoryLimit} Ft)`,
            dotX + radius + labelPadding,
            dotY,
          );

          ctx.restore();
        });
      },
    };

    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: dashboardChartData.map((b) => b.categoryName),
        datasets: [
          {
            label: 'Limit',
            data: dashboardChartData.map(() => 100),
            backgroundColor: '#4A4A4A',
            barThickness: 6,
            categoryPercentage: 0.5,
            barPercentage: 0.8,
            grouped: false,
            order: 2,
          },
          {
            label: 'Spent',
            data: dashboardChartData.map((b) => {
              if (!b.categoryLimit || b.categoryLimit === 0) return 0;
              return Math.min((b.categorySpent / b.categoryLimit) * 100, 100);
            }),
            backgroundColor: dashboardChartData.map((b) =>
              b.categoryLimit - b.categorySpent <= 0
                ? 'red'
                : b.categoryLimit * 0.8 <= b.categorySpent
                  ? 'yellow'
                  : 'green',
            ),
            barThickness: 8,
            categoryPercentage: 0.5,
            barPercentage: 0.8,
            grouped: false,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: { padding: { top: 10 } },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: { min: 0, max: 100, grid: { display: false }, display: false },
          y: { grid: { display: false }, display: false, stacked: true },
        },
      },
      plugins: [customLabelsPlugin],
    });
  }

  public createCategoryChart(dashboardData: DashboardDto | MonthlyStatisticsDto): Chart | null {
    const canvas = this.destroyExistingChart('CategoryChart');
    if (!canvas) return null;

    return new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: dashboardData?.categoryBreakdowns.map((b) => b.categoryName),
        datasets: [
          {
            label: 'Categories',
            data: dashboardData?.categoryBreakdowns.map((b) => b.amount),
            backgroundColor: dashboardData?.categoryBreakdowns.map((b) => b.categoryColor),
            borderRadius: 0,
            borderWidth: 1,
            borderColor: 'rgb(31, 30, 30)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { bodyFont: { size: 16 } },
        },
      },
    } as any);
  }

  private destroyExistingChart(canvasId: string): HTMLCanvasElement | null {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return null;

    const existingChart = Chart.getChart(canvas); // ← Chart.js beépített lookup
    if (existingChart) {
      existingChart.destroy();
    }

    return canvas;
  }
}

class DataChart {
  categoryName: string = '';
  categoryColor: string = '';
  categorySpent: number = 0;
  categoryLimit: number = 0;
}
