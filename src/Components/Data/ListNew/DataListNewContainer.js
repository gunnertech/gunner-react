import React from 'react'
import useDataFetcher from '../../../Hooks/useNewDataFetcher';

const defaultOnItemsChange = items => items;
const defaultSort = undefined;
const defaultFilter = item => true;
const defaultTransform = items => items;
const defaultOnCreatedItem = item => item;
const defaultOnUpdatedItem = item => item;
const defaultOnLoading = loading => loading;
const defaultViewVariables = {};
const defaultButtonProps = {};
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

  DataListView,
  useButton,
  RenderComponent,
  viewVariables = defaultViewVariables,
  buttonProps = defaultButtonProps,
  skipAutoLoad
}) => {
  const results = useDataFetcher({
    pollInterval,
    skip,
    refetchCount,
    clearResultsCount, 
    loadMoreCount,
    query, 
    onCreateQuery,
    onUpdateQuery,
    clientFilter,
    clientSort,
    clientTransform,
    onItemsChange,
    onCreatedItem,
    onUpdatedItem,
    onEndReached,
    onLoading
  });

  return (
    <DataListView
      RenderComponent={RenderComponent}
      useButton={useButton}
      skipAutoLoad={skipAutoLoad}
      viewVariables={viewVariables}
      buttonProps={buttonProps}
      {...results}
    />
  )

}