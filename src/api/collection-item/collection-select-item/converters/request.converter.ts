import { Injectable } from '@nestjs/common';
import { CreateCollectionSelectItemRequestModelDto } from '../models/dto/request/createCollectionSelectItem.model';
import { CollectionItemModel } from '../../models/collection-item.model';

@Injectable()
export class CollectionSelectItemRequestConverter {
  public convertCreate(data: CreateCollectionSelectItemRequestModelDto) {
    const collectionItem: CollectionItemModel = {
      type: data?.type,
      code: data?.code,
      workcenter_id: data?.workcenter_id,
      title: data?.title,
      description: data?.description,
      expiry_date: data?.expiry_date,
      filePath: data?.filePath,
      updated_at: new Date(),
    };
    const selectOptions = data.options;

    return { collectionItem, selectOptions };
  }
}
