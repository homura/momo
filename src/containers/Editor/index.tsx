import { Button, Col, Empty, Row } from 'antd';
import FileSaver from 'file-saver';
import React, { useCallback, useEffect } from 'react';
import { useStoreActions, useStoreState } from '../../store';
import { ChartStage } from '../ChartStage';
import { Configuration } from '../Configuration';
import { DEMO_CSV_URL } from '../../constants';

export const Editor = () => {
  const loadCSV = useStoreActions((actions) => actions.editor.loadCSV);
  const { isEditorSetup, rawData } = useStoreState((state) => state.editor);

  useEffect(() => {
    loadCSV({ name: 'example', url: DEMO_CSV_URL });
  }, []);

  const downloadDemoCSV = useCallback(() => {
    const file = new File([rawData], 'demo.csv', {
      type: 'text/csv;charset=utf-8',
    });
    FileSaver.saveAs(file);
  }, [rawData]);

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
