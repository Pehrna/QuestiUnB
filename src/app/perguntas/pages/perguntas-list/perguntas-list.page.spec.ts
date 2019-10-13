import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntasListPage } from './perguntas-list.page';

describe('PerguntasListPage', () => {
  let component: PerguntasListPage;
  let fixture: ComponentFixture<PerguntasListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerguntasListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerguntasListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
