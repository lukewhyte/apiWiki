// Module dependencies.
var application_root = __dirname,
  express = require( 'express' ), //Web framework
  path = require( 'path' ), //Utilities for dealing with file paths
  mongoose = require( 'mongoose' ); //MongoDB integration

//Create server
var app = express();

//Start server
var port = 1666;

app.listen( port, function () {
  console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});

//Connect to database
mongoose.connect('mongodb://localhost/apiwiki_db');

//Schemas
var Data = new mongoose.Schema({
  name: String,
  url: String,
  slug: {type: String, unique: true}
});

//Models
var APIModel = mongoose.model('Data', Data);

// Configure server
app.configure( function() {
    //parses request body and populates request.body
    app.use( express.bodyParser() );

    //checks request.body for HTTP method overrides
    app.use( express.methodOverride() );

    //perform route lookup based on url and HTTP method
    app.use( app.router );

    //Where to serve static content
    app.use( express.static( path.join( application_root, './') ) );

    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//Get a list of all apis
app.get( '/apis', function( request, response ) {
  return APIModel.find( function( err, apis ) {
    if( !err ) {
      return response.send( apis );
    } else {
      return console.log( err );
    }
  });
});

//Insert a new api
app.post( '/apis', function( request, response ) {
  console.log(request.body);
  var api = new APIModel({
    name: request.body.name,
    url: request.body.url,
    slug: request.body.slug
  });
  
  return api.save( function( err ) {
    if( !err ) {
      console.log( 'created' );
      return response.send( api );
    } else {
      console.log( err );
    }
  });
});

//Get a single api by id
app.get( '/apis/:slug', function (request, response) {
  return APIModel.find({slug: request.params.slug}, function ( err, api ) {
    if( !err ) {
      return response.send( api );
    } else {
      return console.log( err );
    }
  });
});

//Update an api
app.put( '/apis/:id', function( request, response ) {
  console.log( 'Updating api ' + request.body.name );
  return APIModel.findById( request.params.id, function( err, api ) {
    api.name = request.body.name;
    api.url = request.body.url;
    api.slug = request.body.slug;

    return api.save( function( err ) {
      if( !err ) {
        console.log( 'api updated' );
        return response.send( api );
      } else {
        console.log( err );
      }
    });
  });
});

//Delete an api
app.delete( '/apis/:id', function( request, response ) {
  console.log( 'Deleting api with id: ' + request.params.id );
  return APIModel.findById( request.params.id, function( err, api ) {
    return api.remove( function( err ) {
      if( !err ) {
        console.log( 'API removed' );
        return response.send( '' );
      } else {
        console.log( err );
      }
    });
  });
});