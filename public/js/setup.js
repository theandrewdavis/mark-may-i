// Initialize the app's main view when DOM is ready
$(function() {
  var tokens = new App.TokenCollection();
  var facebook = new App.Facebook('332353970184011');
  new App.AppView({el: $('#app'), facebook: facebook, collection: tokens});
});
