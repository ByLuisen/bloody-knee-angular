import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxingvideosComponent } from './boxingvideos.component';

describe('BoxingvideosComponent', () => {
  let component: BoxingvideosComponent;
  let fixture: ComponentFixture<BoxingvideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoxingvideosComponent]
    });
    fixture = TestBed.createComponent(BoxingvideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
