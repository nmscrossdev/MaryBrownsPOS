import { groupSaleConstants } from '../_constants';

export function tableRecord(state = {}, action) {
    switch (action.type) {
        case groupSaleConstants.GET_TABLE_RECORD_SUCCESS:
            return {
                tableRecord: action.tableRecord
            };
        case groupSaleConstants.GET_TABLE_RECORD_FAILURE:
            return {
                error: action.error
            };
        case groupSaleConstants.GET_TABLE_RECORD_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}
