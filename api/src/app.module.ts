import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CharactersModule } from './characters/characters.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'rolemaster',
      password: 'mvp_password',
      database: 'rolemaster_db',
      autoLoadEntities: true,
      synchronize: true, //TODO=> désactiver en prod ce truc
    }),
    UsersModule,
    AuthModule,
    MailModule,
    CampaignsModule,
    CharactersModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
