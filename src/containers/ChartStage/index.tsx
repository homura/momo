import React, { useCallback, useRef } from 'react';
import { barChart, RankingRenderer } from '../../charts/bar';
import { useStoreState } from '../../store';

export const ChartStage = () => {
  const editor = useStoreState((state) => state.editor);

  const updateChart = useCallback(
    (node) => {
      if (node !== null) {
        const renderer = barChart(node);

        renderer.render(editor.data, {
          dimensionKey: editor.comparison,
          mainDimensionKey: editor.dimension,
          metricKey: editor.metric,
        });
      }
    },
    [editor.comparison, editor.data, editor.dimension, editor.metric],
  );

  return (
    <>
      <h1>{editor.dataTitle}</h1>
      <svg ref={updateChart} viewBox="0 0 960 540" />
    </>
  );
};
