export function fetchFromGitHubRaw(url: string): Promise<string> {
  return fetch(url).then((res) => res.text());
}
