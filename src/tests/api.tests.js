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

const foldersAPI = 'https://custom.pocketreporter.co.za/wp-json/wp/v2/election_folders';
const resourceAPI = 'https://custom.pocketreporter.co.za/wp-json/wp/v2/election_information';
const questionAPI = 'https://custom.pocketreporter.co.za/wp-json/wp/v2/election_questions/';

function test_GetAndTransformFolders(){

  var json = controller.dataObject('folders');
	transformer.xFormFolders(json);
}

test( 'Get Folders', function (assert) {
	test_GetAndTransformFolders();
	assert.end()
});
