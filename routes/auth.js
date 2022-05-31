const express = require("express")
const passport = require("passport")
const router = express.Router()

// @desc Auth With Google
// @route GET /api/google-login
router.get('/api/google-login',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
))

// @desc Google Auth Callback
// @route GET /auth/google/callback
router.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/google-register',
        failureRedirect: '/'
}))

module.exports = router