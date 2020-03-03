import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliverymanOrdersController {
    async index(req, res) {
        const { deliveryman_id } = req.params;

        const deliveryman = await Deliveryman.findOne({
            where: {
                id: deliveryman_id,
            },
        });

        if (!deliveryman) {
            return res.status(400).json({ error: 'Deliveryman not found' });
        }

        const orders = await Order.findAll({
            where: {
                deliveryman_id,
                canceled_at: null,
                end_date: null,
            },
        });
        return res.json(orders);
    }
}

export default new DeliverymanOrdersController();
