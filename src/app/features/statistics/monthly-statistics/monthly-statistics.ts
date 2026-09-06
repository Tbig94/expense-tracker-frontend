import { ChangeDetectorRef, Component, effect, inject, OnInit, signal } from '@angular/core';
import { MonthlyLargeCards } from './monthly-large-cards/monthly-large-cards';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StatisticsService } from '../statistics.service';
import { MonthlyStatisticsDto } from '../../../models/MonthlyStatistics.model';
import { MonthlySmallCards } from './monthly-small-cards/monthly-small-cards';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-monthly-statistics',
  imports: [
    MonthlyLargeCards,
    MonthlySmallCards,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDivider,
  ],
  templateUrl: './monthly-statistics.html',
  styleUrl: './monthly-statistics.css',
})
export class MonthlyStatistics implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private statisticsService = inject(StatisticsService);

  months = [
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
  ];

  monthsDict: NumberDictionary = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  selected = signal(
    Object.keys(this.monthsDict).find((k) => this.monthsDict[k] === new Date().getMonth() + 1)!,
  );
  isMonthly = signal(true);
  isLoading = false;
  monthlyStats: MonthlyStatisticsDto | undefined;

  form = new FormGroup({
    month: new FormControl(this.selected()),
  });

  constructor() {
    effect(() => {
      const selectedC = this.selected();
      this.isLoading = true;
      this.statisticsService.getMonthlyStatistics(2026, this.monthsDict[selectedC]).subscribe({
        next: (data) => {
          this.monthlyStats = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    });

    this.form.get('month')!.valueChanges.subscribe((value) => {
      if (value) this.selected.set(value);
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.statisticsService.getMonthlyStatistics(2026, this.monthsDict[this.selected()]).subscribe({
      next: (data) => {
        this.monthlyStats = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  switch(s: string) {
    if (s === 'monthly') {
      this.isMonthly.set(true);
    } else {
      this.isMonthly.set(false);
    }
  }
}

interface NumberDictionary {
  [key: string]: number;
}
