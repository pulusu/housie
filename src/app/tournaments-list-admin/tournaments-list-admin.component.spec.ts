import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsListAdminComponent } from './tournaments-list-admin.component';

describe('TournamentsListAdminComponent', () => {
  let component: TournamentsListAdminComponent;
  let fixture: ComponentFixture<TournamentsListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentsListAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentsListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
