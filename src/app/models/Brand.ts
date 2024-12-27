export class Brand {
  #id: number;
  #name: string;


  constructor(
    id: number = 0,
    name: string = '',

  ) {
    this.#id = id;
    this.#name = name;

  }

  // Getters
  get id(): number {
    return this.#id;
  }
  get name(): string {
    return this.#name;
  }


  // Setters
  set id(id: number) {
    this.#id = id;
  }
  set name(name: string) {
    this.#name = name;
  }

  // Convertir objeto a JSON
  toJSON(): any {
    return {
      id: this.#id,
      name: this.#name,
    };
  }
}
