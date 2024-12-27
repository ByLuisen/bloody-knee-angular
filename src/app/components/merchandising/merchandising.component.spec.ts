import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandisingComponent } from './merchandising.component';

describe('MerchandisingComponent', () => {
  let component: MerchandisingComponent;
  let fixture: ComponentFixture<MerchandisingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MerchandisingComponent]
    });
    fixture = TestBed.createComponent(MerchandisingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
