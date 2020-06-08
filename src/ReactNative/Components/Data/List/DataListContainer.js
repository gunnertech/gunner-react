import React from 'react'

import DataListView from "./DataListView"
import DataListContainer from '../../../../Components/Data/List';



export default props => 
  <DataListContainer
   DataListView={DataListView}
   {...props}
  />