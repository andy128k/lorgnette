import {registerChainable} from './lens';
import {IdentityLens} from './identity';
import {MapLens, MapWithDefaultLens} from './map';
import {ArrayLens, ArrayFirstLens, ArrayLastLens} from './array';


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

