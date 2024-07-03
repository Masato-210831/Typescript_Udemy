import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class Product {
  @IsNotEmpty() // 必須
  title: string;
  @IsNumber() // number only
  @IsPositive() // positive number only
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }

  getInformation() {
    return [this.title, `${this.price}円`];
  }
}
