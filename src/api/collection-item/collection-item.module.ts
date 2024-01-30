import { Module } from '@nestjs/common';
import { CollectionTextItemModule } from './collection-text-item/collection-text-item.module';
import { CollectionSelectItemModule } from './collection-select-item/collection-select-item.module';
import { CollectionFormModule } from '../collection-form/collection-form.module';

@Module({
  imports: [CollectionTextItemModule, CollectionSelectItemModule, CollectionFormModule],
})
export class CollectionItemModule {}
