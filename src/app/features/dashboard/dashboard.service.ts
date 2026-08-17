import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DashboardDto } from '../../models/Dashboard.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  public getDashboardData(): Observable<DashboardDto> {
    return this.http.get<DashboardDto>(`${environment.apiUrl}/Dashboard/GetDashboardData`);
  }
}
