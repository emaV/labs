one.ubuntu - YQL javascript connector

== SUMMARY ==
A simple YQL Open Data Tables generated with JavaScript from Ubuntu One data.

Authentication with oAuth. Basically:

1) Create a new token in Ubuntu SSO (login.ubuntu.com).
2) Tell Ubuntu One about that new token.
3) Use that new token to sign a request to the Ubuntu One files API.



== REFERENCES ==

* Ubuntu One API
API Docs > Account admin APIs > Authorisation and Authentication > Authorisation - Other Platforms
https://one.ubuntu.com/developer/account_admin/auth/otherplatforms

For non-web applications wishing to access Ubuntu One APIs, the Ubuntu SSO service will provide the best user experience for acquiring an OAuth access token. Rather than bouncing the user through a web site, it allows the application to query the user for their email address and password (Python Example).

* Ubuntu One Oauth login from PHP
http://askubuntu.com/questions/54185/ubuntu-one-oauth-login-from-php

* launchpad: SSO token name must have spaces around "@"
https://bugs.launchpad.net/u1devsite/+bug/1026843


* maemo Ubi
https://garage.maemo.org/plugins/ggit/browse.php/?p=ubi;a=blob;f=qml/ubi/u1.js;h=a118cb76b6224468d13c1559778b12fdc3353ac5;hb=9258f43ecdca38297659820679a07b3f21fe6ffd

An unofficial Ubuntu One app for Maemo 5 and other Qt-enabled platforms.
The Ubi app provides access to Ubuntu One cloud service. Initial version supports simple storage management tasks like: file Download, Upload and Deletion. The plan is to provide other cloud features i.e. Notes editing and Contact synchronization.
The code is mostly done in Qt Quick so hopefully it can be easily migrated to Symbian or MeeGo platforms.


* How-to: Secure OAuth in JavaScript
http://derek.io/blog/2010/how-to-secure-oauth-in-javascript/


* YQN guide
http://developer.yahoo.com/yql/guide/yql-execute-examples.html#yql-execute-example-oauth-netflix
http://developer.yahoo.com/yql/guide/yql-javascript-objects.html#rest_methods-parseJson


