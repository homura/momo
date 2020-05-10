import { Form, Select } from 'antd';
import React from 'react';
import { useStoreState } from '../../store';
import { CSVReader } from './CSVReader';

export const Configuration = () => {
  const { comparison, metric, dimension } = useStoreState(
    (state) => state.editor,
  );

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="data">
          <CSVReader />
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
