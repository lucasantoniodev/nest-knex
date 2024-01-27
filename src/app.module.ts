import { Module } from '@nestjs/common';
import { CollectionItemModule } from './api/collection-item/collection-item.module';

@Module({
  imports: [CollectionItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
