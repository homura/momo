import { Button, Upload } from 'antd';
import { UploadChangeParam } from 'antd/es/upload/interface';
import { ParseResult } from 'papaparse';
import React from 'react';
import { useStoreActions, useStoreState } from '../../../store';

export interface CSVReaderProps<T = any> {
  onFileLoaded?: (result: ParseResult) => void;
}

export const CSVReader = (props: CSVReaderProps) => {
  const { loadCSVFile } = useStoreActions((actions) => actions.editor);
  const dataTitle =
    useStoreState((state) => state.editor.dataTitle) || 'select a .csv file';

  async function handleChange(upload: UploadChangeParam) {
    const file = upload.file.originFileObj;
    if (file instanceof File) {
      loadCSVFile(file);
    }
  }

  return (
    <Upload
      customRequest={() => null}
      showUploadList={false}
      accept=".csv"
      onChange={handleChange}
    >
      <Button size="small">{dataTitle}</Button>
    </Upload>
  );
};
