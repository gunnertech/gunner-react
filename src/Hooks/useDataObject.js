import { useMemo } from "react"
import { useQuery } from '@apollo/client'

export default ({objectId, object, query, dataKey}) => {

  const {data} = useQuery(query, {
    skip: !!object,
    pollInterval: !object ? 3000 : 0,
    variables: {
      id: objectId
    }
  });

  return useMemo(() => object ?? data?.[dataKey], [JSON.stringify(object??data?.[dataKey])])
}