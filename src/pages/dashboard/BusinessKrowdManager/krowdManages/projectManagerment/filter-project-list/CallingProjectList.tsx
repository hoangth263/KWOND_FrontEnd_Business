// material
import { Box, CircularProgress, Container, Typography } from '@mui/material';

import Page from 'components/Page';
import CallingProjectTable from 'components/table/project-table/filter-project-table/CallingProjectTable';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getBusinessById } from 'redux/slices/krowd_slices/business';
import { dispatch, RootState } from 'redux/store';
import { ErrorProject } from '../ProjectDetails';
// ----------------------------------------------------------------------

export default function CallingProjectList() {
  const { user } = useAuth();
  const { businessDetailState } = useSelector((state: RootState) => state.business);
  const { businessDetail, isLoading } = businessDetailState;

  useEffect(() => {
    dispatch(getBusinessById(user?.businessId));
  }, [dispatch]);
  return (
    <Page title="Dự án đang kêu gọi| Krowd dành cho quản lý">
      <Container maxWidth={false}>
        {(isLoading && (
          <Box>
            <CircularProgress
              size={100}
              sx={{ margin: '0px auto', padding: '1rem', display: 'flex' }}
            />
            <Typography variant="h5" sx={{ textAlign: 'center', padding: '1rem' }}>
              Đang tải dữ liệu, vui lòng đợi giây lát...
            </Typography>
          </Box>
        )) ||
          (businessDetail?.status === 'ACTIVE' && <CallingProjectTable />) || (
            <ErrorProject type="UNKNOWN ERROR" />
          )}
      </Container>
    </Page>
  );
}
