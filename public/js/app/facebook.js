// Handles communication with the Facebook API
App.Facebook = function(appId) {
  this.appId = appId;
}
App.Facebook.prototype = _.extend({
  // Initialize application with application id
  init: function() {
    FB.init({appId: this.appId, status: true, cookie: false, xfbml: false, oauth: true});
  },

  // Fire login/logout events when the user asks to login or for the current
  // login status. Check permissions if logged in, otherwise they are empty.
  onStatusChange: function(response) {
    if (response.status === 'connected') {
      this.trigger('login', response.authResponse.accessToken, response.authResponse.expiresIn);
      this.checkPermissions();
    } else {
      this.trigger('logout');
    }
  },
  
  // Check if the user has authorized this app
  getStatus: function() {
    FB.getLoginStatus($.proxy(this.onStatusChange, this));
  },
  
  // Ask the user to authorize this app with the given permissions. This will
  // cause a Facebook authentication popup.
  login: function(permissions) {
    FB.login($.proxy(this.onStatusChange, this), {scope: permissions.join(',')});
  },
  
  // Ask the API what permissions are granted to this app
  checkPermissions: function() {
    FB.api('me/permissions', $.proxy(function(response) {
      this.trigger('update', this.formatPermissions(response));
    }, this));
  },

  // Format permission JSON object as an array. Remove the 'installed'
  // permission (which just means the app is authorized) because the user
  // cannot request this permission.
  formatPermissions: function(response) {
    var all = _.keys(response.data[0]);
    return _.without(all, 'installed');
  },
  
  // Revoke all permissions but do not log the user out of Facebook. Must
  // communicate with the API again (the second permissions call) to
  // avoid a bug that prevents login being called immediately after revoke.
  revoke: function() {
    FB.api('me/permissions', 'delete', $.proxy(function(response) {
      FB.api('me/permissions', $.proxy(function(response) {
        this.trigger('revoke');
      }, this));
    }, this));
  },

  // Remove given permissions. The API allows revoking only one permission
  // per call, so each callback checks if all others are done. Finally, the
  // permissions are checked which alerts the user of the permission change.
  removePermissions: function(permissions) {
    var remaining = permissions;
    _(permissions).each(function(permission) {
      FB.api('/me/permissions/' + permission, 'delete', $.proxy(function(response) {
        remaining = _(remaining).without(permission);
        if (remaining.length === 0) {
          this.checkPermissions();
        }
      }, this));
    }, this);
  },
  
  // Update the permissions granted to the app. This will cause a Facebook
  // authentication popup if new permissions are requested.
  update: function(toAdd, toRemove) {
    FB.login($.proxy(function(response) {
      if (_.isEmpty(toRemove)) {
        this.checkPermissions();
      } else {
        this.removePermissions(toRemove);
      }
    }, this), {scope: toAdd.join(',')});
  }
  
}, Backbone.Events);
