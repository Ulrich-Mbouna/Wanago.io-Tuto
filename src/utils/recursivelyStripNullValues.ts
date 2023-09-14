export function recursivelyStripNullValues(value: any) {
  if (Array.isArray(value)) {
    return value.map(recursivelyStripNullValues);
  }

  if (value !== null && typeof value === 'object') {
    Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        recursivelyStripNullValues(value),
      ]),
    );
  }

  if (value !== null) return value;
}
