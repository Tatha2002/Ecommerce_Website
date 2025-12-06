import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    // Load .env file globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM + PostgreSQL Configuration
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        console.log("🔵 DATABASE CONFIG:");
        console.log("DB_HOST:", process.env.DB_HOST);
        console.log("DB_PORT:", process.env.DB_PORT);
        console.log("DB_USERNAME:", process.env.DB_USERNAME);
        console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "****" : "undefined");
        console.log("DB_NAME:", process.env.DB_NAME);

        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    CustomersModule,
  ],
})
export class AppModule {}
