import { just } from "./maybe.mjs";
import { Lens } from "./lens.mjs";

export class IdentityLens extends Lens {
  get(obj) {
    return just(obj);
  }

  update(obj, func) {
    return func(obj);
  }
}
