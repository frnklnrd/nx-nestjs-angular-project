import { Logger } from '@nestjs/common';

export abstract class AbstractAppController {
  protected readonly logger = new Logger(this.getClassName());

  protected abstract getClassName(): string;
}
