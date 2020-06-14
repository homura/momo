import { Input, Modal } from 'antd';
import React, { useState } from 'react';

interface DataLoaderModal {
  visible: boolean;
  onData: (str: string) => void;
}

const TextArea = Input.TextArea;

export const DataLoader = (props: DataLoaderModal) => {
  const [data, setData] = useState<string>('');

  return (
    <Modal title="load data">
      <TextArea value={data} onChange={(e) => setData(e.target.value)} />
    </Modal>
  );
};
