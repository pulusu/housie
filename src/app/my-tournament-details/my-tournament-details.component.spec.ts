import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTournamentDetailsComponent } from './my-tournament-details.component';

describe('MyTournamentDetailsComponent', () => {
  let component: MyTournamentDetailsComponent;
  let fixture: ComponentFixture<MyTournamentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTournamentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTournamentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
