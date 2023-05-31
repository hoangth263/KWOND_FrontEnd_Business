import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import { TransactionAPI } from '../../../_apis_/krowd_apis/transaction';
import {
  Bill,
  KeyClientUpload,
  ListOfDailyReport,
  ListOfWalletTransaction,
  ListOfWithdrawRequest,
  Transaction,
  WalletTransaction
} from '../../../@types/krowd/transactionKrowd/transaction';
// ----------------------------------------------------------------------

type TransactionState = {
  transactionState: {
    error: boolean;
    isLoading: boolean;
    listOfAccountTransaction: Transaction[];
    numOfAccountTransaction: number;
  };
  transactionWithdrawState: {
    isLoading: boolean;
    listOfWithdrawRequest: ListOfWithdrawRequest[];
    numOfWithdrawRequest: number;

    error: boolean;
  };
  transactionWithdrawDetail: {
    isLoading: boolean;
    TransactionWithdrawDetail: ListOfWithdrawRequest | null;
    error: boolean;
  };
  //====================WALLET TRANSACTION============================

  walletTransactionState: {
    isLoading: boolean;
    listOfWalletTransaction: ListOfWalletTransaction[];
    error: boolean;
    numOfWalletTransaction: number;
  };
  //====================DAILY REPORT==================================
  dailyReportState: {
    isLoading: boolean;
    listOfDailyReport: ListOfDailyReport[];
    numOfDailyReport: number;
    error: boolean;
  };
  dailyReportDetails: {
    isLoading: boolean;
    DailyDetails: ListOfDailyReport | null;
    numOfDailyReport: number;
    error: boolean;
  };
  //====================BILLS IN DAILY REPORT=========================
  biilDailyReportState: {
    isLoading: boolean;
    listOfBill: Bill[];
    numOfBill: number;
    error: boolean;
  };
  //====================KEY CLIENT UPLOAD=========================
  keyClientUploadState: {
    isLoading: boolean;
    key: KeyClientUpload | null;
    error: boolean;
  };
};

const initialState: TransactionState = {
  transactionState: {
    isLoading: false,
    listOfAccountTransaction: [],
    error: false,
    numOfAccountTransaction: 0
  },
  transactionWithdrawState: {
    isLoading: false,
    numOfWithdrawRequest: 0,
    listOfWithdrawRequest: [],
    error: false
  },
  transactionWithdrawDetail: {
    isLoading: false,
    TransactionWithdrawDetail: null,
    error: false
  },
  //====================WALLET TRANSACTION============================

  walletTransactionState: {
    isLoading: false,
    listOfWalletTransaction: [],
    error: false,
    numOfWalletTransaction: 0
  },
  //====================DAILY REPORT==================================

  dailyReportState: {
    isLoading: false,
    listOfDailyReport: [],
    numOfDailyReport: 0,
    error: false
  },
  dailyReportDetails: {
    isLoading: false,
    DailyDetails: null,
    numOfDailyReport: 0,
    error: false
  },
  //====================BILLS IN DAILY REPORT=========================

  biilDailyReportState: {
    isLoading: false,
    listOfBill: [],
    numOfBill: 0,
    error: false
  },
  //====================KEY CLIENT UPLOAD=========================

  keyClientUploadState: {
    isLoading: false,
    key: null,
    error: false
  }
};

const slice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    // ------ GET ALL TRANSACTION ------------ //
    startLoadingTransactionList(state) {
      state.transactionState.isLoading = true;
    },
    hasGetTransactionError(state, action) {
      state.transactionState.isLoading = false;
      state.transactionState.error = action.payload;
    },
    getTransactionListSuccess(state, action) {
      state.transactionState.isLoading = false;
      state.transactionState = action.payload;
    },
    // ------ GET ALL TRANSACTION WALLET------------ //
    startLoadingWalletTransactionList(state) {
      state.walletTransactionState.isLoading = true;
    },
    hasGetWalletTransactionError(state, action) {
      state.walletTransactionState.isLoading = false;
      state.walletTransactionState.error = action.payload;
    },
    getWalletTransactionListSuccess(state, action) {
      state.walletTransactionState.isLoading = false;
      state.walletTransactionState = action.payload;
    }, // ------ GET ALL WITHDRAW REQUEST TRANSACTION ------------ //
    startLoadingWithdrawTransactionList(state) {
      state.transactionWithdrawState.isLoading = true;
    },
    hasGetWithdrawTransactionError(state, action) {
      state.transactionWithdrawState.isLoading = false;
      state.transactionWithdrawState.error = action.payload;
    },
    getWithdrawTransactionListSuccess(state, action) {
      state.transactionWithdrawState.isLoading = false;
      state.transactionWithdrawState = action.payload;
    }, // ------ GET ALL WITHDRAW REQUEST TRANSACTION BY ID------------ //
    startLoadingWithdrawTransactionById(state) {
      state.transactionWithdrawDetail.isLoading = true;
    },
    hasGetWithdrawTransactionByIdError(state, action) {
      state.transactionWithdrawDetail.isLoading = false;
      state.transactionWithdrawDetail.error = action.payload;
    },
    getWithdrawTransactionByIdSuccess(state, action) {
      state.transactionWithdrawDetail.isLoading = false;
      state.transactionWithdrawDetail.TransactionWithdrawDetail = action.payload;
    },
    // ------ GET ALL DAILY REPORT------------ //

    startLoadingDailyReportList(state) {
      state.dailyReportState.isLoading = true;
    },
    hasGetDailyReportError(state, action) {
      state.dailyReportState.isLoading = false;
      state.dailyReportState.error = action.payload;
    },
    getDailyReportSuccess(state, action) {
      state.dailyReportState.isLoading = false;
      state.dailyReportState = action.payload;
    },

    // ------ GET ALL DAILY WITH ID------------ //
    startLoadingDailyReportDetails(state) {
      state.dailyReportDetails.isLoading = true;
    },
    hasGetDailyReportDetailsError(state, action) {
      state.dailyReportDetails.isLoading = false;
      state.dailyReportDetails.error = action.payload;
    },
    getDailyReportDetailsSuccess(state, action) {
      state.dailyReportDetails.isLoading = false;
      state.dailyReportDetails.DailyDetails = action.payload;
    },

    // ------ GET ALL BILL IN DAILY REPORT------------ //

    startLoadingBillDailyReportList(state) {
      state.biilDailyReportState.isLoading = true;
    },
    hasGetBillDailyReportError(state, action) {
      state.biilDailyReportState.isLoading = false;
      state.biilDailyReportState.error = action.payload;
    },
    getBillDailyReportSuccess(state, action) {
      state.biilDailyReportState.isLoading = false;
      state.biilDailyReportState = action.payload;
    },

    // ------ GET KEY CLIENT------------ //
    startLoadingKeyClient(state) {
      state.keyClientUploadState.isLoading = true;
    },
    hasGetKeyClientError(state, action) {
      state.keyClientUploadState.isLoading = false;
      state.keyClientUploadState.error = action.payload;
    },
    getKeyClientSuccess(state, action) {
      state.keyClientUploadState.isLoading = false;
      state.keyClientUploadState.key = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

//---------------------------- GET ALL TRANSACTION------------------------------

export function getTransactionList(pageIndex: number, pageSize: number) {
  return async () => {
    dispatch(slice.actions.startLoadingTransactionList());
    try {
      const response = await TransactionAPI.getsTransaction({
        pageIndex: pageIndex,
        pageSize: pageSize
      });
      dispatch(slice.actions.getTransactionListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasGetTransactionError(error));
    }
  };
}
//---------------------------- GET WALLET TRANSACTION------------------------------

export function getWalletTransactionList(walletId: string, pageIndex: number, pageSize: number) {
  return async () => {
    dispatch(slice.actions.startLoadingWalletTransactionList());
    try {
      const response = await TransactionAPI.getsWalletTransaction({
        walletId: walletId,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
      dispatch(slice.actions.getWalletTransactionListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasGetWalletTransactionError(error));
    }
  };
} //---------------------------- GET ALL DAILY REPORT------------------------------

export function getDailyReportProjectID(projectId: string, pageIndex: number) {
  return async () => {
    dispatch(slice.actions.startLoadingDailyReportList());
    try {
      const response = await TransactionAPI.getsDailyReport(projectId, pageIndex);
      dispatch(slice.actions.getDailyReportSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasGetDailyReportError(error));
    }
  };
}
//---------------------------- GET DAILY REPORT ID------------------------------

export function getDailyReportByID(id: string) {
  return async () => {
    dispatch(slice.actions.startLoadingDailyReportDetails());
    try {
      const response = await TransactionAPI.getsDailyReportByID(id);
      dispatch(slice.actions.getDailyReportDetailsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasGetDailyReportDetailsError(error));
    }
  };
}
//---------------------------- GET ALL BILL IN DAILY REPORT------------------------------

export function getBillDailyReport(dailyId: string, pageIndex: number) {
  return async () => {
    dispatch(slice.actions.startLoadingBillDailyReportList());
    try {
      const response = await TransactionAPI.getsBillDailyReport(dailyId, pageIndex);
      dispatch(slice.actions.getBillDailyReportSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasGetBillDailyReportError(error));
    }
  };
}
//---------------------------- GET ALL WITHDRAW REQUEST TRANSACTION------------------------------

export function getWithdrawRequestTransactionList(
  userId: string,
  pageIndex: number,
  pageSize: number
) {
  return async () => {
    dispatch(slice.actions.startLoadingWithdrawTransactionList());
    try {
      const response = await TransactionAPI.getsWithdrawTransaction({
        userId: userId,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
      dispatch(slice.actions.getWithdrawTransactionListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasGetWithdrawTransactionError(error));
    }
  };
}
//---------------------------- GET ALL WITHDRAW REQUEST TRANSACTION BY ID------------------------------

export function getWithdrawRequestTransactionById(id: string) {
  return async () => {
    dispatch(slice.actions.startLoadingWithdrawTransactionById());
    try {
      const response = await TransactionAPI.getsWithdrawTransactionById(id);
      dispatch(slice.actions.getWithdrawTransactionByIdSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasGetWithdrawTransactionByIdError(error));
    }
  };
}
