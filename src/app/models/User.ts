export class User {
  #id: number;
  #picture: string;
  #nickname: string;
  #email: string;
  #connection: string;
  #country: string | null;
  #fullName: string | null;
  #phone: string | null;
  #address: string | null;
  #province: string | null;
  #city: string | null;
  #zip: string | null;
  #createdAt: Date;
  #updatedAt: Date;

  constructor(
    id: number = 0,
    picture: string = '',
    nickname: string = '',
    email: string = '',
    connection: string = '',
    country: string | null = null,
    fullName: string | null = null,
    phone: string | null = null,
    address: string | null = null,
    province: string | null = null,
    city: string | null = null,
    zip: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.#id = id;
    this.#picture = picture;
    this.#nickname = nickname;
    this.#email = email;
    this.#connection = connection;
    this.#country = country;
    this.#fullName = fullName;
    this.#phone = phone;
    this.#address = address;
    this.#province = province;
    this.#city = city;
    this.#zip = zip;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  // Getters
  get id(): number {
    return this.#id;
  }
  get picture(): string {
    return this.#picture;
  }
  get nickname(): string {
    return this.#nickname;
  }
  get email(): string {
    return this.#email;
  }
  get connection(): string {
    return this.#connection;
  }
  get country(): string | null {
    return this.#country;
  }
  get fullName(): string | null {
    return this.#fullName;
  }
  get phone(): string | null {
    return this.#phone;
  }
  get address(): string | null {
    return this.#address;
  }
  get province(): string | null {
    return this.#province;
  }
  get city(): string | null {
    return this.#city;
  }
  get zip(): string | null {
    return this.#zip;
  }
  get createdAt(): Date {
    return this.#createdAt;
  }
  get updatedAt(): Date {
    return this.#updatedAt;
  }

  // Setters
  set id(id: number) {
    this.#id = id;
  }
  set picture(picture: string) {
    this.#picture = picture;
  }
  set nickname(nickname: string) {
    this.#nickname = nickname;
  }
  set email(email: string) {
    this.#email = email;
  }
  set connection(connection: string) {
    this.#connection = connection;
  }
  set country(country: string) {
    this.#country = country;
  }
  set fullName(fullName: string) {
    this.#fullName = fullName;
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

  // Convertir objeto a JSON
  toJSON(): any {
    return {
      id: this.#id,
      picture: this.#picture,
      nickname: this.#nickname,
      email: this.#email,
      connection: this.#connection,
      country: this.#country,
      fullName: this.#fullName,
      phone: this.#phone,
      address: this.#address,
      province: this.#province,
      city: this.#city,
      zip: this.#zip,
    };
  }
}
