import React from 'react'

import DataListView from "./DataListNewView"
import DataListContainer from '../../../../Components/Data/ListNew';



export default props => 
  <DataListContainer
    DataListView={DataListView}
    {...props}
  />