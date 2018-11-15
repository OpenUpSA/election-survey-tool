var test = require('tape');

const firebase = require("firebase");
const firebaseApp = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const firebaseDB = require("firebase/database");
const uuidv1 = require('uuid/v1');

var config = {
	apiKey: "AIzaSyDSLOG6UQL5CSUVpfSDfcFCl3nVrsUXe8c",
	authDomain: "election-tool-2019.firebaseapp.com",
	databaseURL: "https://election-tool-2019.firebaseio.com",
	projectId: "election-tool-2019",
	storageBucket: "election-tool-2019.appspot.com",
	messagingSenderId: "168702593827"
};
firebase.initializeApp(config);

function test_submitData(){
	var itemKey = uuidv1();

	firebase.database().ref('election-survey/' + itemKey).set({
		data: encodeURIComponent('{ "test": "test data "}')
	});
}

test( 'submit data', function (assert) {
	var result = test_submitData()
	assert.end()
});
