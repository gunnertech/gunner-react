import React, { useMemo, useEffect } from 'react'
import useDataFetcher from '../../../Hooks/useDataFetcher';



export default ({
  mockData, 
  RenderComponent, 
  query = "Activity.queries.list", 
  variables = {}, 
  dataKey = 'listActivitys', 
  
  subscriptionUpdateDataKey,
  subscriptionUpdateVariables,
  subscriptionUpdateMutation,

  subscriptionCreateDataKey,
  subscriptionCreateVariables,
  subscriptionCreateMutation,

  subscriptionUpdateQuery,

  viewVariables,
  
  clientFilter = item => !!item,
  clientSort,
  prependedObjects = [],
  DataListView,
  noPoll,
  useButton,
  usedButton,
  forceMore,
  onLoading,
  onLoaded
}) => {
  const {objects, refetch, error, nextToken, loading, onCreateLoading, onUpdateLoading, handleEndReached, handleRefresh } = useDataFetcher({
    mockData, 
    query, 
    variables, 
    dataKey,

    noPoll,
    
    subscriptionCreateDataKey,
    subscriptionCreateVariables,
    subscriptionCreateMutation,

    subscriptionUpdateDataKey,
    subscriptionUpdateVariables,
    subscriptionUpdateMutation,
    subscriptionUpdateQuery
  });

  const memoizedObjects = useMemo(() => [
      ...prependedObjects, 
      ...objects.filter(obj => !prependedObjects.find(po => po.id === obj.id))
    ], 
    [JSON.stringify([...prependedObjects, ...objects])]
  )

  useEffect(() => {
    !!onLoading && onLoading(loading)
  }, [loading])

  useEffect(() => {
    !!onLoaded && onLoaded(nextToken)
  }, [nextToken])

  return useMemo(() =>
    <DataListView
      objects={memoizedObjects}
      onEndReached={handleEndReached}
      RenderComponent={RenderComponent}
      viewVariables={viewVariables}
      clientFilter={clientFilter}
      clientSort={clientSort}
      hasMoreItems={!!nextToken}
      loading={loading}
      useButton={useButton}
      usedButton={usedButton}
      forceMore={forceMore}
    />
  , [memoizedObjects, loading, handleEndReached, handleRefresh, onCreateLoading, onUpdateLoading, clientFilter, useButton])
}