import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from '../../models/Expense.model';
import { environment } from '../../../environments/environment';
import { ExpenseFilter } from '../../models/ExpenseFilter.model';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private http = inject(HttpClient);
  readonly API_URL: string = `${environment.apiUrl}/Expense`;

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

    return this.http.get<Expense[]>(`${this.API_URL}/GetByFilter`, { params });
  }

  public getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.API_URL);
  }

  public createExpense(
    categoryId: string,
    date: Date,
    amount: number,
    description: string,
  ): Observable<any> {
    return this.http.post(this.API_URL, {
      categoryId,
      date,
      amount,
      description,
    });
  }

  public deleteExpense(id: string): Observable<any> {
    return this.http.delete(this.API_URL, { params: { id } });
  }
}
