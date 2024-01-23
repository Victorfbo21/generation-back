import { Router } from 'express';
import UsersRouter from "../../modules/users/router"
import HealthCheckRouter from '../../modules/healthcheck/router'
import AuthRouter from '../../modules/auth/routes';
import WorkRouter from '../../modules/works/router';
const Routers = Router();

Routers.use('/healthcheck', HealthCheckRouter)
Routers.use('/users', UsersRouter)
Routers.use('/work', WorkRouter)
Routers.use('/auth', AuthRouter)

export default Routers;