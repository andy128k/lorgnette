import {registerChainable} from './lens';
import {IdentityLens} from './identity';
import {MapLens} from './map';
import {ArrayLens, ArrayFirstLens, ArrayLastLens} from './array';


registerChainable('prop', (property, dflt) => new MapLens(property, dflt));
registerChainable('at', (index) => new ArrayLens(index));
registerChainable('first', () => new ArrayFirstLens());
registerChainable('last', () => new ArrayLastLens());


export const lens = new IdentityLens();
export default lens;
export {multi} from './multilens';

