

import {Router} from "express"; 


import{
    createCalculation, 
    getAllCalculations,
    updateCalculation,
    deleteCalculation 
} from '../controllers/calculationControllerService';

const router: Router = Router();

router.post('/create/calculation', createCalculation);
router.get('/allCalculations', getAllCalculations);
router.put('/update/calculation/:id', updateCalculation);
router.delete('/delete/calculation/:id', deleteCalculation);




export default router; 