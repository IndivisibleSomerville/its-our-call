export function urlLegislatorsList(): string {
  return '/legislators';
}

export function urlFmtLegislatorView(id: number | string): string {
  return '/legislators/' + id;
}

export function urlIssuesList(): string {
  return '/issues';
}

export function urlFmtIssueView(id: number | string): string {
  return '/issues/' + id;
}
