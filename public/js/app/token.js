// Models a Facebook API token
App.Token = Backbone.Model.extend({
  // Set up a timer to notify views when the token's remaining time changes
  initialize: function() {
    this.collection.on('reset', this.clearTimer, this);
    this.timer = setInterval($.proxy(this.onTick, this), 1000);
  },
  
  // Time remaining until this token expires
  remaining: function() {
    var passed = (new Date().getTime() - this.get('begin')) / 1000;
    return this.get('expires') - passed;
  },
  
  // Check whether this token has expired
  expired: function() {
    return this.remaining() <= 0;
  },

  // Called every second. Triggers a 'tick' event and an 'expired' event if
  // the token has expired
  onTick: function() {
    this.trigger('tick');
    if (this.expired()) {
      clearInterval(this.timer)
      this.trigger('expired');
    }
  }
});
