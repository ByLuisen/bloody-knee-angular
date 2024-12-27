import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMovileComponent } from './menu-movile.component';

describe('MenuMovileComponent', () => {
  let component: MenuMovileComponent;
  let fixture: ComponentFixture<MenuMovileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuMovileComponent]
    });
    fixture = TestBed.createComponent(MenuMovileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
