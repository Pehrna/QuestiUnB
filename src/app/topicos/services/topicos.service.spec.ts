import { TestBed } from '@angular/core/testing';

import { TopicosService } from './topicos.service';

describe('TopicosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopicosService = TestBed.get(TopicosService);
    expect(service).toBeTruthy();
  });
});
