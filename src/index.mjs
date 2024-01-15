import { registerChainable } from "./lens.mjs";
import { IdentityLens } from "./identity.mjs";
import { MapLens } from "./map.mjs";
import {
  ArrayPredicateLens,
  ArrayLens,
  ArrayFirstLens,
  ArrayLastLens,
} from "./array.mjs";

registerChainable("prop", (property, dflt) => new MapLens(property, dflt));
registerChainable("at", (index) => new ArrayLens(index));
registerChainable("first", () => new ArrayFirstLens());
registerChainable("last", () => new ArrayLastLens());
registerChainable("firstOf", (pred) => new ArrayPredicateLens(pred, true));
registerChainable("lastOf", (pred) => new ArrayPredicateLens(pred, false));

export const lens = new IdentityLens();
export default lens;
export { multi } from "./multilens.mjs";
export { just, nothing } from "./maybe.mjs";
