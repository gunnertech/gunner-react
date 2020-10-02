import React from 'react'
import { FlatList, View, Text } from 'react-native'
import uniqByProp from '../../../../Util/uniqByProp';


export default ({onScroll, objects, loading, onRefresh, onEndReached, RenderComponent, viewVariables, clientFilter = item => !!item, clientSort}) =>
  <FlatList
    onScroll={onScroll}
    keyboardShouldPersistTaps="handled"
    ListEmptyComponent={
      !!loading ? null :
      <View style={{flex: 1, alignItems: "center", margin: 16}}>
        <Text>Nothing Yet!</Text>
      </View>
    }
    refreshing={!!loading}
    onRefresh={onRefresh}
    keyExtractor={item => item.id}
    data={
      (objects??[]).filter(uniqByProp('id')).slice().sort(clientSort ?? undefined).filter(clientFilter)
    }
    onEndReached={onEndReached}
    renderItem={({item}) => 
      <RenderComponent
        id={item.id}
        object={item}
        filter={clientFilter}
        {...viewVariables ?? {}}
      />
    }
  />
