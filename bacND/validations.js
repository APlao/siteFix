import {body} from 'express-validator';
 export const registrationValidation = [
    body('email').isEmail(),
    body('password').isLength({min:4}),
    body('fullName').isLength({min:3}),
    body('avatarUrl').optional().isURL()
]
export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min:4})
]
export const postCreateValidation = [
    body('title','Введите заголовог статьи').isLength({min:3}).isString(),
    body('text','Введите текст статьи').isLength({min:10}).isString(),
    body('tags','Неверный формат тегов (укажите массив)').optional().isArray(),
    body('imageUrl','Неверная ссылка на изоборажение').optional().isString(),
]