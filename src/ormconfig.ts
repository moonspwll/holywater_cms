import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_DB_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_DB_PORT || '5432', 10),
    username: process.env.POSTGRES_DB_USER,
    password: process.env.POSTGRES_DB_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    logging: false,
};

export default config;