import { writable } from 'svelte/store';

export default function collectionStore(Item, initialCollection = []) {
  const collection = writable([...initialCollection]);

  // Re-initialize
  collection.reset = function reset() {
    collection.update(() => {
      return [...initialCollection];
    });
  };

  collection.create = function create(value) {
    if (typeof value !== 'object') {
      value = { value };
    }
    const newItem = Item ? new Item(value) : { ...value };

    if(newItem.result && value.result){
      newItem.result.outcome = value.result.outcome;
    }
    
    collection.update((value) => {
      return [...value, newItem];
    });
    
    return newItem;
  };

  collection.remove = function remove(removeItem) {
    collection.update((items) => {
      return items.filter((item) => {
        return item !== removeItem;
      });
    });
  };

  return collection;
}
