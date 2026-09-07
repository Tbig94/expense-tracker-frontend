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
  readonly API_URL: string = `${environment.apiUrl}/Category`;

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API_URL);
  }

  public createCategory(name: string, color: string): Observable<any> {
    return this.http.post(this.API_URL, { name, color });
  }

  public deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}?id=${id}`);
  }
}
