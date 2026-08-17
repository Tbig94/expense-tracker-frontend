import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/Category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/Category/GetAll`);
  }

  public createCategory(name: string, color: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Category/Create`, { name, color });
  }

  public deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Category/Delete?id=${id}`);
  }
}
