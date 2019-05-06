import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
class IsAlreadyExistConstraint implements ValidatorConstraintInterface {
  public async validate(value: string, args: ValidationArguments) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [entityObject, field] = args.constraints as [any, string];

    const object = await entityObject.findOne({ where: { [field]: value } });
    if (object) {
      return false;
    }
    return true;
  }

  public defaultMessage() {
    return 'Login already in use';
  }
}

export function IsAlreadyExist(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entityObject: any,
  field: string,
  validationOptions?: ValidationOptions
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [entityObject, field],
      options: validationOptions,
      validator: IsAlreadyExistConstraint,
    });
  };
}
