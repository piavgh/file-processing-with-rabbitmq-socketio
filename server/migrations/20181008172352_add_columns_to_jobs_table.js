exports.up = function(knex, Promise) {
    return knex.schema.table('jobs', table => {
        table.integer('result');
        table.string('error');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('jobs', table => {
        table.dropColumn('result');
        table.dropColumn('error');
    });
};
