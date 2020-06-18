import { useEffect, useMemo, useCallback } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import useInterval from "./useInterval";

export default ({
  mockData = [], 
  doFreshLoad, 
  query,
  fetchAll, 
  noPoll,
  
  subscriptionCreateDataKey,
  subscriptionCreateVariables,
  subscriptionCreateMutation,

  subscriptionUpdateDataKey,
  subscriptionUpdateVariables,
  subscriptionUpdateMutation,

  subscriptionUpdateQuery,
  variables, 
  dataKey,
  skip,
}) => {
  
  // const client = useApolloClient();
  const {refetch, fetchMore, loading: dumbLoading, error, data: {[dataKey]: {nextToken, items} = {}} = {}} = useQuery(query, {
    skip: !!skip,
    // pollInterval: 5000,
    variables
  });

  const loading = !!dumbLoading && !items;


  const entry = useSubscription(subscriptionCreateMutation, {
    skip: !subscriptionCreateMutation || !!skip,
    variables: subscriptionCreateVariables
  })
  const newObject = null; //entry?.data?.[subscriptionCreateDataKey];
  const onCreateLoading = false; //!!entry?.loading;

  // console.log("ENTRY", entry)

  const updateEntry = useSubscription(subscriptionUpdateMutation, {
    skip: !subscriptionUpdateMutation || !!skip,
    variables: subscriptionUpdateVariables
  })
  const updatedObject = updateEntry?.data?.[subscriptionUpdateDataKey];
  const onUpdateLoading = !!updateEntry?.loading;

  // console.log("NEW OB", entry?.data)
  // console.log("UPDATED OB", updateEntry?.data)


  const memoizedItems = useMemo(() => items ?? [], [JSON.stringify(items)]);


  const handleRefresh = useCallback(limit => 
    fetchMore({
      query,
      variables: {
        ...variables,
        nextToken: null,
        limit: limit ?? variables.limit
      },
      updateQuery: ({__typename, [dataKey]: {__typename: connectionTypename, items }}, { fetchMoreResult: {[dataKey]: {nextToken, items: newItems }} }) => 
      ({
        __typename,
        [dataKey]: {
          __typename: connectionTypename,
          nextToken,
          items: [
            ...newItems,
            ...items.filter(item => !newItems.find(i => i.id === item.id)),
          ]
        }
      })
    })
  , [])

  const handleEndReached = useCallback(() =>
      console.log("NEXT TOKEN", nextToken) || !nextToken ? (() => null)() : (
      fetchMore({
        query,
        variables: {
          ...variables,
          nextToken
        },
        updateQuery: ({__typename, [dataKey]: {__typename: connectionTypename, items }}, { fetchMoreResult: {[dataKey]: {nextToken, items: newItems }} }) =>
        ({
          __typename,
          [dataKey]: {
            __typename: connectionTypename,
            nextToken,
            items: [
              ...items,
              ...newItems.filter(item => !items.find(i => i.id === item.id))
            ]
          }
        })
      })
    )
  , [nextToken])

  useInterval(() => 
    !!items && handleRefresh(items.length + 1)
  , !!noPoll ? 40000000 : 5000);

  // useEffect(() => {
  //   // console.log(memoizedItems?.length, !!nextToken)
  //   !!nextToken && 
  //   !memoizedItems?.length &&
  //   handleEndReached()
  // }, [memoizedItems, nextToken, handleEndReached])

  useEffect(() => {
    (newObject?.id || updatedObject?.id) &&
    client.query({
      query: subscriptionUpdateQuery,
      variables: {
        id: (newObject?.id || updatedObject?.id)
      }
    })
  }, [newObject?.id, updatedObject?.id])


  useEffect(() => {
    (newObject?.id || updatedObject?.id) &&
    handleRefresh()
  }, [handleRefresh, newObject?.id, updatedObject?.id])

  useEffect(() => {
    // refetch({nextToken: null})
    !!doFreshLoad &&
    refetch({nextToken: null})
  }, [doFreshLoad])

  useEffect(() => {
    !!fetchAll &&
    !!nextToken &&
    handleEndReached()
  }, [fetchAll, nextToken])

  !!error && console.log(error)

  // console.log(loading)


  return !!skip ? {} : { objects: memoizedItems, loading: !!fetchAll ? !!nextToken || !!dumbLoading : loading, onUpdateLoading, onCreateLoading, error, nextToken, refetch, handleRefresh, handleEndReached }
}