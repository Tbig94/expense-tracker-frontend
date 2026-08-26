import { AfterViewInit, Component, ElementRef, effect, input, ViewChild } from '@angular/core';
import { YearlyStatisticsDto } from '../../../../models/YearlyStatistics.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-yearly-large-cards',
  imports: [],
  templateUrl: './yearly-large-cards.html',
  styleUrl: './yearly-large-cards.css',
})
export class YearlyLargeCards implements AfterViewInit {
  yearlyStats = input.required<YearlyStatisticsDto>();

  @ViewChild('yearlyChart') private yearlyChart!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  currentYear: number = new Date().getFullYear();

  constructor() {
    // Az effect automatikusan lefut, amikor a yearlyStats signal értéke megérkezik/megváltozik
    effect(() => {
      const stats = this.yearlyStats();

      // Csak akkor frissítjük a chartot, ha a chart már inicializálva van ÉS vannak adatok
      if (this.chart && stats?.monthlySpendingTrend?.length) {
        const monthlyAmounts = stats.monthlySpendingTrend.map((item) => item.amount);
        this.chart.data.datasets[0].data = monthlyAmounts;
        this.chart.update(); // Újrarajzolja a diagramot az új adatokkal
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const ctx = this.yearlyChart.nativeElement.getContext('2d');
    if (!ctx) return;

    // Biztonságos lekérés: ha még nincsenek adatok, üres tömbbel/nullákkal indít
    const stats = this.yearlyStats();
    const monthlyAmounts = stats?.monthlySpendingTrend?.map((item) => item.amount) ?? [];

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        datasets: [
          {
            label: `Expenses in (${this.currentYear})`,
            data: monthlyAmounts,
            borderColor: '#36a2eb',
            backgroundColor: 'rgba(54, 162, 235, 0.15)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#36a2eb',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Monthly expens trends - ${this.currentYear}`,
            font: { size: 18 },
          },
          tooltip: {
            callbacks: {
              label: (context) => ` Expense: ${context.parsed.y?.toLocaleString('hu-HU')} Ft`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount (Ft)',
            },
            ticks: {
              callback: (value) => `${value.toLocaleString('hu-HU')} Ft`,
            },
          },
        },
      },
    });
  }
}
