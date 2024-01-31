import { ItemForm } from '../collection-form.model';

export interface CreateCollectionForm {
  name: string;
  description: string;
  items: ItemForm[];
}
