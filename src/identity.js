import {just} from './maybe';
import {Lens} from './lens';


export class IdentityLens extends Lens {
  get(obj) {
    return just(obj);
  }

  update(obj, func) {
    return func(obj);
  }
}

