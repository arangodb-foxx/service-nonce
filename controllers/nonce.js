'use strict';

var crypto = require("org/arangodb/crypto");
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var controller = new Foxx.Controller(applicationContext);

var nonceIdSchema = joi.string().required()
.description('The id of the nonce')
.meta({allowMultiple: false});

// Creates a new nonce and returns it.
controller.post('/', function (req, res) {
  var nonce = crypto.createNonce();
  res.json({ nonce: nonce });
});

// Reads and uses nonce. Returns 'true' if nonce was valid.
controller.put('/:id', function (req, res) {
  var id = crypto.checkAndMarkNonce(req.urlParameters.id);
  res.json(id);
})
.pathParam('id', nonceIdSchema)
.errorResponse(ArangoError, 404, 'The nonce could not be found');
