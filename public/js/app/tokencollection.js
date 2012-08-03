App.TokenCollection = Backbone.Collection.extend({
  model: App.Token,
  
  // Add a new token, saving the time the token was added
  addToken: function(value, expires) {
    this.add({value: value, expires: expires, begin: new Date().getTime()});
  },
});
