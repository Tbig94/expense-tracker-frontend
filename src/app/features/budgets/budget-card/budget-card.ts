import { Component, inject, input, OnInit, output } from '@angular/core';
import { Budget } from '../../../models/Budget.model';

@Component({
  selector: 'app-budget-card',
  imports: [],
  templateUrl: './budget-card.html',
  styleUrl: './budget-card.css',
})
export class BudgetCard implements OnInit {
  budgetItem = input<Budget>();
  onDelete = output<string>();
  categoryName = input<string>();

  deleteBudget(id: string) {
    this.onDelete.emit(id);
  }

  ngOnInit(): void {}
}
