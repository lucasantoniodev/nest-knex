import { Module } from '@nestjs/common';
import { CollectionItemModule } from './api/collection-item/collection-item.module';
import { CollectionFormModule } from './api/collection-form/collection-form.module';

@Module({
  imports: [CollectionItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
