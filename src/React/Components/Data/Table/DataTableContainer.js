import React, { useState } from 'react';
import { TableRow, TableCell } from '@material-ui/core';

import useStyles from './DataTableStyles';
import DataTableView from './DataTableView';


export default ({
  fields, 
  search, 
  defaultSort = order => (a, b) => a.createdAt > b.createdAt ? (order === 'desc' ? -1 : 1) : (order === 'asc' ? -1 : 1),
  dataListParams
}) => {
  const classes = useStyles();
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState('desc');
  const [forceMore, setForceMore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(null);

  const CustomTableRow = ({object, id, filter = item => true}) => {
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
  }

  const handleHeaderCellClick = label =>
    label === orderBy ? (
      setOrder(order === 'desc' ? 'asc' : 'desc')
    ) : (
      setOrderBy(label)
    )
  
  const selectedField = Object.entries(fields).find(([label, field]) => label === orderBy);
  const sortFunc = !!selectedField ? selectedField[1].sort(order) : defaultSort(order);
  const filterFunc = item => 
    !!Object.entries(fields)
      .map(([label, field]) => !!field.searchValue ? field.searchValue(item) : field.value(item))
      .join(", ")
      .includes(search||"")


  return (
    <DataTableView
      classes={classes}
      orderBy={orderBy}
      order={order}
      fields={fields}
      onHeaderCellClick={handleHeaderCellClick}
      onLoadMoreClick={() => setForceMore(forceMore => forceMore + 1)}
      forceMore={forceMore}

      onLoaded={loaded => setLoaded(loaded)}
      onLoading={loading => setLoading(loading)}

      loading={loading}
      loaded={loaded}

      dataListParams={{
        RenderComponent: CustomTableRow,
        clientSort: sortFunc,
        clientFilter: filterFunc,
        ...dataListParams
      }}
    />
  )
}