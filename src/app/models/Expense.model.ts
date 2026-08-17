export class Expense {
  id: string;
  categoryId: string;
  categoryName: string;
  userId: string;
  date: Date;
  amount: number;
  description: string;

  constructor(
    id: string,
    categoryId: string,
    categoryName: string,
    userId: string,
    date: Date,
    amount: number,
    description: string,
  ) {
    this.id = id;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.userId = userId;
    this.date = date;
    this.amount = amount;
    this.description = description;
  }
}
