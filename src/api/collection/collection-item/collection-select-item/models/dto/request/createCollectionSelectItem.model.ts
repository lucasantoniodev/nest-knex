import { CollectionItemModel } from 'src/api/collection/collection-item/models/collection-item.model';
import { SelectOptionModel } from '../../collection-select-item.model';

export interface CreateCollectionSelectItemRequestModelDto
  extends CollectionItemModel {
  options: SelectOptionModel[];
}
