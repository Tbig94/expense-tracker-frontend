import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Budget } from '../../models/Budget.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private http = inject(HttpClient);
  readonly API_URL: string = `${environment.apiUrl}/Budget`;

  public getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.API_URL);
  }

  public deleteBudget(id: string): Observable<any> {
    return this.http.delete<void>(this.API_URL, {
      params: { id },
    });
  }

  public createBudget(
    categoryId: string,
    limitAmount: number,
    month = new Date().getMonth() + 1,
    year = new Date().getFullYear(),
  ): Observable<any> {
    return this.http.post(this.API_URL, {
      categoryId,
      limitAmount,
      month,
      year,
    });
  }
}
