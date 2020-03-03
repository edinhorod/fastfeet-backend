module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('deliverymans', 'counter', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('deliverymans', 'counter');
    },
};
