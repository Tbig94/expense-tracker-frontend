export class Budget {
  id: string;
  categoryId: string;
  userId: string;
  limitAmount: number;
  // month: number;
  // year: number;
  validFrom: Date;
  validTo: Date;

  constructor(
    id: string,
    categoryId: string,
    userId: string,
    limitAmount: number,
    validFrom: Date,
    validTo: Date,
  ) {
    this.id = id;
    this.categoryId = categoryId;
    this.userId = userId;
    this.limitAmount = limitAmount;
    this.validFrom = validFrom;
    this.validTo = validTo;
  }
}
