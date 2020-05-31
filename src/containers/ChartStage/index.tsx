import { UndoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback, useRef } from 'react';
import { barChart, RankingRenderer } from '../../charts/bar';
import { useStoreState } from '../../store';

export const ChartStage = () => {
  const editor = useStoreState((state) => state.editor);
  const rendererRef = useRef<RankingRenderer>();

  const updateChart = useCallback(
    (node) => {
      if (node !== null) {
        rendererRef.current = barChart(node);
        render();
      }
    },
    [editor.comparison, editor.data, editor.dimension, editor.metric],
  );

  function render() {
    rendererRef.current.render(editor.data, {
      dimensionKey: editor.comparison,
      mainDimensionKey: editor.dimension,
      metricKey: editor.metric,
    });
  }

  function onStop() {
    rendererRef.current.stop();
  }

  async function onStart() {
    await rendererRef.current.stop();
    render();
  }

  return (
    <>
      <h1>{editor.dataTitle}</h1>
      <svg ref={updateChart} viewBox="0 0 960 540" />
      <Button
        size="small"
        icon={<UndoOutlined />}
        onClick={onStart}
        title="replay"
      />
    </>
  );
};
