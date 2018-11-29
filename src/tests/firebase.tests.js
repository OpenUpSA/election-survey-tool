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

	//Auth
	firebase.auth().signInWithEmailAndPassword('tobechanged', 'tobechanged').then(function() {
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
		     var user = firebase.auth().currentUser;

				 	console.log(user.uid);

					//Submit
					firebase.database().ref('election-survey/' + itemKey).set({
						data: encodeURIComponent('{ "test": "test data "}')
					}).catch(function(error) {
						console.log(error);
					});

		  } else {
		    console.log('not signed in');
		  }
		});

	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // ...
	});

  //Signout
	firebase.auth().signOut().then(function() {
  		// Sign-out successful.
		}).catch(function(error) {
  		consol.log('error');
	});
}

function test_FBLogin(){
	var provider = new firebase.auth.FacebookAuthProvider();

	firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;

	console.log(user.uid);

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			 var user = firebase.auth().currentUser;

				console.log(user.uid);

				//Submit
				firebase.database().ref('election-survey/' + user.uid).set({
					data: encodeURIComponent('{ "test": "test data "}')
				}).catch(function(error) {
					console.log(error);
				});

		} else {
			console.log('not signed in');
		}
	});
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;

	console.log(errorMessage);
  // ...
});
}

test( 'FB Login', function (assert) {
	var result = test_FBLogin()
	assert.end()
});

/*test( 'submit data', function (assert) {
	var result = test_submitData()
	assert.end()
});*/
