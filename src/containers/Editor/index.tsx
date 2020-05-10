import { Button, Col, Empty, Row } from 'antd';
import FileSaver from 'file-saver';
import React, { useEffect } from 'react';
import { csv } from './example-data';
import { useStoreActions, useStoreState } from '../../store';
import { ChartStage } from '../ChartStage';
import { Configuration } from '../Configuration';

export const Editor = () => {
  const loadCSV = useStoreActions((actions) => actions.editor.loadCSV);
  const { isEditorSetup } = useStoreState((state) => state.editor);

  useEffect(() => {
    loadCSV({
      csvText: csv,
      name: 'COVID-19-USA',
    });
  }, [loadCSV]);

  const downloadDemoCSV = () => {
    const file = new File([csv], 'demo.csv', {
      type: 'text/csv;charset=utf-8',
    });
    FileSaver.saveAs(file);
  };

  return (
    <Row>
      <Col span={18} style={{ padding: '16px' }}>
        {isEditorSetup ? <ChartStage /> : <Empty />}
      </Col>
      <Col span={6} style={{ padding: '16px' }}>
        <Configuration />

        <div>
          <Button type="link" size="small" onClick={downloadDemoCSV}>
            download demo.csv
          </Button>
        </div>
      </Col>
    </Row>
  );
};
