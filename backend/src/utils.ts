import { BadRequestException, ParseIntPipe } from '@nestjs/common';

export function generateParseIntPipe(name: string) {
  return new ParseIntPipe({
    exceptionFactory: () => new BadRequestException(`${name}应该传数字`),
  });
}
