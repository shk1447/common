var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function(user, done) {
    console.log(user)
    if(user.emails.length > 0) {
        khan.model.user.selectByEmail(user.emails[0].value).then((rows) => {
            if(rows.length > 0) {
                done(null, user);
            } else {
                khan.model.user.insert({email:user.emails[0].value, name:user.displayName}).then(() => {
                    done(null, user);
                })
            }
        })
    }
});

passport.deserializeUser(function(obj, done) {
    //console.log(obj)
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.google_id,
    clientSecret: process.env.google_secret,
    callbackURL: "http://localhost:1000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
    });
    }
));

module.exports = {
    get : {
        "check": function(req,res,next) {
            if(req.isAuthenticated()) {
                res.status(200).send();
            } else {
                res.status(401).send();
            }
        },
        "google" :[passport.authenticate('google', { scope: ['openid', 'email']}),
            function(req,res,next) {
                res.status(200).send();
        }] ,
        "google/callback" : [passport.authenticate('google', { failureRedirect: '/login' }),
            function(req,res,next) {
                res.redirect('/#/viewer');
        }],
        "logout" : function(req,res,next) {
            req.logout();
            res.redirect('/');
        }
    }
}