import { Component, inject, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-expenses',
  imports: [DatePipe, CurrencyPipe, ReactiveFormsModule, CurrencyPipe],
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
  categories: Category[] = [];

  ngOnInit(): void {
    this.isLoading = true;

    forkJoin({
      expenses: this.expensesService.getExpenses(),
      categories: this.categoriesService.getCategories(),
    }).subscribe({
      next: ({ expenses, categories }) => {
        // Erőltetjük az Angular Zónán belüli frissítést
        this.ngZone.run(() => {
          this.expenses = [...expenses];
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
          `Kiadások - ${now.getFullYear()}-${now.getMonth() + 1}`,
        );
      },
    });
  }
}
