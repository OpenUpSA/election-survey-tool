/*** Models ***/
// ElectionSurveyTool state
var State = Backbone.Model.extend({
  defaults: {
    stories: [],
    nextId: 1,
    customTopics: null,
  }
});


var Topic = Backbone.Model.extend({
  initialize: function() {
    // improve the questions
    this.set('length', this.get('questions').length);
    _.each(this.get('questions'), function(q, i) {
      q.num = i+1;
    });
  }
});


var TopicsList = Backbone.Model.extend({
  defaults: function() {
    return {
      id: null,
      icon: null,
      name: null,
      topics: [],
      custom: false,
    }
  }
});


var CategoriesList = Backbone.Collection.extend({
  model: TopicsList,
  comparator: 'display'
});


var Topics = Backbone.Collection.extend({
  model: Topic,
  comparator: 'name'
});


var RequestForTemplate = Backbone.Model.extend({
  defaults: function() {
    return {
      idSlug: '',
      loading: false,
      notExists: false,
      error: false,
      success: false,
      exists: false,
      notExist: false,
    }
  }
})


var Story = Backbone.Model.extend({
  defaults: function() {
    return {
      answers: [],
      created_at: moment(),
      updated_at: moment()
    };
  },

  initialize: function() {
    this.on('change', this.updated, this);
    this.on('change:topic', this.setupTopic, this);
    // propagate events from the answer list
    this.get('answers').on('change add remove reset', this.answersChanged, this);
  },

  answersChanged: function(obj, options) {
    this.trigger('change', this, options);
  },

  setupTopic: function() {
    // clear answers and ensure we have one for every question
    var topic = ElectionSurveyTool.topics.get(this.get('topic'));
    var answers = _.map(topic.get('questions'), function(q) {
      return new Answer({key: q.key});
    });

    this.get('answers').reset(answers);
  },

  parse: function(json, options) {
    // reify moments from iso8601 string
    json.created_at = moment(json.created_at);
    json.updated_at = moment(json.updated_at);
    json.answers = new AnswerList(json.answers);
    return json;
  },

  updated: function() {
    this.set('updated_at', moment(), {silent: true});
  },

  percentComplete: function() {
    var total = this.get('answers').length;
    return (total === 0 ? 0 : this.completed().length / total);
  },

  pending: function() {
    return this.get('answers').filter(function(a) { return !a.get('done'); });
  },

  completed: function() {
    return this.get('answers').filter(function(a) { return a.get('done'); });
  },

  firebase: function() {
    var pending = this.pending();

    if (pending.length > 0) {
      if (!confirm(ElectionSurveyTool.polyglot.t('story.share_incomplete')))
        return;
    }

    var itemKey = uuidv1();

    //Auth
    firebase.auth().signInWithEmailAndPassword('tobechanged', 'tobechanged').then(function() {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //Submit
            firebase.database().ref('election-survey/' + itemKey).set({
              data: encodeURIComponent(this.shareableBody())
            }).catch(function(error) {
              console.log(error);
            });
        } else {
           //User not signed in. We throw error
           throw('Firebase authentication failed!');
        }
      });

    }).catch(function(error) {
      throw(error);
    });

    //Signout
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
      throw(error);
    });
  },

  share: function() {
    var pending = this.pending();

    if (pending.length > 0) {
      if (!confirm(ElectionSurveyTool.polyglot.t('story.share_incomplete')))
        return;
    }

    var mailto = 'mailto:';

    mailto += '?subject=' + encodeURIComponent(this.get('title'));
    mailto += '&body=' + encodeURIComponent(this.shareableBody());

    window.open(mailto, '_blank');

    ElectionSurveyTool.trackEvent('story', 'share');
  }
});

var Stories = Backbone.Collection.extend({
  model: Story,
  comparator: 'updated_at',
  localStorage: new Backbone.LocalStorage('stories')
});

/* answers are a simple model, with attributes for each question key, such as
 * q-name-notes: notes for the "name" question
 */
var Answer = Backbone.Model.extend({
  idAttribute: 'key',
  defaults: {
    done: false
  }
});
var AnswerList = Backbone.Collection.extend({
  model: Answer
});
