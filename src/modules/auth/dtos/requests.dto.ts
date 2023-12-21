import { ApiProperty } from '@nestjs/swagger';
export class SignInReqDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john',
  })
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'dummy_password',
  })
  password: string;
}
