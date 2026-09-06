import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from '../../models/Expense.model';
import { environment } from '../../../environments/environment';
import { ExpenseFilter } from '../../models/ExpenseFilter.model';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private http = inject(HttpClient);

  public getExpensesByFilter(filter: ExpenseFilter): Observable<Expense[]> {
    let params = new HttpParams();

    if (filter) {
      Object.keys(filter).forEach((key) => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<Expense[]>(`${environment.apiUrl}/Expense/GetByFilter`, { params });
  }

  public getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${environment.apiUrl}/Expense/GetAll`);
  }

  public createExpense(
    categoryId: string,
    date: Date,
    amount: number,
    description: string,
  ): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Expense/Create`, {
      categoryId,
      date,
      amount,
      description,
    });
  }

  public deleteExpense(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Expense/Delete`, { params: { id } });
  }
}
