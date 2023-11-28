import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export const StringNotEmpty = (name: string) => {
  return applyDecorators(
    IsString({
      message: `${name}是字符串`,
    }),
    IsNotEmpty({
      message: `${name}不能为空`,
    }),
  );
};
export const StringNotEmptyWithLen = (
  name: string,
  min?: number,
  max?: number,
) => {
  return applyDecorators(
    StringNotEmpty(name),
    Length(min, max, {
      message: `${name}不能为空`,
    }),
  );
};
