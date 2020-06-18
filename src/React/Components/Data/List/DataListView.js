import React from 'react'
import FlatList from 'flatlist-react';
import uniqByProp from '../../../../Util/uniqByProp';
import { useEffect } from 'react'


export default ({loading, hasMoreItems, objects, onEndReached, RenderComponent, viewVariables, clientFilter = item => !!item, clientSort}) => {
  const handleEndReached = () => {
    if ((window.innerHeight + window.scrollY - 50) >= document.body.offsetHeight) {
      console.log("you're at the bottom of the page", !!hasMoreItems);
      !!hasMoreItems && onEndReached()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleEndReached);

    return () => window.removeEventListener('scroll', handleEndReached)
  })
  
  return (
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
  )
}
  
