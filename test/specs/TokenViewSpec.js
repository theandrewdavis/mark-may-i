describe('TokenView', function() {

  var html = 
    '<div id="token" style="display:none;">' +
      '<div id="time"></div>' +
      '<input id="value">' +
      '<button id="revoke">Revoke</button>' +
      '<button id="update">Update</button>' +
    '</div>';
  
  var AppViewFake = function() { this.initialize(); };
  AppViewFake.prototype = _.extend({
    initialize: function() {
      this.isChanged = false;
      _.bindAll(this);
    },
    revoke: function() {
      this.trigger('revoke:begin');
    },
    update: function() {
      this.trigger('update:begin');
    },
    changed: function() {
      return this.isChanged;
    },
    change: function() {
      this.isChanged = true;
      this.trigger('request:change');
    },
    unchange: function() {
      this.isChanged = false;
      this.trigger('request:change');
    }
  }, Backbone.Events);
  
  beforeEach(function() {
    this.app = new AppViewFake();
    this.collection = new App.TokenCollection();
    this.view = new App.TokenView({el: $(html), app: this.app, collection: this.collection});
  });
  
  describe('(when there is no token)', function() {
    it('is hidden', function() {
      $('body').append(this.view.el);

      expect(this.view.el).toBeHidden();
      this.collection.addToken('ABC', 120);
      expect(this.view.el).toBeVisible();
      this.collection.reset();
      expect(this.view.el).toBeHidden();

      this.view.remove();
    });
  });

  describe('(when there is a token but no permissions yet)', function() {
    beforeEach(function() {
      this.clock = sinon.useFakeTimers();
      this.collection.addToken('ABC', 120);
    });

    afterEach(function() {
      this.clock.restore();
    });
    
    it('is locked', function() {
      expect(this.view.$('button')).toBeDisabled();
    });

    it('shows token value', function() {
      expect(this.view.$('#value').val()).toEqual('ABC');
    });

    it('shows time remaining', function() {
      expect(this.view.$('#time').text()).toEqual('2m');
    });
    
    it('updates time remaining as time passes', function() {
      expect(this.view.$('#time').text()).toEqual('2m');
      this.clock.tick(60 * 1000);
      expect(this.view.$('#time').text()).toEqual('1m');
    });

    it('formats seconds into easily readable time', function() {
      expect(this.view.formatTime(-1.5)).toEqual('0s');
      expect(this.view.formatTime(0)).toEqual('0s');
      expect(this.view.formatTime(30)).toEqual('30s');
      expect(this.view.formatTime(60.5)).toEqual('1m');
      expect(this.view.formatTime(60 * 59)).toEqual('59m');
      expect(this.view.formatTime(60 * 60 - 15)).toEqual('1h');
      expect(this.view.formatTime(60 * 60)).toEqual('1h');
      expect(this.view.formatTime(60 * 60 * 24 - 60 * 15)).toEqual('1d');
      expect(this.view.formatTime(60 * 60 * 24)).toEqual('1d');
      expect(this.view.formatTime(60 * 60 * 24 * 79 - 60 * 60 * 11)).toEqual('79d');
    });
  });

  describe('(when permissions are unchanged)', function() {
    beforeEach(function() {
      this.collection.addToken('ABC', 120);
      this.collection.first().set({permissions: ['One']})
    });
    
    it('unlocks the revoke button', function() {
      expect(this.view.$('#revoke')).not.toBeDisabled();
    });
  
    it('keeps the update button locked', function() {
      expect(this.view.$('#update')).toBeDisabled();
    });
    
    it('locks when revoke is clicked', function() {
      this.view.$('#revoke').click();
      expect(this.view.$('#revoke, #update')).toBeDisabled();
    });
  });
  
  describe('(when permissions are changed)', function() {
    beforeEach(function() {
      this.collection.addToken('ABC', 120);
      this.collection.first().set({permissions: ['One']});
      this.app.change();
    });
    
    it('unlocks the update button', function() {
      expect(this.view.$('#update')).not.toBeDisabled();
    });

    it('locks the update button again when change is undone', function() {
      this.app.unchange();
      expect(this.view.$('#update')).toBeDisabled();
    });
    
    it('keeps update locked if changed while revoking', function() {
      this.view.$('#revoke').click();
      this.app.change();
      expect(this.view.$('#update')).toBeDisabled();
    });
  });

  describe('(when token is expired)', function() {
    beforeEach(function() {
      this.clock = sinon.useFakeTimers();
      this.collection.addToken('ABC', 120);
      this.collection.first().set({permissions: ['One']});
      this.clock.tick(121 * 1000);
    });

    afterEach(function() {
      this.clock.restore();
    });

    it('changes the time remaining display', function() {
      expect(this.view.$('#time')).toHaveClass('expired');
    });

    it('unlocks update', function() {
      expect(this.view.$('#update')).not.toBeDisabled();
    });
    
    it('keeps update unlocked regarless of change', function() {
      this.app.change();
      expect(this.view.$('#update')).not.toBeDisabled();
      this.app.unchange();
      expect(this.view.$('#update')).not.toBeDisabled();
    });
  });
});
