import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSocialComponent } from './nav-social.component';

describe('NavSocialComponent', () => {
  let component: NavSocialComponent;
  let fixture: ComponentFixture<NavSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavSocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
