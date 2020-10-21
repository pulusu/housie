import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsEditAdminComponent } from './tournaments-edit-admin.component';

describe('TournamentsEditAdminComponent', () => {
  let component: TournamentsEditAdminComponent;
  let fixture: ComponentFixture<TournamentsEditAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentsEditAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentsEditAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
