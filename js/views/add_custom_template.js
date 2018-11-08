/*** AddCustom ***/
var AddCustomTemplate = Backbone.View.extend({
  template: Handlebars.compile($("#add-custom-view-template").html()),

  bindings: {
    '[name=idSlug]': 'idSlug',
  },

  events: {
    'click button.send': 'getTemplateFromApi'
  },

  initialize: function() {
    this.model = new RequestForTemplate({});
    this.listenTo(this.model, 'change:idSlug', this.idSlugUpdate);
    this.render();
  },

  getTemplateFromApi: function() {
    var self = this;

    if (PocketReporter.topics.get(this.model.get('idSlug'))) {
      return self.setState('exists')
    }

    PocketReporter.addCustomTemplateFromApi(
      [this.model.get('idSlug')],
      function(response) {
        if (response) {
          return self.setState(response);
        }
      }
    )

    this.setState('loading');
  },

  idSlugUpdate: function(value) {
    this.model.set('idSlug', value.get('idSlug'));
  },

  setState: function(state) {
    this.model.clear();
    this.model.set(state, true);
    this.model.set('idSlug', '');
    this.render();
  },

  render: function() {
    this.$el.html(this.template({
      loading: this.model.get('loading'),
      error: this.model.get('error'),
      success: this.model.get('success'),
      exists: this.model.get('exists'),
      notExist: this.model.get('notExist'),
    }));
    this.stickit();

    return this;
  }
});
