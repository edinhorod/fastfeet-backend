import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
    async index(req, res) {
        const recipients = await Recipient.findAll();
        return res.json(recipients);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            address: Yup.string().required(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            zipcode: Yup.string().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const recipient = await Recipient.create(req.body);

        return res.json(recipient);
    }
}

export default new RecipientController();
