import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Budget } from '../../models/Budget.model';
import { BudgetService } from './budget.service';
import { BudgetCard } from './budget-card/budget-card';
import { Dialog } from '@angular/cdk/dialog';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../../models/Category.model';
import { CreateBudgetDialogComponent } from './new-budget/create-budget-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-budgets',
  imports: [BudgetCard],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css',
})
export class Budgets implements OnInit {
  private readonly budgetsService = inject(BudgetService);
  private readonly categoriesService = inject(CategoriesService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(Dialog);
  private snackBar = inject(MatSnackBar);

  isLoading = false;
  budgets: Budget[] = [];
  categories: Category[] = [];

  ngOnInit(): void {
    this.isLoading = true;
    this.budgetsService.getBudgets().subscribe({
      next: (data) => {
        this.budgets = data;
        this.cdr.detectChanges();
      },
    });
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateBudgetDialogComponent, {
      width: '900px',
      panelClass: 'custom-dialog',
      backdropClass: 'my-dark-backdrop',
    });

    dialogRef.closed.subscribe((result) => {
      this.loadBudgets();
    });
  }

  handleDeleteBudget(id: string): void {
    this.budgetsService.deleteBudget(id).subscribe({
      next: (data) => {
        this.snackBar.open('Budget deleted successfully', 'X', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success'],
        });
        this.loadBudgets();
      },
      error: (err) => {
        this.snackBar.open('Failed to delete budget!', 'X', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  loadBudgets(): void {
    this.budgetsService.getBudgets().subscribe({
      next: (data) => {
        this.budgets = data;
        this.cdr.detectChanges();
      },
    });
  }
}
