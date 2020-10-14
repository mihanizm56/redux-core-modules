import fileDownload from 'js-file-download';
import { FILE_TYPES } from '@/constants';
import { base64toBytes } from './base-64-to-bytes';

export type DownloadFileParamsType = {
  fileType: string;
  file: any;
  contentType: string;
  name: string;
};

export const downloadFile = ({
  fileType,
  file,
  contentType,
  name,
}: DownloadFileParamsType) => {
  // get file
  const blobFile =
    fileType === FILE_TYPES.base64 ? base64toBytes(file, contentType) : file;

  // download file
  fileDownload(blobFile, name);
};
