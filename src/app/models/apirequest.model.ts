import { Links } from "./links.model";
import { Page } from "./page.model";

export class ApiRequest<T> {
    page: Page;
    '_embedded': {
          href?: Array<T>
    };
    '_links': Links;
  }