module.exports = {
    up: QueryInterface => {
        return QueryInterface.bulkInsert(
            'recipients',
            [
                {
                    name: 'Distribuidora FastFeet',
                    address: 'Rua 01',
                    number: 12,
                    complement: null,
                    state: 'SC',
                    city: 'Palhoça',
                    zipcode: '88136-200',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: () => {},
};
