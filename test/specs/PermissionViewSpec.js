describe('PermissionView', function() {

  var html = 
    '<div id="permissions">' +
      '<li><label><input id="one" type="checkbox" />One</label></li>' +
      '<li><label><input id="two" type="checkbox" />Two</label></li>' +
      '<li><label><input id="three" type="checkbox" />Three</label></li>' +
    '</div>';

  beforeEach(function() {
    this.initializeStub = sinon.stub(App.AppView.prototype, 'initialize');
    this.app = new App.AppView();
    this.collection = new Backbone.Collection();
    this.view = new App.PermissionView({el: $(html), collection: this.collection, app: this.app});
  });
  
  afterEach(function() {
    this.initializeStub.restore();
  });

  it('gets all checked permissions on #permissions', function() {
    this.view.$('#one, #three').attr('checked', true);
    expect(this.view.permissions()).toEqual(['One', 'Three']);
  });

  it('gets the saved permissions on #saved', function() {
    expect(this.view.saved()).toEqual([]);
    this.collection.add({permissions: ['Two']});
    expect(this.view.saved()).toEqual(['Two']);
  });

  it('gets newly added permissions on #added', function() {
    this.collection.add({permissions: ['Two']});
    this.view.$('#one, #three').attr('checked', true);
    expect(this.view.added()).toEqual(['One', 'Three']);
  });

  it('gets newly removed permissions on #removed', function() {
    this.collection.add({permissions: ['Two']});
    this.view.$('#two').attr('checked', false);
    expect(this.view.removed()).toEqual(['Two']);
  });

  it('gets whether the selection matches saved permissions on #changed', function() {
    this.collection.add({permissions: ['Two']});
    this.view.$('#two').attr('checked', true);
    expect(this.view.changed()).toBe(false);

    this.view.$('#two').attr('checked', false);
    expect(this.view.changed()).toBe(true);

    this.view.$('#two').attr('checked', true);
    expect(this.view.changed()).toBe(false);
  });

  it('is locked on initialization', function() {
    expect(this.view.$('input')).toBeDisabled();
  });

  it('unlocks when it gets a "logout" signal', function() {
    this.app.trigger('logout');
    expect(this.view.$('input')).not.toBeDisabled();
  });
  
  it('locks when it gets a "update:begin" signal', function() {
    this.app.trigger('logout');
    this.app.trigger('update:begin');
    expect(this.view.$('input')).toBeDisabled();
  });
  
  it('sets checkboxes when the collection updates', function() {
    this.collection.add({});
    this.collection.first().set({permissions: ['One', 'Two']});
    expect(this.view.$("#one, #two")).toBeChecked();
    expect(this.view.$("#three")).not.toBeChecked();
  });

  it('clears all checkboxes when the collection resets', function() {
    this.collection.add({});
    this.collection.first().set({permissions: ['One', 'Two']});
    this.collection.reset();
    expect(this.view.$("#one, #two, #three")).not.toBeChecked();
  });

  it('triggers "request:change" when a button is toggled', function() {
    this.app.trigger('logout');
    var triggerSpy = sinon.spy(this.app, 'trigger');
    this.view.$('#one').attr('checked', true).change();
    expect(triggerSpy).toHaveBeenCalledWith('request:change');
    triggerSpy.restore();
  });

  it('marks each selection as added when there is no token', function() {
    this.app.trigger('logout');
    this.view.$('#two').attr('checked', true).change();
    expect(this.view.$('#two').parent()).toHaveClass('added');

    this.view.$('#two').attr('checked', false).change();
    expect(this.view.$('#two').parent()).not.toHaveClass('added');
    expect(this.view.$('#two').parent()).not.toHaveClass('removed');
  });

  it('sets added selections to neither when token is added', function() {
    this.view.$('#one').attr('checked', false).change();
    this.collection.add({}).first().set({permissions: ['One']});
    expect(this.view.$('#one').parent()).not.toHaveClass('added');
    expect(this.view.$('#one').parent()).not.toHaveClass('removed');
  });

  it('sets selections to added or removed when there is a token', function() {
    this.collection.add({}).first().set({permissions: ['One']});
    this.view.$('#one').attr('checked', false).change();
    this.view.$('#two').attr('checked', true).change();
    expect(this.view.$('#one').parent()).toHaveClass('removed');
    expect(this.view.$('#two').parent()).toHaveClass('added');
  });

  it('clears all added or removed when the token is reset', function() {
    this.collection.add({}).first().set({permissions: ['One']});
    this.view.$('#one').attr('checked', false).change();
    this.view.$('#two').attr('checked', true).change();
    this.collection.reset();
    expect(this.view.$('#one').parent()).not.toHaveClass('removed');
    expect(this.view.$('#one').parent()).not.toHaveClass('added');
    expect(this.view.$('#two').parent()).not.toHaveClass('removed');
    expect(this.view.$('#two').parent()).not.toHaveClass('added');
  });
});
