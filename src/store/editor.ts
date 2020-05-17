import { action, Action, computed, Computed, thunk, Thunk } from 'easy-peasy';
import { parse } from 'papaparse';

interface SetDataPayload {
  data: any[];
  dataTitle: string;
  columns: string[];
  dimension: string;
  comparison: string;
  metric: string;
}

interface NamedCSV {
  name: string;
  csvText: string;
}

export interface EditorModel {
  data: any[];
  dataTitle: string;
  columns: string[];
  dimension: string;
  comparison: string;
  metric: string;

  isEditorSetup: Computed<EditorModel, boolean>;

  switchDimension: SwitchColumn;
  switchComparison: SwitchColumn;
  switchMetric: SwitchColumn;
  setupEditor: Action<EditorModel, SetDataPayload>;

  loadCSV: Thunk<EditorModel, NamedCSV>;
  loadCSVFile: Thunk<EditorModel, File>;
}

type SwitchColumn = Action<EditorModel, string>;

export const editorModel: EditorModel = {
  data: [],
  dataTitle: '',
  columns: [],

  comparison: '',
  dimension: '',
  metric: '',

  isEditorSetup: computed((state) => {
    const data = state.data;
    return Array.isArray(data) && data.length > 0;
  }),

  setupEditor: action((state, payload) => {
    const { data, columns, dimension, metric, comparison, dataTitle } = payload;

    state.data = data.map((item) => ({
      ...item,
      [metric]: Number(item[metric]),
    }));

    state.columns = columns;
    state.dimension = dimension;
    state.comparison = comparison;
    state.metric = metric;

    state.dataTitle = dataTitle;
  }),
  switchDimension: action((state, dimension) => {
    state.dimension = dimension;
  }),
  switchComparison: action((state, comparison) => {
    state.comparison = comparison;
  }),
  switchMetric: action((state, metric) => {
    state.metric = metric;
  }),

  loadCSV: thunk(async (actions, payload) => {
    const parseResult = parse(payload.csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const { meta, data } = parseResult;

    const columns = meta.fields;
    const [dimension, comparison, metric] = columns;

    actions.setupEditor({
      columns,
      data,
      dimension,
      comparison,
      metric,
      dataTitle: payload.name,
    });
  }),

  loadCSVFile: thunk(async (actions, file) => {
    const csvText = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result as string);
      };
      reader.readAsText(file);
    });

    actions.loadCSV({
      csvText,
      name: file.name.split('.')[0],
    });
  }),
};
