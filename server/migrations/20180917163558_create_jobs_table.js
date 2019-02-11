/**
 * Create jobs table.
 *
 * @param  {object} knex
 *
 */
exports.up = function(knex) {
    console.log('generating jobs table');
    return knex.schema.createTable('jobs', table => {
        table.increments('id').primary().unsigned();
        table.string('input_image_path');
        table.string('output_image_path');
        table.integer('status'); // Status of the job, might be 1: "in_queue", 2: "processing" or 3: "finished"
        table.timestamp('created_at');
        table.timestamp('updated_at');
    });
};

/**
 * Drop jobs table.
 *
 * @param  {object} knex
 *
 */
exports.down = function(knex) {
    console.log('dropping jobs table');
    return knex.schema.dropTable('jobs');
};
