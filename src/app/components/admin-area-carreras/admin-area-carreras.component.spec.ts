import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAreaCarrerasComponent } from './admin-area-carreras.component';

describe('AdminAreaCarrerasComponent', () => {
  let component: AdminAreaCarrerasComponent;
  let fixture: ComponentFixture<AdminAreaCarrerasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAreaCarrerasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAreaCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
