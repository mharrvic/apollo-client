export type OptimisticWrapperFunction<
  T = (...args: any[]) => any
> = T & {
  // The .dirty(...) method of an optimistic function takes exactly the same
  // parameter types as the original function.
  dirty: T;
};

export type OptimisticWrapOptions = {
  max?: number;
  disposable?: boolean;
  makeCacheKey?(...args: any[]): any;
};

export { wrap } from 'optimism';

export class CacheKeyNode<KeyType = object> {
  private children: Map<any, CacheKeyNode<KeyType>> | null = null;
  private key: KeyType | null = null;

  lookup(...args: any[]): KeyType {
    return this.lookupArray(args);
  }

  lookupArray(array: any[]): KeyType {
    let node: CacheKeyNode<KeyType> = this;
    array.forEach(value => {
      node = node.getOrCreate(value);
    });
    return node.key || (node.key = Object.create(null));
  }

  getOrCreate(value: any): CacheKeyNode<KeyType> {
    const map = this.children || (this.children = new Map());
    let node = map.get(value);
    if (!node) {
      map.set(value, node = new CacheKeyNode<KeyType>());
    }
    return node;
  }
}
