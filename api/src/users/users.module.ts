import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  // 1. On déclare l'entité pour que TypeORM génère le Repository
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  // 2. On exporte le service pour que le AuthModule puisse s'en servir
  exports: [UsersService],
})
export class UsersModule {}
