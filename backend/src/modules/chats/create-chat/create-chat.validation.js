import { body } from "express-validator";

export const createChatValidation = [
  body("participantId")
    .isMongoId()
    .withMessage("Valid participant ID is required"),
];
