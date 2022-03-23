/* eslint 'camelcase': 'off' */

import { QueryInterface, DataTypes } from 'sequelize'


module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const { INTEGER, DATE } = DataTypes
    await queryInterface.createTable('user_role', {
      id: {
        type: INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      role_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: false,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      created_at: {
        type: DATE
      },
      updated_at: {
        type: DATE
      }
    })
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('user_role')
  }
}
