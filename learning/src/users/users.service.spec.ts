import { Injectable } from '@nestjs/common';

export type Users = {
  id           : string,
  email         :string,
  password_hash :string,
  displayName   :string,
}


@Injectable()
export class UsersService {}
