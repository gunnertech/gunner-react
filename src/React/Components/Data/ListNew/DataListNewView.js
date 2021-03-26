import React, { useCallback } from 'react'
// import FlatList from 'flatlist-react';
import { useEffect } from 'react'
import { Button } from '@material-ui/core';

export default ({
  items,
  nextToken,
  skipAutoLoad,
  // setToken,
  refreshing,
  // loadNew,
  // clearResults,
  // refetch,
  loadMore,
  useButton,
  RenderComponent,
  viewVariables,
  buttonProps
}) => {
  const handleEndReached = useCallback(() => {
    // console.log((window.innerHeight + window.scrollY + 100), document.body.offsetHeight)
    if ((window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight) {
      // console.log("you're at the bottom of the page", nextToken);
      loadMore()
    }
  }, [loadMore, nextToken])

  useEffect(() => {
    window.addEventListener('scroll', !!useButton || !!skipAutoLoad ? (() => null) : handleEndReached);

    return () => window.removeEventListener('scroll', handleEndReached)
  }, [!!useButton, nextToken, skipAutoLoad])
  
  return (
    <>
      {
        items
          .map(item => 
            <RenderComponent
              key={item.id}
              id={item.id}
              object={item}
              {...viewVariables ?? {}}
            />  
        )
        // !!loading ? "Loading..." :
        // <FlatList
        //   hasMoreItems={hasMoreItems}
        //   list={
        //     objects.filter(uniqByProp('id')).slice().sort(clientSort).filter(clientFilter)
        //   }
        //   loadMoreItems={onEndReached}
        //   renderItem={item => 
        //     <RenderComponent
        //       key={item.id}
        //       id={item.id}
        //       object={item}
        //       filter={clientFilter}
        //       {...viewVariables ?? {}}
        //     />
        //   }
        // />
      }
      {
        !!useButton &&
        !!nextToken &&
        !skipAutoLoad &&
        <Button 
          fullWidth 
          variant="contained" 
          size="large" 
          color="secondary"
          onClick={loadMore}
          disabled={!!refreshing}
          {...(buttonProps??{})}
        >
          {!!refreshing ? "Loading..." : "Load More"}
        </Button>
      }
    </>
  )
}
  
