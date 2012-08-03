// Manages list of checkboxes allowing the user to request permissions.
App.PermissionView = Backbone.View.extend({
  initialize: function(options) {
    this.lock();
    this.app = options.app;
    this.collection.on('change reset', this.update, this);
    this.collection.on('change', this.unlock, this);
    this.app.on('logout', this.unlock, this);
    this.app.on('update:begin', this.lock, this);
    this.$('input').change($.proxy(this.toggle, this));
  },

  // Update the view based on the permissions saved in the current token.
  update: function() {
    this.$('input').attr('checked', false);
    this.$('label').removeClass('added removed');
    _(this.saved()).each(function(name) {
      this.$('label:contains("' + name + '") input').attr('checked', true);
    }, this);
  },
  
  // Change a permission's label text to red/blue to indicate whether it
  // will be added or removed on an update.
  toggle: function(event) {
    this.app.trigger('request:change');
    var label = $(event.currentTarget).parent();
    var isSaved = _.include(this.saved(), label.text());
    var isRequested = $(event.currentTarget).is(':checked');
    label.toggleClass('added', isRequested && !isSaved);
    label.toggleClass('removed', isSaved && !isRequested);
  },
  
  // Disable the checkboxes in this view
  lock: function() {
    this.$('input').attr('disabled', true);
  },
  
  // Enable the checkboxes in this view
  unlock: function() {
    this.$('input').attr('disabled', false);
  },
  
  // Get the labels of the checked permissions requested by the user
  permissions: function() {
    return _.map(this.$('input:checked'), function(input) {
      return $(input).parent().text();
    });
  },

  // Get the permissions saved in the current token or an empty array if
  // there is no token.
  saved: function() {
    var token = this.collection.first();
    return token ? token.get('permissions') : [];
  },

  // Get the permissions that the user has asked to add
  added: function() {
    return _.difference(this.permissions(), this.saved());
  },

  // Get the permissions that the user has asked to remove
  removed: function() {
    return _.difference(this.saved(), this.permissions());
  },
  
  // Check whether the user has asked to add or remove permissions
  changed: function() {
    return this.added().length != 0 || this.removed().length != 0;
  },
});
