import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTypeDisplayComponent } from './file-type-display.component';

describe('FileTypeDisplayComponent', () => {
  let component: FileTypeDisplayComponent;
  let fixture: ComponentFixture<FileTypeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTypeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTypeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
