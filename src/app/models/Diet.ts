export class Diet {
    private _id: number;
    private _title: string;
    private _description: string;
    private _content: string;
    private _author: string;
  
    constructor(
      id: number = 0,
      title: string = '',
      description: string = '',
      content: string = '',
      author: string = '',
    ) {
      this._id = id;
      this._title = title;
      this._description = description;
      this._content = content;
      this._author = author;
  
    }
  
    // Getters
    get id(): number {
      return this._id;
    }
    get title(): string {
      return this._title;
    }
    get description(): string {
      return this._description;
    }
    get content(): string {
      return this._content;
    }
    get author(): string {
      return this._author;
    }

  
    // Setters
    set id(id: number) {
      this._id = id;
    }
    set title(title: string) {
      this._title = title;
    }
    set description(description: string) {
      this._description = description;
    }
    set content(content: string) {
      this._content = content;
    }
    set author(author: string) {
      this._author = author;
    }
 
  
    // Convertir objeto a JSON
    toJSON(): any {
      return {
        id: this._id,
        title: this._title,
        description: this._description,
        content: this._content,
        author: this._author,
      };
    }
  }
  