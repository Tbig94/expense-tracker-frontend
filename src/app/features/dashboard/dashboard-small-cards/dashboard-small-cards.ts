import { Component, input } from '@angular/core';
import { DashboardDto } from '../../../models/Dashboard.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-small-cards',
  imports: [CurrencyPipe],
  templateUrl: './dashboard-small-cards.html',
  styleUrl: './dashboard-small-cards.css',
})
export class DashboardSmallCards {
  dashboardData = input<DashboardDto>();

  hufFormazo = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  });
}
