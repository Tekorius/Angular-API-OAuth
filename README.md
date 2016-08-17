# AngularJS RIP API OAuth

This module is intended to integrate into RIP API and provide OAuth 1 interceptor

Pull requests with optimizations and bugfixes are always welcome.

## Getting started

### Installation

You should use Bower to install this module

    bower install --save angular-rip-api-oauth
    
Also these modules are required, but should be installed automatically by bower

    angular-rip-api
    oauth-signature
    
After the module is downloaded include the following JavaScript to your application

`./bower_components/oauth-signature/dist/oauth-signature.js`
`./bower_components/angular-rip-api/angular-rip-api.js`
`./bower_components/angular-rip-api-oauth/angular-rip-api-oauth.js`

### Configuration

You should use this module during the run phase of your angular app.

The provided interceptor must be attached to `bind` type. You should also provide the parameters containing your consumer token and consumer secret keys.

The module is provided as `rip.api.oauth` and injected as `$apiOauth`;

    angular.module('yourApp', ['rip.api', 'rip.api.oauth'])
    
    .config(function($apiProvider) {
        
        $apiProvider
            .get('secured', null)
            .header('Content-Type', 'application/x-www-form-urlencoded')
            .addParams({ 
                oauth_consumer: 'Cd3XXhZfBpqZy8zrGs', 
                oauth_secret: 'xWweEuOJQbWwZrNVBfnpR9tP5mHgX2BV'  
            })
                .post('login', '/login').end()
            .end()
        ;
        
    })
    
    .run(function($api, $apiOauth) {
        
        $api('secured').interceptor('bind', 'oauth', $apiOauth);
    })
    
That's it, any of your `secured` endpoint children are now OAuth enabled.

After logging in, you should set user token and secret to your secured endpoint

    $api('secured.login').interceptor('success', 'oauth', function(data, request, q, ret, svc) {
        $api('secured').addParams({
            oauth_token: data.data.key,
            oauth_token_secret: data.data.secret
        });
            
        // TODO: save to local or something
    });
    
So in sum, you have to set these params

    oauth_token
    oauth_token_secret
    oauth_consumer
    oauth_secret