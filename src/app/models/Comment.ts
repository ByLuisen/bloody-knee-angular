import { User } from "./User";

export class Comment {
    #id: number;
    #userId: number;
    #videoId: number;
    #date: Date;
    #comment: string;
    #createdAt: Date;
    #updatedAt: Date;
    #user: User;

    constructor(
      id: number = 0,
      userId: number = 0,
      videoId: number = 0,
      date: Date = new Date(),
      comment: string = '',
      createdAt: Date = new Date(),
      updatedAt: Date = new Date(),
      user: User = new User() // Establece un usuario por defecto
    ) {
      this.#id = id;
      this.#userId = userId;
      this.#videoId = videoId;
      this.#date = date;
      this.#comment = comment;
      this.#createdAt = createdAt;
      this.#updatedAt = updatedAt;
      this.#user = user;
    }

    // Getters
    get id(): number {
      return this.#id;
    }
    get userId(): number {
      return this.#userId;
    }
    get videoId(): number {
      return this.#videoId;
    }
    get date(): Date {
      return this.#date;
    }
    get comment(): string {
      return this.#comment;
    }
    get createdAt(): Date {
      return this.#createdAt;
    }
    get updatedAt(): Date {
      return this.#updatedAt;
    }
    get user(): User {
      return this.#user;
    }

    // Setters
    set id(id: number) {
      this.#id = id;
    }
    set userId(userId: number) {
      this.#userId = userId;
    }
    set videoId(videoId: number) {
      this.#videoId = videoId;
    }
    set date(date: Date) {
      this.#date = date;
    }
    set comment(comment: string) {
      this.#comment = comment;
    }
    set createdAt(createdAt: Date) {
      this.#createdAt = createdAt;
    }
    set updatedAt(updatedAt: Date) {
      this.#updatedAt = updatedAt;
    }
    set user(user: User) {
      this.#user = user;
    }

    // Convertir objeto a JSON
    toJSON(): any {
      return {
        id: this.#id,
        userId: this.#userId,
        videoId: this.#videoId,
        date: this.#date.toISOString(), // Convertir fecha a formato ISO
        comment: this.#comment,
        createdAt: this.#createdAt.toISOString(), // Convertir fecha a formato ISO
        updatedAt: this.#updatedAt.toISOString(), // Convertir fecha a formato ISO
        user: this.#user.toJSON() // Convertir el usuario a formato JSON
      };
    }
  }
