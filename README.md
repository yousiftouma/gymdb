# Project Description

This application will let the user collect movies that they have seen and would
like to see in one place. There, the user can for example rank the movies and
keep track of what movies they want to see again or similar.
It will allow users send movie recommendations to friends and discuss movies 
directly in the application.

## Functional specifications
* Browse movies in a library
* Add movies to your own movie list
* Rank your movies
* Recommend movies to other users/friends
* Discuss movies with other users

## Technical specifications

We will be using the MEAN-stack, which stands for MongoDB, ExpressJS, AngularJS
and NodeJS. We use MeanJS as our starting point to start  building from.

The Client Framework amongst these is AngularJS.
The server/backend frameworks are NodeJS and ExpressJS. 
MongoDB is used as database.
We are planning on separating user data from the application by using
Firebase and their built in authentication.
We will use Gulp as task runner to automate builds and other tasks.
We will use Postman to test our API backend.
We are planning on using a pipeline that consists of pushing to our repository,
building/testing using Travis, and if everything passes,
deploying to for example Heroku.

It might be worth noting that we plan to use "The Movie DB" API to get our data.
If necessary, we can also integrate with IMDBs OmdbAPI which is also open,
but requires payments to get access to everything.


