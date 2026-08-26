import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { YearlySmallCards } from './yearly-small-cards/yearly-small-cards';
import { YearlyLargeCards } from './yearly-large-cards/yearly-large-cards';
import { StatisticsService } from '../statistics.service';
import { YearlyStatisticsDto } from '../../../models/YearlyStatistics.model';

@Component({
  selector: 'app-yearly-statistics',
  imports: [YearlySmallCards, YearlyLargeCards],
  templateUrl: './yearly-statistics.html',
  styleUrl: './yearly-statistics.css',
})
export class YearlyStatistics implements OnInit {
  private statisticsService = inject(StatisticsService);
  private cdr = inject(ChangeDetectorRef);

  yearlyStats: YearlyStatisticsDto = new YearlyStatisticsDto();

  ngOnInit(): void {
    this.statisticsService.getYearlyStatistics().subscribe({
      next: (data) => {
        this.yearlyStats = data;
        this.cdr.detectChanges();
      },
    });
  }
}
