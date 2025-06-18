export async function loginUser(credentials) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(credentials),
    }
  );
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}