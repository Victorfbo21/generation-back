
import { Router, request, response } from 'express';

const router = Router();

router.get('/isalive', (request, response) => {
    response.json('Api Generation Funcionando Normal');
});

export default router;