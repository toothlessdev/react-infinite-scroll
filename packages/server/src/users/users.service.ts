import { Injectable } from '@nestjs/common';
import { HOST, PORT, PROTOCOL } from 'src/config/env';

import { getRandomNickname } from '@woowa-babble/random-nickname';
import { MoreThan, Repository } from 'typeorm';
import { UserModel } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginateUserDto } from './dto/paginate-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  public async createDummyUsers(size: number) {
    for (let i = 0; i < size; i++) {
      await this.createUser({
        id: i,
        name: getRandomNickname('animals'),
        email: `email${i}@princip.es`,
      });
    }
    return { message: `Successfully created ${size} dummy users` };
  }

  public async paginateUsers(paginateUserDto: PaginateUserDto) {
    // 커서 기반 페이지네이션
    const users = await this.usersRepository.find({
      where: {
        id: MoreThan(Number(paginateUserDto.where__id_more_than ?? 0)),
      },
      order: {
        createdAt: paginateUserDto.order__created_at,
      },
      take: Number(paginateUserDto.take ?? 5),
    });

    // 다음 페이지 URL 생성 (where__id_more_than 을 제외한 쿼리 파라미터는 그대로 유지)
    const nextUrl = new URL(`${PROTOCOL}://${HOST}:${PORT}/users`);
    const lastItem = users[users.length - 1] ?? null;

    for (const queryKey of Object.keys(paginateUserDto)) {
      if (queryKey === 'where__id_more_than')
        nextUrl.searchParams.append(queryKey, lastItem.id.toString());
      nextUrl.searchParams.append(queryKey, paginateUserDto[queryKey]);
    }

    return {
      users,
      pageInfo: {
        size: users.length,
        lastCursor: lastItem?.id ?? null,
        nextUrl:
          users.length < (paginateUserDto.take || 5)
            ? null
            : nextUrl.toString(),
      },
    };
  }

  public async deleteUser(id: number) {
    return this.usersRepository.delete(id);
  }
}
