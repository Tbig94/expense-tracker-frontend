import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { DashboardDto } from '../../models/Dashboard.model';
import { Chart, registerables } from 'chart.js';
import { DashboardSmallCards } from './dashboard-small-cards/dashboard-small-cards';
import { DashboardLargeCards } from './dashboard-large-cards/dashboard-large-cards';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [DashboardSmallCards, DashboardLargeCards],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private dashboardService = inject(DashboardService);

  dashboardData: DashboardDto | undefined;
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Hiba:', err);
        this.isLoading = false;
      },
    });
  }
}
