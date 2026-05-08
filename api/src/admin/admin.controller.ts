import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CampaignsService } from '../campaigns/campaigns.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/role.guard';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  private adminService: any;
  constructor(
    private campaignsService: CampaignsService,
    private usersService: UsersService,
  ) {}

  // Permet de tout voir (ignorer le gm_id)
  @Get('campaigns')
  getAllCampaigns() {
    return this.campaignsService.findAllGlobal();
  }

  // Permet de détruire une campagne
  @Delete('campaigns/:id')
  deleteCampaign(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
