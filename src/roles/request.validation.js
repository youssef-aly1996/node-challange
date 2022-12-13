import { validationResult } from "express-validator";

//middleware to check if req.body has valid fields
export const isValidBody = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
