import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YearlyStatisticsDto } from '../../models/YearlyStatistics.model';
import { environment } from '../../../environments/environment';
import { MonthlyStatisticsDto } from '../../models/MonthlyStatistics.model';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private http = inject(HttpClient);

  public getYearlyStatistics(): Observable<YearlyStatisticsDto> {
    return this.http.get<YearlyStatisticsDto>(
      `${environment.apiUrl}/Statistics/GetYearlyStatistics`,
    );
  }

  public getMonthlyStatistics(year: number, month: number): Observable<MonthlyStatisticsDto> {
    const params = new HttpParams().set('year', year).set('month', month);

    return this.http.get<MonthlyStatisticsDto>(
      `${environment.apiUrl}/Statistics/GetMonthlyStatistics`,
      { params },
    );
  }
}

export class MonthlyStatisticsRequest {
  month: number | null | undefined;
  year: number | null | undefined;
}
