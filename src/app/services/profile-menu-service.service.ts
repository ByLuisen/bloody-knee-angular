import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileMenuService {
  private selectedOptionSubject: BehaviorSubject<string> = new BehaviorSubject<string>('editProfile');
  selectedOptionService: Observable<string> = this.selectedOptionSubject.asObservable();

  constructor() { }

  updateSelectedOption(option: string) {
    this.selectedOptionSubject.next(option);
  }
}
