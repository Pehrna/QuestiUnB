import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurmasListPage } from './turmas-list.page';

describe('TurmasListPage', () => {
  let component: TurmasListPage;
  let fixture: ComponentFixture<TurmasListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurmasListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurmasListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
