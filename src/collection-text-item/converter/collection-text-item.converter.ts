import { Injectable } from '@nestjs/common';
import {
  CollectionItemModel,
  CollectionTextItemUpdateRequestDto,
  CreateCollectionTextItemRequestDto,
  TextItemModel,
} from '../collection-text-item.model';

@Injectable()
export class CollectionTextItemConverter {
  public convertCreateRequest(data: CreateCollectionTextItemRequestDto) {
    const baseData: CollectionItemModel = {
      type: data.type,
      code: data.code,
      workcenter_id: data.workcenter_id,
      title: data.title,
      description: data.description,
      expiry_date: data.expiry_date,
      filePath: data?.filePath,
    };
    const childData: TextItemModel = {
      min_length: data?.min_length,
      max_length: data.max_length,
      validate_min_length: data.validate_min_length,
    };

    return {
      baseData,
      childData,
    };
  }

  public convertUpdateRequest(
    id: string,
    data: CollectionTextItemUpdateRequestDto,
  ) {
    const baseData: CollectionItemModel = {
      id,
      type: data?.type,
      code: data?.code,
      workcenter_id: data?.workcenter_id,
      title: data?.title,
      description: data?.description,
      expiry_date: data?.expiry_date,
      filePath: data?.filePath,
    };
    const childData: TextItemModel = {
      collection_item_id: id,
      min_length: data?.min_length,
      max_length: data?.max_length,
      validate_min_length: data?.validate_min_length,
    };

    return {
      baseData,
      childData,
    };
  }
}
