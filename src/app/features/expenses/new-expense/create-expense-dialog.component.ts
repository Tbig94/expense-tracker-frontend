import { Component, inject, OnInit } from '@angular/core';
import { ExpensesService } from '../expenses.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';
import { Category } from '../../../models/Category.model';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-expense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-expense-dialog.component.html',
  styleUrl: './create-expense-dialog.component.css',
})
export class CreateExpenseDialogComponent implements OnInit {
  private dialogRef = inject(DialogRef<CreateExpenseDialogComponent>);
  private expensesService = inject(ExpensesService);
  private categoriesService = inject(CategoriesService);
  private snackBar = inject(MatSnackBar);

  categoryControl = new FormControl<string | Category>('');

  amount = 0;
  description = '';
  categories: Category[] = [];
  selectedCategory?: Category;
  date = '';

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
    });
  }

  create(): void {
    this.expensesService
      .createExpense(this.selectedCategory!.id, new Date(), this.amount, this.description)
      .subscribe({
        next: (result) => {
          this.snackBar.open('Expense created successfully', 'X', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-success'],
          });

          this.dialogRef.close(result);
        },
        error: (err) => {
          this.snackBar.open('Failed to create expense!', 'X', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error'],
          });
        },
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
