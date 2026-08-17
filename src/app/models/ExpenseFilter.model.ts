export class Expense {
  text: string;
  minDate: Date;
  maxDate: Date;
  categoryId: string;

  constructor(text: string, minDate: Date, maxDate: Date, categoryId: string) {
    this.text = text;
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.categoryId = categoryId;
  }
}
