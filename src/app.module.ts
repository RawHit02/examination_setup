import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomMiddleware } from './common/middleware/custom_middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EnvKeyConstants } from './shared-lib';
import { JWTService } from './infrastructure/services/helpers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigModule } from './common/configuration/db/config.module';
import { TypeOrmPostgresConnectionService } from './common/configuration/db/config.service';
import { ApplicationModule } from './application/application.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { AutoMapperProfileMapper } from './infrastructure/mappers/automapper_profile.mapper';
import * as path from 'path';


const envFilePath = path.resolve(__dirname, '..', '.env'); // Get absolute path

console.log('🌍 Loading .env from:', envFilePath);
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: EnvKeyConstants.JWT_SECRET,
      signOptions: { expiresIn: '30000s' }, // 5min.
      verifyOptions: {
        algorithms: ['HS256'],
        complete: true,
      },
    }),

    ApplicationModule,
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useClass: TypeOrmPostgresConnectionService,
      inject: [TypeOrmPostgresConnectionService],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.env', '.dev.env'],
      envFilePath:envFilePath,

      expandVariables: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JWTService, AutoMapperProfileMapper],
  exports: [JwtModule, JWTService, AutoMapperProfileMapper],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomMiddleware).forRoutes('*');
  }
}
