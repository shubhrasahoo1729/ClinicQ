export function getErrorMessage(err) {
  const data = err.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).join('. ');
  }
  return data?.message || 'Could not reach the server';
}