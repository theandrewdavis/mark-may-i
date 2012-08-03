describe('HelpView', function() {

  var html =
    '<div id="help">' + 
      '<p>Step 1</p>' + 
      '<p style="display:none;">' + 
        'Step 2 <a id="sample">Link</a>' +
      '</p>' +
    '</div>';

  beforeEach(function() {
    this.collection = new Backbone.Collection();
    this.view = new App.HelpView({el: $(html), collection: this.collection});
    $('body').append(this.view.el);
  });
  
  afterEach(function() {
    this.view.remove();
  });

  it('should display step 1 initially', function() {
    expect(this.view.$('p:visible').text()).toEqual('Step 1');
  });

  it('should display step 2 when a token is added', function() {
    this.collection.add({});
    expect(this.view.$('p:visible').text()).toEqual('Step 2 Link');
  });

  it('should display step 1 when the collection is reset', function() {
    this.collection.add({}).reset();
    expect(this.view.$(':visible').text()).toEqual('Step 1');
  });
  
  it('should display add a center tag on step 2', function() {
    expect(this.view.$el).not.toHaveClass('center');
    this.collection.add({});
    expect(this.view.$el).toHaveClass('center');
    this.collection.reset();
    expect(this.view.$el).not.toHaveClass('center');
  });

  it('should change the sample link when a token changes', function() {
    var baseUrl = 'https://graph.facebook.com/me/?access_token=';

    this.collection.add({value: 'ABC'}).reset();
    expect(this.view.$('#sample').attr('href')).toEqual(baseUrl + 'ABC');
    
    this.collection.reset().add({value: 'DEF'});
    expect(this.view.$('#sample').attr('href')).toEqual(baseUrl + 'DEF');
  });
});
