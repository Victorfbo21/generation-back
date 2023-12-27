import { Router } from 'express';
import UsersRouter from "../../modules/users/router"
import HealthCheckRouter from '../../modules/healthcheck/router'
import MenuRouter from '../../modules/menu/router';
import OrderRouter from '../../modules/order/router'


const Routers = Router();

Routers.use('/healthcheck', HealthCheckRouter)
Routers.use('/users', UsersRouter)
Routers.use('/menu', MenuRouter)
Routers.use('/orders', OrderRouter)


export default Routers;