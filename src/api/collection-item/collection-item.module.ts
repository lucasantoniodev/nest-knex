import { Module } from '@nestjs/common';
import { CollectionTextItemModule } from './collection-text-item/collection-text-item.module';

@Module({
  imports: [CollectionTextItemModule],
})
export class CollectionItemModule {}
