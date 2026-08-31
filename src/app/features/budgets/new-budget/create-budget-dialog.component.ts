import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { BudgetService } from '../budget.service';
import { CategoriesService } from '../../categories/categories.service';
import { Category } from '../../../models/Category.model';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';

@Component({
  selector: 'app-create-budget-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatInput,
    MatLabel,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-budget-dialog.component.html',
  styleUrl: './create-budget-dialog.component.css',
})
export class CreateBudgetDialogComponent implements OnInit {
  private readonly dialogRef = inject(DialogRef<CreateBudgetDialogComponent>);
  private readonly budgetsService = inject(BudgetService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly snackbarService = inject(SnackbarService);

  limit = 0;
  categories: Category[] = [];
  selectedCategory?: Category;

  createBudgetForm = new FormGroup({
    limit: new FormControl(0, [Validators.required]),
    categoryName: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (result) => {
        this.categories = result;
      },
    });
  }

  create(): void {
    const formValue = this.createBudgetForm.value;
    this.selectedCategory = this.categories.find((x) => x.name === formValue.categoryName);

    this.budgetsService.createBudget(this.selectedCategory!.id, formValue.limit!).subscribe({
      next: (result) => {
        this.snackbarService.success('Budget created successfully');
        this.dialogRef.close();
      },
      error: (err) => {
        this.snackbarService.error('Failed to create budget!');
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
