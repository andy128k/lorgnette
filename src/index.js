import {registerChainable} from './lens';
import {IdentityLens} from './identity';
import {MapLens} from './map';
import {ArrayPredicateLens, ArrayLens, ArrayFirstLens, ArrayLastLens} from './array';


registerChainable('prop', (property, dflt) => new MapLens(property, dflt));
registerChainable('at', (index) => new ArrayLens(index));
registerChainable('first', () => new ArrayFirstLens());
registerChainable('last', () => new ArrayLastLens());
registerChainable('firstOf', (pred) => new ArrayPredicateLens(pred, true));
registerChainable('lastOf', (pred) => new ArrayPredicateLens(pred, false));


export const lens = new IdentityLens();
export default lens;
export {multi} from './multilens';
export {just, nothing} from './maybe';

