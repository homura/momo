import * as d3 from 'd3';
import { BaseType, Selection, Transition } from 'd3';
import * as _ from 'lodash';
import { hashRGB } from '../utils';

type Status = 'start' | 'stop';

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
  stop: () => Promise<void>;
}

export function barChart<Datum = any>(
  selector: string | BaseType,
): RankingRenderer<Datum> {
  // @ts-ignore
  let svg = d3.select(selector);
  const width = 960;
  const height = 540;

  let transition: Transition<BaseType, Datum, null, undefined>;
  let status: Status = 'stop';

  function remove() {
    console.log(svg.selectAll('*'));
    svg.selectAll('*').remove();
  }

  async function stop(): Promise<void> {
    status = 'stop';
    remove();
  }

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
      .style('font-size', '64px')
      .attr('text-anchor', 'end')
      .attr('x', width - margin.right)
      .attr('y', height - margin.bottom)
      .attr('fill', '#eee')
      .attr('stroke', '#333');

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

    status = 'start';

    function shouldContinueTransition() {
      return status === 'start';
    }

    for (let current = 0; current < nested.length; current++) {
      if (!shouldContinueTransition()) break;

      transition = d3.transition<Datum>().duration(750);

      const data = nested[current];
      const values = data.values.slice(0, 10);

      const maxMetric = getMetric(values?.[0]);
      xScale.domain([0, maxMetric]);
      yScale.domain(d3.range(values.length));

      svg.select('.dimension-main').text(data.key);

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
        .transition(transition)
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
        .transition(transition)
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
        .transition(transition)
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
          .transition(transition)
          .attr('y', height)
          .attr('opacity', 1e-6)
          .attr('fill-opacity', 1e-6)
          .remove();

      rects.exit().call(exit);
      dimensionLabels.exit().call(exit);
      metricLabels.exit().call(exit);

      if (transition && status === 'start') {
        try {
          await transition.end();
        } catch (e) {
          break;
        }
      } else {
        break;
      }
    }
  }

  return { render, remove, stop };
}
