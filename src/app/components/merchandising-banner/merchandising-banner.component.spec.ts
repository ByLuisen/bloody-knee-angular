import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandisingBannerComponent } from './merchandising-banner.component';

describe('MerchandisingBannerComponent', () => {
  let component: MerchandisingBannerComponent;
  let fixture: ComponentFixture<MerchandisingBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MerchandisingBannerComponent]
    });
    fixture = TestBed.createComponent(MerchandisingBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
