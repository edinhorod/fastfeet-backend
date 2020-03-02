import * as Yup from 'yup';
import { getHours, parseISO, format } from 'date-fns';

import pt from 'date-fns/locale/pt';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import Mail from '../../lib/Mail';

class OrderController {
    async index(req, res) {
        const orders = await Order.findAll({
            attributes: [
                'id',
                'product',
                'canceled_at',
                'start_date',
                'end_date',
            ],
            include: [
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: [
                        'name',
                        'address',
                        'number',
                        'complement',
                        'city',
                        'state',
                        'zipcode',
                    ],
                },
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['name', 'email'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
            ],
        });
        return res.json(orders);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            recipient_id: Yup.number()
                .positive()
                .required(),
            deliveryman_id: Yup.number()
                .positive()
                .required(),
            product: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(401).json({ error: 'Validations fails' });
        }

        // Recipient = Destinatario
        const recipient = await Recipient.findByPk(req.body.recipient_id);
        if (!recipient) {
            return res
                .status(400)
                .json({ error: 'This recipient does not exist.' });
        }

        const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);
        if (!deliveryman) {
            return res
                .status(400)
                .json({ error: 'This deliveryman does not exist.' });
        }

        // Verificando se hora está entre 08:00 e 18:00hs
        const today = new Date();
        const hour = getHours(today);
        if (hour < 8 || hour > 18) {
            return res
                .status(400)
                .json({ error: 'Pick-up time is 8am to 6pm' });
        }

        const order = await Order.create({
            recipient_id: req.body.recipient_id,
            deliveryman_id: req.body.deliveryman_id,
            signature_id: req.body.signature_id,
            product: req.body.product,
            canceled_at: null,
            start_date: new Date(),
            end_date: null,
        });

        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: 'Nova encomenda',
            template: 'newOrder',
            context: {
                deliveryman: deliveryman.name,
                created_at: format(
                    order.createdAt,
                    "'dia' dd 'de' MMMM', às' H:mm'h'",
                    { locale: pt }
                ),
                product: order.product,
                recipient: recipient.name,
                address: recipient.address,
                complement: recipient.complement,
                number: recipient.number,
                state: recipient.state,
                city: recipient.city,
                zipcode: recipient.zipcode,
            },
        });

        return res.json(order);
    }
}

export default new OrderController();

// A data de início deve ser cadastrada assim que for feita a retirada do produto pelo entregador, e as retiradas só podem ser feitas entre as 08:00 e 18:00h. OK
// Os campos recipient_id e deliveryman_id devem ser cadastrados no momento que for cadastrada a encomenda. OK
// A data de término da entrega deve ser cadastrada quando o entregador finalizar a entrega:
// Quando a encomenda é cadastrada para um entregador, o entregador recebe um e-mail com detalhes da encomenda, com nome do produto e uma mensagem informando-o que o produto já está disponível para a retirada. OK
// Crie rotas para listagem/cadastro/atualização/remoção de encomendas;
