export class Role {
  #id: string;
  #name: string;
  #description: string;
  constructor(
    id: string = '',
    name: string = '',
    description: string = '',
  ) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
  }

  //Getters--------------------------
  get id(): string {
    return this.#id;
  }
  get name(): string {
    return this.#name;
  }
  get description(): string {
    return this.#description;
  }
  //-----------------------------------

  //Setters----------------------------
  set id(id: string) {
    this.#id = id;
  }
  set name(name: string) {
    this.#name = name;
  }
  set description(description: string) {
    this.#description = description;
  }
  //-----------------------------------

  toJSON(): any {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
    };
  }
}
