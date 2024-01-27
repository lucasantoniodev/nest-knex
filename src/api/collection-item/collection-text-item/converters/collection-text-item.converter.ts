import { Injectable } from '@nestjs/common';
import { CollectionItemModel } from '../../models/collection-item.model';
import { CreateTextItemModelDto } from '../models/dto/create-text-item.model';
import { TextItemModel } from '../models/text-item.model';

@Injectable()
export class CollectionTextItemConverter {
  public convertCreateRequest(data: CreateTextItemModelDto) {
    const collectionItem: CollectionItemModel = {
      type: data.type,
      code: data.code,
      workcenter_id: data.workcenter_id,
      title: data.title,
      description: data.description,
      expiry_date: data.expiry_date,
      filePath: data?.filePath,
    };
    const textItem: TextItemModel = {
      min_length: data?.min_length,
      max_length: data.max_length,
      validate_min_length: data.validate_min_length,
    };

    return {
      collectionItem,
      textItem,
    };
  }
}