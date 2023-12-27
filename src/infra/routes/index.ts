import { Router } from 'express';
import UsersRouter from "../../modules/users/router"
import HealthCheckRouter from '../../modules/healthcheck/router'


const Routers = Router();

Routers.use('/healthcheck', HealthCheckRouter)
Routers.use('/users', UsersRouter)

export default Routers;