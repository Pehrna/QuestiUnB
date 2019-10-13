import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurmaLoginPage } from './turma-login.page';

describe('TurmaLoginPage', () => {
  let component: TurmaLoginPage;
  let fixture: ComponentFixture<TurmaLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurmaLoginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurmaLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
