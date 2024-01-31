import { Module } from '@nestjs/common';
import { CollectionModule } from './api/collection/collection.module';

@Module({
  imports: [CollectionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
