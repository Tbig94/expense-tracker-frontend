import {
  Component,
  inject,
  NgZone,
  ChangeDetectorRef,
  OnInit,
  signal,
  ViewChild,
  AfterViewInit,
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
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';

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
    NgxSkeletonLoaderComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses implements OnInit, AfterViewInit {
  private readonly expensesService = inject(ExpensesService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly csvExportService = inject(CsvExportService);
  private readonly snackbarService = inject(SnackbarService);
  private dialog = inject(Dialog);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  form = new FormGroup({
    description: new FormControl(''),
    minDate: new FormControl(''),
    maxDate: new FormControl(''),
    minAmount: new FormControl(''),
    maxAmount: new FormControl(''),
    categoryName: new FormControl(''),
  });

  isLoading = signal(false);
  expenses: Expense[] = [];
  expensesDataSource = new MatTableDataSource<any>([]);
  skeletonData = Array(10).fill({}); // 5 soros skeleton váz
  categories: Category[] = [];
  selected = signal('');

  displayedColumns: string[] = ['date', 'description', 'categoryName', 'amount', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.expensesDataSource.data = this.skeletonData;
    this.isLoading.set(true);

    forkJoin({
      expenses: this.expensesService.getExpenses(),
      categories: this.categoriesService.getCategories(),
    }).subscribe({
      next: ({ expenses, categories }) => {
        this.ngZone.run(() => {
          this.expenses = [...expenses];
          this.expensesDataSource.data = expenses;
          this.categories = [...categories];
          this.isLoading.set(false);
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.isLoading.set(false);
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
    if (formValue.minAmount) filter.MinAmount = parseFloat(formValue.minAmount);
    if (formValue.maxAmount) filter.MaxAmount = parseFloat(formValue.maxAmount);
    if (formValue.description) filter.Text = formValue.description;

    this.isLoading.set(true);
    this.expensesService.getExpensesByFilter(filter).subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.expenses = [...data];
          this.expensesDataSource.data = data;
          this.isLoading.set(false);
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.isLoading.set(false);
          this.cdr.markForCheck();
        });
      },
    });
  }

  loadExpenses(): void {
    this.isLoading.set(true);
    this.expensesService.getExpenses().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.expenses = [...data];
          this.expensesDataSource.data = data;
          this.isLoading.set(false);
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.isLoading.set(false);
          this.cdr.markForCheck();
        });
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateExpenseDialogComponent, {
      width: '750px',
      height: '600px',
      panelClass: 'custom-dialog',
      backdropClass: 'my-dark-backdrop',
      data: {
        categories: this.categories,
      },
    });

    dialogRef.closed.subscribe(() => {
      this.loadExpenses();
    });
  }

  handleDeleteExpense(id: string): void {
    this.expensesService.deleteExpense(id).subscribe({
      next: () => {
        this.snackbarService.success('Expense deleted successfully');
        this.loadExpenses();
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
          `Expenses - ${now.getFullYear()}-${now.getMonth() + 1}`,
        );
      },
    });
  }
}
