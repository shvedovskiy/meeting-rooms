import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import Maybe from 'graphql/tsutils/Maybe';
import parse from 'date-fns/parse';
import ruLocale from 'date-fns/locale/ru';

@ValidatorConstraint({ async: true })
class IsAfterConstraint implements ValidatorConstraintInterface {
  public async validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const relatedValue: Maybe<string> = (args.object as any)[
      relatedPropertyName
    ];
    return (
      typeof relatedValue === 'string' &&
      parse(value, 'HH:mm', Date.now(), { locale: ruLocale }) >
        parse(relatedValue, 'HH:mm', Date.now(), { locale: ruLocale })
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
