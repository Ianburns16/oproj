export abstract class BaseModel {
  id: number;
  name: string;
  image: string;
  description: string;

  constructor(data: {
    id: number;
    name: string;
    image: string;
    description: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.description = data.description;
  }

  abstract getDisplayPrice(): string;
  abstract getType(): string;
} 