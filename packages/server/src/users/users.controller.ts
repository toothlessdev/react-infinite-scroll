import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginateUserDto } from './dto/paginate-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  public async readUsers(@Query() query: PaginateUserDto) {
    return this.usersService.paginateUsers(query);
  }

  @Post('dummy/:size')
  public async createDummyUsers(@Param('size', ParseIntPipe) size: number) {
    return this.usersService.createDummyUsers(size);
  }

  @Delete(':id')
  public async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
