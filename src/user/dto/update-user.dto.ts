import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
  })
  first_name: string;

  @ApiProperty({
    type: String,
  })
  @ApiProperty({
    type: String,
  })
  last_name: string;

  @ApiProperty({
    type: String,
  })
  phone_no: string;

}
