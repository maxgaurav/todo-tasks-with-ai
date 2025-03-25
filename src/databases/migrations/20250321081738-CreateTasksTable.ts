'use strict';

import { QueryInterface, Sequelize } from 'sequelize';
import { DataType } from 'sequelize-typescript';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('tasks', {
      id: {
        type: DataType.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataType.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataType.BIGINT,
      },
      content: {
        type: DataType.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      completed_on: {
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
      },
      due_on: {
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('tasks', {
      type: 'foreign key',
      fields: ['user_id'],
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('tasks', ['user_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('tasks');
  },
};
