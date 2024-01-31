import { Injectable } from '@nestjs/common';
import { CollectionItemModel } from '../../models/collection-item.model';
import {
  CreateTextItemModelDto,
  UpdateCollectionTextItemModelDto,
} from '../models/dto/request.model';
import { TextItemModel } from '../models/text-item.model';

@Injectable()
export class CollectionTextItemRequestConverter {
  public execute(
    data: CreateTextItemModelDto | UpdateCollectionTextItemModelDto,
  ) {
    const collectionItem: CollectionItemModel = {
      type: data?.type,
      code: data?.code,
      organizational_resource_plant_id: data?.organizational_resource_plant_id,
      title: data?.title,
      description: data?.description,
      expiry_date: data?.expiry_date,
      file_path: data?.file_path,
      updated_at: new Date(),
    };
    const textItem: TextItemModel = {
      min_length: data?.min_length,
      max_length: data?.max_length,
      validate_min_length: data?.validate_min_length,
    };

    return {
      collectionItem,
      textItem,
    };
  }
}
