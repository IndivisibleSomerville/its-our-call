export function urlLegislatorsList(): string {
  return '/legislators';
}

export function urlFmtLegislatorView(id: number | string): string {
  return '/legislators/' + id;
}
