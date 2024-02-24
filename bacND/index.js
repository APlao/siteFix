
import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose'
import cors from 'cors'
import  {registrationValidation, loginValidation,postCreateValidation} from './validations.js'




import {UserController, PostController} from './controllers/index.js';

import Post from './models/Post.js';
import {handleValidationErrors,checkAuth} from './utils/index.js';

mongoose.connect(
    'mongodb+srv://IVANAN:OVNXrEjmfjiaUnPK@zxc.7iangdu.mongodb.net/blog?retryWrites=true&w=majority')
    .then(()=>console.log('DB OK'))
    .catch((err)=> console.log(' DB err',err))


const app = express()

const storage = multer.diskStorage({
destination: (_, __, cb) => {
    cb(null, 'uploads')
},
filename: (_, file, cb) => {
    cb(null, file.originalname)
},
})

const upload = multer({storage})

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads',))   //{ extensions: ['jpg'] }//
const PORT = '3002'

app.post('/auth/login',loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/registration',registrationValidation,handleValidationErrors, UserController.register)
app.get('/auth/me',checkAuth, UserController.getMe)

app.post('/upload',checkAuth, upload.single('image'),(req,res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
app.get('/tags', PostController.getLastTags)
app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts',checkAuth, postCreateValidation,handleValidationErrors, PostController.create)
app.delete('/posts/:id',checkAuth, PostController.remove)
app.patch('/posts/:id',checkAuth,postCreateValidation,handleValidationErrors, PostController.update)
// app.patch('/posts',checkAuth, UserController.update)



app.listen(PORT, (err) =>{
    if(err)
 {
    return console.log(err);
 }
console.log(`listening on port ${PORT}`);
})