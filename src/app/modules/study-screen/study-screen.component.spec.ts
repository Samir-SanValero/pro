import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudyScreenComponent } from './study-screen.component';

describe('StudyScreenComponent', () => {
  let component: StudyScreenComponent;
  let fixture: ComponentFixture<StudyScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
