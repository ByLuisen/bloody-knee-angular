import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOrdersComponent } from './profile-orders.component';

describe('ProfileOrdersComponent', () => {
  let component: ProfileOrdersComponent;
  let fixture: ComponentFixture<ProfileOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileOrdersComponent]
    });
    fixture = TestBed.createComponent(ProfileOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
