const sayHi = () => "Hi";

describe('sayHi', () => {
  it('default', () => {
    expect(sayHi()).toBe('Hi');
  });
});
