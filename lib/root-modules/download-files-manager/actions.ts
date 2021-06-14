import { Action } from '@/types';
import { DownloadFilesManagerType } from './types';

export const DOWNLOAD_FILE_MANAGER =
  '@redux-core-modules/DOWNLOAD_FILE_MANAGER';
export const downloadFilesManagerSagaAction: Action<DownloadFilesManagerType> = (
  payload: DownloadFilesManagerType,
) => ({
  type: DOWNLOAD_FILE_MANAGER,
  payload,
});
