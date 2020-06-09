const Enums = {
  RoleStatusEnum: {
    'DISABLED': '禁用',
    'ENABLE': '启用'
  },
  RoleTypeEnum: {
    'SYSTEM': '系统',
    'CUSTOMER': '客户',
    'USER': '客户下内置角色'
  },
  UserStatusEnum: {
    'CLOCKED': '禁用',
    'NORMAL': '可用'
  },
  UserTypeEnum: {
    'ADMIN': '高级用户',
    'CUSTOMER': '客户',
    'USER': '普通用户'
  }
}

exports.seed = function (knex, Promise) {
  knex.schema.__proto__._createTableIfNotExists = function (tableName, callback) {
    return knex.schema.hasTable(tableName).then(exists => {
      if (exists) {
        console.log(`表[${tableName}]已经存在!`)
        return Promise.resolve(true)
      }
      return knex.schema.createTableIfNotExists(tableName, callback).then(() => {
        console.log(`${tableName} ddl upgrade.`)
        return Promise.resolve(false)
      })
    })
  }

  return knex.schema
    ._createTableIfNotExists('qx_auth', (table) => {
      table.increments('id').primary()
      table.string('name', 20).unique().notNullable().comment('权限名称')
      table.string('key', 50).unique().notNullable().comment('权限key')
    })
    .then(function () {
      return knex.schema
        ._createTableIfNotExists('qx_role', (table) => {
          table.increments('id').primary()
          table.string('name', 20).notNullable().comment('角色名称')
          table.enu('status', Object.keys(Enums.RoleStatusEnum)).comment('角色状态')
          table.json('auth_ids').comment('权限id')
          table.json('route_ids').comment('路由id')
          table.json('menus').comment('菜单')
          table.enu('type', Object.keys(Enums.RoleTypeEnum)).comment('权限类型')
          table.integer('cust_id').comment('所属客户id，表示此角色是此客户创建的')
          table.timestamp('created_at').defaultTo(knex.fn.now()).comment('创建时间')
          table.datetime('updated_at').comment('最后更新时间') //.defaultTo(knex.fn.now())
        })
    })
    .then(function () {
      return knex.schema
        ._createTableIfNotExists('qx_routes', (table) => {
          table.increments('id').primary()
          table.string('name', 20).comment('路由显示名称')
          table.string('url').unique().comment('路由路径')
          table.string('file').comment('路由组件路径')
          table.boolean('isMenu').defaultTo(false).comment('是否为菜单')
          table.integer('auth_id').notNullable().comment('菜单所属的权限id')
          table.string('icon').comment('菜单图标')
        })
    })
    .then(function () {
      return knex.schema
        ._createTableIfNotExists('qx_user', (table) => {
          table.increments('id').primary()
          table.string('name', 35).unique().notNullable().comment('用户昵称, 可用作登录账号')
          table.string('image', 200).comment('头像')
          table.string('email', 32).comment('用户邮箱, 可用作登录账号')
          table.string('phone', 11).comment('用户手机号码，可用作登录账号')
          table.string('password', 50).notNullable().comment('登录口令')
          table.boolean('is_super').defaultTo(false).notNullable().comment('是否为超级管理员，超级管理员拥有系统所有的权限')
          table.string('alarm_way', 50).comment('报警通知方式 (Enums.AlarmWayEnum)')
          table.enu('status', Object.keys(Enums.UserStatusEnum)).defaultTo('NORMAL').comment('状态')
          table.json('role_ids').comment('角色id')
          table.enu('type', Object.keys(Enums.UserTypeEnum)).defaultTo('CUSTOMER').comment('账户类型，默认是客户')
          table.string('full_name', 50).comment('客户全名')
          table.integer('cust_id').comment('所属客户id，只有当帐户类型为普通用户（USER）时才设置此值')
          table.integer('db_id').comment('客户数据数据库，只有当帐户类型为客户（CUSTOMER）时才设置此值')
          table.string('memo', 200).comment('备注信息')
          table.boolean('internal').defaultTo(false).notNullable().comment('是否为系统内置用户，内置用户不能执行: 更改角色，删除等破坏性操作')
          table.datetime('last_login_time').comment('最后一次登录的时间')
          table.string('last_login_ip', 15).comment('最后一次登录的IP地址')
          table.timestamp('created_at').defaultTo(knex.fn.now()).comment('创建时间')
          table.datetime('updated_at').comment('最后更新时间') // .defaultTo(knex.fn.now())
        })
        .then(function (exists) {
          return !exists && knex('qx_user').insert([
            { id: '1', name: 'super', image: 'http://www.gravatar.com/avatar/a76b06ee4f5bdd877072bf3c9149ec76?d=mm&s=', email: 'super@gmail.com', password: '14e1b600b1fd579f47433b88e8d85291', is_super: '1', status: 'NORMAL', role_ids: '[1]', type: 'ADMIN', full_name: '', cust_id: null, internal: 1 },
            { id: '2', name: '开发工程师', image: 'http://www.gravatar.com/avatar/a76b06ee4f5bdd877072bf3c9149ec76?d=mm&s=', email: 'dev@gmail.com', password: '14e1b600b1fd579f47433b88e8d85291', is_super: '0', status: 'NORMAL', role_ids: '[2]', type: 'ADMIN', full_name: '', cust_id: null, internal: 1 },
            { id: '3', name: '客户1', image: 'http://www.gravatar.com/avatar/a76b06ee4f5bdd877072bf3c9149ec76?d=mm&s=', email: 'cust1@gmail.com', password: '14e1b600b1fd579f47433b88e8d85291', is_super: '0', status: 'NORMAL', role_ids: '[3]', type: 'CUSTOMER', full_name: '', cust_id: null, internal: 0 },
            { id: '4', name: '客户1(部署)', image: 'http://www.gravatar.com/avatar/a76b06ee4f5bdd877072bf3c9149ec76?d=mm&s=', email: 'user1@gmail.com', password: '14e1b600b1fd579f47433b88e8d85291', is_super: '0', status: 'NORMAL', role_ids: '[4]', type: 'USER', full_name: '', cust_id: '3', internal: 0 },
            { id: '5', name: '客户2(观察)', image: 'http://www.gravatar.com/avatar/a76b06ee4f5bdd877072bf3c9149ec76?d=mm&s=', email: 'user2@gmail.com', password: '14e1b600b1fd579f47433b88e8d85291', is_super: '0', status: 'NORMAL', role_ids: '[5]', type: 'USER', full_name: '', cust_id: '3', internal: 0 },
            { id: '6', name: '客户2', image: 'http://www.gravatar.com/avatar/a76b06ee4f5bdd877072bf3c9149ec76?d=mm&s=', email: 'cust2@gmail.com', password: '14e1b600b1fd579f47433b88e8d85291', is_super: '0', status: 'NORMAL', role_ids: '[3]', type: 'CUSTOMER', full_name: '', cust_id: null, internal: 0 },
            { id: '7', name: '客户2(部署)', image: 'http://www.gravatar.com/avatar/a76b06ee4f5bdd877072bf3c9149ec76?d=mm&s=', email: 'user3@gmail.com', password: '14e1b600b1fd579f47433b88e8d85291', is_super: '0', status: 'NORMAL', role_ids: '[4]', type: 'USER', full_name: '', cust_id: '5', internal: 0 }
          ])
        })
    })
}
