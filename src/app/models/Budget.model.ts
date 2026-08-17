export class Budget {
  id: string;
  categoryId: string;
  userId: string;
  limitAmount: number;
  month: number;
  year: number;

  constructor(
    id: string,
    categoryId: string,
    userId: string,
    limitAmount: number,
    month: number,
    year: number,
  ) {
    this.id = id;
    this.categoryId = categoryId;
    this.userId = userId;
    this.limitAmount = limitAmount;
    this.month = month;
    this.year = year;
  }
}
