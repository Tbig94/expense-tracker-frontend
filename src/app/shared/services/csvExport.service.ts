import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CsvExportService {
  private http = inject(HttpClient);

  public generateExport(
    from: string | undefined,
    to: string | undefined,
    categoryId: string | undefined | null,
    exportType: number,
  ): Observable<ArrayBuffer> {
    let filter = new ExportFilter();
    filter.FromDate = from;
    filter.ToDate = to;
    filter.ExportType = exportType;

    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach((key) => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get(`${environment.apiUrl}/Expense/Export`, {
      params,
      headers: {
        Authorization: environment.bearer,
      },
      responseType: 'arraybuffer',
    });
  }

  exportCsvFromByteArray(
    byteArray: ArrayBuffer | Uint8Array | number[],
    fileName: string = 'export.csv',
  ): void {
    // 1. Ha ArrayBuffer jött a backendről, átalakítjuk Uint8Array-jé
    let uint8Array: Uint8Array;

    if (byteArray instanceof ArrayBuffer) {
      uint8Array = new Uint8Array(byteArray);
    } else if (byteArray instanceof Uint8Array) {
      uint8Array = byteArray;
    } else {
      uint8Array = new Uint8Array(byteArray);
    }

    // 2. UTF-8 BOM az ékezetekhez
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);

    // 3. Biztonságos összefűzés egyetlen új Uint8Array-be
    // Ez megelőzi a buffer offset / slicing hibákat!
    const combined = new Uint8Array(bom.length + uint8Array.length);
    combined.set(bom, 0);
    combined.set(uint8Array, bom.length);

    // 4. Blob létrehozása a combined tömbből
    const blob = new Blob([combined], { type: 'text/csv;charset=utf-8;' });

    // 5. Letöltés kikényszerítése
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export class ExportFilter {
  FromDate: string | null | undefined;
  ToDate: string | null | undefined;
  CategoryId: string | null | undefined;
  ExportType: number = 0;
}

export enum ExportType {
  Expenses,
  Budgets,
  Categories,
  Complex,
}
