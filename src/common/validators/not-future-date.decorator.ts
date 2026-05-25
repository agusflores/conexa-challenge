import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: Date) {
          if (!value) return false;

          return new Date(value).getTime() <= Date.now();
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} cannot be a future date`;
        },
      },
    });
  };
}
