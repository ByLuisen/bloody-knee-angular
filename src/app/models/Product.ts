export class Product {
  private _id: number;
  private _brandId: number;
  private _brand: string;
  private _categoryId: number;
  private _category: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _stock: number;
  private _url_img1: string;
  private _url_img2: string;
  private _url_img3: string;
  private _quantity: number;
  private _added_date: string;

  constructor(
    id: number = 0,
    brandId: number = 0,
    brand: string = '',
    categoryId: number = 0,
    category: string = '',
    name: string = '',
    description: string = '',
    price: number = 0,
    stock: number = 0,
    url_img1: string = '',
    url_img2: string = '',
    url_img3: string = '',
    quantity: number = 0,
    added_date: string = ''
  ) {
    this._id = id;
    this._brandId = brandId;
    this._brand = brand;
    this._categoryId = categoryId;
    this._category = category;
    this._name = name;
    this._description = description;
    this._price = price;
    this._stock = stock;
    this._url_img1 = url_img1;
    this._url_img2 = url_img2;
    this._url_img3 = url_img3;
    this._quantity = quantity;
    this._added_date = added_date
  }

  // Getters
  get id(): number {
    return this._id;
  }
  get brandId(): number {
    return this._brandId;
  }
  get brand(): string {
    return this._brand;
  }
  get category(): string {
    return this._category;
  }
  get categoryId(): number {
    return this._categoryId;
  }
  get name(): string {
    return this._name;
  }
  get description(): string {
    return this._description;
  }
  get price(): number {
    return this._price;
  }
  get stock(): number {
    return this._stock;
  }
  get url_img1(): string {
    return this._url_img1;
  }
  get url_img2(): string {
    return this._url_img2;
  }
  get url_img3(): string {
    return this._url_img3;
  }
  get quantity(): number {
    return this._quantity;
  }
  get added_date(): string {
    return this._added_date;
  }


  // Setters
  set id(id: number) {
    this._id = id;
  }
  set brandId(brandId: number) {
    this._brandId = brandId;
  }
  set brand(brand: string) {
    this._brand = brand;
  }
  set categoryId(categoryId: number) {
    this._categoryId = categoryId;
  }
  set category(category: string) {
    this._category = category;
  }
  set name(name: string) {
    this._name = name;
  }
  set description(description: string) {
    this._description = description;
  }
  set price(price: number) {
    this._price = price;
  }
  set stock(stock: number) {
    this._stock = stock;
  }
  set url_img1(url_img1: string) {
    this._url_img1 = url_img1;
  }
  set url_img2(url_img2: string) {
    this._url_img2 = url_img2;
  }
  set url_img3(url_img3: string) {
    this._url_img3 = url_img3;
  }
  set quantity(quantity: number) {
    this._quantity = quantity;
  }
  set added_date(added_date: string) {
    this._added_date = added_date;
  }


  // Convertir objeto a JSON
  toJSON(): any {
    return {
      id: this._id,
      brandId: this._brandId,
      brand: this._brand,
      categoryId: this._categoryId,
      category: this._category,
      name: this._name,
      description: this._description,
      price: this._price,
      stock: this._stock,
      url_img1: this._url_img1,
      url_img2: this._url_img2,
      url_img3: this._url_img3,
      quantity: this._quantity,
      added_date: this._added_date
    };
  }
}
