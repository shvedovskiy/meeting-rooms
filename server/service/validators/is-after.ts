import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
class IsAfterConstraint implements ValidatorConstraintInterface {
  public async validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const relatedValue = (args.object as any)[relatedPropertyName];
    return (
      typeof value === 'string' &&
      typeof relatedValue === 'string' &&
      new Date(value) > new Date(relatedValue)
    );
  }

  public defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `'${args.property}' must be after '${relatedPropertyName}'`;
  }
}

export function IsAfter(
  property: string,
  validationOptions?: ValidationOptions
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsAfterConstraint,
    });
  };
}
