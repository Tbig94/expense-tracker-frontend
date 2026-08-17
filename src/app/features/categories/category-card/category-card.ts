import { ChangeDetectorRef, Component, inject, input, output } from '@angular/core';
import { Category } from '../../../models/Category.model';

@Component({
  selector: 'app-category-card',
  imports: [],
  templateUrl: './category-card.html',
  styleUrl: './category-card.css',
})
export class CategoryCard {
  categoryItem = input.required<Category>();
  isSystemCategory = input.required<boolean>();
  onDelete = output<string>();

  deleteCategory(id: string) {
    this.onDelete.emit(id);
  }
}
