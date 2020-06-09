/**
 * 本次更新内容
 * - xxx
 */

exports.up = function (knex, Promise) {
  return knex.schema.table('t_plc', (t) => {
    t.integer('cust_id').notNullable().comment('报警策略所属客户id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('t_plc', (t) => {
    t.dropColumn('cust_id')
  })
}
