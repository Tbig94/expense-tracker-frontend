import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Budget } from '../../models/Budget.model';
import { BudgetService } from './budget.service';
import { BudgetCard } from './budget-card/budget-card';
import { Dialog } from '@angular/cdk/dialog';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../../models/Category.model';
import { CreateBudgetDialogComponent } from './new-budget/create-budget-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';

@Component({
  selector: 'app-budgets',
  imports: [BudgetCard, MatButton, MatIcon],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css',
})
export class Budgets implements OnInit {
  private readonly budgetsService = inject(BudgetService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly snackbarService = inject(SnackbarService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(Dialog);

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
      width: '750px',
      height: '600px',
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
        this.snackbarService.success('Budget deleted successfully');
        this.loadBudgets();
      },
      error: (err) => {
        this.snackbarService.error('Failed to delete budget!');
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
