import * as d3 from 'd3';
import { csv } from './data';
import { barChart } from './src/bar';
import './src/base.css';

const renderer = barChart(
  'svg',
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
);

renderer.render();
