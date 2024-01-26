import { Injectable } from '@nestjs/common';
import { CollectionSelectItemModel } from './collection-select-item.model';
import { CollectionItemModel } from 'src/collection-text-item/collection-text-item.model';

@Injectable()
export class CollectionSelectItemConverter {
  public convertRequest(data: CollectionSelectItemModel) {
    const baseData: CollectionItemModel = {
      id: data?.id,
      type: data.type,
      code: data.code,
      workcenter_id: data.workcenter_id,
      title: data.title,
      description: data.description,
      filePath: data?.filePath,
      expiry_date: data.expiry_date,
    };
    return baseData;
  }
}
