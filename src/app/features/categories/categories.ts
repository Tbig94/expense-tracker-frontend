import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from './categories.service';
import { Category } from '../../models/Category.model';
import { CreateCategoryDialogComponent } from './new-category/create-category-dialog.component';
import { CategoryCard } from './category-card/category-card';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrl: './categories.css',
  imports: [CategoryCard],
})
export class Categories implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
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
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      backdropClass: 'my-dark-backdrop',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.loadCategories();
        this.cdr.detectChanges();
      }
    });
  }

  handleDeleteCategory(id: string): void {
    this.categoriesService.deleteCategory(id).subscribe((data) => {
      this.loadCategories();
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
