import { ApiProperty } from '@nestjs/swagger';

export class SignInResDto {
  @ApiProperty({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5fZG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  token: string;

  @ApiProperty({
    description: 'Indicates if the sign in was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message indicating the result of the sign in',
    example: 'Sign in successful',
  })
  message: string;

  @ApiProperty({
    description: 'Data of the user',
    example: {
      username: 'john_doe',
      role: 'tutor',
      id: 1,
    },
  })
  data: {
    username: string;
    role: string;
    id: number;
  };
}

export class signInErrorResDto {
  @ApiProperty({
    description: 'Indicates if the sign in was successful',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message indicating the result of the sign in',
    example: 'Sign in failed',
  })
  message: string;
}