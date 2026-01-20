import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentComp } from './student';

describe('StudentComp', () => {
  let component: StudentComp;
  let fixture: ComponentFixture<StudentComp>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
