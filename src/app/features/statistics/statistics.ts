import { Component, signal } from '@angular/core';
import { MonthlyStatistics } from './monthly-statistics/monthly-statistics';
import { YearlyStatistics } from './yearly-statistics/yearly-statistics';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-statistics',
  imports: [MonthlyStatistics, YearlyStatistics, MatButtonModule, MatTabsModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics {
  isMonthly = signal(true);
  switch(s: string) {
    if (s === 'monthly') {
      this.isMonthly.set(true);
    } else {
      this.isMonthly.set(false);
    }
  }
}
