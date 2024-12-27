import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddressPageComponent } from './shipping-address-page.component';

describe('ShippingAddressPageComponent', () => {
  let component: ShippingAddressPageComponent;
  let fixture: ComponentFixture<ShippingAddressPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingAddressPageComponent]
    });
    fixture = TestBed.createComponent(ShippingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
