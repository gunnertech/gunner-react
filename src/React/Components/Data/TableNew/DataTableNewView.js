import React from 'react';
import { TableRow, TableCell, TableBody, Table, TableHead, TableSortLabel, Box, TableContainer, Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import DataList from "../ListNew";
import { Button } from '@material-ui/core';


export default ({
  classes,
  orderBy,
  order,
  fields,
  onHeaderCellClick,
  hasMore,

  dataListParams,
  onLoadMoreClick,
  loading
}) =>
  <>
    <TableContainer component={Paper}>
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
          <DataList 
            useButton={!!dataListParams?.useButton}
            skipAutoLoad={!!dataListParams?.useButton}
            {...dataListParams}
          />
        </TableBody>
      </Table>
      {
        !!dataListParams?.useButton &&
        !!hasMore &&
        loading === false &&
        <Button 
          fullWidth 
          variant="contained" 
          size="large" 
          color="secondary"
          onClick={onLoadMoreClick}
          disabled={!!dataListParams?.refreshing}
        >
          {!!dataListParams?.refreshing ? "Loading..." : "Load More"}
        </Button>
      }
    </TableContainer>
    {
      !!loading &&
      <Box display="flex" mt={4} mb={4} justifyContent="center">
        <CircularProgress color="secondary" />
      </Box>
    }
  </>