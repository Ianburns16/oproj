import { BaseModel } from './BaseModel';

export class CategoryModel extends BaseModel {
  constructor(data: {
    id: number;
    name: string;
    image: string;
    description: string;
  }) {
    super(data);
  }

  getDisplayPrice(): string {
    return ''; // Categories don't have prices
  }

  getType(): string {
    return 'category';
  }

  static fromSupabase(data: any): CategoryModel {
    return new CategoryModel({
      id: data.id,
      name: data.name,
      image: data.image,
      description: data.description
    });
  }
} 