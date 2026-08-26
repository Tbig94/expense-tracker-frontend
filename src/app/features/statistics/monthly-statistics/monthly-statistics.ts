import { Component, signal } from '@angular/core';
import { MonthlyLargeCards } from './monthly-large-cards/monthly-large-cards';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-monthly-statistics',
  imports: [
    MonthlyLargeCards,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './monthly-statistics.html',
  styleUrl: './monthly-statistics.css',
})
export class MonthlyStatistics {
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

  selected = signal('January');
  isMonthly = signal(true);

  form = new FormGroup({
    month: new FormControl(''),
  });

  switch(s: string) {
    if (s === 'monthly') {
      this.isMonthly.set(true);
    } else {
      this.isMonthly.set(false);
    }
  }
}
