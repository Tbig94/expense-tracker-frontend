import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { BudgetService } from '../budget.service';
import { CategoriesService } from '../../categories/categories.service';
import { Category } from '../../../models/Category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-create-budget-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButton],
  templateUrl: './create-budget-dialog.component.html',
  styleUrl: './create-budget-dialog.component.css',
})
export class CreateBudgetDialogComponent implements OnInit {
  private dialogRef = inject(DialogRef<CreateBudgetDialogComponent>);
  private budgetsService = inject(BudgetService);
  private categoriesService = inject(CategoriesService);
  private snackBar = inject(MatSnackBar);

  limit = 0;
  categories: Category[] = [];
  selectedCategory?: Category;

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (result) => {
        this.categories = result;
      },
    });
  }

  create(): void {
    this.budgetsService.createBudget(this.selectedCategory!.id, this.limit).subscribe({
      next: (result) => {
        this.snackBar.open('Budget created successfully', 'X', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success'],
        });
        this.dialogRef.close();
      },
      error: (err) => {
        this.snackBar.open('Failed to create budget!', 'X', {
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
