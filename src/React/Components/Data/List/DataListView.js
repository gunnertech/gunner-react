import React from 'react'
// import FlatList from 'flatlist-react';
import uniqByProp from '../../../../Util/uniqByProp';
import { useEffect } from 'react'
import { Button } from '@material-ui/core';

export default ({
  loading, 
  hasMoreItems, 
  nextToken,
  objects, 
  onEndReached, 
  RenderComponent, 
  viewVariables, 
  clientFilter = item => !!item, 
  clientSort,
  useButton,
  usedButton,
  forceMore
}) => {
  console.log("useButton", useButton)
  const handleEndReached = () => {
    // console.log((window.innerHeight + window.scrollY + 100), document.body.offsetHeight)
    if ((window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight) {
      console.log("you're at the bottom of the page", nextToken);
      onEndReached(nextToken)
    }
  }

  useEffect(() => {
    // console.log("OKOK", nextToken)
    window.addEventListener('scroll', !!useButton ? (() => null) : handleEndReached);

    return () => window.removeEventListener('scroll', handleEndReached)
  }, [!!useButton, !!usedButton, nextToken])

  useEffect(() => {
    !!forceMore &&
    onEndReached()
  }, [forceMore])
  
  return (
    <>
      {
        objects
          .slice()
          .filter(uniqByProp('id'))
          .sort(clientSort)
          .filter(clientFilter)
          .map(item => 
            <RenderComponent
              key={item.id}
              id={item.id}
              object={item}
              filter={clientFilter}
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
        !!hasMoreItems &&
        !usedButton &&
        <Button 
          fullWidth 
          variant="contained" 
          size="large" 
          color="secondary"
          onClick={() => onEndReached(nextToken)}
          disabled={!!loading}
        >
          {!!loading ? "Loading..." : "Load More"}
        </Button>
      }
    </>
  )
}
  
