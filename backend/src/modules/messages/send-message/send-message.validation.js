import { body } from "express-validator";

export const sendMessageValidation = [
  body("chatId").notEmpty().withMessage("Chat ID is required"),

  body("content").trim().notEmpty().withMessage("Message content is required"),
];
