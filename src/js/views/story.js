/*** QuestionView
 *
 * Single question/answer in a story
 */
var QuestionView = Backbone.View.extend({
  template: Handlebars.compile($("#story-question-template").html()),
  tagName: 'li',
  className: 'question clearfix',
  events: {
  },
  bindings: {
    '[name=notes]': 'notes'
  },

  initialize: function(options) {
    this.question = options.question;
    this.key = this.question.key;
    this.custom = this.question.custom;
    this.num = options.num;
    this.story = options.story;
    this.answerType = options.answerType,
    this.answerOptions = options.answerOptions

    this.listenTo(this.model, 'change:notes', this.answerChanged);
    this.listenTo(ElectionSurveyTool.state, 'change:locale', this.render);
  },

  answerChanged: function() {
    var done = !_.isEmpty(this.model.get('notes'));
    this.model.set('done', done);
    this.$el.toggleClass('answered', done);
  },

  render: function() {
    var q = this.question;
    if (!this.custom) {
      q.question = ElectionSurveyTool.polyglot.t('topics.' + this.story.get('topic') + '.questions.' + q.key);
    }

    this.$el
      .html(this.template({
        q: q,
        a: this.model.attributes,
        num: this.num
      }))
      .data('key', this.key);

    // bind form elements to model
    this.stickit();
    this.$el.find('.btn-group input[type=radio]:checked').closest('label').addClass('active');
    // this.$el.find('textarea').autogrow();
    this.answerChanged();

    return this;
  },

  inserted: function() {
    this.$el.find('textarea').autogrow();
  }
});


/*** StoryView ***/
var StoryView = Backbone.View.extend({
  className: "story-view",
  template: Handlebars.compile($("#story-view-template").html()),

  events: {
    'click #app-header h1': 'rename',
    'click .delete': 'deleteStory',
    'click .share': 'share',
    'click .firebase': 'firebase'
  },

  initialize: function() {
    this.topic = ElectionSurveyTool.topics.get(this.model.get('topic'));

    this.answers = this.model.get('answers');
    this.listenTo(this.answers, 'change', this.updateProgress);
    this.listenTo(this.answers, 'change:done', this.questionDone);
    this.on('view-inserted', function() {
      self.$el.find('textarea').autogrow();
    });

    // setup child views
    var self = this;
    this.children = _.map(this.topic.get('questions'), function(q, i) {
      var model = self.answers.get(q.key);

      if (!model) {
        model = new Answer({key: q.key});
        self.answers.add(model);
      }

      return new QuestionView({
        num: i+1,
        model: model,
        question: q,
        story: self.model,
        type: self.answerType, //Note: Riaan Snyders to be added to model
        options: self.answerOptions //Note: Riaan Snyders to be added to model
      });
    });

    this.render();
  },

  updateProgress: function() {
    var p = this.model.percentComplete();
    this.$('#story-progress .progress-bar')
      .css({width: p * 100 + "%"})
      .text(Math.round(p * 100) + "% complete");

    this.$('.story-done').toggle(this.model.percentComplete() == 1.0);
  },

  deleteStory: function(e) {
    e.preventDefault();

    if (confirm(ElectionSurveyTool.polyglot.t('story.confirm_delete'))) {
      ElectionSurveyTool.stories.remove(this.model);
      ElectionSurveyTool.trackEvent('story', 'delete');
      router.navigate('', {trigger: true});
    }
  },

  rename: function(e) {
    var title = prompt(ElectionSurveyTool.polyglot.t('story.rename'), this.model.get('title'));

    if (!_.isEmpty(title)) {
      this.model.set('title', title);
      this.$('#app-header h1').text(title);
    }
  },

  share: function(e) {
    e.preventDefault();
    this.model.share();
  },

  //Note: Riaan Snyders - To become Firebase
  firebase: function(e) {
    e.preventDefault();
    this.model.firebase();
  },

  render: function() {
    var self = this;

    this.$el.html(this.template({
      story: this.model.toJSON(),
      topic: this.topic.toJSON()
    }));

    var $questions = this.$('#question-list');

    _.each(this.children, function(view) {
      $questions.append(view.render().el);
    });

    this.updateProgress();
  },

  close: function() {
    this.remove();
    _.each(this.children, function(c) { c.remove(); });
  }
});
