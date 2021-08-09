const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    

     Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
    /* Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        if(favorites){
            user_favorites = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
            if(!user_favorites){
                var err=new Error('You dont have favorites yet');
                err.status=404;
                return next(err);
            }
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user_favorites);
    }, (err) => next(err))
    .catch((err) => next(err)); */
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {
            for (let i = 0; i < req.body.length; i++) {
                if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                    favorite.dishes.push(req.body[i]._id);

                }
            }
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err)); 
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": req.body})
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
favoriteRouter.route('/:dishID')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {
            console.log(favorite);
            if (favorite.dishes.indexOf(req.params.dishID) === -1) {
                favorite.dishes.push(req.params.dishID);
                console.log(req.params.dishID);
            }
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err)); 
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": req.params.dishID})
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user": req.user._id})
    .then((favorite) => {
        var index = favorite.dishes.indexOf(req.params.dishID)
        if (index === -1) {
            err = new Error('Favorite Dish not Found');
            err.statusCode = 404;
            return next(err)
        }
        else {
            favorite.dishes.splice(index, 1);
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }

    }, (err) => next(err))
    .catch((err) => next(err));
}); 
module.exports=favoriteRouter;