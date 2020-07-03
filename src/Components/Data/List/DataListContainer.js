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
  onLoaded,
  onItemsChange,
  doClear,
  transform = items => items,
  onScroll
}) => {
  const { objects, refetch, error, nextToken, loading, onCreateLoading, onUpdateLoading, handleEndReached, handleRefresh, clearResults } = useDataFetcher({
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
    subscriptionUpdateQuery,

    onItemsChange
  });

  const memoizedObjects = useMemo(() => transform([
      ...prependedObjects, 
      ...objects.filter(obj => !prependedObjects.find(po => po.id === obj.id))
    ]), 
    [JSON.stringify([...prependedObjects, ...objects])]
  )

  useEffect(() => {
    !!onLoading && onLoading(loading)
  }, [loading])

  useEffect(() => {
    !!onLoaded && onLoaded(nextToken)
  }, [nextToken])

  !!doClear && setTimeout(clearResults, 3000)

  return useMemo(() =>
    <DataListView
      onScroll={onScroll}
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
  , [memoizedObjects, loading, handleEndReached, handleRefresh, onCreateLoading, onUpdateLoading, clientFilter, useButton, forceMore])
}