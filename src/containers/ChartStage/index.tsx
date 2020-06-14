import { UndoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { LegacyRef, useCallback, useRef } from 'react';
import { barChart, RankingRenderer } from '../../charts/bar';
import { useStoreState } from '../../store';

export const ChartStage = () => {
  const editor = useStoreState((state) => state.editor);
  const rendererRef = useRef<RankingRenderer>();

  const updateChart: LegacyRef<SVGElement> = useCallback(
    (node) => {
      if (node) {
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
      <svg ref={updateChart} width={864} height={468} viewBox="0 0 960 540" />
      <div>
        <Button
          size="small"
          icon={<UndoOutlined />}
          onClick={onStart}
          title="replay"
        />
      </div>
    </>
  );
};
