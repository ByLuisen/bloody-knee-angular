import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteVideosComponent } from './favourite-videos.component';

describe('FavouriteVideosComponent', () => {
  let component: FavouriteVideosComponent;
  let fixture: ComponentFixture<FavouriteVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavouriteVideosComponent]
    });
    fixture = TestBed.createComponent(FavouriteVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
