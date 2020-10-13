import { useEffect, useCallback, useState, useMemo } from "react";
import { useQuery, useSubscription } from "@apollo/client";
// import useInterval from "./useInterval";
import { useApolloClient } from "@apollo/client"
import useInterval from "./useInterval";
// import { LogBox } from "react-native";

const defaultOnItemsChange = items => items;
const defaultSort = undefined;
const defaultFilter = item => true;
const defaultTransform = items => items;
const defaultOnCreatedItem = item => item;
const defaultOnUpdatedItem = item => item;
const defaultOnLoading = loading => loading;
const defaultOnEndReached = () => null;

export default ({
  pollInterval, 
  skip,
  refetchCount = 0,
  clearResultsCount = 0, 
  loadMoreCount = 0,
  query, 
  onCreateQuery,
  onUpdateQuery,
  clientFilter = defaultFilter,
  clientSort = defaultSort,
  clientTransform = defaultTransform,
  onItemsChange = defaultOnItemsChange,
  onCreatedItem = defaultOnCreatedItem,
  onUpdatedItem = defaultOnUpdatedItem,
  onLoading = defaultOnLoading,
  onEndReached = defaultOnEndReached,
}) => {
  const client = useApolloClient();
  const [refreshing, setRefreshing] = useState(false);
  // const [accumulatedItems, setAccumulatedItems] = useState([]);
  // const [token, setToken] = useState(null);

  const clearResults = () => useCallback(() => {
    client.writeQuery({
      query: query.query,
      variables: query.variables,
      data: {
        [query.dataKey]: {
          ...data[query.dataKey],
          items: [],
        }
      },
    });
  }, [client, query])

  // const clearResults = useCallback(() => [
  //   setAccumulatedItems([]),
  //   setToken(null)
  // ], [])
  
  // const fetchNew = () => 
  //   client.query(query)

  // const entry = useQuery(query.query, {
  //   variables: {
  //     ...(query.variables ?? {}),
  //     // nextToken: token
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  // console.log("ENTRY", entry)
  

  const {refetch, fetchMore, error, loading, data: {[query.dataKey]: {nextToken, items} = {}} = {}} = useQuery(query.query, {
    variables: {
      ...(query.variables ?? {}),
      // nextToken: token
    },
    notifyOnNetworkStatusChange: true,
  });

  !!error && console.log("FETCH ERROR", error)

  // const bbbb = useQuery(query.query, {
  //   variables: {
  //     ...(query.variables ?? {}),
  //     nextToken: token
  //   },
  //   // notifyOnNetworkStatusChange: true
  // });

  // console.log("BBBB", bbbb)

  
  // const loadMore = useCallback(() => 
  //   setToken(nextToken)
  // , [nextToken])

  const loadMore = useCallback(() => 
  !!fetchMore && fetchMore({
      variables: {
        ...(query.variables??{}),
        nextToken
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          [query.dataKey]: {
            ...prev[query.dataKey],
            nextToken: fetchMoreResult[query.dataKey]?.nextToken,
            items: [
              ...(prev[query.dataKey].items??[]),
              ...(fetchMoreResult[query.dataKey]?.items??[]).filter(item => !(prev[query.dataKey].items??[]).find(i => i.id === item.id))
            ]
          }  
        }
      }
      // updateQuery: ({__typename, [query.dataKey]: {__typename: connectionTypename, items = [] } = {}} = {}, { fetchMoreResult: {[query.dataKey]: {items: newItems = [] } = {}} = {} }) => 
      // ({
      //   __typename,
      //   [query.dataKey]: {
      //     __typename: connectionTypename,
      //     nextToken,
      //     items: [
      //       ...(items??[]),
      //       ...(newItems??[]).filter(item => !(items??[]).find(i => i.id === item.id)),
      //     ]
      //   }
      // })
    })
  , [query, nextToken, fetchMore])

  const loadNew = useCallback(() => 
    !!fetchMore && Promise.all([
      setRefreshing(true),
      fetchMore({
        variables: {
          ...(query.variables??{})
        },
        // updateQuery: ({__typename, [query.dataKey]: {__typename: connectionTypename, items = [] } = {}} = {}, { fetchMoreResult: {[query.dataKey]: {items: newItems = [] } = {}} = {} }) => 
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            [query.dataKey]: {
              ...prev[query.dataKey],
              items: [
                ...(fetchMoreResult[query.dataKey]?.items??[]),
                ...(prev[query.dataKey].items??[]).filter(item => !(fetchMoreResult[query.dataKey]?.items??[]).find(i => i.id === item.id)),
              ]
            }  
          }
        }
      })
        .catch(e => console.log("ERROR", (e)))
        .finally(() => console.log("DONE") || setRefreshing(false))
    ])
  , [setRefreshing, query, fetchMore])

  // const loadNew = () => 
  //   Promise.all([
  //     setRefreshing(true),
  //     fetchNew()
  //       .then(({data: {[query.dataKey]: {items: newItems}}}) =>
  //         setAccumulatedItems(accumulatedItems =>
  //           [
  //             ...clientTransform((newItems??[])),
  //             ...accumulatedItems.filter(item => !newItems.find(i => i.id === item.id)),
  //           ]
  //             .slice()
  //             .filter(clientFilter)
  //             .sort(clientSort)
  //         )
  //       )
  //       .then(() => setRefreshing(false))
  //     ,
  //   ])

  const {data: {[onUpdateQuery?.dataKey ?? "onUpdateQueryData"]: onUpdateItem} = {}} = useSubscription(onUpdateQuery?.query, {
    skip: !onUpdateQuery?.query,
    variables: onUpdateQuery?.variables
  })

  const {data: {[onCreateQuery?.dataKey ?? "onCreateQueryData"]: onCreateItem} = {}} = useSubscription(onCreateQuery?.query, {
    skip: !onCreateQuery?.query,
    variables: onCreateQuery?.variables
  })

  const replaceItem = useCallback(item => {
    const data = client.readQuery({
      query: query.query,
      variables: query.variables
    });

    client.writeQuery({
      query: query.query,
      variables: query.variables,
      data: {
        [query.dataKey]: {
          ...data[query.dataKey],
          items: (data[query.dataKey]?.items??[]).map(ai => ai.id === item.id ? item : ai),
        }
      },
    });
  }, [client, query])

  const prependItem = useCallback(item => {
    const data = client.readQuery({
      query: query.query,
      variables: query.variables
    });

    const transformedItems = clientTransform([item]);


    client.writeQuery({
      query: query.query,
      variables: query.variables,
      data: {
        [query.dataKey]: {
          ...data[query.dataKey],
          items: [
            ...transformedItems,
            ...(data[query.dataKey]?.items??[]).filter(item => !transformedItems.find(ti => ti.id === item.id)),
          ]
        },
      },
    });
  }, [client, query, clientTransform]);

  const accumulatedItems = useMemo(() => 
    clientTransform(items??[])
        .slice()
        .filter(clientFilter)
        .sort(clientSort)
  , [items, clientFilter, clientSort, clientTransform])

  // useEffect(() => {
  //   LogBox.ignoreLogs(["The updateQuery callback"])
  // }, [LogBox])

  useEffect(() => {
    onLoading(loading)
  }, [onLoading, loading])

  useEffect(() => {
    // console.log("MARKE", nextToken, loading);

    !nextToken &&
    !loading &&
    onEndReached()
  }, [nextToken, loading, onEndReached])

  useEffect(() => {
    !!onUpdateItem &&
    onUpdatedItem(onUpdateItem)
  }, [onUpdatedItem, onUpdateItem])

  useEffect(() => {
    !!onCreateItem &&
    onCreatedItem(onCreateItem)
  }, [onCreatedItem, onCreateItem])

  // useEffect(() => {
  //   setAccumulatedItems(accumulatedItems =>
  //     [
  //       ...accumulatedItems.map(ai => {
  //         const foundItem = (items??[]).find(i => i.id === ai.id);
  //         return foundItem ?? ai;
  //       }),
  //       ...clientTransform((items??[])).filter(item => !accumulatedItems.find(i => i.id === item.id))
  //     ]
  //       .slice()
  //       .filter(clientFilter)
  //       .sort(clientSort)
  //   )
  // }, [items, clientFilter, clientSort, clientTransform])

  useEffect(() => {
    refetchCount > 0 &&
    !!refetch &&
    refetch()
  }, [refetchCount, refetch])

  useEffect(() => {
    clearResultsCount > 0 &&
    !!clearResults &&
    clearResults()
  }, [clearResultsCount, clearResults])

  useEffect(() => {
    loadMoreCount > 0 &&
    !!loadMore &&
    loadMore()
  }, [loadMoreCount])

  useEffect(() => {
    !!onUpdateItem && replaceItem(onUpdateItem)
  }, [replaceItem, onUpdateItem])

  useEffect(() => {
    !!onCreateItem && prependItem(onCreateItem)
  }, [prependItem, onCreateItem])

  // useEffect(() => {
  //   !!onUpdateItem &&
  //   setAccumulatedItems(accumulatedItems =>
  //     accumulatedItems
  //       .slice()
  //       .filter(clientFilter)
  //       .sort(clientSort)
  //       .map(ai => ai.id === onUpdateItem.id ? onUpdateItem : ai)
  //   )
  // }, [onUpdateItem, clientFilter, clientSort])
  
  // useEffect(() => {
  //   !!onCreateItem &&
  //   setAccumulatedItems(accumulatedItems =>
  //     [
  //       ...clientTransform([onCreateItem]),
  //       ...accumulatedItems.filter(item => item.id !== onCreateItem.id),
  //     ]
  //       .slice()
  //       .filter(clientFilter)
  //       .sort(clientSort)
  //   )
  // }, [onCreateItem, clientFilter, clientSort, clientTransform])

  useEffect(() => {
    onItemsChange(accumulatedItems);
  }, [accumulatedItems, onItemsChange]);

  useInterval(() => 
    refetch()
  , !!pollInterval ? pollInterval : 5000000);

  return !!skip ? ({

  }) : ({ 
    items: accumulatedItems,
    nextToken,
    // setToken,
    refreshing,
    loadNew,
    clearResults,
    refetch,
    loadMore,
  })
}