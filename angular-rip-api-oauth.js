angular.module('rip.api.oauth', ['rip.api'])
    
.factory('$apiOauth',
    function RipApiOAuthFactory() {

        var timestamp = function() {
            var t = (new Date()).getTime();
            return Math.floor(t / 1000);
        };

        var nonce = function (length) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
            var result = "";
            for (var i = 0; i < length; ++i) {
                var rnum = Math.floor(Math.random() * chars.length);
                result += chars.substring(rnum, rnum+1);
            }
            return result;
        };

        return function(data, headers, url, endpoint) {

            var consumer = endpoint.getParam('oauth_consumer');
            var secret = endpoint.getParam('oauth_secret');
            var correction = endpoint.getParam('oauth_time_correction');

            var token = endpoint.getParam('oauth_token');
            var token_secret = endpoint.getParam('oauth_token_secret');

            data.oauth_consumer_key = consumer;
            if (token) { data.oauth_token = token }
            data.oauth_nonce = nonce(6);
            data.oauth_timestamp = timestamp() + (correction ? correction : 0);
            data.oauth_signature_method = 'HMAC-SHA1';
            data.oauth_version = '1.0';

            // Sign
            data.oauth_signature = oauthSignature.generate(endpoint.method, url, data, secret, token_secret, { encodeSignature: false});

        }
        
    })

;