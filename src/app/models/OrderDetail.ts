export class OrderDetail {
  #id: number;
  #order_id: number;
  #img: string;
  #name: string;
  #brand: string;
  #quantity: number;
  #unit_price: number;
  constructor(
    id: number = 0,
    order_id: number = 0,
    img: string = '',
    name: string = '',
    brand: string = '',
    quantity: number = 0,
    unit_price: number = 0,
  ) {
    this.#id = id;
    this.#order_id = order_id;
    this.#img = img;
    this.#name = name;
    this.#brand = brand;
    this.#quantity = quantity;
    this.#unit_price = unit_price;
  }

  //Getters--------------------------

  get id(): number {
    return this.#id;
  }
  get order_id(): number {
    return this.#order_id;
  }
  get img(): string {
    return this.#img;
  }
  get name(): string {
    return this.#name;
  }
  get brand(): string {
    return this.#brand;
  }
  get quantity(): number {
    return this.#quantity;
  }
  get unit_price(): number {
    return this.#unit_price;
  }
  //-----------------------------------

  //Setters----------------------------
  set id(id: number) {
    this.#id = id;
  }
  set order_id(order_id: number) {
    this.#order_id = order_id;
  }
  set img(img: string) {
    this.#img = img;
  }
  set name(name: string) {
    this.#name = name;
  }
  set brand(brand: string) {
    this.#brand = brand;
  }
  set quantity(quantity: number) {
    this.#quantity = quantity;
  }
  set unit_price(unit_price: number) {
    this.#unit_price = unit_price;
  }

  //-----------------------------------

  toJSON(): any {
    return {
      id: this.#id,
      order_id: this.#order_id,
      img: this.#img,
      name: this.#name,
      brand: this.#brand,
      quantity: this.#quantity,
      unit_price: this.#unit_price
    };
  }
}
