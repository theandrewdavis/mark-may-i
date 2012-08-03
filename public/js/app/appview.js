// App's main view. Creates and coordinates subviews
App.AppView = Backbone.View.extend({
  initialize: function(options) {
    this.facebook = options.facebook;
    _.bindAll(this);

    // Initialize subviews
    this.helpView = new App.HelpView({el: this.$('#steps'), collection: this.collection});
    this.createView = new App.CreateView({el: this.$('#create'), app: this, collection: this.collection});
    this.permissionView = new App.PermissionView({el: this.$('.permissions'), app: this, collection: this.collection});
    this.tokenView = new App.TokenView({el: this.$('#token'), app: this, collection: this.collection});
    
    // Setup facebook callbacks and get the user's login status
    this.facebook.on('login', this.onLogin, this);
    this.facebook.on('logout', this.onLogout, this);
    this.facebook.on('update', this.onUpdate, this);
    this.facebook.on('revoke', this.onRevoke, this);
    this.facebook.init();
    this.facebook.getStatus();
  },
  
  // Create a new token with the requested permissions
  create: function() {
    this.trigger('create:begin');
    this.facebook.login(this.permissionView.permissions());
  },
  
  // Remove all permissions from a token
  revoke: function() {
    this.trigger('revoke:begin');
    this.facebook.revoke();
  },

  // Update a token's permissions
  update: function() {
    this.trigger('update:begin');
    this.facebook.update(this.permissionView.added(), this.permissionView.removed());
  },

  // Checks if requested permissions differ from the saved token
  changed: function() {
    return this.permissionView.changed();
  },
  
  // Logged-in callback
  onLogin: function(value, expires) {
    this.collection.addToken(value, expires);
  },

  // Not-logged-in callback
  onLogout: function() {
    this.trigger('logout');
  },

  // Token revoke callback
  onRevoke: function() {
    this.collection.reset();
  },
  
  // Permission change callback. Always fire a change event so that
  // the PermissionView is still accurate when permissions are denied
  onUpdate: function(permissions) {
    this.collection.first().set({permissions: permissions}, {silent: true});
    this.collection.trigger('change');
  }
});
