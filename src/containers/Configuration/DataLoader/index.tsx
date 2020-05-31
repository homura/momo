import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from '../../../store';

interface DataLoaderModal {
  visible: boolean;
  onCancel: () => void;
}

const TextArea = Input.TextArea;

export const DataLoader = (props: DataLoaderModal) => {
  const rawData = useStoreState((state) => state.editor.rawData);
  const loadCSV = useStoreActions((actions) => actions.editor.loadCSV);
  const [data, setData] = useState<string>('');

  function onOk() {
    loadCSV({
      csvText: data,
      name: '',
    });
  }

  useEffect(() => {
    setData(rawData);
  }, [rawData]);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      title="CSV"
      onOk={onOk}
    >
      <TextArea
        rows={10}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </Modal>
  );
};
