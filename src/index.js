import {just} from './maybe';
import {Lens, registerChainable} from './lens';
import {MapLens, MapWithDefaultLens} from './map';
import {ArrayLens, ArrayFirstLens, ArrayLastLens} from './array';

class IdentityLens extends Lens {
  get(obj) {
    return just(obj);
  }

  update(obj, func) {
    return func(obj);
  }
}

registerChainable('prop', (property, dflt) => {
  if (dflt)
    return new MapWithDefaultLens(property, dflt);
  else
    return new MapLens(property);
});


registerChainable('at', (index) => new ArrayLens(index));
registerChainable('first', () => new ArrayFirstLens());
registerChainable('last', () => new ArrayLastLens());


export default new IdentityLens();

