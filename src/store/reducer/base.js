import * as TYPES from '../action-types';
import _ from '../../assets/utils';

let inital = {
    info: null
}

export default function baseReducer(state=inital,action) {
    state=_.clone(state);
    switch(action.type){
        // 更新登陆者信息
        case TYPES.BASE_INFO:
            state.info=action.info;
            break;
        default:
    }
    return state;
};