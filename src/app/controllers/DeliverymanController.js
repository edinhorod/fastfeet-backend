import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
    async index(req, res) {
        const deliverymans = await Deliveryman.findAll();
        return res.json(deliverymans);
    }

    async store(req, res) {
        // const schema = Yup.object().shape({
        //     name: Yup.string().required(),
        //     email: Yup.string()
        //         .email()
        //         .required(),
        // });
        // if (!(await schema.isValid(req.body))) {
        //     return res.status(400).json({ error: 'Validation fails' });
        // }

        // const { originalname: name, filename: path } = req.file;
        console.log(req.file);

        // const deliveryman = await Deliveryman.create(req.body);

        return res.json(req.file);
        // return res.json(deliveryman);
    }
}

export default new DeliverymanController();
