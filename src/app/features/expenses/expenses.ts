import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Expense } from '../../models/Expense.model';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../models/Category.model';
import { ExpenseFilter, ExpensesService } from './expenses.service';
import { CategoriesService } from '../categories/categories.service';
import { CsvExportService } from '../../shared/services/csvExport.service';
import { CreateExpenseDialogComponent } from './new-expense/create-expense-dialog.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-expenses',
  imports: [DatePipe, CurrencyPipe, ReactiveFormsModule], // MatTableModule eltávolítva
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses implements OnInit {
  private expensesService = inject(ExpensesService);
  private categoriesService = inject(CategoriesService);
  private csvExportService = inject(CsvExportService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(Dialog);

  form = new FormGroup({
    description: new FormControl(''),
    minDate: new FormControl(''),
    maxDate: new FormControl(''),
    minAmount: new FormControl(''),
    maxAmount: new FormControl(''),
    categoryName: new FormControl(''),
    edit: new FormControl(''),
    delete: new FormControl(''),
  });

  isLoading = false;
  expenses: Expense[] | undefined;
  categories: Category[] = [];
  expenseFilter: ExpenseFilter | undefined;

  ngOnInit(): void {
    this.isLoading = true;
    this.expensesService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
        this.cdr.detectChanges();
      },
    });
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit() {
    let formValue = this.form.value;
    this.expenseFilter = new ExpenseFilter();

    if (formValue.categoryName != null && formValue.categoryName != '') {
      this.expenseFilter.CategoryName = formValue.categoryName;
    }
    if (formValue.minDate != null && formValue.minDate != '') {
      this.expenseFilter.MinDate = new Date(formValue.minDate!).toISOString();
    }
    if (formValue.maxDate != null && formValue.maxDate != '') {
      this.expenseFilter.MaxDate = new Date(formValue.maxDate!).toISOString();
    }
    if (formValue.minAmount != null && formValue.minAmount != '') {
      this.expenseFilter.MinAmount = parseInt(formValue.minAmount!);
    }
    if (formValue.maxAmount != null && formValue.maxAmount != '') {
      this.expenseFilter.MaxAmount = parseInt(formValue.maxAmount!);
    }
    if (formValue.description != null && formValue.description != '') {
      this.expenseFilter.Text = formValue.description;
    }
    this.expensesService.getExpensesByFilter(this.expenseFilter).subscribe({
      next: (data) => {
        this.expenses = data;
        this.cdr.detectChanges();
      },
    });
  }

  onExport() {
    var now = new Date();

    var from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    var to = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
    this.csvExportService.generateExport(from, to, null, 2).subscribe({
      next: (data: ArrayBuffer) => {
        this.csvExportService.exportCsvFromByteArray(
          data!,
          `Kiadások - ${now.getFullYear()}-${now.getMonth()}`,
        );
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

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.expensesService.getExpenses().subscribe({
          next: (data) => {
            this.expenses = data;
            this.cdr.detectChanges();
          },
        });
      }
    });
  }

  onEditExpense(id: string) {}

  handleDeleteExpense(id: string) {
    this.expensesService.deleteExpense(id).subscribe({
      next: (data) => {
        this.loadExpenses();
      },
    });
  }

  loadExpenses(): void {
    this.expensesService.getExpensesByFilter((this.expenseFilter = new ExpenseFilter())).subscribe({
      next: (data) => {
        this.expenses = data;
        this.cdr.detectChanges();
      },
    });
  }
}
