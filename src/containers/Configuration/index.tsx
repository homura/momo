import { Button, Form, Select } from 'antd';
import React, { useState } from 'react';
import { useStoreState } from '../../store';
import { DataLoader } from './DataLoader';

export const Configuration = () => {
  const { comparison, metric, dimension, dataTitle } = useStoreState(
    (state) => state.editor,
  );

  const [dataModalVisible, setDataModalVisible] = useState(false);

  return (
    <div>
      <DataLoader
        visible={dataModalVisible}
        onCancel={() => setDataModalVisible(false)}
      />
      <Form layout="vertical">
        <Form.Item label="data">
          <Button onClick={() => setDataModalVisible(true)}>
            {dataTitle || 'data'}
          </Button>
        </Form.Item>
        <Form.Item label="dimension">
          <Select value={dimension}>
            <Select.Option key={dimension} value={dimension}>
              {dimension}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="comparison">
          <Select value={comparison}>
            <Select.Option value={comparison}>{comparison}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="metric">
          <Select value={metric}>
            <Select.Option value={metric}>{metric}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};
