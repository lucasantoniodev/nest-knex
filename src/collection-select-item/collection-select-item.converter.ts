import { Injectable } from '@nestjs/common';
import {
  CollectionSelectItemModel,
  CollectionSelectItemUpdateRequestDto,
} from './collection-select-item.model';
import { CollectionItemModel } from 'src/collection-text-item/collection-text-item.model';

@Injectable()
export class CollectionSelectItemConverter {
  public convertCreatRequest(data: CollectionSelectItemModel) {
    return this.buildCollectionItemModel(data);
  }

  public convertUpdateRequest(
    id: string,
    idItem: string,
    data: CollectionSelectItemUpdateRequestDto,
  ) {
    const baseData: CollectionItemModel = this.buildCollectionItemModel(data);
    baseData.id = id;
    const grandChildData = { ...data.options, id: idItem };
    return { baseData, grandChildData };
  }

  private buildCollectionItemModel(data: any) {
    return {
      id: data?.id,
      type: data?.type,
      code: data?.code,
      workcenter_id: data?.workcenter_id,
      title: data?.title,
      description: data?.description,
      filePath: data?.filePath,
      expiry_date: data?.expiry_date,
    };
  }
}
