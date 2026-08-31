import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from './categories.service';
import { Category } from '../../models/Category.model';
import { CreateCategoryDialogComponent } from './new-category/create-category-dialog.component';
import { CategoryCard } from './category-card/category-card';
import { Dialog } from '@angular/cdk/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrl: './categories.css',
  imports: [CategoryCard, MatButton, MatIcon],
})
export class Categories implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly snackbarService = inject(SnackbarService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(Dialog);

  isLoading = false;
  systemCategories: Category[] = [];
  userCategories: Category[] = [];

  ngOnInit(): void {
    this.isLoading = true;
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.systemCategories = data.filter((x) => x.userId === null);
        this.userCategories = data.filter((x) => x.userId !== null);
        this.cdr.detectChanges();
        this.isLoading = false;
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      width: '750px',
      height: '600px',
      panelClass: 'custom-dialog',
      backdropClass: 'my-dark-backdrop',
    });

    dialogRef.closed.subscribe((result) => {
      this.loadCategories();
    });
  }

  handleDeleteCategory(id: string): void {
    this.categoriesService.deleteCategory(id).subscribe({
      next: (data) => {
        this.snackbarService.success('Category deleted successfully');
        this.loadCategories();
      },
      error: (err) => {
        this.snackbarService.error('Failed to delete category!');
      },
    });
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe((data) => {
      this.systemCategories = data.filter((x) => x.userId === null);
      this.userCategories = data.filter((x) => x.userId !== null);
      this.cdr.detectChanges();
    });
  }
}
