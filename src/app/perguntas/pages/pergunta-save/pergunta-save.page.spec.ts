import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntaSavePage } from './pergunta-save.page';

describe('PerguntaSavePage', () => {
  let component: PerguntaSavePage;
  let fixture: ComponentFixture<PerguntaSavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerguntaSavePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerguntaSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
