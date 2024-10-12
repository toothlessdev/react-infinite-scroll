import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/users/entities/user.entity';

export const TypeORMRootModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'database.db',
  entities: [UserModel],

  synchronize: true,
});
