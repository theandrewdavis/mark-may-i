describe('CreateView', function() {

  var html = 
    '<div id="create">' +
      '<button>Create</button>' +
    '</div>';

  beforeEach(function() {
    this.initializeStub = sinon.stub(App.AppView.prototype, 'initialize');
    this.createStub = sinon.stub(App.AppView.prototype, 'create');
    this.app = new App.AppView();
    this.collection = new Backbone.Collection();
    this.view = new App.CreateView({el: $(html), collection: this.collection, app: this.app});
    $('body').append(this.view.el);
  });
  
  afterEach(function() {
    this.view.remove();
    this.initializeStub.restore();
    this.createStub.restore();
  });

  it('is visible and locked upon initialization', function() {
    expect(this.view.$el).toBeVisible();
    expect(this.view.$('button')).toBeDisabled();
  });

  it('unlocks when it gets a "logout" signal', function() {
    this.app.trigger('logout');
    expect(this.view.$('button')).not.toBeDisabled();
  });

  it('hides when a token is created', function() {
    this.collection.add({});
    expect(this.view.$el).toBeHidden();
  });

  it('shows and unlocks when there is no token', function() {
    this.collection.add({}).reset();
    expect(this.view.$el).toBeVisible();
    expect(this.view.$('button')).not.toBeDisabled();
  });

  it('calls "create" when the create button is pressed', function() {
    this.view.$('button').click();
    expect(this.createStub).toHaveBeenCalled();
  });

  it('locks when it gets the "create:begin" signal', function() {
    this.app.trigger('logout');
    this.app.trigger('create:begin');
    expect(this.view.$('button')).toBeDisabled();
  });
  
  it('unlocks if the create action is cancelled', function() {
    this.app.trigger('logout');
    this.app.trigger('create:begin');
    this.app.trigger('logout');
    expect(this.view.$('button')).not.toBeDisabled();
  });
});
