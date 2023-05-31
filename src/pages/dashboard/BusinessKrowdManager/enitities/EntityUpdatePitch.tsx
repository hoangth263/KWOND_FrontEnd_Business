import * as Yup from 'yup';
import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import {
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  FormHelperText,
  Autocomplete,
  Container
} from '@mui/material';
// utils
// @types
import {
  NewProjectEntityFormValues,
  Project,
  ProjectEntityFormValues,
  ProjectEntityUpdate,
  UpdateProjectEntityFormValues
} from '../../../../@types/krowd/project';
//
import { useSelector } from 'react-redux';
import { PATH_DASHBOARD } from 'routes/paths';
import { dispatch, RootState } from 'redux/store';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';
import { QuillEditor } from 'components/editor';
import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
import { getProjectEntityID } from 'redux/slices/krowd_slices/projectEnity';
import { Quill } from 'react-quill';
import { Icon } from '@iconify/react';
import roundUndo from '@iconify/icons-ic/round-undo';
import roundRedo from '@iconify/icons-ic/round-redo';
import QuillEditorToolbarStyle from 'components/editor/quill/QuillEditorToolbarStyle';
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------
type PitchProps = {
  id: string;
  title: string;
  link: string;
  content: string;
  description: string;
};
type EntityPitchDetailProps = {
  pitch: PitchProps;
  closeDialog: () => void;
  project: Project;
};
export default function EntityUpdatePitch({ pitch, closeDialog, project }: EntityPitchDetailProps) {
  const { enqueueSnackbar } = useSnackbar();

  const NewProjectSchema = Yup.object().shape({
    title: Yup.string()
      .required('Yêu cầu nhập tiêu đề')
      .max(20, 'Tiêu đề không nhiều quá 20 ký tự'),
    content: Yup.string().min(10).required('Yêu cầu nhập nội dung chi tiết tối thiểu 10 ký tự')
  });
  function getToken() {
    return window.localStorage.getItem('accessToken');
  }

  function getHeaderFormData() {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  }
  const formik = useFormik<UpdateProjectEntityFormValues>({
    initialValues: {
      type: 'PITCH',
      title: pitch.title ?? '',
      link: pitch.link ?? '',
      content: pitch.content ?? '',
      description: pitch.description ?? ''
    },
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();

        await axios
          .put(REACT_APP_API_URL + `/project_entities/${pitch.id}`, values, {
            headers: headers
          })
          .then(() => {
            enqueueSnackbar('Cập nhật tiêu điểm thành công', {
              variant: 'success'
            });
            resetForm();
            setSubmitting(true);
            dispatch(getProjectId(project?.id));
            closeDialog();
          })
          .catch(() => {
            enqueueSnackbar('Cập nhật thất bại vui lòng kiểm tra lại thông tin', {
              variant: 'error'
            });
          });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;
  return (
    <>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <LabelStyle>Tiêu điểm</LabelStyle>

            <TextField
              sx={{ legend: { span: { mt: 1 } } }}
              label="Tiêu đề"
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              variant="outlined"
            />
          </Stack>
          <div>
            <LabelStyle sx={{ py: 4, p: 3 }}>Mô tả thông tin</LabelStyle>
            <QuillEditor
              sx={{ mx: 3 }}
              id={`pitch-content__${pitch?.id}`}
              value={values.content}
              onChange={(val) => setFieldValue('content', val)}
              error={Boolean(touched.content && errors.content)}
            />
            {touched.content && errors.content && (
              <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                {touched.content && errors.content}
              </FormHelperText>
            )}
          </div>
          {/* {touched.content && errors.content && (
              <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                {touched.content && errors.content}
              </FormHelperText>
            )}

            {touched.content && errors.content && (
              <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                {touched.content && errors.content}
              </FormHelperText>
            )} */}

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3, mx: 3, my: 3 }}>
            <Button
              color="error"
              variant="contained"
              size="large"
              onClick={closeDialog}
              sx={{ mr: 1.5 }}
            >
              Đóng
            </Button>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              Cập nhật
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}

// //
// import QuillEditorToolbarStyle from './QuillEditorToolbarStyle';

// // ----------------------------------------------------------------------
