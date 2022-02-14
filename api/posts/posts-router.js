const Post = require('./posts-model')
const express = require('express')
const { route } = require('../server')

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

router.put('/:id', (req, res) => {
    const { id } = req.params
    const changes = req.body
    
    if (!id) {
        res.status(404).json('The post with the specified ID does not exist')
    } else if (!changes.title || !changes.contents) {
        res.status(400).json('Please provide title and contents for the post')
    } else {
        Post.update(id, changes)
            .then(() => {
            res.status(200).json(changes)
            })
            .catch(() => {
            res.status(500).json({ message: "The post information could not be modified" })
        })
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            res.status(404).json('The post with the specified ID does not exist')
        } else {
            await Post.remove(id)
            res.status(200).json(post)
        }
    }
    catch (err){
        res.status(500).json('The post could not be removed')
    }
    
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params
    
    Post.findCommentById(id)
        .then(comment => {
            if (!comment) {
                res.status(404).json('The post with the specified ID does not exist')
            } else {
                res.status(200).json(comment.text)
            }
        }).catch(() => {
            res.status(500).json('The comments information could not be retrieved')
        })
    
})

module.exports = router