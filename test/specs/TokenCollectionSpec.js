describe("TokenCollection", function() {
  beforeEach(function() {
    this.collection = new App.TokenCollection();
  });
  
  it('can create a Token', function() {
    expect(this.collection.isEmpty()).toBe(true);
    this.collection.addToken('ABCDEFG', 120);
    expect(this.collection.isEmpty()).toBe(false);
  });
  
  it('creates a token with value, expires, and begin set', function() {
    this.collection.addToken('ABCDEFG', 120);
    expect(this.collection.first().has('value')).toBe(true);
    expect(this.collection.first().has('expires')).toBe(true);
    expect(this.collection.first().has('begin')).toBe(true);
  });
});
