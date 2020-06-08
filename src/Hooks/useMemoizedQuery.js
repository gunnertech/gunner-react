import { useMemo } from 'react'
import { useQuery } from '@apollo/client';

export default (query, params) => {
  const entry = useQuery(query, params);

  return useMemo(() => entry, [JSON.stringify(params), !!entry?.loading, !!entry?.error, JSON.stringify(entry?.data)]);
}