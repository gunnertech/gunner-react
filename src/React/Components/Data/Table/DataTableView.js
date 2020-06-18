import React from 'react';
import { TableRow, TableCell, TableBody, Table, TableHead, TableSortLabel } from '@material-ui/core';

import { DataList } from "gunner-react/web";



export default ({
  classes,
  orderBy,
  order,
  fields,
  onHeaderCellClick,

  dataListParams,
  RenderComponent,
  query,
  dataKey,
  clientSort,
  clientFilter,
  variables
}) =>
  <div className={classes.root}>
    <Table size="small" className={classes.table}>
      <TableHead>
        <TableRow>
          {
            Object.entries(fields).map(([label, field]) =>
              <TableCell className={classes.tableCellNoWrap} key={label} sortDirection={orderBy === label ? order : false}>
                {
                  !field.sort ? (
                    !!field.hideLabel ? "" : label
                  ) : (
                    <TableSortLabel
                      active={orderBy === label}
                      direction={order}
                      onClick={() => onHeaderCellClick(label)}
                    >
                      {!!field.hideLabel ? "" : label}
                    </TableSortLabel>
                  )
                }
              </TableCell>
            )
          }
        </TableRow>
      </TableHead>
      <TableBody>
        <DataList {...dataListParams} />
      </TableBody>
    </Table>
  </div>