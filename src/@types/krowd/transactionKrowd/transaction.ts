export type AccountTransaction = {
  id: string;
  fromUserId: string;
  toUserId: string;
  description: string;
  status: string;
  createDate: Date | string | number;
  createBy: string;
  updateDate: Date | string | number;
  updateBy: string;
  isDeleted: boolean;
  AccountTransaction: {
    id: string;
    fromUserId: string;
    toUserId: string;
    description: string;
    status: string;
    createDate: Date | string | number;
    createBy: string;
    updateDate: Date | string | number;
    updateBy: string;
    isDeleted: boolean;
  }[];
};

export type WalletTransaction = {
  numOfWalletTransaction: number;
  listOfWalletTransaction: ListOfWalletTransaction[];
};

export type Transaction = {
  id: string;
  fromUserId: string;
  partnerClientId: string;
  amount: string;
  orderType: string;
  message: string;
  orderId: string;
  partnerCode: string;
  payType: string;
  signature: string;
  requestId: string;
  responsetime: string;
  resultCode: string;
  extraData: string;
  orderInfo: string;
  transId: string;
  createDate: string;
  type: string;
};

export type ListOfWalletTransaction = {
  id: string;
  paymentId: null;
  systemWalletId: null;
  projectWalletId: null;
  investorWalletId: null;
  amount: number;
  description: string;
  type: string;
  fromWalletId: null | string;
  toWalletId: string;
  fee: number;
  createDate: string;
  createBy: string;
};

export type PeriodRevenueHistory = {
  id: string;
  name: string;
  periodRevenueId: string;
  description: string;
  status: string;
  createDate: Date | string | number;
  createBy: string;
  updateDate: Date | string | number;
  updateBy: string;
  isDeleted: boolean;
}; // ===================================WITH DRAW REQUEST================================

export type WithDrawRequest = {
  numOfWithdrawRequest: number;
  listOfWithdrawRequest: ListOfWithdrawRequest[];
};

export type ListOfWithdrawRequest = {
  id: string;
  bankName: string;
  accountName: string;
  bankAccount: string;
  description: string;
  amount: number;
  status: string;
  refusalReason: null;
  createDate: string;
  reportMessage: null;
  createBy: string;
  updateDate: string;
  updateBy: string;
};
// ===================================DAILY REPORT================================

export type DailyReportProject = {
  numOfDailyReport: number;
  listOfDailyReport: ListOfDailyReport[];
};

export type ListOfDailyReport = {
  id: string;
  stageId: string;
  amount: number;
  stageName: string;
  reportDate: string;
  createDate: Date | string;
  createBy: string;
  updateDate: string;
  updateBy: string;
  status: string;
};
// ===================================BILL IN DAILY REPORT================================
export type BillDailyReport = {
  numOfBill: number;
  listOfBill: Bill[];
};

export type Bill = {
  id: string;
  dailyReportId: string;
  invoiceId: string;
  amount: number;
  description: string;
  createBy: string;
  createDate: string;
};
export type KeyClientUpload = {
  userId: string;
  projectId: string;
  projectName: string;
  accessKey: string;
  secretKey: string;
};
