import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: 'admin',
    password: 'cms_password',
    database: 'holywater',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    // logging: true,
};

export default config;