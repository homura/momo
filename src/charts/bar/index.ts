import * as d3 from 'd3';
import { BaseType, Selection } from 'd3';
import * as _ from 'lodash';
import { hashRGB } from './utils';

interface RenderOptions<Datum> {
  mainDimensionKey: string;
  dimensionKey: string;
  metricKey: string;
}

interface SelectionCall<
  GElement extends BaseType = any,
  Datum = any,
  PElement extends BaseType = any,
  PDatum = any
> {
  (selection: Selection<GElement, Datum, PElement, PDatum>): any;
}

export interface RankingRenderer<Datum = any> {
  render: (datum: Datum[], options: RenderOptions<Datum>) => Promise<void>;
  remove: () => void;
}

export function barChart<Datum>(
  selector: string | BaseType,
): RankingRenderer<Datum> {
  // @ts-ignore
  const svg = d3.select(selector);
  const width = 960;
  const height = 540;

  async function render(
    datum: Datum[],
    options: RenderOptions<Datum>,
  ): Promise<void> {
    const getMainDimension = (data: Datum): string =>
      _.get(data, options.mainDimensionKey);

    const getDimension = (data: Datum): string =>
      _.get(data, options.dimensionKey);
    const getMetric = (data: Datum): number => _.get(data, options.metricKey);

    const margin = {
      top: 30,
      right: 80,
      bottom: 30,
      left: 20,
    };

    // main dimension bottom right of the chart
    svg
      .append('text')
      .attr('class', 'dimension-main')
      .style('font-size', '64px');

    const nested = d3
      .nest<Datum>()
      .key(getMainDimension)
      .sortKeys((a, b) => a.localeCompare(b))
      .sortValues(
        (a, b) => Number(b[options.metricKey]) - Number(a[options.metricKey]),
      )
      .entries(datum);

    const xScale = d3
      .scaleLinear()
      .range([0, width - margin.left - margin.right]);
    const yScale = d3
      .scaleBand<number>()
      .range([0, height - margin.top - margin.bottom])
      .paddingInner(0.2)
      .padding(0.3);

    for (let current = 0; current < nested.length; current++) {
      const data = nested[current];
      const values = data.values.slice(0, 10);

      const maxMetric = getMetric(values?.[0]);
      xScale.domain([0, maxMetric]);
      yScale.domain(d3.range(values.length));

      const t = d3.transition().duration(750);

      svg
        .select('.dimension-main')
        .attr('text-anchor', 'end')
        .attr('x', width - margin.right)
        .attr('y', height - margin.bottom)
        .attr('fill', '#eee')
        .attr('stroke', '#333')
        .text(data.key);

      const rects = svg
        .selectAll<SVGRectElement, Datum>('.bar')
        .data(values, getDimension);
      const dimensionLabels = svg
        .selectAll<SVGTextElement, Datum>('.label-dimension')
        .data(values, getDimension);
      const metricLabels = svg
        .selectAll<SVGTextElement, Datum>('.label-metric')
        .data(values, getDimension);

      // prettier-ignore
      rects
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', height)
        .attr('fill', (d) => hashRGB(d[options.dimensionKey]))
        .attr('height', yScale.bandwidth())
        .attr('fill-opacity', 1e-6)
        .merge(rects)
        .transition(t)
        .attr('y', (datum, i) => yScale(i))
        .attr('width', (datum: Datum) => xScale(getMetric(datum)))
        .attr('height', yScale.bandwidth())
        .attr('fill-opacity', 1);

      const labelStyle: SelectionCall = (s) =>
        s
          .attr('y', height)
          .attr('alignment-baseline', 'central')
          .attr('opacity', 1e-6)
          .attr('stroke', (datum: Datum) =>
            d3
              .rgb(hashRGB(getDimension(datum)))
              .brighter()
              // @ts-ignore
              .formatHex(),
          )
          .style(' stroke-linecap', 'butt')
          .attr('fill', '#fff')
          .style('font-size', '28px')
          .attr('text-anchor', 'end');

      dimensionLabels
        .enter()
        .append('text')
        .attr('class', 'label-dimension')
        .call(labelStyle)
        .text(getDimension)
        .merge(dimensionLabels)
        .transition(t)
        .attr('opacity', 1)
        .attr('y', (datum, i) => yScale(i) + yScale.bandwidth() / 2)
        .attr('x', (datum: Datum) => xScale(getMetric(datum)) - 10);

      metricLabels
        .enter()
        .append('text')
        .call(labelStyle)
        .attr('text-anchor', 'start')
        .attr('class', 'label-metric')
        .style('font-size', '24px')
        .merge(metricLabels)
        .transition(t)
        //@ts-ignore
        .textTween(function (datum, i) {
          const last = getMetric(nested?.[current - 1]?.values?.[i]) ?? 0;
          const now = getMetric(datum);

          return (t: number): number => Math.ceil(last + (now - last) * t);
        })
        .attr('opacity', 1)
        .attr('y', (datum, i) => yScale(i) + yScale.bandwidth() / 2)
        .attr('x', (datum: Datum) => xScale(getMetric(datum)) + 10);

      const exit: SelectionCall = (s) =>
        s
          .attr('opacity', 1)
          .attr('fill-opacity', 1)
          .transition(t)
          .attr('y', height)
          .attr('opacity', 1e-6)
          .attr('fill-opacity', 1e-6)
          .remove();

      rects.exit().call(exit);
      dimensionLabels.exit().call(exit);
      metricLabels.exit().call(exit);

      if (t) {
        await t.end();
      } else {
        break;
      }
    }
  }

  function remove() {
    svg.remove();
  }

  return { render, remove };
}
