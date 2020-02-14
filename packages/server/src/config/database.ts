import { ConnectionOptions } from 'typeorm'

const database_configurations: ConnectionOptions = {
    type: "mysql",
    host: "database",
    port: 3306,
    username: "root",
    password: "root",
    database: "lrbsl_database",
    charset: "utf8",
    synchronize: process.env.NODE_ENV !== 'production',
    entities: [
        '**/**.entity.ts'
    ],
    migrations: ["migration/*.ts"],
    cli: {
        migrationsDir: "migration"
    },
    connectTimeout: 30000,
    acquireTimeout: 30000,
    maxQueryExecutionTime: 5000
}

export {
    database_configurations
}