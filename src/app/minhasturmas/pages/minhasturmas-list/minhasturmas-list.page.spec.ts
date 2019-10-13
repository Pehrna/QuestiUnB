import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasturmasListPage } from './minhasturmas-list.page';

describe('MinhasturmasListPage', () => {
  let component: MinhasturmasListPage;
  let fixture: ComponentFixture<MinhasturmasListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinhasturmasListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhasturmasListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
