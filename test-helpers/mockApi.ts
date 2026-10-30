// Підробляє успішну відповідь сервера з потрібними даними
export function mockApiSuccess(data: unknown) {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => data,
  }) as unknown as typeof fetch;
}

// Підробляє відповідь сервера з помилкою (наприклад, 500)
export function mockApiError(status: number) {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({}),
  }) as unknown as typeof fetch;
}

// Запит «висить» і ніколи не завершується (для перевірки стану завантаження)
export function mockApiPending() {
  globalThis.fetch = jest.fn(
    () => new Promise(() => {})
  ) as unknown as typeof fetch;
}
