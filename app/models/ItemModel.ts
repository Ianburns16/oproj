import { BaseModel } from './BaseModel';

export class ItemModel extends BaseModel {
  categoryid: number;
  private _price: number;

  constructor(data: {
    id: number;
    name: string;
    image: string;
    price: number;
    description: string;
    categoryid: number;
  }) {
    super(data);
    this.categoryid = data.categoryid;
    this._price = data.price;
  }

  get price(): number {
    return this._price;
  }

  getDisplayPrice(): string {
    return `$${this._price.toFixed(2)}`;
  }

  getType(): string {
    return 'item';
  }

  static fromSupabase(data: any): ItemModel {
    return new ItemModel({
      id: data.id,
      name: data.name,
      image: data.image,
      price: data.price,
      description: data.description,
      categoryid: data.categoryid
    });
  }
} 