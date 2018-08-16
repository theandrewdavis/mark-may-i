Want to explore the [Facebook API](http://developers.facebook.com/docs/guides/web/) without all the setup hassle? This web app lets you create an authentication token and start making API calls in seconds.

### Why? ###
When I was creating [fb-photo-backup](https://github.com/theandrewdavis/fb-photo-backup), I wanted to use the [Open Graph API](http://developers.facebook.com/docs/reference/api/) to download all the photos I'm tagged in. That didn't work - some of my friends have tight privacy settings so I could see photos from the website but couldn't get them from the API. But I had to do a lot of setup just to learn that it wasn't going to work! So this app aims to get you up and running much faster, immediately giving you an authentication token with whatever permissions you ask for. Happy exploring!

### How? ###
I used the [Backbone](http://backbonejs.org/) MVC library to organize my code and separate model and view concerns. This is a huge step up from [my last web app](https://github.com/theandrewdavis/lf4m), which used jQuery alone, but there seems to be a lot of boilerplate for binding models and views. 

Testing was another big improvement. I used [Jasmine](https://jasmine.github.io/) and [Sinon](http://sinonjs.org/) to test my code, and really loved the safety net of running the test suite after a refactor to know I didn't break anything. I also [stubbed out](https://github.com/theandrewdavis/mark-may-i/blob/master/test/FakeFacebookRunner.html) the Facebook API so I could work on design and test edge cases without hitting the Facebook servers.

### Usage ###
The page is hosted on AppFog - [check it out](http://markmayi.theandrewdavis.com/).
