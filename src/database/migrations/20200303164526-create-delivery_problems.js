module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('delivery_problems', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            order_id: {
                type: Sequelize.INTEGER,
                references: { model: 'orders', key: 'id' },
                onUpdate: 'SET NULL',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: queryInterface => {
        return queryInterface.dropTable('delivery_problems');
    },
};
