export class Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  hasExpense: boolean;

  constructor(id: string, userId: string, name: string, color: string, hasExpense: boolean) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.color = color;
    this.hasExpense = hasExpense;
  }
}
