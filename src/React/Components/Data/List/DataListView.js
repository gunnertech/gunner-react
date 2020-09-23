import React from 'react'
// import FlatList from 'flatlist-react';
import uniqByProp from '../../../../Util/uniqByProp';
import { useEffect } from 'react'
import { Button } from '@material-ui/core';

export default ({
  loading, 
  hasMoreItems, 
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
  const handleEndReached = () => {
    if ((window.innerHeight + window.scrollY - 50) >= document.body.offsetHeight) {
      console.log("you're at the bottom of the page", !!hasMoreItems);
      !!hasMoreItems && onEndReached()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', !!useButton || !!usedButton ? (() => null) : handleEndReached);

    return () => window.removeEventListener('scroll', handleEndReached)
  }, [!!useButton, !!usedButton])

  useEffect(() => {
    !!forceMore &&
    onEndReached()
  }, [forceMore])

  console.log("RENDERING")
  
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
          onClick={onEndReached}
          disabled={!!loading}
        >
          {!!loading ? "Loading..." : "Load More"}
        </Button>
      }
    </>
  )
}
  
