import { Component, input, output } from '@angular/core';
import { Category } from '../../../models/Category.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-category-card',
  imports: [MatButtonModule, MatIcon, NgClass],
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
