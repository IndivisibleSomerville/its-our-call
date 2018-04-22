import * as districtData from './usa-districts-dimensions.json';

interface Object {
  viewBox: string;
}
// tslint:disable-next-line:no-any
export default (districtData as any) as Object;
