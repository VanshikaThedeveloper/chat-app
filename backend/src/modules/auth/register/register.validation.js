import { body } from 'express-validator'

export const registerValidation = [
  body("username").trim().notEmpty().withMessage(" username is required").isLength({min :3}).withMessage("username must be at least 3 characters") ,

  body("email").isEmail().withMessage("Valid email is required"),

  body("password").isLength({min :6}).withMessage("password must be at least 6 characters")
]
