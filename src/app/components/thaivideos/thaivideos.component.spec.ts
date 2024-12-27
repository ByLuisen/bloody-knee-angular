import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThaivideosComponent } from './thaivideos.component';

describe('ThaivideosComponent', () => {
  let component: ThaivideosComponent;
  let fixture: ComponentFixture<ThaivideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThaivideosComponent]
    });
    fixture = TestBed.createComponent(ThaivideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
