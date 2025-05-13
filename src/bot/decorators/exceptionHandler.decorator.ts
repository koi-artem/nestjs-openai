import { Logger } from '@nestjs/common';

export function CatchUnhandledErrors(): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        Logger.error(
          `Unhandled error in ${String(propertyKey)}: ${error.message}`,
          error.stack,
        );
        return;
      }
    };

    return descriptor;
  };
}
