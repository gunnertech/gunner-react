import React, { useState, useCallback, useMemo } from 'react';
import { TableRow, TableCell } from '@material-ui/core';

import useStyles from './DataTableNewStyles';
import DataTableView from './DataTableNewView';

const defaultSort = undefined;

export default ({
  fields, 
  dataListParams,
}) => {
  const classes = useStyles();
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState('desc');
  const [hasMore, setHasMore] = useState(true);
  const [loadMoreCount, setLoadMoreCount] = useState(0);
  const localSort = dataListParams?.clientSort ?? defaultSort;
  const [loading, setLoading] = useState(null);
  
  const CustomTableRow = useCallback(({object}) => {
    return (
      <TableRow>
        {
          Object.entries(fields).map(([label, field]) =>
            <TableCell key={label} className={!!field.nowrap ? classes.tableCellNoWrap : null }>
              {field.value(object)}
            </TableCell>
          )
        }
      </TableRow>
    )
  }, [fields]);

  const handleHeaderCellClick = useCallback(label =>
    label === orderBy ? (
      setOrder(order === 'desc' ? 'asc' : 'desc')
    ) : (
      setOrderBy(label)
    )
  , [orderBy, order]);

  const selectedField = useMemo(() => Object.entries(fields).find(([label, field]) => label === orderBy), [orderBy, fields]);
  const sortFunc = useMemo(() => !!selectedField ? selectedField[1].sort(order) : localSort, [selectedField, localSort, order]);
  const loadMore = useCallback(() => setLoadMoreCount(loadMoreCount => loadMoreCount + 1), []);

  const handleEndReached = useCallback(() =>
    setHasMore(false)
  , [])

  return (
    <DataTableView
      classes={classes}
      orderBy={orderBy}
      order={order}
      fields={fields}
      onHeaderCellClick={handleHeaderCellClick}
      onLoadMoreClick={loadMore}
      hasMore={hasMore}
      loading={loading}
      
      dataListParams={{
        RenderComponent: CustomTableRow,
        clientSort: sortFunc,
        loadMoreCount,
        onEndReached: handleEndReached,
        onLoading: setLoading,
        ...dataListParams
      }}
    />
  )
}