import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    // Delete in order to respect foreign key constraints
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const models = Reflect.ownKeys(this).filter(
      (key) => key[0] !== '_' && typeof key === 'string',
    );

    return Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      models.map((modelKey) => (this as any)[modelKey].deleteMany()),
    );
  }
}
