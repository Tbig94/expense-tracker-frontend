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

  public getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${environment.apiUrl}/Budget/GetAll`);
  }

  public deleteBudget(id: string): Observable<any> {
    return this.http.delete<void>(`${environment.apiUrl}/Budget/Delete`, {
      params: { id },
    });
  }

  public createBudget(
    categoryId: string,
    limitAmount: number,
    month = 8,
    year = 2026,
  ): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Budget/Create`, {
      categoryId,
      limitAmount,
      month,
      year,
    });
  }
}
