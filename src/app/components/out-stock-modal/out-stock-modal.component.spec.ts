import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutStockModalComponent } from './out-stock-modal.component';

describe('OutStockModalComponent', () => {
  let component: OutStockModalComponent;
  let fixture: ComponentFixture<OutStockModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutStockModalComponent]
    });
    fixture = TestBed.createComponent(OutStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
