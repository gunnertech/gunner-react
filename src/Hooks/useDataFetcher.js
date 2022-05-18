import { useEffect, useMemo, useCallback, useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import useInterval from "./useInterval";
import { useApolloClient } from "@apollo/client"
import gql from "graphql-tag";

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

  onItemsChange = items => null
}) => {
  // const test = useQuery(query, {
  //   skip: !!skip,
  //   // pollInterval: 5000,
  //   variables
  // });

  const query1 = gql`
    query ListSportsbooks(
      $filter: ModelSportsbookFilterInput
      $limit: Int
      $nextToken: String
    ) {
      listSportsbooks(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
          id
          createdAt
          updatedAt
          name
          active
        }
        nextToken
      }
    }
  `

  const [loading, setLoading] = useState(false);
  const client = useApolloClient();
  console.log("QUERY", query1);
  // const entry = useQuery(query1, {
  //   skip: !!skip,
  //   // pollInterval: 5000,
  //   variables
  // });
  // console.log("ENTRUY", entry)
  // const {refetch, fetchMore, loading: dumbLoading, error, data: {[dataKey]: {nextToken, items} = {}} = {}} = useQuery(query, {
  //   skip: !!skip,
  //   // pollInterval: 5000,
  //   variables
  // });


  // const entry = useSubscription(subscriptionCreateMutation, {
  //   skip: !subscriptionCreateMutation || !!skip,
  //   variables: subscriptionCreateVariables
  // })
  // const newObject = !subscriptionCreateDataKey ? null : entry?.data?.[subscriptionCreateDataKey];
  // const onCreateLoading = false; //!!entry?.loading;

  // // console.log("ENTRY", entry)

  // const updateEntry = useSubscription(subscriptionUpdateMutation, {
  //   skip: !subscriptionUpdateMutation || !!skip,
  //   variables: subscriptionUpdateVariables
  // })
  // const updatedObject = !subscriptionUpdateDataKey ? null : updateEntry?.data?.[subscriptionUpdateDataKey];
  // const onUpdateLoading = !!updateEntry?.loading;

  // // console.log("NEW OB", entry?.data)
  // // console.log("UPDATED OB", updateEntry?.data)


  // // const memoizedItems = useMemo(() => items ?? [], [JSON.stringify(items)]);

  // // const memoizedItems = items ?? [];

  // const handleItemsChange = useCallback(items => 
  //   onItemsChange(items)
  // , [])

  // // const handleItemsChange = items => 
  // //   onItemsChange(items)
  

  // const clearResults = () => null
  //   // fetchMore({
  //   //   query,
  //   //   variables: {
  //   //     ...variables,
  //   //     nextToken: null,
  //   //     limit: variables.limit
  //   //   },
  //   //   // updateQuery: ({__typename, [dataKey]: {__typename: connectionTypename, items } = {}} = {}, { fetchMoreResult: {[dataKey]: {items: newItems }} }) => 
  //   //   updateQuery: (resp, resp2) => 
  //   //   console.log("resp", resp, resp2)
  //   // })
  //   // //   !!__typename &&
  //   // //   ({
  //   // //     __typename,
  //   // //     [dataKey]: {
  //   // //       __typename: connectionTypename,
  //   // //       nextToken,
  //   // //       items: [
  //   // //         ...newItems,
  //   // //       ]
  //   // //     }
  //   // //   })
  //   // // })

  // const defaultLimit = 10;

  // const handleRefresh = useCallback(limit => 
  //   fetchMore({
  //     query,
  //     variables: {
  //       ...variables,
  //       nextToken: null,
  //       limit: limit ?? variables.limit
  //     },
  //     updateQuery: ({__typename, [dataKey]: {__typename: connectionTypename, items = [] } = {}} = {}, { fetchMoreResult: {[dataKey]: {items: newItems = [] } = {}} = {} }) => 
  //     ({
  //       __typename,
  //       [dataKey]: {
  //         __typename: connectionTypename,
  //         nextToken,
  //         items: [
  //           ...newItems,
  //           ...items.filter(item => !!item?.id && !newItems.filter(i => !!i?.id).find(i => i.id === item.id)),
  //         ]
  //       }
  //     })
  //   })
  //   .then(() => console.log("done loading new"))
  // , [JSON.stringify(variables), nextToken])

  // const handleEndReached = useCallback(passedToken =>
  //   !nextToken && !passedToken ? (() => null)() : Promise.all([
  //     setLoading(true),
  //     fetchMore({
  //       query,
  //       variables: {
  //         ...variables,
  //         nextToken: passedToken || nextToken
  //       },
  //       updateQuery: ({__typename, [dataKey]: {__typename: connectionTypename, items = [] } = {}} = {}, { fetchMoreResult: {[dataKey]: {nextToken, items: newItems } = {}} = {} }) =>
  //       ({
  //         __typename,
  //         [dataKey]: {
  //           __typename: connectionTypename,
  //           nextToken,
  //           items: [
  //             ...items,
  //             ...newItems.filter(item => !items.find(i => i.id === item.id))
  //           ]
  //         }
  //       })
  //     })
  //     .then(() => console.log("done loading more") || setLoading(false))
  //   ])
  // , [nextToken, JSON.stringify(variables)])

  // useInterval(() => 
  //   !!items && handleRefresh(Math.max(items.length, variables.limit ?? defaultLimit))
  // , !!noPoll ? 40000000 : 5000);

  // // useEffect(() => {
  // //   // console.log(memoizedItems?.length, !!nextToken)
  // //   !!nextToken && 
  // //   !memoizedItems?.length &&
  // //   handleEndReached()
  // // }, [memoizedItems, nextToken, handleEndReached])

  // useEffect(() => {
  //   handleItemsChange(items)
  // }, [handleItemsChange, items])

  // useEffect(() => {
  //   setLoading(dumbLoading);
  // }, [dumbLoading])

  // // useEffect(() => { NOTE: Turned this off because it was causing a refetch of the data everytime
  // //   client.writeQuery({
  // //     query,
  // //     data: {
  // //       [dataKey]: {
  // //         nextToken: null,
  // //         items: [],
  // //       },
  // //     }
  // //   })
  // // }, [JSON.stringify(variables), dataKey])

  // useEffect(() => {
  //   (newObject?.id || updatedObject?.id) &&
  //   !!subscriptionUpdateQuery &&
  //   client.query({
  //     query: subscriptionUpdateQuery,
  //     variables: {
  //       id: (newObject?.id || updatedObject?.id)
  //     }
  //   })
  // }, [subscriptionUpdateQuery, newObject?.id, updatedObject?.id])


  // useEffect(() => {
  //   (newObject?.id || updatedObject?.id) &&
  //   handleRefresh()
  // }, [handleRefresh, newObject?.id, updatedObject?.id])

  // useEffect(() => {
  //   // refetch({nextToken: null})
  //   !!doFreshLoad &&
  //   refetch({nextToken: null})
  // }, [doFreshLoad])

  // useEffect(() => {
  //   !!fetchAll &&
  //   !!nextToken &&
  //   handleEndReached()
  // }, [fetchAll, nextToken])

  // !!error && console.log(error)

  // // console.log(loading)

  // // console.log("LENGTH", items?.length)


  // return !!skip ? {} : { objects: items, nextToken, loading: !!fetchAll ? !!nextToken || !!loading : loading, onUpdateLoading, onCreateLoading, error, nextToken, refetch, handleRefresh, handleEndReached, clearResults }

  return {}
}