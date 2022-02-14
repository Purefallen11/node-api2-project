const Post = require('./posts-model')
const express = require('express')

const router = express.Router()

//endpoints

router.get('/', (req, res) => {
    Post.find()
        .then(post => {
        res.status(200).json(post)
        })
        .catch(()=> {
        res.status(500).json('The posts information could not be retrieved')
    })
})

router.get('/:id', (req, res) => {
    const {id} = req.params
    Post.findById(id)
        .then(post => {     
            if (!post) {
                res.status(404).json(`post with id ${id} does not exist`)
            } else {
                res.status(200).json(post)
            }
        })
        .catch(() => {
        res.status(500).json('The post information could not be retrieved')
    })
})

router.post('/', (req, res) => {
    const newPost = req.body
    if (!newPost.title || !newPost.contents) {
            res.status(400).json('Please provide title and content')
    } else {
        Post.insert(newPost)
            .then(() => {
            res.status(201).json(newPost)
        }) .catch(() => {
        res.status(500).json('There was an error while saving the post to the database')
    })
    }
})

module.exports = router