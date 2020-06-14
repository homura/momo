import { has } from 'lodash';
import { parse, ParseResult } from 'papaparse';
import { fetchFromGitHubRaw } from '../../data/fetch';

interface NamedCSV {
  name: string;
  csvText: string;
}

interface UrledCSV {
  name: string;
  url: string;
}

export type LoadableCSV = NamedCSV | UrledCSV;

export function isUrledCSV(csv: LoadableCSV): csv is UrledCSV {
  return has(csv, 'data');
}

export function isNamedCSV(csv: LoadableCSV): csv is NamedCSV {
  return has('csv', 'csvText');
}

export async function loadCSV<T>(
  csv: LoadableCSV,
): Promise<ParseResult<T> & { rawData: string }> {
  const rawData = isNamedCSV(csv)
    ? csv.csvText
    : await fetchFromGitHubRaw(csv.url);

  const parsed = parse<T>(rawData, {
    header: true,
    skipEmptyLines: true,
  });

  return { rawData, ...parsed };
}
