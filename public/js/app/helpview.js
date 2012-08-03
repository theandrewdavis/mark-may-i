// Displays the help bar, which changes based on app state
App.HelpView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('add change', this.updateLink, this);
    this.collection.on('add reset', this.toggle, this);
  },
  
  // Switch between the "Step 1" and "Step 2" help paragraphs and add the
  // center tag to the "Step 2" paragraph. When the view is initialized,
  // "Step 2" is hidden and the center tag is not applied.
  toggle: function() {
    this.$('p').toggle();
    this.$el.toggleClass('center');
  },

  // Update the sample Facebook API link to use the user's current token.
  updateLink: function() {
    var token = this.collection.first().get('value');
    var baseUrl = 'https://graph.facebook.com/me/?access_token=';
    this.$('#sample').attr('href', baseUrl + token);
  }
});
