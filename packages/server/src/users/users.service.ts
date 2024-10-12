import { Injectable, NotFoundException } from '@nestjs/common';
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

  public async paginateUsers(paginateUserDto: PaginateUserDto) {
    // 1. 커서 기반 페이지네이션
    const users = await this.usersRepository.find({
      where: { id: MoreThan(Number(paginateUserDto.where__id_more_than ?? 0)) },
      order: { createdAt: paginateUserDto.order__created_at ?? 'ASC' },
      take: Number(paginateUserDto.take ?? 5),
    });

    // 2. 다음 페이지 URL 생성
    const nextUrl = new URL(`${PROTOCOL}://${HOST}:${PORT}/users`);
    const lastItem = users[users.length - 1] ?? null;

    // where__id_more_than 을 제외한 쿼리 파라미터는 그대로 유지
    for (const queryKey of Object.keys(paginateUserDto)) {
      if (queryKey === 'where__id_more_than') nextUrl.searchParams.set(queryKey, lastItem.id.toString());
      else nextUrl.searchParams.append(queryKey, paginateUserDto[queryKey]);
    }

    // where__id_more_than이 존재하지 않으면 추가
    if (!Object.keys(paginateUserDto).includes('where__id_more_than')) {
      nextUrl.searchParams.set('where__id_more_than', lastItem.id.toString());
    }

    return {
      data: users,
      pageInfo: {
        size: users.length,
        lastCursor: lastItem?.id ?? null,
        // DB 에서 가져온 데이터 개수보다 페이지네이션으로 요청한 개수가 더 적으면 다음 페이지 없음
        nextUrl: users.length < (paginateUserDto.take || 5) ? null : nextUrl.toString(),
      },
    };
  }

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

  public async deleteUser(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`${id} 에 대한 유저가 존재하지 않습니다`);
    return this.usersRepository.delete(id);
  }
}
