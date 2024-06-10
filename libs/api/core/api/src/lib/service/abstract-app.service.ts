import { Logger } from '@nestjs/common';

export abstract class AbstractAppService {
  protected readonly logger = new Logger(this.getClassName());

  protected abstract getClassName(): string;
}
