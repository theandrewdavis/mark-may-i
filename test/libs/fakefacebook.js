App.FakeFacebook = function() {}
App.FakeFacebook.prototype = _.extend({
  saved: [],
  
  init: function() {},

  wait: function(time, callback) {
    setTimeout($.proxy(callback, this), time);
  },
  
  getStatus: function() {
    this.wait(1000, function() {
      this.trigger('logout');
    });
  },
  
  login: function(permissions) {
    this.saved = permissions;
    var token = 'AAAEuRjBVH0sBAAOhZAwfvBi74GHKqcIoUfGaMoPCmmTpeYKpAZCxGxRN8xYUCO8uEuUosubKDZA5bpF9KUbvh8RG5e7fLcKMFqu7xOCfwZDZD';
    this.wait(1000, function() {
      this.trigger('login', token, 120);
    });
    this.wait(1500, function() {
      this.trigger('update', permissions);
    });
  },

  revoke: function() {
    this.wait(1000, function() {
      this.trigger('revoke');
    });
  },

  update: function(toAdd, toRemove) {
    this.saved = _.difference(_.union(this.saved, toAdd), toRemove);
    this.wait(1000, function() {
      this.trigger('update', this.saved);
    });
  }
  
}, Backbone.Events);
