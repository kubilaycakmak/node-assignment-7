const router = require("express").Router();
const { mongoConnect } = require('../services/mongo')
const ObjectID = require('mongodb').ObjectID

router.get('/', async(req,res) => {
    const db = mongoConnect()
    const fetchedTodos = await db.collection('todos').find().toArray()
    console.log(fetchedTodos);
    const todos = fetchedTodos.map(item => ({ ID: item._id, ...item }))
    res.render('index', { model: todos })
})

router.get('/create', (req,res) => {
    res.render('create', { model: {} })
})

router.post('/create', async (req,res) => {
    const db = mongoConnect()
    db.collection('todos').insertOne({ Title: req.body.Title })
    .then(result => {
        console.log('A todo has been added');
        res.redirect('/')
    })
})

router.delete('/:id', async (req,res) => {
    const db = mongoConnect()

    console.log(req.params.id);
    console.log('ads');
    // db.collection('todos').delete({ Title: req.body.Title })
    // .then(result => {
    //     console.log('A todo has been deleted');
    //     res.redirect('/')
    // })
})
router.get('/delete/:id', async (req,res) => {
    const db = mongoConnect()
    db.collection('todos').deleteOne({ "_id": ObjectID(req.params.id) })
    .then(result => {
        console.log('A todo has been deleted');
        res.redirect('/')
    })
})

router.get('/edit/:id', async (req,res) => {
    const db = mongoConnect()
    db.collection('todos').findOne({ "_id": ObjectID(req.params.id)})
    .then(result => {
        console.log(result);
        res.render('edit', { model: {result} })
    })
})

router.post('/edit/:id', async (req,res) => {
    const db = mongoConnect()
    db.collection('todos').updateOne({ "_id": ObjectID(req.params.id)}, {$set:{Title:req.body.Title}})
    .then(result => {
        console.log(result);
        res.redirect('/')
    })
})

module.exports = router;
