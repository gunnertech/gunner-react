import React from 'react'
import { FlatList, View, Text } from 'react-native'
import uniqByProp from '../../../../Util/uniqByProp';


export default ({objects, loading, onRefresh, onEndReached, RenderComponent, viewVariables, clientFilter = item => !!item}, clientSort = (a,b) => 1) =>
  <FlatList
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
      objects.filter(uniqByProp('id')).slice().sort(clientSort).filter(clientFilter)
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
