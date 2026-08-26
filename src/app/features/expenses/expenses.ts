import {
  Component,
  inject,
  NgZone,
  ChangeDetectorRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Expense } from '../../models/Expense.model';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../models/Category.model';
import { ExpenseFilter, ExpensesService } from './expenses.service';
import { CategoriesService } from '../categories/categories.service';
import { CsvExportService } from '../../shared/services/csvExport.service';
import { CreateExpenseDialogComponent } from './new-expense/create-expense-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-expenses',
  imports: [
    DatePipe,
    CurrencyPipe,
    ReactiveFormsModule,
    CurrencyPipe,
    MatButtonModule,
    MatIcon,
    MatTableModule,
    MatLabel,
    MatFormFieldModule,
    MatInput,
    MatSelectModule,
    MatDatepickerModule,
    MatPaginatorModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses implements OnInit {
  private expensesService = inject(ExpensesService);
  private categoriesService = inject(CategoriesService);
  private csvExportService = inject(CsvExportService);
  private dialog = inject(Dialog);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private snackBar = inject(MatSnackBar);

  form = new FormGroup({
    description: new FormControl(''),
    minDate: new FormControl('2026-01-01'),
    maxDate: new FormControl('2026-12-31'),
    minAmount: new FormControl(''),
    maxAmount: new FormControl(''),
    categoryName: new FormControl(''),
    edit: new FormControl(''),
    delete: new FormControl(''),
  });

  isLoading = false;
  expenses: Expense[] = [];
  expensesDataSource = new MatTableDataSource<any>([]);
  categories: Category[] = [];
  selected = signal('');

  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.isLoading = true;

    forkJoin({
      expenses: this.expensesService.getExpenses(),
      categories: this.categoriesService.getCategories(),
    }).subscribe({
      next: ({ expenses, categories }) => {
        this.ngZone.run(() => {
          this.expenses = [...expenses];

          const rawData = [
            { id: 1, date: new Date(), description: 'Kávé', categoryName: 'Étel', amount: 800 },
            // ... többi elem
          ];
          this.expensesDataSource.data = expenses;
          // this.expensesDataSource.data = rawData;

          this.categories = [...categories];
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      },
    });
  }

  ngAfterViewInit(): void {
    this.expensesDataSource.paginator = this.paginator;
  }

  onSubmit(): void {
    const formValue = this.form.value;
    const filter = new ExpenseFilter();

    if (formValue.categoryName) filter.CategoryName = formValue.categoryName;
    if (formValue.minDate) filter.MinDate = new Date(formValue.minDate).toISOString();
    if (formValue.maxDate) filter.MaxDate = new Date(formValue.maxDate).toISOString();
    if (formValue.minAmount) filter.MinAmount = parseInt(formValue.minAmount, 10);
    if (formValue.maxAmount) filter.MaxAmount = parseInt(formValue.maxAmount, 10);
    if (formValue.description) filter.Text = formValue.description;

    this.isLoading = true;
    this.expensesService.getExpensesByFilter(filter).subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.expenses = [...data];
          this.expensesDataSource.data = data;
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      },
    });
  }

  loadExpenses(): void {
    this.isLoading = true;
    this.expensesService.getExpenses().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.expenses = [...data];
          this.expensesDataSource.data = data;
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateExpenseDialogComponent, {
      width: '900px',
      height: '600px',
      panelClass: 'custom-dialog',
      backdropClass: 'my-dark-backdrop',
    });

    dialogRef.closed.subscribe(() => {
      this.loadExpenses();
    });
  }

  handleDeleteExpense(id: string): void {
    this.expensesService.deleteExpense(id).subscribe({
      next: () => {
        this.snackBar.open('Expense deleted successfully', 'X', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success'],
        });
        this.loadExpenses();
      },
      error: (err) => {
        this.snackBar.open('Failed to delete expense!', 'X', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  onExport(): void {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const to = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    this.csvExportService.generateExport(from, to, null, 2).subscribe({
      next: (data: ArrayBuffer) => {
        this.csvExportService.exportCsvFromByteArray(
          data,
          `Kiadások - ${now.getFullYear()}-${now.getMonth() + 1}`,
        );
      },
    });
  }
}
