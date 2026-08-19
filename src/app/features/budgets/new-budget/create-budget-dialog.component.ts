import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit, output } from '@angular/core';
import { BudgetService } from '../budget.service';
import { CategoriesService } from '../../categories/categories.service';
import { Category } from '../../../models/Category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Budget } from '../../../models/Budget.model';

@Component({
  selector: 'app-create-budget-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-budget-dialog.component.html',
  styleUrl: './create-budget-dialog.component.css',
})
export class CreateBudgetDialogComponent implements OnInit {
  private dialogRef = inject(DialogRef<CreateBudgetDialogComponent>);
  private budgetsService = inject(BudgetService);
  private categoriesService = inject(CategoriesService);

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
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Hiba:', err);
        alert('Nem sikerült a büdzsé létrehozása.');
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
