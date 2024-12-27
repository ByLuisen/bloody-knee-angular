import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessvideoComponent } from './fitnessvideo.component';

describe('FitnessvideoComponent', () => {
  let component: FitnessvideoComponent;
  let fixture: ComponentFixture<FitnessvideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FitnessvideoComponent]
    });
    fixture = TestBed.createComponent(FitnessvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
