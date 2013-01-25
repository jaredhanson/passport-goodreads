# Passport-Goodreads

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Goodreads](http://www.goodreads.com/) using the OAuth 1.0 API.

This module lets you authenticate using Goodreads in your Node.js applications.
By plugging into Passport, Goodreads authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-goodreads

## Usage

#### Configure Strategy

The Goodreads authentication strategy authenticates users using a Goodreads
account and OAuth tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a consumer key, consumer secret, and callback URL.

    passport.use(new GoodreadsStrategy({
        consumerKey: GOODREADS_KEY,
        consumerSecret: GOODREADS_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/goodreads/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ goodreadsId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'goodreads'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/goodreads',
      passport.authenticate('goodreads'));
    
    app.get('/auth/goodreads/callback', 
      passport.authenticate('goodreads', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/jaredhanson/passport-goodreads/tree/master/examples/login).

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/passport-goodreads.png)](http://travis-ci.org/jaredhanson/passport-goodreads)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
