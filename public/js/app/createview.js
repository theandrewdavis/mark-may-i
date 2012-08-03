// Displays a "Create New Token" button
App.CreateView = Backbone.View.extend({
  initialize: function(options) {
    this.lock();
    this.collection.on('reset', this.show, this);
    this.collection.on('add', this.hide, this);
    options.app.on('logout', this.unlock, this);
    options.app.on('create:begin', this.lock, this);
    this.$('button').click(options.app.create);
  },

  // Show this view
  show: function() {
    this.unlock();
    this.$el.show();
  },

  // Hide this view
  hide: function() {
    this.$el.hide();
  },
  
  // Disable this view's button
  lock: function() {
    this.$('button').attr('disabled', true);
  },
  
  // Enable this view's button
  unlock: function() {
    this.$('button').attr('disabled', false);
  },
});
