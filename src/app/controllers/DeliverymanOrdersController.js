import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';
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

        const deliveries = await Order.findAll({
            where: {
                deliveryman_id,
                canceled_at: null,
                end_date: null,
            },
        });
        return res.json(deliveries);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            start_date: Yup.date(),
            end_date: Yup.date(),
            signature_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' });
        }

        const { deliveryman_id, order_id } = req.params;
        const { start_date, end_date, signature_id } = req.body;

        const deliveryman = await Deliveryman.findByPk(deliveryman_id);
        const order = await Order.findOne({ where: { id: order_id } });

        if (!deliveryman) {
            return res.status(400).json({ error: 'Invalid deliveryman_id' });
        }

        if (!order) {
            return res.status(400).json({ error: 'Invalid order_id' });
        }

        if (end_date) {
            const alreadyDelivered = order.end_date;
            if (alreadyDelivered) {
                return res.status(401).json({
                    error:
                        'You can no longer update its end date because the Order has already been delivered.',
                });
            }

            if (!signature_id) {
                return res.status(401).json({ error: 'Signature is required' });
            }
        }

        if (start_date) {
            const alreadyWithdrawn = order.start_date;
            if (alreadyWithdrawn) {
                return res.status(401).json({
                    error:
                        'Order has already been Withdrawn. You can no longer update its start date',
                });
            }
            const startHour = format(parseISO(start_date), 'H');
            if (startHour < 8 || startHour > 18) {
                await deliveryman.update({ counter: 0 });
                return res
                    .status(400)
                    .json({ error: 'Pick-up time is 8am to 6pm' });
            }

            const { counter } = deliveryman;
            if (counter >= 5) {
                return res.status(400).json({
                    error: 'You can only make up to 5 deliveries per day',
                });
            }

            await deliveryman.increment('counter');
        }
        await order.update(req.body);

        return res.json(order);
    }
}

export default new DeliverymanOrdersController();
