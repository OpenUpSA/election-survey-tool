/*** AddStoryView ***/
var AddStoryView = Backbone.View.extend({
  className: "add-story-view",
  template: Handlebars.compile($("#add-story-view-template").html()),
  navTab: 'add',

  bindings: {
    '[name=title]': 'title'
  },

  events: {
    'click button.next': 'create'
  },

  initialize: function(options) {
    var surveys = sessionStorage.getItem('surveys');
    surveys = JSON.parse(surveys);
    
    this.categoryId = options.category;
    this.topic = options.topic;

    if (options.category && options.topic) {
      this.model = new Story({}, {parse: true});
      this.model.set('topic', options.topic);

    } else if (options.category) {
      this.model = ElectionSurveyTool.categoriesList.get(options.category);

    } else {
      this.model = ElectionSurveyTool.categoriesList;
    }

    this.render();

    this.listenTo(this.model, 'change', this.checkOk);
    this.listenTo(ElectionSurveyTool.state, 'change:locale', this.render);
  },

  render: function() {
    var props = {
      categoriesList: null,
      topicsList: null,
      topic: null,
      categoryId: this.categoryId,
    }

    function getActiveTopics(model) {
      var activeTopics = _.map(model.get('topics'), function(id) { return ElectionSurveyTool.topics.get(id).toJSON(); });

      activeTopics.forEach(function(item) {
        if (!item.custom) {
          item.name = ElectionSurveyTool.polyglot.t('topics.' + item.id + '.name');
        }
      })

      return activeTopics;
    }

    if (this.model instanceof CategoriesList) {
      props.categoriesList = this.model.toJSON();

    } else if (this.model instanceof TopicsList) {
      props.custom = props.categoryId === 'custom';
      props.topicsList = getActiveTopics(this.model);

    } else if (this.model instanceof Story) {
      var topics = ElectionSurveyTool.topics.toJSON();
      var topicName = this.model.get('topic');
      props.topic = _.find(topics, function(t) { return t.id == topicName; });
    }

    this.$el.html(this.template(props));
    this.stickit();

    return this;
  },

  checkOk: function() {
    this.$('button.next').toggleClass('disabled', _.isEmpty(this.model.get('title')));
  },

  create: function(topic) {
    this.model.set('id', ElectionSurveyTool.newStoryId());
    ElectionSurveyTool.stories.add(this.model);

    router.navigate('stories/' + this.model.id, {trigger: true});
  }
});
