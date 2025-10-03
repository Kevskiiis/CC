export async function httpPostJSON<T>(
  url: string,
  body: unknown,
  opts: { timeoutMs?: number; headers?: Record<string, string> } = {}
): Promise<{ ok: boolean; status: number; json?: T }> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), opts.timeoutMs ?? 12000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers ?? {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    let json: T | undefined = undefined;
    try {
      json = (await res.json()) as T;
    } catch {
      // no JSON body or invalid JSON; leave json undefined
    }

    return { ok: res.ok, status: res.status, json };
  } finally {
    clearTimeout(id);
  }
}