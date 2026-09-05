import { Component, input } from '@angular/core';
import { MonthlyStatisticsDto } from '../../../../models/MonthlyStatistics.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-monthly-small-cards',
  imports: [CurrencyPipe],
  templateUrl: './monthly-small-cards.html',
  styleUrl: './monthly-small-cards.css',
})
export class MonthlySmallCards {
  monthlyStats = input<MonthlyStatisticsDto>();
}
