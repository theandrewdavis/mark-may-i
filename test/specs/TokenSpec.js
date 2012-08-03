describe("Token", function() {
  beforeEach(function() {
    this.clock = sinon.useFakeTimers();
    this.collection = new App.TokenCollection();
    this.collection.addToken('ABCDEFG', 120);
    this.token = this.collection.first();
    this.tickListener = sinon.spy();
    this.token.on('tick', this.tickListener);
  });
  
  afterEach(function() {
    this.clock.restore();
  });

  it('calculates time remaining until expiration', function() {
    expect(this.token.remaining()).toEqual(120);
    
    this.clock.tick(60 * 1000);
    expect(this.token.remaining()).toEqual(60);

    this.clock.tick(60 * 1000);
    expect(this.token.remaining()).toEqual(0);
  });

  it('is expired when the expiration time has passed', function() {
    expect(this.token.expired()).toBe(false);

    this.clock.tick(121 * 1000);
    expect(this.token.expired()).toBe(true);
  });

  it('triggers an expired event', function() {
    var expiredListener = sinon.spy();
    this.token.on('expired', expiredListener);
    this.clock.tick(125 * 1000);
    expect(expiredListener).toHaveBeenCalledOnce();
  });
  
  it('sets a timer on creation', function() {
    this.clock.tick(1001);
    expect(this.tickListener).toHaveBeenCalledOnce();
  });
  
  it('clears the timer on expiration', function() {
    this.clock.tick(125 * 1000);
    expect(this.tickListener.callCount).toEqual(120);
  });

  it('clears the timer on collection reset', function() {
    this.clock.tick(10 * 1000);
    this.collection.reset();
    this.clock.tick(10 * 1000);
    expect(this.tickListener.callCount).toEqual(10);
  });

  it('does not error if expired then collection reset', function() {
    this.clock.tick(125 * 1000);
    this.collection.reset();
    expect(this.tickListener.callCount).toEqual(120);
  });
});
