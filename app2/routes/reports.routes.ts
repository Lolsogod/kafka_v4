import { Router } from "express";
import { Review } from "../models/Review";
import { Types } from "mongoose";

const router = Router()

//report api
router.get('/top-rating', async (req,res)=>{
    let report = await Review.aggregate([
        {
          '$group': {
            '_id': '$movie', 
            'rating': {
              '$avg': '$rating'
            }
          }
        }, {
          '$lookup': {
            'from': 'movies', 
            'localField': '_id', 
            'foreignField': '_id', 
            'as': 'movie_info'
          }
        }, {
          '$unwind': '$movie_info'
        }, {
          '$project': {
            '_id': 1, 
            'title': '$movie_info.title', 
            'rating': 1
          }
        }, {
          '$limit': 10
        }, {
          '$sort': {
            'rating': -1
          }
        }
      ])
    res.send(report)
})
router.get('/most-popular', async (req,res)=>{
    let report = await Review.aggregate([
        {
          '$group': {
            '_id': '$movie', 
            'votes': {
              '$count': {}
            }
          }
        }, {
          '$lookup': {
            'from': 'movies', 
            'localField': '_id', 
            'foreignField': '_id', 
            'as': 'movie_info'
          }
        }, {
          '$unwind': '$movie_info'
        }, {
          '$project': {
            '_id': 1, 
            'title': '$movie_info.title', 
            'votes': 1
          }
        }, {
          '$limit': 10
        }, {
          '$sort': {
            'votes': -1
          }
        }
      ])
    res.send(report)
})
router.get('/top-reviews/:id', async (req,res)=>{
    let report = await Review.aggregate([
        {
          '$match': {
            'movie': new Types.ObjectId(req.params.id)
          }
        }, {
          '$lookup': {
            'from': 'movies', 
            'localField': 'movie', 
            'foreignField': '_id', 
            'as': 'movie_info'
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'author', 
            'foreignField': '_id', 
            'as': 'user_info'
          }
        }, {
          '$unwind': '$movie_info'
        }, {
          '$unwind': '$user_info'
        }, {
          '$project': {
            '_id': 1, 
            'movie': '$movie_info.title', 
            'author': '$user_info.login', 
            'rating': 1, 
            'text': 1, 
            'likes': 1
          }
        }, {
          '$limit': 10
        }, {
          '$sort': {
            'likes': -1
          }
        }
      ])
    res.send(report)
})

module.exports = router