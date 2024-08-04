export default (payload: string): Promise<unknown> => fetch(payload)
    .then(response => response.json());
