'use strict';

import { QueryInterface, Sequelize } from 'sequelize';
import { DataType } from 'sequelize-typescript';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.sequelize.query(
      'create extension if not exists vector',
    );

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('task_embeddings', {
      id: {
        type: DataType.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      task_id: {
        type: DataType.BIGINT,
        allowNull: false,
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

    await queryInterface.addConstraint('task_embeddings', {
      type: 'foreign key',
      fields: ['task_id'],
      references: {
        table: 'tasks',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });

    await queryInterface.addIndex('task_embeddings', ['task_id']);
    await queryInterface.sequelize.query(
      'alter table task_embeddings add column if not exists embeddings vector',
    );
    // @todo only allows when vector size is upto 2000
    // await queryInterface.sequelize.query(
    //   'CREATE INDEX tasks_embeddings_embedding_idx ON task_embeddings USING hnsw (embeddings vector_cosine_ops)',
    // );
  },

  down: async (queryInterface: QueryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('task_embeddings');
  },
};
