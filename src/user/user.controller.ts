import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from './decorators/user_auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtUserAuthGuard } from './guards/jwt-guard';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth('defaultBearerAuth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return await this.userService.login(loginDto);
  }
  
  @UseGuards(JwtUserAuthGuard)
  @Get('profile')
  async getUserProfile(@AuthUser() authUser) {
    return await this.userService.getProfile(authUser);
  }

  @UseGuards(JwtUserAuthGuard)
  @Put('logout')
  async logout(@AuthUser() authUser) {
    return await this.userService.logout(authUser._id);
  }

  @UseGuards(JwtUserAuthGuard)
  @Put('update')
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser,
  ) {
    return await this.userService.updateProfile(authUser._id, updateUserDto);
  }

 

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('test');
    return await this.userService.create(createUserDto);
  }
}
