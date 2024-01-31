import { Module } from '@nestjs/common';
import { CollectionSelectItemModule } from './collection-select-item/collection-select-item.module';
import { CollectionTextItemModule } from './collection-text-item/collection-text-item.module';

@Module({
  imports: [CollectionTextItemModule, CollectionSelectItemModule],
})
export class CollectionItemModule {}
