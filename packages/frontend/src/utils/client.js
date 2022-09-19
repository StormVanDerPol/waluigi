const client = {
  get: async (url) => {
    const res = await fetch(url, { method: 'GET' });

    if (!res.ok) throw new Error(res.statusText);
    if (res.status === 204) return;
    if (res.status === 200) return res.json();
  },

  post: async (url, body) => {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        ['Content-Type']: 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    if (res.status === 204) return;
    if (res.status === 200) return res.json();
  },
};

export default client;
