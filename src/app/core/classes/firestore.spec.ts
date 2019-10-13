import { Firestore } from './firestore';

describe('Firestore', () => {
  it('should create an instance', () => {
    expect(new Firestore()).toBeTruthy();
  });
});
