import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UserService } from '../user.service';
@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private userService: UserService) {}
  async validate(email: string, args: ValidationArguments) {
    const user = await this.userService.findByEmail(email);
    console.log(user, 'user');
    if (user) return false;
    return true;
  }
}

export function IsUserEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserEmailAlreadyExistConstraint,
    });
  };
}
