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
    ._createTableIfNotExists('t_plc_type', (table) => {
      table.increments('id').primary()
      table.string('name', 10).notNullable().comment('PLC类型名称')
      table.boolean('enable').defaultTo(true).comment('是否启用')
			table.string('memo', 200).comment('备注信息')
      table.timestamp('created_at').defaultTo(knex.fn.now()).comment('创建时间')
      table.timestamp('updated_at').comment('最后更新时间') // .defaultTo(knex.fn.now())
    })
    .then(function (exists) {
			return !exists && knex.raw("INSERT INTO `t_plc_type` (`id`, `name`, `enable`, `memo`, `created_at`, `updated_at`) VALUES" +
			"(1, 'Modbus协议', 1, 'modbus协议', '2017-01-01 00:00:00', '2017-01-01 00:00:00')," +
			"(12, '三菱 Fx系列', 1, '三菱Fx系列', '2017-01-01 00:00:00', '2017-01-01 00:00:00')," +
			"(11, '三菱 Q系列', 1, 'Q系列TCP协议', '2017-01-01 00:00:00', '2017-01-01 00:00:00')," +
			"(2, '西门子200', 1, 'PPI', '2017-01-01 00:00:00', '2017-01-01 00:00:00')," +
			"(3, '西门子300', 1, 'ISO-on-TCP', '2017-01-01 00:00:00', '2017-01-01 00:00:00')," +
			"(4, '西门子1200', 1, 'ISO-on-TCP', '2017-01-01 00:00:00', '2017-01-01 00:00:00')," +
			"(31, 'GNSS', 1, NULL, '2017-01-01 00:00:00', '2017-01-01 00:00:00');")
		})
		.then(function () {
			return knex.schema
        ._createTableIfNotExists('t_protocol', (table) => {
          table.increments('id').primary()
          table.integer('plc_type_id').notNullable().comment('PLC类型id')
          table.string('name', 10).notNullable().comment('PLC协议类型名称')
          table.integer('link_type').notNullable().comment('连接类型')
					table.boolean('enable').defaultTo(true).comment('PLC类型名称')
					table.json('protocols').comment('协议项')
					table.json('data_areas').comment('数据区域')
					table.json('function_codes').comment('功能码')
          table.json('config').comment('动态配置项')
          table.json('default_config').comment('默认配置项')
          table.string('memo', 200).comment('备注信息')
          table.timestamp('created_at').defaultTo(knex.fn.now()).comment('创建时间')
          table.timestamp('updated_at').comment('最后更新时间') // .defaultTo(knex.fn.now())
        })
		})
		.then(function (exists) {
			return !exists && knex('t_protocol').insert([
				{
					id: 1, plc_type_id: 1, name: 'Modbus tcp', link_type: '0', enable: 1,
					config: '[{"label":"IP地址","key":"ip","type":"String","optional":"","value":"192.168.1.1","plc_config_type":1},{"label":"端口号","key":"port","type":"Number","optional":"","value":"502","plc_config_type":1},{"label":"从站ID","key":"SlaveId","type":"Number","optional":"","value":"1","plc_config_type":3},{"label":"功能码","key":"Function","type":"Number","optional":"","value":"3","plc_config_type":3},{"label":"起始地址","key":"StartAddr","type":"Number","optional":"","value":"0","plc_config_type":3,"filters":"point:0:Function:2:DB区号"}]',
					default_config: '[{"label":"PlcProto","key":"PlcProto","type":"String","optional":"","value":"Modbus","plc_config_type":1},{"label":"字节间的超时时长","key":"ByteTimeout","type":"Number","optional":"","value":"0","plc_config_type":1},{"label":"响应速度的超时时长","key":"ResponseTimeout","type":"Number","optional":"","value":"0","plc_config_type":1}]',
					memo: 'modbus-tcp', created_at: '2017-01-01 00:00:00', updated_at: '2017-01-01 00:00:00'
				},
				{
					id: 2, plc_type_id: 1, name: 'Modbus rtu', link_type: '1', enable: 1,
					config: '[{"label":"COM","key":"com","type":"SingleSelect","optional":"/dev/ttyO1:COM1,/dev/ttyO2:COM2,/dev/ttyO3:COM3,/dev/ttyO4:COM4,/dev/ttyO5:COM5","value":"/dev/ttyO1","filters":"","plc_config_type":1},{"label":"波特率","key":"baud_rate","type":"SingleSelect","optional":"2400:2400,4800:4800,9600:9600, 19200:19200, 38400:38400,","value":"9600","filters":"","plc_config_type":1},{"label":"数据位","key":"data_bits","type":"SingleSelect","optional":"7:7 Bits,8:8 Bits","value":"8","filters":"","plc_config_type":1},{"label":"校验位","key":"verify","type":"SingleSelect","optional":"N:None,E:Even,O:Odd,M:Mark,S:Space","value":"N","filters":"N:None,E:Even,O:Odd,M:Mark,S:Space","plc_config_type":1},{"label":"停止位","key":"stop_bits","type":"SingleSelect","optional":"1:1bits,2:2bits","value":"1","filters":"","plc_config_type":1},{"label":"从站ID","key":"SlaveId","type":"Number","optional":"","value":"1","filters":"","plc_config_type":3},{"label":"功能码","key":"Function","type":"SingleSelect","optional":"1:1读开出,2:2读开入,3:3读模出,4:4读模入","value":"3","filters":"","plc_config_type":3},{"label":"起始地址","key":"StartAddr","type":"Number","optional":"","value":"0","filters":"","plc_config_type":3},{"label":"刷新频率","key":"Interval","type":"Number","optional":"","value":"1000","filters":"","plc_config_type":3}]',
					default_config: '[{"label":"PlcProto","key":"PlcProto","type":"String","optional":"","value":"Modbus","plc_config_type":1},{"label":"ByteTimeout","key":"ByteTimeout","type":"Number","optional":"","value":"0","plc_config_type":1},{"label":"ResponseTimeout","key":"ResponseTimeout","type":"Number","optional":"","value":"0","plc_config_type":1}]',
					memo: 'Modbus rtu', created_at: '2017-01-01 00:00:00', updated_at: '2017-01-01 00:00:00'
				},
				{
					id: 3, plc_type_id: 12, name: 'FX2N-RS485', link_type: '1', enable: 1,
					config: '[{"label":"功能码","key":"Function","type":"SingleSelect","optional":"0:BR,1:WR","value":"1","filters":"","plc_config_type":3},{"label":"COM","key":"com","type":"SingleSelect","optional":"/dev/ttyO1:COM1,/dev/ttyO2:COM2,/dev/ttyO3:COM3,/dev/ttyO4:COM4,/dev/ttyO5:COM5","value":"/dev/ttyO4","filters":"","plc_config_type":1},{"label":"波特率","key":"baud_rate","type":"SingleSelect","optional":"1200:1200,2400:2400,4800:4800,9600:9600,14400:14400, 19200:19200,28800:28800, 38400:38400,57600:57600,115200:115200,187500:187500","value":"9600","filters":"1200:1200,2400:2400,4800:4800,9600:9600,14400:14400, 19200:19200,28800:28800, 38400:38400,57600:57600,115200:115200,187500:187500","plc_config_type":1},{"label":"数据位","key":"data_bits","type":"SingleSelect","optional":"7:7 Bits,8:8 Bits","value":"7","filters":"7:7 Bits,8:8 Bits","plc_config_type":1},{"label":"校验","key":"verify","type":"SingleSelect","optional":"N:None,E:Even,O:Odd,M:Mark,S:Space","value":"E","filters":"N:None,E:Even,O:Odd,M:Mark,S:Space","plc_config_type":1},{"label":"设备类型","key":"PlcProto","type":"String","optional":"","value":"Mitsub","filters":"Mitsub","plc_config_type":1},{"label":"刷新时间（ms）","key":"Interval","type":"Number","optional":"1000","value":"1000","filters":"","plc_config_type":3},{"label":"ByteTimeout","key":"ByteTimeout","type":"Number","optional":"1000","value":"1000","filters":"1000","plc_config_type":1},{"label":"ResponseTimeout","key":"ResponseTimeout","type":"Number","optional":"1000","value":"1000","filters":"1000","plc_config_type":1},{"label":"停止位","key":"stop_bits","type":"SingleSelect","optional":"1:1bits,2:2bits","value":"1","filters":"1:1bits,2:2bits","plc_config_type":1},{"label":"数据区","key":"Block","type":"SingleSelect","optional":"0:D区,1:T区,2:C区,3:S区,4:M区,5:Y区,6:X区","value":"0","filters":"0:D区,1:T区,2:C区,3:S区,4:M区,5:Y区,6:X区","plc_config_type":3},{"label":"协议类型","key":"ProtoType","type":"Number","optional":"","value":"1","filters":"1","plc_config_type":1},{"label":"起始地址","key":"StartAddr","type":"Number","optional":"0","value":"0","filters":"","plc_config_type":3},{"label":"PLC站号","key":"Slave","type":"Number","optional":"","value":"0","filters":"","plc_config_type":3}]',
					default_config: '[]',
					memo: '', created_at: '2017-01-01 00:00:00', updated_at: '2017-01-01 00:00:00'
				},
				{
					id: 4, plc_type_id: 11, name: 'MC协议', link_type: '0', enable: 1,
					config: '[{"label":"IP地址","key":"ip","type":"String","optional":"","value":"192.168.1.1","filters":"","plc_config_type":1},{"label":"端口号","key":"port","type":"Number","optional":"","value":"5002","filters":"","plc_config_type":1},{"label":"刷新频率","key":"Interval","type":"Number","optional":"","value":"1000","filters":"","plc_config_type":3},{"label":"网络编号","key":"NetNo","type":"Number","optional":"","value":"0","filters":"","plc_config_type":2},{"label":"PLC编号","key":"PlcNo","type":"Number","optional":"","value":"255","filters":"","plc_config_type":2},{"label":"请求目标模块I/O编号","key":"DstIoNo","type":"Number","optional":"","value":"1023","filters":"","plc_config_type":2},{"label":"请求目标模块站编号","key":"DstStationNo","type":"Number","optional":"","value":"0","filters":"","plc_config_type":2},{"label":"命令","key":"Function","type":"SingleSelect","optional":"0:RWord,1:RBit","value":"0","filters":"","plc_config_type":3},{"label":"起始地址","key":"Startaddr","type":"Number","optional":"","value":"0","filters":"","plc_config_type":3},{"label":"数据区","key":"Block","type":"SingleSelect","optional":"160:B区,168:D区,156:X区,157:Y区,144:M区,146:L区,152:S区,147:F区,193:TS区,192:TC区,196:CS区,195:CC区,194:TN区,197:CN区,180:W区,175:R区","value":"168","filters":"","plc_config_type":3},{"label":"ByteTimeout","key":"ByteTimeout","type":"Number","optional":"","value":"1000","filters":"","plc_config_type":1},{"label":"ResponseTimeout","key":"ResponseTimeout","type":"Number","optional":"","value":"1000","filters":"","plc_config_type":1}]',
					default_config: '[{"label":"PlcProto","key":"PlcProto","type":"String","optional":"","value":"MC","plc_config_type":1},{"label":"CPU监视定时器","key":"CpuTimer","type":"Number","optional":"","value":"16","plc_config_type":2}]',
					memo: '', created_at: '2017-01-01 00:00:00', updated_at: '2017-01-01 00:00:00'
				},
				{
					id: 5, plc_type_id: 2, name: '西门子200ppi', link_type: '1', enable: 1,
					config: '[{"label":"COM","key":"com","type":"SingleSelect","optional":"/dev/ttyO1:COM1,/dev/ttyO2:COM2,/dev/ttyO3:COM3,/dev/ttyO4:COM4,/dev/ttyO5:COM5","value":"/dev/ttyO1","filters":"","plc_config_type":1},{"label":"波特率","key":"baud_rate","type":"SingleSelect","optional":"1200:1200,2400:2400,4800:4800,9600:9600,14400:14400,19200:19200,28800:28800,38400:38400,57600:57600,115200:115200,187.5k:187.5k","value":"9600","filters":"","plc_config_type":1},{"label":"数据位","key":"data_bits","type":"SingleSelect","optional":"7:7bits,8:8bits","value":"8","filters":"","plc_config_type":1},{"label":"校验位","key":"verify","type":"SingleSelect","optional":"N:None,E:Even,O:Odd,M:Mark,S:Space","value":"E","filters":"","plc_config_type":1},{"label":"停止位","key":"stop_bits","type":"SingleSelect","optional":"1:1 Bits,2:2 Bits","value":"1","filters":"","plc_config_type":1},{"label":"刷新时间（毫秒）","key":"interval","type":"Number","optional":"","value":"1000","filters":"","plc_config_type":3},{"label":"区域","key":"Area","type":"SingleSelect","optional":"1:SM,2:AI,3:AQ,5:I,6:Q,7:M,8:V,14:C","value":"7","filters":"","plc_config_type":3},{"label":"DB区号","key":"DBNum","type":"Number","optional":"","value":"0","filters":"","plc_config_type":3},{"label":"StartAddr","key":"StartAddr","type":"String","optional":"","value":"1000","filters":"","plc_config_type":3}]',
					default_config: '[{"label":"协议","key":"Protocol","type":"String","optional":"","value":"0","plc_config_type":1},{"label":"速率","key":"Speed","type":"String","optional":"","value":"2","plc_config_type":1},{"label":"超时","key":"Timeout","type":"Number","optional":"","value":"500","plc_config_type":1},{"label":"SensorId","key":"SensorId","type":"Number","optional":"","value":"1","plc_config_type":3},{"label":"PlcAddrSize","key":"PlcAddrSize","type":"String","optional":"","value":"4","plc_config_type":2},{"label":"PlcAddress","key":"PlcAddress","type":"String","optional":"","value":"1","plc_config_type":2},{"label":"PlcProto","key":"PlcProto","type":"String","optional":"","value":"Siemens","plc_config_type":1},{"label":"LocalPPI","key":"LocalMPI","type":"String","optional":"","value":"0","plc_config_type":1},{"label":"Protocol","key":"Protocol","type":"String","optional":"","value":"1","plc_config_type":1},{"label":"DestPPI","key":"DestMPI","type":"Number","optional":"","value":"2","plc_config_type":2},{"label":"Rack","key":"Rack","type":"String","optional":"","value":"0","plc_config_type":2},{"label":"Slot","key":"Slot","type":"Number","optional":"","value":"0","plc_config_type":2},{"label":"Subnet1","key":"Subnet1","type":"Number","optional":"","value":"0","plc_config_type":2},{"label":"Subnet3","key":"Subnet3","type":"Number","optional":"","value":"0","plc_config_type":2},{"label":"test","key":"test","type":"String","optional":"","value":"test","plc_config_type":1}]',
					memo: '', created_at: '2017-01-01 00:00:00', updated_at: '2017-01-01 00:00:00'
				},
				{
					id: 6, plc_type_id: 3, name: 'ISO-on-TCP', link_type: '0', enable: 1,
					config: '[{"label":"IP地址","key":"ip","type":"String","optional":"","value":"192.168.250.1","filters":"","plc_config_type":1},{"label":"端口号","key":"port","type":"Number","optional":"","value":"102","filters":"","plc_config_type":1},{"label":"刷新时间(毫秒)","key":"Interval","type":"Number","optional":"","value":"1000","filters":"","plc_config_type":3},{"label":"区域","key":"Area","type":"SingleSelect","optional":"5:I,6:Q,7:M,8:DB","value":"8","filters":"","plc_config_type":3},{"label":"DB区号","key":"DBNum","type":"Number","optional":"","value":"0","filters":"","plc_config_type":3},{"label":"StartAddr","key":"StartAddr","type":"Number","optional":"","value":"0","filters":"","plc_config_type":3},{"label":"Slot","key":"Slot","type":"Number","optional":"","value":"2","filters":"","plc_config_type":2}]',
					default_config: '[{"label":"协议","key":"Protocol","type":"String","optional":"","value":"0","plc_config_type":1},{"label":"速率","key":"Speed","type":"String","optional":"","value":"2","plc_config_type":1},{"label":"超时","key":"Timeout","type":"Number","optional":"","value":"500000","plc_config_type":1},{"label":"SensorId","key":"SensorId","type":"Number","optional":"","value":"1","plc_config_type":3},{"label":"PlcAddrSize","key":"PlcAddrSize","type":"Number","optional":"","value":"4","plc_config_type":2},{"label":"PlcAddress","key":"PlcAddress","type":"Number","optional":"","value":"1","plc_config_type":2},{"label":"PlcProto","key":"PlcProto","type":"String","optional":"","value":"Siemens","plc_config_type":1},{"label":"LocalMPI","key":"LocalMPI","type":"String","optional":"","value":"0","plc_config_type":1},{"label":"Protocol","key":"Protocol","type":"String","optional":"","value":"0","plc_config_type":1},{"label":"DestMPI","key":"DestMPI","type":"Number","optional":"","value":"2","plc_config_type":2},{"label":"Rack","key":"Rack","type":"Number","optional":"","value":"0","plc_config_type":2},{"label":"Subnet1","key":"Subnet1","type":"Number","optional":"","value":"0","plc_config_type":2},{"label":"Subnet3","key":"Subnet3","type":"Number","optional":"","value":"0","plc_config_type":2},{"label":"test","key":"test","type":"String","optional":"","value":"test","plc_config_type":1}]',
					memo: '', created_at: '2017-01-01 00:00:00', updated_at: '2017-01-01 00:00:00'
				},
				{
					id: 7, plc_type_id: 4, name: '西门子1200', link_type: '0', enable: 1,
					config: '[{"label":"IP地址","key":"ip","type":"String","optional":"","value":"192.168.250.1","filters":"","plc_config_type":1},{"label":"端口号","key":"port","type":"Number","optional":"","value":"102","filters":"","plc_config_type":1},{"label":"刷新时间(毫秒)","key":"Interval","type":"Number","optional":"","value":"1000","filters":"","plc_config_type":3},{"label":"区域","key":"Area","type":"SingleSelect","optional":"5:I,6:Q,7:M,8:DB","value":"8","filters":"","plc_config_type":3},{"label":"DB区号","key":"DBNum","type":"Number","optional":"","value":"2","filters":"","plc_config_type":3},{"label":"StartAddr","key":"StartAddr","type":"Number","optional":"","value":"0","filters":"","plc_config_type":3}]',
					default_config: '[{"label":"协议","key":"Protocol","type":"String","optional":"","value":"0","plc_config_type":1},{"label":"速率","key":"Speed","type":"String","optional":"","value":"2","plc_config_type":1},{"label":"超时","key":"Timeout","type":"Number","optional":"","value":"500","plc_config_type":1},{"label":"SensorId","key":"SensorId","type":"Number","optional":"","value":"1","plc_config_type":3},{"label":"PlcAddrSize","key":"PlcAddrSize","type":"String","optional":"","value":"4","plc_config_type":2},{"label":"PlcAddress","key":"PlcAddress","type":"String","optional":"","value":"1","plc_config_type":2},{"label":"PlcProto","key":"PlcProto","type":"String","optional":"","value":"Siemens","plc_config_type":1},{"label":"LocalMPI","key":"LocalMPI","type":"String","optional":"","value":"0","plc_config_type":1},{"label":"Protocol","key":"Protocol","type":"String","optional":"","value":"0","plc_config_type":1},{"label":"DestMPI","key":"DestMPI","type":"Number","optional":"","value":"2","plc_config_type":2},{"label":"Rack","key":"Rack","type":"String","optional":"","value":"0","plc_config_type":2},{"label":"Slot","key":"Slot","type":"Number","optional":"","value":"1","plc_config_type":2},{"label":"Subnet1","key":"Subnet1","type":"Number","optional":"","value":"0","plc_config_type":2},{"label":"Subnet3","key":"Subnet3","type":"Number","optional":"","value":"0","plc_config_type":2},{"label":"test","key":"test","type":"String","optional":"","value":"test","plc_config_type":1}]',
					memo: '', created_at: '2017-01-01 00:00:00', updated_at: '2017-01-01 00:00:00'
				},
				{
					id: 8, plc_type_id: 31, name: 'Gnss', link_type: '1', enable: 1,
					config: '[{"label":"功能码","key":"Function","type":"SingleSelect","optional":"1:WR","value":"1","filters":"","plc_config_type":3},{"label":"COM","key":"com","type":"SingleSelect","optional":"/dev/ttyO1:COM1,/dev/ttyO2:COM2,/dev/ttyO3:COM3,/dev/ttyO4:COM4,/dev/ttyO5:COM5","value":"/dev/ttyO5","filters":"/dev/ttyO1:COM1,/dev/ttyO2:COM2,/dev/ttyO3:COM3,/dev/ttyO4:COM4,/dev/ttyO5:COM5","plc_config_type":1},{"label":"波特率","key":"baud_rate","type":"String","optional":"","value":"9600","filters":"1200:1200,2400:2400,4800:4800,9600:9600,14400:14400, 19200:19200,28800:28800, 38400:38400,57600:57600,115200:115200,187500:187500","plc_config_type":1},{"label":"数据位","key":"data_bits","type":"SingleSelect","optional":"8:8 Bits","value":"8","filters":"","plc_config_type":1},{"label":"校验","key":"verify","type":"String","optional":"","value":"N","filters":"N:None,E:Even,O:Odd,M:Mark,S:Space","plc_config_type":1},{"label":"设备类型","key":"PlcProto","type":"String","optional":"","value":"Gnss","filters":"Gnss","plc_config_type":1},{"label":"刷新频率","key":"Interval","type":"Number","optional":"","value":"1000","filters":"","plc_config_type":3},{"label":"ByteTimeout","key":"ByteTimeout","type":"Number","optional":"","value":"1000","filters":"1000","plc_config_type":1},{"label":"ResponseTimeout","key":"ResponseTimeout","type":"Number","optional":"","value":"1000","filters":"","plc_config_type":1},{"label":"停止位","key":"stop_bits","type":"SingleSelect","optional":"1:1bits","value":"1","filters":"","plc_config_type":1},{"label":"数据区","key":"Block","type":"SingleSelect","optional":"0:GGA","value":"0","filters":"","plc_config_type":3},{"label":"协议类型","key":"ProtoType","type":"Number","optional":"","value":"1","filters":"1","plc_config_type":1},{"label":"起始地址","key":"StartAddr","type":"Number","optional":"","value":"0","filters":"","plc_config_type":3},{"label":"PLC站号","key":"Slave","type":"Number","optional":"","value":"0","filters":"","plc_config_type":3}]',
					default_config: '[]',
					memo: '', created_at: '2017-01-01 00:00:00', updated_at: '2017-01-01 00:00:00'
				}
			])
		})
    .then(function () {
      return knex.schema
        ._createTableIfNotExists('t_plc', (table) => {
					table.increments('id').primary()
          table.integer('gateway_id').notNullable().comment('设备id')
          table.string('name', 20).notNullable().comment('PLC名称')
          table.integer('type').notNullable().comment('PLC类型')
          table.integer('protocol_type').notNullable().comment('PLC协议类型')
          table.boolean('enable').defaultTo(true).comment('是否启用PLC')
          table.json('config').comment('PLC协议的自定义配置信息')
          table.string('memo', 200).comment('备注信息')
          table.timestamp('created_at').defaultTo(knex.fn.now()).comment('创建时间')
          table.timestamp('updated_at').comment('最后更新时间') // .defaultTo(knex.fn.now())
        })
		})
}
