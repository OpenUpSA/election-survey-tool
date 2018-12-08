var test = require('tape');
var jsdom = require('jsdom');
var mock = require('mock-require');

global.Backbone = require('backbone');

const controller = require('../js/controller.min.js');
const transformer = require('../js/transformation.min.js');

const { JSDOM } = jsdom;

const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
global.window = document.defaultView;

// Passes the window object into jQuery, so that it can create the .ajax() method:
global.$ = require('jquery')(global.window);

mock('jquery', $);
mock.reRequire('jquery');

// This maps the dynamic .ajax method into Backbone:
//Backbone.$.ajax = $.ajax;

function test_GetAndTransformFolders(){

  var json = controller.dataObject('folders');
	return transformer.xFormFolders(json);
}

function test_GetAndTransformContent(){

  var json = controller.dataObject('contents');
	return transformer.xFormContent(json);
}

function test_GetAndTransformQuestions(){

  var json = controller.dataObject('questions');
	return transformer.xFormQuestions(json);
}

function test_MapToSurvey(){
 var folders = test_GetAndTransformFolders();
 var contents = test_GetAndTransformContent();
 var questions = test_GetAndTransformQuestions();

 transformer.mapToSurvey(folders,contents,questions);
}

test( 'Get Folders', function (assert) {
	test_GetAndTransformFolders();
	assert.end()
});

test( 'Get Content', function (assert) {
	test_GetAndTransformContent();
	assert.end()
});

test( 'Get Questions', function (assert) {
	test_GetAndTransformQuestions();
	assert.end()
});

test( 'Map to Survey', function (assert) {
	test_MapToSurvey();
	assert.end()
});
