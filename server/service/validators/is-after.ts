import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import Maybe from 'graphql/tsutils/Maybe';

@ValidatorConstraint({ async: true })
class IsAfterConstraint implements ValidatorConstraintInterface {
  public async validate(value: Date, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const relatedValue: Maybe<Date> = (args.object as any)[relatedPropertyName];
    return (
      value instanceof Date &&
      relatedValue instanceof Date &&
      value > relatedValue
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
