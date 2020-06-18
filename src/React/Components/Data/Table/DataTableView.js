import React from 'react';
import { TableRow, TableCell, TableBody, Table, TableHead, TableSortLabel } from '@material-ui/core';

import DataList from "../List";



export default ({
  classes,
  orderBy,
  order,
  fields,
  onHeaderCellClick,

  dataListParams,
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