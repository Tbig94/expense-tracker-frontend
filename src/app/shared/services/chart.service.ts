import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardDto } from '../../models/Dashboard.model';

@Injectable({ providedIn: 'root' })
export class ChartService {
  public createBudgetChart(budgetChart: any, dashboardChartData: DataChart[]): void {
    const canvas = document.getElementById('BudgetChart') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    if (budgetChart) {
      budgetChart.destroy();
    }

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

          // 1. DINAMIKUS PÖTTY RAJZOLÁSA
          const radius = 4;
          const dotX = textX + radius;
          const dotY = textY;

          ctx.beginPath();
          ctx.arc(dotX, dotY, radius, 0, 2 * Math.PI);
          ctx.fillStyle = item.categoryColor || '#FFFFFF';
          ctx.fill();

          // 2. FEHÉR SZÖVEG RAJZOLÁSA (Megmaradnak a valós Ft értékek)
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

    budgetChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: dashboardChartData.map((b) => b.categoryName),
        datasets: [
          // 1. DATASET: Szürke háttérsáv (Fix 100% szélesség)
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
          // 2. DATASET: Színes sáv (Arányos kitöltés, max 100%)
          {
            label: 'Spent',
            data: dashboardChartData.map((b) => {
              if (!b.categoryLimit || b.categoryLimit === 0) return 0;
              const percentage = (b.categorySpent / b.categoryLimit) * 100;
              return Math.min(percentage, 100); // Ne lépje túl a 100%-ot
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
        layout: {
          padding: {
            top: 10,
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: {
            min: 0,
            max: 100, // Rögzített skála 0-tól 100%-ig
            grid: { display: false },
            display: false,
          },
          y: {
            grid: { display: false },
            display: false,
            stacked: true,
          },
        },
      },
      plugins: [customLabelsPlugin],
    });
  }

  public createCategoryChart(categoryChart: any, dashboardData: DashboardDto): void {
    const canvas = document.getElementById('CategoryChart') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }
    if (categoryChart) {
      categoryChart.destroy();
    }

    const config: any = {
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
          tooltip: {
            bodyFont: {
              size: 16,
            },
          },
        },
      },
    };

    categoryChart = new Chart(
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
