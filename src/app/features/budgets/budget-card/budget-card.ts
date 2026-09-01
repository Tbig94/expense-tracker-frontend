import { Component, input, OnInit, output } from '@angular/core';
import { Budget } from '../../../models/Budget.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-budget-card',
  imports: [CurrencyPipe, MatButtonModule, MatIcon, DatePipe],
  templateUrl: './budget-card.html',
  styleUrl: './budget-card.css',
})
export class BudgetCard implements OnInit {
  budgetItem = input<Budget>();
  onDelete = output<string>();
  // categoryName = input<string>();

  deleteBudget(id: string) {
    this.onDelete.emit(id);
  }

  ngOnInit(): void {}
}
