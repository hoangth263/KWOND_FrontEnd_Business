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
  Input
} from '@mui/material';
// utils
import { useNavigate } from 'react-router-dom';
// @types
import { NewProjectEntityFormValues, Project } from '../../../../@types/krowd/project';
//
import { UploadAPI } from '_apis_/krowd_apis/upload';

import { dispatch, RootState } from 'redux/store';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';
import { Container } from '@mui/system';
import { UploadDocument, UploadPhoto, UploadSingleFile } from 'components/upload';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type ProjectEntityNewFormProps = {
  isEdit: boolean;
  currentField?: NewProjectEntityFormValues;
};
type DocumentDetailProps = {
  project: Project;
  closeDialog: () => void;
  //   album: string[];
};
export default function EntityDocument({ project: p, closeDialog }: DocumentDetailProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const NewProjectSchema = Yup.object().shape({
    title: Yup.string().required('Yêu cầu nhập tên tài liệu')
  });

  const formik = useFormik<NewProjectEntityFormValues>({
    initialValues: {
      projectId: p.id,
      type: 'DOCUMENT',
      title: '',
      link: '',
      content: '',
      description: ''
    },
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await UploadAPI.postDocument({
          id: p.id,
          file: fileUpload,
          title: values.title,
          description: values.description
        })
          .then(() => {
            enqueueSnackbar('Tạo mới tài liệu thành công', {
              variant: 'success'
            });
            resetForm();
            // setSubmitting(true);
            dispatch(getProjectId(p?.id));
            closeDialog();
          })
          .catch(() => {
            enqueueSnackbar(
              'Tạo mới thất bại vui lòng kiểm tra lại thông tin vui lòng kiểm tra lại thông tin',
              {
                variant: 'error'
              }
            );
          });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue: setFieldDocument,
    getFieldProps
  } = formik;
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldDocument('Link', {
          ...file,
          preview: URL.createObjectURL(file)
        });
        setFileUpload(file);
      }
    },
    [setFieldDocument]
  );

  return (
    <>
      <FormikProvider value={formik}>
        <Form
          style={{ width: '700px', height: '550px' }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Stack spacing={3} sx={{ p: 3 }}>
            <LabelStyle>Tài liệu</LabelStyle>

            <TextField
              sx={{ legend: { span: { mt: 1 } }, mx: 3, my: 3 }}
              label="Tên"
              required
              fullWidth
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              variant="outlined"
            />
            {/* <Input type={'file'} sx={{ mx: 3, my: 3 }} fullWidth /> */}
            {/* <Input type="file" name="file" onChange={changeHandler} />
            <Container>
              <Button onClick={handleSubmission}>Submit</Button>
            </Container> */}
            <UploadSingleFile
              sx={{ mx: 5, my: 3 }}
              file={values.link}
              maxSize={3145728}
              onDrop={handleDrop}
            />
            {fileUpload && <Typography>Đã tải lên: {fileUpload.name}</Typography>}
            {/* <Input type="file" sx={{ mx: 5, my: 3 }} onDrop={handleDrop} /> */}

            {/* <Input type={'file'} sx={{ mx: 5, my: 3 }} onChange={handleDrop} /> */}
            {/* <TextField
              sx={{ mx: 3, my: 3 }}
              fullWidth
              label="Mô tả thông tin"
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            /> */}
          </Stack>

          <Stack direction="row" justifyContent="flex-end" sx={{ mx: 3, py: 3 }}>
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
              Lưu
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}
