import { createSlice } from '@reduxjs/toolkit';
import { InvestmentAPI } from '_apis_/krowd_apis/investment';
import { FilterCount, Investments, ListOfInvestment } from '../../../@types/krowd/investment';
import { dispatch } from '../../store';

// ----------------------------------------------------------------------

type InvestmentState = {
  investmentState: {
    isLoading: boolean;
    listOfInvestment: ListOfInvestment[];
    numOfInvestment: number;
    error: boolean;
    filterCount: FilterCount | null;
  };
  investmentAllState: {
    isLoading: boolean;
    listOfInvestment: ListOfInvestment[];
    numOfInvestment: number;
    error: boolean;
    filterCount: FilterCount | null;
  };
  //====================WALLET Investment============================
};
const initialState: InvestmentState = {
  investmentState: {
    isLoading: false,
    listOfInvestment: [],
    numOfInvestment: 0,
    error: false,
    filterCount: null
  },
  investmentAllState: {
    isLoading: false,
    listOfInvestment: [],
    numOfInvestment: 0,
    error: false,
    filterCount: null
  }
};

const slice = createSlice({
  name: 'Investment',
  initialState,
  reducers: {
    // ------ GET ALL Investment In PROJECT ID ------------ //
    startLoadingInvestmentList(state) {
      state.investmentState.isLoading = true;
    },
    hasGetInvestmentError(state, action) {
      state.investmentState.isLoading = false;
      state.investmentState.error = action.payload;
    },
    getInvestmentListSuccess(state, action) {
      state.investmentState.isLoading = false;
      state.investmentState = action.payload;
    },
    // ------ GET ALL Investment ------------ //
    startLoadingInvestmentListAll(state) {
      state.investmentAllState.isLoading = true;
    },
    hasGetInvestmentAllError(state, action) {
      state.investmentAllState.isLoading = false;
      state.investmentAllState.error = action.payload;
    },
    getInvestmentListAllSuccess(state, action) {
      state.investmentAllState.isLoading = false;
      state.investmentAllState = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

//---------------------------- GET ALL Investment------------------------------

export function getInvestmentList(projectId: string, pageIndex: number, pageSize: number) {
  return async () => {
    dispatch(slice.actions.startLoadingInvestmentList());
    try {
      const response = await InvestmentAPI.getsInvestment({
        projectId: projectId,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
      dispatch(slice.actions.getInvestmentListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasGetInvestmentError(error));
    }
  };
}
export function getInvestmentListAll(projectId: string, pageIndex: number, pageSize: number) {
  return async () => {
    dispatch(slice.actions.startLoadingInvestmentListAll());
    try {
      const response = await InvestmentAPI.getsInvestment({
        projectId: projectId,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
      dispatch(slice.actions.getInvestmentListAllSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasGetInvestmentAllError(error));
    }
  };
}
