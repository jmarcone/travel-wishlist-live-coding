import { body, validationResult } from 'express-validator';
import { Router } from 'express';

const validateCountryData = Router();


validateCountryData.use(
    body('alpha2code').isLength({ min: 2, max: 2 }),
    body('alpha3code').isLength({ min: 3, max: 3 }),
    body('visited').isBoolean(),
    (req, res, next) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ errors: errors.array() });
        }
    
        return next();
    }
)

export default validateCountryData;