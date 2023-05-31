import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import { dispatch, RootState, useSelector } from 'redux/store';
import { ACTION_TYPE, DATA_TYPE, KrowdTable, RowData } from '../krowd-table/KrowdTable';
import { getDailyReportProjectID } from 'redux/slices/krowd_slices/transaction';
import { LoadingButton } from '@mui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import * as xlsx from 'xlsx';
import axios from 'axios';
import eyeFill from '@iconify/icons-eva/eye-fill';

import { useSnackbar } from 'notistack';
import { fCurrency } from 'utils/formatNumber';
import { PATH_DASHBOARD_PROJECT } from 'routes/paths';
import { TransactionAPI } from '_apis_/krowd_apis/transaction';
import { Icon } from '@iconify/react';
import ProjectBillDailyReport from './ProjectBillDailyReport';
import { SeverErrorIllustration } from 'assets';
import { EXCEL_FILE_BASE64 } from 'config';
import FileSaver from 'file-saver';
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'center' },
  { id: 'name', label: 'TÊN ', align: 'center' },
  { id: 'reportDate', label: 'NGÀY BÁO CÁO', align: 'left' },
  { id: 'updateBy', label: 'CẬP NHẬT', align: 'left' },
  { id: 'updateBy', label: 'TRẠNG THÁI', align: 'left' },
  { id: 'amount', label: 'SỐ TIỀN', align: 'center' },
  { id: '', label: 'Báo cáo', align: 'center' }
];

const note = [
  {
    name: 'Lưu ý:'
  },
  {
    name: 'Khi tới hạn báo cáo bạn mới có thể đăng tải file lên.'
  },
  {
    name: 'Dữ liệu sẽ được thay đổi nếu bạn đã đăng tải một file trước đó rồi.'
  }
];
export default function ProjectReportRevenue() {
  const { dailyReportState, dailyReportDetails } = useSelector(
    (state: RootState) => state.transaction
  );
  const { isLoading, listOfDailyReport: list, numOfDailyReport } = dailyReportState;
  const { DailyDetails: details } = dailyReportDetails;

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize1, setPageSize1] = useState(1);
  const [secretKey, setSecretKey] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [ProjectIDClient, setProjectIDClient] = useState('');
  const [pageSize, setPageSize] = useState(8);
  const [dataExcel, setDataExcel] = useState<any>();

  const projectId = localStorage.getItem('projectId');

  useEffect(() => {
    dispatch(getDailyReportProjectID(localStorage.getItem('projectId') ?? '', pageIndex ?? 1));
  }, [pageIndex]);
  // const [openStage, setOpenStage] = useState('KROWD_UPLOAD');
  const [openKrowdUpload, setOpenKrowdUpload] = useState(false);
  const [openStepUpload, setOpenKrowdStepUpload] = useState(false);
  const [openBillDaily, setOpenKrowdBillDaily] = useState(false);
  const [openClientUpload, setOpenClientUpload] = useState(false);
  const [openGuideKrowd, setOpenGuideKrowd] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDownload = (e: any) => {
    let sliceSize = 1024;
    const byteCharacters = atob(EXCEL_FILE_BASE64);
    let bytesLength = byteCharacters.length;
    let slicesCount = Math.ceil(bytesLength / sliceSize);
    let byteArrays = new Array(slicesCount);
    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      let begin = sliceIndex * sliceSize;
      let end = Math.min(begin + sliceSize, bytesLength);
      let bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    FileSaver.saveAs(
      new Blob(byteArrays, { type: 'application/vnd.ms-excel' }),
      'Báo cáo doanh thu.xlsx'
    );
  };
  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setFieldValue('bills', json);
        setDataExcel(json ?? []);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleClickOpenBill = async () => {
    setOpenKrowdBillDaily(true);
  };
  const handleClickOpenStage = async () => {
    setOpenKrowdUpload(true);
  };

  const handleClickOpenGuideKrowd = async () => {
    setOpenGuideKrowd(true);
  };

  const handleClickOpenClientUpload = async () => {
    setOpenClientUpload(true);
  };
  const handleClickCloseClientUpload = async () => {
    setSecretKey('');
    setAccessKey('');
    setProjectIDClient('');
    setOpenClientUpload(false);
  };
  const handleCloseOpenStage = () => {
    setOpenKrowdUpload(false);
    setDataExcel([]);
  };
  function getToken() {
    return window.localStorage.getItem('accessToken');
  }
  function getHeaderFormData() {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  }
  const renderAction = () => {
    return (
      <Grid
        container
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={1}
      >
        <Grid>
          <Button onClick={() => handleClickOpenGuideKrowd()} variant="outlined">
            Hướng dẫn tải báo cáo lên Krowd
          </Button>
          <Box>
            <Dialog maxWidth={false} open={openKrowdUpload}>
              {details?.status === 'REPORTED' && (
                <>
                  <DialogTitle textAlign={'center'} color="#ef7d08">
                    BẠN ĐÃ BÁO CÁO Ở NGÀY NÀY RỒI!
                    <br />
                    Nếu bạn tiếp tục thực hiện thao tác sẽ ghi đè lên dữ liệu lúc trước
                  </DialogTitle>
                  <>
                    <DialogContent sx={{ mt: 3, fontWeight: 700 }}>
                      Chọn file định dạng Excel để tải lên
                    </DialogContent>

                    <Box sx={{ mb: 3, mx: 3 }}>
                      <form>
                        <label htmlFor="upload"></label>
                        <input type="file" name="upload" id="upload" onChange={readUploadFile} />
                      </form>
                    </Box>
                    <DialogContent>
                      <Typography variant="h6">Chi tiết đơn hàng:</Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell align="left">Số tiền</TableCell>
                              <TableCell align="left">Người tạo</TableCell>
                              <TableCell align="left">Ngày tạo</TableCell>
                              <TableCell align="left">Mô tả</TableCell>
                              <TableCell align="right" />
                            </TableRow>
                          </TableHead>
                          {dataExcel &&
                            dataExcel.map((e: any) => (
                              <>
                                <TableBody key={e.invoiceId}>
                                  <TableRow>
                                    <TableCell>
                                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                                        {fCurrency(e.amount)}
                                      </Typography>
                                    </TableCell>

                                    <TableCell>
                                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                                        {e.createby}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                                        {e.createdate}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                                        {e.description ?? 'Không có mô tả'}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </>
                            ))}
                        </Table>
                      </TableContainer>
                    </DialogContent>
                    <Stack direction="row" justifyContent="flex-end" sx={{ p: 2, my: 1 }}>
                      <FormikProvider value={formik}>
                        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                          <Box display="flex">
                            <Button
                              fullWidth
                              type="button"
                              color="error"
                              variant="contained"
                              size="large"
                              onClick={() => handleCloseOpenStage()}
                              sx={{ mr: 1.5 }}
                            >
                              Hủy báo cáo
                            </Button>
                            <LoadingButton
                              type="submit"
                              variant="contained"
                              size="large"
                              loading={isSubmitting}
                              sx={{ width: 180 }}
                            >
                              Báo cáo
                            </LoadingButton>
                          </Box>
                        </Form>
                      </FormikProvider>
                    </Stack>
                  </>
                </>
              )}
              {(details?.status === 'DUE' || details?.status === 'NOT_REPORTED') && (
                <>
                  <DialogTitle textAlign={'center'} color={'#14b7cc'}>
                    BÁO CÁO QUA HỆ THỐNG CỦA KROWD
                  </DialogTitle>{' '}
                  <DialogContent sx={{ mt: 3, fontWeight: 700 }}>
                    Chọn file định dạng Excel để tải lên
                  </DialogContent>
                  <Box sx={{ mb: 3, mx: 3 }}>
                    <form>
                      <label htmlFor="upload"></label>
                      {/* <input type="file" name="upload" id="upload" /> */}
                      <input type="file" name="upload" id="upload" onChange={readUploadFile} />
                    </form>
                  </Box>
                  <DialogContent>
                    <Typography variant="h6">Chi tiết đơn hàng:</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="left">Số tiền</TableCell>
                            <TableCell align="left">Người tạo</TableCell>
                            <TableCell align="left">Ngày tạo</TableCell>
                            <TableCell align="left">Mô tả</TableCell>
                            <TableCell align="right" />
                          </TableRow>
                        </TableHead>
                        {dataExcel &&
                          dataExcel.map((e: any) => (
                            <>
                              <TableBody key={e.invoiceId}>
                                <TableRow>
                                  <TableCell>
                                    <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                                      {fCurrency(e.amount)}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                                      {e.createby}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                                      {e.createdate}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                                      {e.description ?? 'Không có mô tả'}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </>
                          ))}
                      </Table>
                    </TableContainer>
                  </DialogContent>
                  <Stack direction="row" justifyContent="flex-end" sx={{ p: 2, my: 1 }}>
                    <FormikProvider value={formik}>
                      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <Box display="flex">
                          <Button
                            fullWidth
                            type="button"
                            color="error"
                            variant="contained"
                            size="large"
                            onClick={() => handleCloseOpenStage()}
                            sx={{ mr: 1.5 }}
                          >
                            Đóng
                          </Button>
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            size="large"
                            loading={isSubmitting}
                            sx={{ width: 180 }}
                          >
                            Báo cáo
                          </LoadingButton>
                        </Box>
                      </Form>
                    </FormikProvider>
                  </Stack>
                </>
              )}

              {details?.status === 'UNDUE' && (
                <>
                  <DialogTitle textAlign={'center'} color={'#946f07'}>
                    CHƯA TỚI NGÀY BÁO CÁO
                  </DialogTitle>{' '}
                  <Box p={3}>
                    <Typography variant="h6">
                      Bạn không thể thực hiện thao tác này ngay bây giờ
                    </Typography>
                    <Box>
                      <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
                    </Box>
                    <DialogActions>
                      <Button
                        fullWidth
                        type="button"
                        color="error"
                        variant="contained"
                        size="large"
                        onClick={() => handleCloseOpenStage()}
                        sx={{ mr: 1.5 }}
                      >
                        Đóng
                      </Button>
                    </DialogActions>
                  </Box>
                </>
              )}
            </Dialog>
          </Box>
          <Box>
            <Dialog maxWidth={false} open={openGuideKrowd} onClose={() => setOpenGuideKrowd(false)}>
              <DialogTitle>Hướng dẫn báo cáo qua hệ thống của KROWD</DialogTitle>
              <Box sx={{ mx: 3 }}>
                <Typography color={'#f66f2a'} variant="body1">
                  *Dùng file Excel mà Krowd Admin đã cung cấp cho bạn.
                </Typography>
              </Box>
              <Box sx={{ mx: 3, mt: 2 }}>
                <Button variant="contained" onClick={handleDownload}>
                  Tải file báo cáo tại đây
                </Button>
              </Box>
              <Box sx={{ my: 2, mx: 3 }}>
                <Typography variant="h6">Bước 1: Chọn vào biểu tượng tải lên</Typography>
                <img width={1000} src="/static/icons/navbar/KrowdPOS.png" />
                <img width={500} src="/static/icons/navbar/KrowdPOS2.png" />
              </Box>
              <Box display={'flex'} justifyContent={'flex-end'} mb={2}>
                <Button
                  type="button"
                  color="error"
                  variant="contained"
                  size="medium"
                  onClick={() => setOpenGuideKrowd(false)}
                >
                  {/* <Icon width={30} height={30} icon={codeFill} /> */}
                  Đóng
                </Button>
              </Box>
            </Dialog>
          </Box>
          <Box>
            <Dialog
              maxWidth={false}
              open={openClientUpload}
              onClose={() => handleClickCloseClientUpload()}
            >
              <DialogTitle>Lấy mã của dự án của bạn</DialogTitle>
              <DialogContent>
                <Box my={2}>
                  <Box display={'flex'} alignItems={'center'} gap={3}>
                    <Typography variant="h6">SecretKey của bạn:</Typography>
                    <Typography>{secretKey}</Typography>
                  </Box>
                  <Box display={'flex'} alignItems={'center'} gap={3}>
                    <Typography variant="h6">AccessKey của bạn:</Typography>
                    <Typography>{accessKey}</Typography>
                  </Box>
                  <Box display={'flex'} alignItems={'center'} gap={3}>
                    <Typography variant="h6">Mã dự án (projectId) của bạn là :</Typography>
                    <Typography>{ProjectIDClient}</Typography>
                  </Box>
                </Box>
                {accessKey && (
                  <>
                    <Box my={5}>
                      <Typography variant="h6">Kế tiếp</Typography>
                      <Typography>
                        Sử dụng API của Krowd để lấy mã signature cho tải đơn hàng:
                        <br />
                        https://ec2-13-215-197-250.ap-southeast-1.compute.amazonaws.com/api/public/v1.0/POS/generate-sig
                      </Typography>
                    </Box>
                    <img src="/static/icons/navbar/ClientPOS.png" />
                    <Typography sx={{ my: 3 }}>
                      Khi thành công sẽ trả về cho bạn một signature
                      <br />
                      ví dụ: 62d771b6*************b1e8560bd1992**********966415c7da4c5d***********
                    </Typography>
                    <Box my={5}>
                      <Typography variant="h6">Bước kế tiếp</Typography>
                      <Typography>
                        Sử dụng API của Krowd để tải đơn hàng lên:
                        <br />
                        https://ec2-13-215-197-250.ap-southeast-1.compute.amazonaws.com/api/public/v1.0/POS/Client-upload
                      </Typography>
                    </Box>
                    <img src="/static/icons/navbar/ClientPOS2.png" />
                    <Typography color={'#ff9500'}>
                      Lưu ý: Có thể tải lên 1 lúc nhiều đơn hàng cùng lúc
                    </Typography>
                    <img src="/static/icons/navbar/ClientPOS3.png" />
                  </>
                )}
              </DialogContent>

              <Stack direction="row" justifyContent="flex-end" sx={{ p: 2, my: 1 }}>
                <Box display={'flex'} justifyContent={'flex-end'}>
                  <Button
                    fullWidth
                    type="button"
                    color="error"
                    variant="contained"
                    size="large"
                    onClick={() => handleClickCloseClientUpload()}
                    sx={{ mr: 1.5 }}
                  >
                    Đóng
                  </Button>
                  {!accessKey && (
                    <FormikProvider value={formikClient}>
                      <Form noValidate autoComplete="off" onSubmit={handleSumitClient}>
                        <LoadingButton
                          sx={{ width: 160 }}
                          type="submit"
                          variant="contained"
                          size="large"
                          loading={isSubmitingClient}
                        >
                          Lấy mã
                        </LoadingButton>
                      </Form>
                    </FormikProvider>
                  )}
                </Box>
              </Stack>
            </Dialog>
          </Box>
        </Grid>
        <Grid>
          <Button variant="outlined" onClick={() => handleClickOpenClientUpload()}>
            Hướng dẫn dùng Krowd API vào POS bán hàng
          </Button>
        </Grid>
      </Grid>
    );
  };
  const formik = useFormik({
    initialValues: {
      date: details?.reportDate,
      projectId: projectId,
      bills: ''
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();
        await axios
          .post(
            `https://ec2-13-215-197-250.ap-southeast-1.compute.amazonaws.com/api/public/v1.0/POS/Krowd-upload`,
            values,
            { headers: headers }
          )
          .then(() => {
            enqueueSnackbar('Cập nhật thành công', {
              variant: 'success'
            });
            dispatch(
              getDailyReportProjectID(localStorage.getItem('projectId') ?? '', pageIndex ?? 1)
            );
            handleCloseOpenStage();
          })
          .catch(() => {
            enqueueSnackbar('Cập nhật thất bại vui lòng kiểm tra lại thông tin', {
              variant: 'error'
            });
          });

        // navigate(PATH_DASHBOARD.admin.listBusiness);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const formikClient = useFormik({
    initialValues: {},
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await TransactionAPI.postKeyClient(projectId ?? '').then((res) => {
          setSecretKey(res.data.secretKey);
          setAccessKey(res.data.accessKey);
          setProjectIDClient(res.data.projectId);
        });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  const {
    errors: errorClient,
    values: vlauesClient,
    touched: touchedClient,
    handleSubmit: handleSumitClient,
    isSubmitting: isSubmitingClient,
    setFieldValue: setFieldValueClient,
    getFieldProps: getFieldPropsClient
  } = formikClient;
  const getData = (): RowData[] => {
    if (!list) return [];
    return list.map<RowData>((_item, _idx) => {
      return {
        id: _item.id,
        items: [
          {
            name: 'idx',
            value: _idx + 1,
            type: DATA_TYPE.NUMBER
          },
          {
            name: 'stageName',
            value: _item.stageName,
            type: DATA_TYPE.NUMBER
          },
          {
            name: 'reportDate',
            value: _item.reportDate.toString().substring(0, 11),
            type: DATA_TYPE.DATE
          },

          {
            name: 'updateBy',
            value:
              (_item.updateBy === 'Client' && 'Đã cập nhật qua KROWD') ||
              (_item.updateBy === null && 'Chưa cập nhật'),
            type: DATA_TYPE.TEXT_FORMAT
          },

          {
            name: 'status',
            value:
              (_item.status === 'NOT_REPORTED' && 'Bạn chưa báo cáo ngày này') ||
              (_item.status === 'REPORTED' && 'Bạn đã báo cáo') ||
              (_item.status === 'DUE' && 'Hôm nay bạn cần báo cáo ngày này') ||
              (_item.status === 'UNDUE' && 'Ngày này chưa tới hạn báo cáo') ||
              (_item.status === null && 'Chưa cập nhật'),
            type: DATA_TYPE.TEXT_FORMAT,
            textColor:
              (_item.status === 'DUE' && '#14b7cc') ||
              (_item.status === 'REPORTED' && 'green') ||
              (_item.status === 'UNDUE' && '#b9a206') ||
              (_item.status === 'NOT_REPORTED' && 'red') ||
              (_item.status === 'NOT_REPORTED' ? 'red' : 'black')
          },
          {
            name: 'amount',
            value: `${_item.amount} đ`,
            type: DATA_TYPE.NUMBER_FORMAT
          }
        ]
      };
    });
  };
  return (
    <>
      <KrowdTable
        headingTitle="BÁO CÁO DOANH THU HẰNG NGÀY"
        header={TABLE_HEAD}
        getData={getData}
        isLoading={isLoading}
        action={renderAction()}
        openBill={() => handleClickOpenBill()}
        openKrowdReport={() => handleClickOpenStage()}
        noteTable={note}
        paging={{
          pageIndex,
          pageSize: pageSize,
          numberSize: numOfDailyReport,

          handleNext() {
            setPageIndex(pageIndex + 1);
          },
          handlePrevious() {
            setPageIndex(pageIndex - 1);
          }
        }}
      />
      {openBillDaily && (
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color={'error'}
              onClick={() => setOpenKrowdBillDaily(false)}
            >
              Đóng lại
            </Button>
          </Box>
          <ProjectBillDailyReport />
        </Card>
      )}
    </>
  );
}
