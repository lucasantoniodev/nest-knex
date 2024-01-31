import { Module } from '@nestjs/common';
import { CollectionFormModule } from './collection-form/collection-form.module';
import { CollectionItemModule } from './collection-item/collection-item.module';

@Module({
  imports: [CollectionFormModule, CollectionItemModule],
})
export class CollectionModule {}
