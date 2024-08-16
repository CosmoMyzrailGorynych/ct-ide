export default (payload: string): Promise<string> => fetch(payload)
    .then(response => response.text());

