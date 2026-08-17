export class Category {
  id: string;
  userId: string;
  name: string;
  color: string;

  constructor(id: string, userId: string, name: string, color: string) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.color = color;
  }
}
