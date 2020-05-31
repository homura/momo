import { Button, Col, Empty, Row } from 'antd';
import FileSaver from 'file-saver';
import React, { useEffect } from 'react';
import { fetchFromGitHubRaw } from '../../data/fetch';
import { useStoreActions, useStoreState } from '../../store';
import { ChartStage } from '../ChartStage';
import { Configuration } from '../Configuration';
import { parse } from 'query-string';

export const Editor = () => {
  const loadCSV = useStoreActions((actions) => actions.editor.loadCSV);
  const { isEditorSetup } = useStoreState((state) => state.editor);

  useEffect(() => {
    const loadExampleData = async () => {
      const csv = await fetchFromGitHubRaw(
        'https://gist.githubusercontent.com/homura/8c7329eeece508c603e107bf219c7e62/raw/aefb8405ea8938f57026b8538432f5f172443889/COVID-USA.csv',
      );
      console.log(parse(window.location.search));

      loadCSV({
        csvText: csv,
        name: 'COVID-19-USA',
      });
    };

    loadExampleData();
  }, [loadCSV]);

  const downloadDemoCSV = () => {
    const file = new File([], 'demo.csv', {
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
