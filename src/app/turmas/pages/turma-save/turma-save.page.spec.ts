import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurmaSavePage } from './turma-save.page';

describe('TurmaSavePage', () => {
  let component: TurmaSavePage;
  let fixture: ComponentFixture<TurmaSavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurmaSavePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurmaSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
