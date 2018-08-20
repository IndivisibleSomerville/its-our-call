// mappings for common conversions that don't need an API
import * as fipsToState from './FIPStoState.json';
import * as stateNameToPO from './StateNameToPO.json';
const FIPStoPO = (() => {
    var ret = {};
    for (var key in fipsToState) {
        if (fipsToState.hasOwnProperty(key)) {
            ret[key] = stateNameToPO[fipsToState[key]];
        }
    }
    return ret;
})();

// we might need the reverse mappings instead.
// tslint:disable-next-line:no-any
function swap (json: any) {
    var ret = {};
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            ret[json[key]] = key;
        }
    }
    return ret;
}
const StateToFIPS = swap(fipsToState);
const POtoStateName = swap(stateNameToPO);
const POtoFIPS = swap(FIPStoPO);

export { fipsToState, stateNameToPO, POtoStateName, StateToFIPS, POtoFIPS, FIPStoPO };