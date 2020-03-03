import { Router } from 'express';
import multer from 'multer'; // Para upload de arquivos (multpart form data
import multerConfig from './config/multer'; // Para upload de arquivos (multpart form data)

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';

import OrderController from './app/controllers/OrderController';

import DeliverymanOrdersController from './app/controllers/DeliverymanOrdersController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
    return res.json('FastFeet');
});

routes.get('/users', UserController.index);
routes.post('/sessions', SessionController.store);
// routes.post('/users', UserController.store);

// routes.get('/providers', ProviderController.index);
// routes.get('/providers/:providerId/available', AvailableConroller.index);

routes.use(authMiddleware);
// routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

// routes.get('/appointments', AppointmentController.index);
// routes.post('/appointments', AppointmentController.store);
// routes.delete('/appointments/:id', AppointmentController.delete);

// routes.get('/schedule', ScheduleController.index);

// routes.get('/notifications', NotificationController.index);
// routes.put('/notifications/:id', NotificationController.update);

routes.post('/recipient', RecipientController.store);

// deliveryman
routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.get(
    '/deliverymans/:deliveryman_id/orders',
    DeliverymanOrdersController.index
);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
export default routes;
