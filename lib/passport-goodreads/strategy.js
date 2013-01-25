/**
 * Module dependencies.
 */
var xml2js = require('xml2js')
  , querystring = require('querystring')
  , util = require('util')
  , OAuthStrategy = require('passport-oauth').OAuthStrategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Goodreads authentication strategy authenticates requests by delegating to
 * Goodreads using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Goodreads
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which Goodreads will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new GoodreadsStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/goodreads/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.requestTokenURL = options.requestTokenURL || 'http://www.goodreads.com/oauth/request_token';
  options.accessTokenURL = options.accessTokenURL || 'http://www.goodreads.com/oauth/access_token';
  var params = { oauth_callback: options.callbackURL };
  options.userAuthorizationURL = options.userAuthorizationURL || 'http://www.goodreads.com/oauth/authorize?' + querystring.stringify(params);;
  options.sessionKey = options.sessionKey || 'oauth:goodreads';

  OAuthStrategy.call(this, options, verify);
  this.name = 'goodreads';
}

/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuthStrategy);

/**
 * Retrieve user profile from Goodreads.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`
 *   - `displayName`
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  this._oauth.get('http://www.goodreads.com/api/auth_user', token, tokenSecret, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    var parser = new xml2js.Parser();
    parser.parseString(body, function (err, xml) {
      if (err) { return done(err) };

      var profile = { provider: 'goodreads' };
      profile.id = xml.user['@'].id;
      profile.displayName = xml.user.name;
      
      profile._raw = body;
      profile._xml2json =
      profile._xml2js = xml;

      done(null, profile);
    });
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
