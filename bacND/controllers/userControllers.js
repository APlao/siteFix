import jwt from  'jsonwebtoken';
import UserDto from '../dtos/user-dto.js'
import bcrypt from  'bcrypt';

import UserModel from '../models/User.js'
export const register = async(req, res) => {
    console.log(req.body)
 try {
 

const password = req.body.password.toString()
const salt =  await bcrypt.genSalt(10)
const hash = await bcrypt.hash(password,salt)

const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    passwordHash:hash,
    avatarUrl: req.body.avatarUrl,
})
const user = await doc.save()

const token = jwt.sign({
_id: user._id
},'secret353',{
    expiresIn: '15m'
})


res.json({
    ...UserDto,token
})
 } catch (error) {
    console.log(error)
    res.status(500).json({
       message:'Не удалось заарегестрироваться?'
    })
 }


}
export const login = async (req, res) =>  {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(404).json({
               message:`В базе такого нет!`
            })
        }
            const isValid = await bcrypt.compare(req.body.password, user._doc.passwordHash)
            if (!isValid) {
                return res.status(400).json({
                    message:`пОРоль не вернный или логин!`
            })
        }
        const token = jwt.sign({
            _id: user._id
            },'secret353',{
                expiresIn: '15m'
            })
            res.json({
                user: user,
                token: token
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({
           message:'Не удалось залогиниться?'
        })
    }
    }
export const getMe = async(req, res) => {
 
    const  user = await UserModel.findById(req.userId)
    try {
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
              });
            }
            const {passwordHash, ...userData} = user._doc
            res.json(userData)
    } catch (error) {
        console.log(err);
        res.status(500).json({
          message: 'Нет доступа',
        });
      
    }
    
    
    }