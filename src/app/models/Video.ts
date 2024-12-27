export class Video {
  #id: number;
  #type_id: number;
  #modality_id: number;
  #title: string;
  #coach: string;
  #description: string;
  #url: string;
  #visits: number;
  #comments: number;
  #likes: number;
  #dislikes: number;
  #upload_date: Date;
  #duration: string;
  #exclusive: boolean;

  constructor(
    id: number = 0,
    type_id: number = 0,
    modality_id: number = 0,
    title: string = '',
    coach: string = '',
    description: string = '',
    url: string = '',
    visits: number = 0,
    comments: number = 0,
    likes: number = 0,
    dislikes: number = 0,
    upload_date: Date = new Date(),
    duration: string = '',
    exclusive: boolean = false
  ) {
    this.#id = id;
    this.#type_id = type_id;
    this.#modality_id = modality_id;
    this.#title = title;
    this.#coach = coach;
    this.#description = description;
    this.#url = url;
    this.#visits = visits;
    this.#comments=comments;
    this.#likes = likes;
    this.#dislikes = dislikes;
    this.#upload_date = upload_date;
    this.#duration = duration;
    this.#exclusive = exclusive;
  }

  // Getters
  get id(): number {
    return this.#id;
  }
  get typeId(): number {
    return this.#type_id;
  }
  get modality_id(): number {
    return this.#modality_id;
  }
  get title(): string {
    return this.#title;
  }
  get coach(): string {
    return this.#coach;
  }
  get description(): string {
    return this.#description;
  }
  get url(): string {
    return this.#url;
  }
  get visits(): number {
    return this.#visits;
  }
  get comments(): number{
    return this.#comments;
  }
  get likes(): number {
    return this.#likes;
  }
  get dislikes(): number {
    return this.#dislikes;
  }
  get uploadDate(): Date {
    return this.#upload_date;
  }
  get duration(): string {
    return this.#duration;
  }
  get exclusive(): boolean {
    return this.#exclusive;
  }

  // Setters
  set id(id: number) {
    this.#id = id;
  }
  set typeId(type_id: number) {
    this.#type_id = type_id;
  }
  set modality_id(modality_id: number) {
    this.#modality_id = modality_id;
  }
  set title(title: string) {
    this.#title = title;
  }
  set coach(coach: string) {
    this.#coach = coach;
  }
  set description(description: string) {
    this.#description = description;
  }
  set url(url: string) {
    this.#url = url;
  }
  set visits(visits: number) {
    this.#visits = visits;
  }
  set comments(comments: number){
    this.#comments= comments;
  }
  set likes(likes: number) {
    this.#likes = likes;
  }
  set dislikes(dislikes: number) {
    this.#dislikes = dislikes;
  }
  set uploadDate(upload_date: Date) {
    this.#upload_date = upload_date;
  }
  set duration(duration: string) {
    this.#duration = duration;
  }
  set exclusive(exclusive: boolean) {
    this.#exclusive = exclusive;
  }

  // Convertir objeto a JSON
  toJSON(): any {
    return {
      id: this.#id,
      type_id: this.#type_id,
      modality_id: this.#modality_id,
      title: this.#title,
      coach: this.#coach,
      description: this.#description,
      url: this.#url,
      visits: this.#visits,
      likes: this.#likes,
      dislikes: this.#dislikes,
      upload_date: this.#upload_date.toISOString(), // Convertir fecha a formato ISO
      duration: this.#duration,
      exclusive: this.#exclusive,
    };
  }
}
