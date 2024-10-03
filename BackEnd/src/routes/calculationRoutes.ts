


import {Router} from "express"; //criar um roteador


import{
    createCalculation, 
    getAllCalculations,
    updateCalculation,
    deleteCalculation 
} from '../controllers/calculationController';

const router: Router = Router();

router.post('/create/calculation', createCalculation);
router.get('/allCalculations', getAllCalculations);
router.put('/update/calculation/:id', updateCalculation);
router.delete('/delete/calculation/:id', deleteCalculation);




export default router; //exporta o roteador para ser usado em outros 