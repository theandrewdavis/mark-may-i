// Displays the token's value, its remaining time, and
// revoke and update buttons
App.TokenView = Backbone.View.extend({
  initialize: function(options) {
    this.app = options.app;
    this.collection.on('add', this.add, this);
    this.collection.on('change', this.unlock, this);
    this.collection.on('reset', this.hide, this);
    this.app.on('revoke:begin update:begin', this.lock, this);
    this.app.on('request:change', this.checkForUpdateLock, this);
    this.$('#revoke').click(options.app.revoke);
    this.$('#update').click(options.app.update);
    this.$('#value').click($.proxy(this.selectValue, this));
    this.lock();
  },

  // Display a token when it is added
  add: function() {
    var token = this.collection.first();
    token.on('tick', this.updateTime, this);
    token.on('expired', this.checkForUpdateLock, this);
    
    this.$('#value').val(token.get('value'));
    this.updateTime();
    this.$el.show();
  },
  
  // Select the token value on click for easy copying
  selectValue: function() {
    this.$('#value').focus().select();
  },

  // Hide this view
  hide: function() {
    this.$el.hide();
  },
  
  // Disable the buttons in this view
  lock: function() {
    this.$('button').attr('disabled', true);
  },

  // Enable the buttons in this view
  unlock: function() {
    this.$('button').attr('disabled', false);
    this.checkForUpdateLock();
  },

  // Enable or disable the update button based on whether the view is locked,
  // the token is expired, and the requested permissions have changed
  checkForUpdateLock: function() {
    if (this.collection.isEmpty()) {
      return;
    }
    var revokeLocked = this.$('#revoke').is(':disabled');
    var expired = this.collection.first().expired();
    var changed = this.app.changed();
    var allowUpdate = (changed || expired) && !revokeLocked;
    this.$('#update').attr('disabled', !allowUpdate);
  },
  
  // Update the display of the remaining time. Color the display red if the
  // token is expired
  updateTime: function() {
    var token = this.collection.first();
    this.$('#time').html(this.formatTime(token.remaining()));
    this.$('#time').toggleClass('expired', token.expired());
  },
  
  // Format the remaining time, originally in seconds, to display in seconds,
  // minutes, hours, or days.
  formatTime: function(time) {
    if (time <= 0) {
      return '0s';
    } else if (time < 60) {
      return Math.round(time) + 's';
    } else if (time < 60 * 59.5) {
      return Math.round(time / 60) + 'm';
    } else if (time < 60 * 60 * 23.5) {
      return Math.round(time / 60 / 60) + 'h'
    } else {
      return Math.round(time / 60 / 60 / 24) + 'd';
    }
  }
});
