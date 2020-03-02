export default {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        // user: '18c5ddfe0bb4a0',
        // pass: 'c8bf83c3c9bb14',
    },
    default: {
        from: 'Equipe GoBarber <noreply@fastfeet.com>',
    },
};
