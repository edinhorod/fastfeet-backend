import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
    async index(req, res) {
        const deliverymans = await Deliveryman.findAll();
        return res.json(deliverymans);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const deliverymanExists = await Deliveryman.findOne({
            where: { email: req.body.email },
        });
        if (deliverymanExists) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // const { originalname: name, filename: path } = req.file;
        console.log(req.file);

        const deliveryman = await Deliveryman.create(req.body);

        return res.json(deliveryman);
        // return res.json(deliveryman);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const deliveryman = await Deliveryman.findByPk(req.params.id);

        const { id, name } = await deliveryman.update(req.body);
        return res.json({ id, name });
    }

    async delete(req, res) {
        const deliveryman = await Deliveryman.findByPk(req.params.id);
        if (!deliveryman) {
            return res.status(400).json({ error: 'Deliveryman not found' });
        }

        await Deliveryman.destroy({
            where: {
                id: req.params.id,
            },
        });
        return res
            .status(200)
            .json({ success: 'Deliveryman deleted with success' });
    }
}

export default new DeliverymanController();
