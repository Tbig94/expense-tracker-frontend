import { Component, inject } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
MatButton;

@Component({
  selector: 'app-create-category-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInput,
    MatFormFieldModule,
    MatLabel,
    ReactiveFormsModule,
  ],
  templateUrl: './create-category-dialog.component.html',
  styleUrl: './create-category-dialog.component.css',
})
export class CreateCategoryDialogComponent {
  private dialogRef = inject(DialogRef<CreateCategoryDialogComponent>);
  private categoriesService = inject(CategoriesService);
  private snackBar = inject(MatSnackBar);

  createCategoryForm = new FormGroup({
    categoryName: new FormControl<string>('', [Validators.required]),
    categoryColor: new FormControl<string>('', [Validators.required]),
  });

  name = '';
  selectedColor = '#00BCD4';

  colors = [
    '#4CAF50',
    '#2196F3',
    '#9C27B0',
    '#F44336',
    '#FF9800',
    '#00BCD4',
    '#E91E63',
    '#607D8B',
    '#8BC34A',
    '#3F51B5',
    '#009688',
    '#FFEB3B',
    '#795548',
    '#5C6BC0',
    '#00ACC1',
    '#FF7043',
    '#26A69A',
    '#AB47BC',
  ];

  create(): void {
    const formValue = this.createCategoryForm.value;

    this.categoriesService
      .createCategory(formValue.categoryName!, formValue.categoryColor!)
      .subscribe({
        next: (result) => {
          this.snackBar.open('Category created successfully', 'X', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-success'],
          });

          this.dialogRef.close(result);
        },
        error: (err) => {
          this.snackBar.open('Failed to create category!', 'X', {
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
