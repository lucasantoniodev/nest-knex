import { CollectionItemModel } from 'src/api/collection-item/models/collection-item.model';
import { TextItemModel } from '../text-item.model';

export interface CreateTextItemModelDto
  extends CollectionItemModel,
    TextItemModel {}
