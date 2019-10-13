import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicoSavePage } from './topico-save.page';

describe('TopicoSavePage', () => {
  let component: TopicoSavePage;
  let fixture: ComponentFixture<TopicoSavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicoSavePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicoSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
