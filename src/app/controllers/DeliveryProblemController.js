import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

import Mail from '../../lib/Mail';

class DeliverymanProblemController {
    async index(req, res) {
        const orders = await DeliveryProblem.findAll({
            where: {
                order_id: req.params.order_id,
            },
            include: [
                {
                    model: Order,
                    as: 'order',
                    attributes: ['product', 'start_date'],
                },
            ],
        });

        if (orders.length === 0) {
            return res
                .status(400)
                .json({ error: 'No problems found with this order' });
        }

        return res.json(orders);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' });
        }
        const { order_id } = req.params;
        const { description } = req.body;

        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(400).json({ error: 'Order Not found' });
        }

        const delivery_problem = await DeliveryProblem.create({
            order_id,
            description,
        });

        return res.json(delivery_problem);
    }

    async delete(req, res) {
        const { order_id } = req.params;
        const deliveryProblem = await DeliveryProblem.findByPk(order_id, {
            include: [
                {
                    model: Order,
                    as: 'order',
                    attributes: [
                        'id',
                        'product',
                        'canceled_at',
                        'deliveryman_id',
                        'recipient_id',
                    ],
                },
            ],
        });
        if (!deliveryProblem) {
            return res.status(400).json({ error: 'Order Not found' });
        }

        const deliveryman = await Deliveryman.findByPk(
            deliveryProblem.order.deliveryman_id
        );
        if (!deliveryman) {
            return res.status(400).json({ error: 'Deliveryman Not found' });
        }

        const recipient = await Recipient.findByPk(
            deliveryProblem.order.recipient_id
        );

        await deliveryProblem.order.update({ canceled_at: new Date() });

        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: 'Uma encomenda foi cancelada!',
            template: 'CancelOrder',
            context: {
                canceled_at: format(
                    new Date(),
                    "'dia' dd 'de' MMMM', às' H:mm'h'",
                    { locale: pt }
                ),
                deliveryman: deliveryman.name,
                product: deliveryProblem.order.product,
                recipient: recipient.name,
            },
        });

        return res.json({
            message: `Order with ID ${deliveryProblem.order.id} was successfully canceled.`,
        });
    }
}

export default new DeliverymanProblemController();
