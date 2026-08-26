import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YearlyStatisticsDto } from '../../models/YearlyStatistics.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private http = inject(HttpClient);

  public getYearlyStatistics(): Observable<YearlyStatisticsDto> {
    return this.http.get<YearlyStatisticsDto>(
      `${environment.apiUrl}/Statistics/GetYearlyStatistics`,
    );
  }
}
