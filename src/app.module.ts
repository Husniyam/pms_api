// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesService } from './modules/roles/roles.service';
import { RolesController } from './modules/roles/roles.controller';
// import { RolesModule } from './modules/roles/roles.module';
import { VagonTurlariService } from './modules/vagon-turlari/vagon-turlari.service';
import { VagonTurlariModule } from './modules/vagon-turlari/vagon-turlari.module';
import { TamirTurlariService } from './modules/tamir-turlari/tamir-turlari.service';
import { TamirTurlariController } from './modules/tamir-turlari/tamir-turlari.controller';
import { TamirTurlariModule } from './modules/tamir-turlari/tamir-turlari.module';
import { VagonlarService } from './modules/vagonlar/vagonlar.service';
import { VagonlarController } from './modules/vagonlar/vagonlar.controller';
import { VagonlarModule } from './modules/vagonlar/vagonlar.module';
import { VagonTamirMuddatlariService } from './modules/vagon-tamir-muddatlari/vagon-tamir-muddatlari.service';
import { VagonTamirMuddatlariController } from './modules/vagon-tamir-muddatlari/vagon-tamir-muddatlari.controller';
import { VagonTamirMuddatlariModule } from './modules/vagon-tamir-muddatlari/vagon-tamir-muddatlari.module';
import { TashkilotlarService } from './modules/tashkilotlar/tashkilotlar.service';
import { TashkilotlarController } from './modules/tashkilotlar/tashkilotlar.controller';
import { TashkilotlarModule } from './modules/tashkilotlar/tashkilotlar.module';
import { TamirJadvaliService } from './modules/tamir-jadvali/tamir-jadvali.service';
import { TamirJadvaliController } from './modules/tamir-jadvali/tamir-jadvali.controller';
import { TamirJadvaliModule } from './modules/tamir-jadvali/tamir-jadvali.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQLHOST'),
        port: +configService.get('MYSQLPORT'),
        username: configService.get('MYSQLUSER'),
        password: configService.get('MYSQLPASSWORD'),
        database: configService.get('MYSQLDATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // development uchun, production'da false qilish kerak
        logging: true,
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Modules
    AuthModule,
    UsersModule,
    // RolesModule,
    VagonTurlariModule,
    TamirTurlariModule,
    VagonlarModule,
    VagonTamirMuddatlariModule,
    TashkilotlarModule,
    TamirJadvaliModule,
  ],
  providers: [VagonTurlariService, TamirTurlariService, VagonlarService, VagonTamirMuddatlariService, TashkilotlarService, TamirJadvaliService],
  controllers: [VagonlarController, TamirTurlariController, VagonlarController, VagonTamirMuddatlariController, TashkilotlarController, TamirJadvaliController],
})
export class AppModule {}