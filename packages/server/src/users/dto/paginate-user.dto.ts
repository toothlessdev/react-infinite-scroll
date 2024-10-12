export class PaginateUserDto {
  take?: number;
  where__id_more_than?: number;
  order__created_at?: 'ASC' | 'DESC';
}
