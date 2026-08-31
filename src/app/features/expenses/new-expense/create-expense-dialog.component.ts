import { Component, inject, OnInit } from '@angular/core';
import { ExpensesService } from '../expenses.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';
import { Category } from '../../../models/Category.model';
import { DialogRef } from '@angular/cdk/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';

@Component({
  selector: 'app-new-expense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatFormFieldModule,
    MatLabel,
    MatInput,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-expense-dialog.component.html',
  styleUrl: './create-expense-dialog.component.css',
  providers: [provideNativeDateAdapter()],
})
export class CreateExpenseDialogComponent implements OnInit {
  private readonly expensesService = inject(ExpensesService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly snackbarService = inject(SnackbarService);
  private dialogRef = inject(DialogRef<CreateExpenseDialogComponent>);

  categoryControl = new FormControl<string | Category>('');

  createExpenseForm = new FormGroup({
    amount: new FormControl<number | null>(null, [Validators.required]),
    description: new FormControl<string>(''),
    categoryName: new FormControl<string>('', [Validators.required]),
    date: new FormControl<Date>(new Date(), [Validators.required]),
  });

  categories: Category[] = [];
  selectedCategory?: Category;

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
    });
  }

  create(): void {
    const formValue = this.createExpenseForm.value;
    this.selectedCategory = this.categories.find((x) => x.name === formValue.categoryName);

    this.expensesService
      .createExpense(
        this.selectedCategory!.id,
        formValue.date!,
        formValue.amount!,
        formValue.description!,
      )
      .subscribe({
        next: (result) => {
          this.snackbarService.success('Expense created successfully');
          this.dialogRef.close(result);
        },
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
