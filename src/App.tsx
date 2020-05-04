import React, { useRef } from 'react';
import './App.css';
import { barChart } from './charts/bar';
import { csv } from './data';
import * as d3 from 'd3';

function App() {
  const chartRef = useRef();

  React.useLayoutEffect(() => {
    const svg = chartRef.current;
    barChart(
      svg,
      d3.csvParse(csv, (d) => ({
        state: d.state,
        date: d.date,
        cases: Number(d.cases),
      })),
      {
        metricKey: 'cases',
        mainDimensionKey: 'date',
        dimensionKey: 'state',
      },
    ).render();
  });

  return (
    <div className="App">
      <svg width="960" height="540" ref={chartRef} />
    </div>
  );
}

export default App;
