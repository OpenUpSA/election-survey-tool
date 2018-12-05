var test = require('tape');

const uuidv1 = require('uuid/v1');

const cryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");

function test_EncryptKey(){
	var key = 'key';
	var secret = uuidv1();

	console.log(secret);

	var encryptedKey = cryptoJS.AES.encrypt(key,secret);

  console.log(encryptedKey.toString());
}

function test_DecryptKey(){
	var key = 'U2FsdGVkX19qso7ZVBc9WDhCQu1rAwLkncXMB87Pe8Inbx0cAS2hgaCFoMCGkJOCKuktzZ9d+0Nt9My2HFICEQ==';
	var secret = '64b0f400-f8a9-11e8-ba8f-6f4534024543';

	var decryptedKey = cryptoJS.AES.decrypt(key.toString(),secret);
	var plaintext = decryptedKey.toString(cryptoJS.enc.Utf8);

  console.log(plaintext.toString());
}


test( 'Encrypt Key', function (assert) {
	var result = test_DecryptKey();
	assert.end()
});
