import { OrderDetail } from './OrderDetail';

export class Order {
  #id: number;
  #user_id: number;
  #payment_id: string;
  #order_date: Date;
  #date_delivery: Date;
  #country: string;
  #full_name: string;
  #phone: string;
  #address: string;
  #province: string;
  #city: string;
  #zip: string;
  #shipping_cost: number;
  #amount_total: number;
  #payment_method: string;
  #status: string;
  #order_details: OrderDetail[];
  constructor(
    id: number = 0,
    user_id: number = 0,
    payment_id: string = '',
    order_date: Date = new Date(),
    date_delivery: Date = new Date(),
    country: string = '',
    full_name: string = '',
    phone: string = '',
    address: string = '',
    province: string = '',
    city: string = '',
    zip: string = '',
    shipping_cost: number = 0,
    amount_total: number = 0,
    payment_method: string = '',
    status: string = '',
    order_details: OrderDetail[] = [],
  ) {
    this.#id = id;
    this.#user_id = user_id;
    this.#payment_id = payment_id;
    this.#order_date = order_date;
    this.#date_delivery = date_delivery;
    this.#country = country;
    this.#full_name = full_name;
    this.#phone = phone;
    this.#address = address;
    this.#province = province;
    this.#city = city;
    this.#zip = zip;
    this.#shipping_cost = shipping_cost;
    this.#amount_total = amount_total;
    this.#payment_method = payment_method;
    this.#status = status;
    this.#order_details = order_details;
    this.#shipping_cost = shipping_cost;
  }

  //Getters--------------------------

  get id(): number {
    return this.#id;
  }
  get user_id(): number {
    return this.#user_id;
  }
  get payment_id(): string {
    return this.#payment_id;
  }
  get order_date(): Date {
    return this.#order_date;
  }
  get date_delivery(): Date {
    return this.#date_delivery;
  }
  get country(): string {
    return this.#country;
  }
  get full_name(): string {
    return this.#full_name;
  }
  get phone(): string {
    return this.#phone;
  }
  get address(): string {
    return this.#address;
  }
  get province(): string {
    return this.#province;
  }
  get city(): string {
    return this.#city;
  }
  get zip(): string {
    return this.#zip;
  }
  get shipping_cost(): number {
    return this.#shipping_cost;
  }
  get amount_total(): number {
    return this.#amount_total;
  }
  get payment_method(): string {
    return this.#payment_method;
  }
  get status(): string {
    return this.#status;
  }
  get order_details(): OrderDetail[] {
    return this.#order_details;
  }
  //-----------------------------------

  //Setters----------------------------
  set id(id: number) {
    this.#id = id;
  }
  set user_id(user_id: number) {
    this.#user_id = user_id;
  }
  set payment_id(payment_id: string) {
    this.#payment_id = payment_id;
  }
  set order_date(order_date: Date) {
    this.#order_date = order_date;
  }
  set date_delivery(date_delivery: Date) {
    this.#date_delivery = date_delivery;
  }
  set country(country: string) {
    this.#country = country;
  }
  set full_name(full_name: string) {
    this.#full_name = full_name;
  }
  set phone(phone: string) {
    this.#phone = phone;
  }
  set address(address: string) {
    this.#address = address;
  }
  set province(province: string) {
    this.#province = province;
  }
  set city(city: string) {
    this.#city = city;
  }
  set zip(zip: string) {
    this.#zip = zip;
  }
  set shipping_cost(shipping_cost: number) {
    this.#shipping_cost = shipping_cost;
  }
  set amount_total(amount_total: number) {
    this.#amount_total = amount_total;
  }
  set payment_method(payment_method: string) {
    this.#payment_method = payment_method;
  }
  set status(status: string) {
    this.#status = status;
  }
  set order_details(order_details: OrderDetail[]) {
    this.#order_details = order_details;
  }

  //-----------------------------------

  toJSON(): any {
    return {
      id: this.#id,
      user_id: this.#user_id,
      payment_id: this.#payment_id,
      date_delivery: this.#date_delivery,
      country: this.#country,
      full_name: this.#full_name,
      phone: this.#phone,
      address: this.#address,
      province: this.#province,
      city: this.#city,
      zip: this.#zip,
      shipping_cost: this.#shipping_cost,
      amount_total: this.#amount_total,
      payment_method: this.#payment_method,
      status: this.#status,
      order_details: this.#order_details,
    };
  }
}
