import { Component, input } from '@angular/core';
import { YearlyStatisticsDto } from '../../../../models/YearlyStatistics.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-yearly-small-cards',
  imports: [CurrencyPipe],
  templateUrl: './yearly-small-cards.html',
  styleUrl: './yearly-small-cards.css',
})
export class YearlySmallCards {
  yearlyStats = input<YearlyStatisticsDto>();
}
