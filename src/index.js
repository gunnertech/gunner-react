import { CurrentUserContext } from "./Contexts/CurrentUser"
import { CognitUserContext } from "./Contexts/CognitoUser"


export useInterval from "./Hooks/useInterval"
export useDataFetcher from "./Hooks/useDataFetcher"
export useDataObject from "./Hooks/useDataObject"
export useMemoizedQuery from "./Hooks/useMemoizedQuery"
export useAppSyncClient from "./Hooks/useAppSyncClient"
export useCurrentUser from "./Hooks/useCurrentUser"

export uniqByProp from "./Util/uniqByProp"
export withoutKeys from "./Util/withoutKeys"
import normalizePhoneNumber from "./Util/normalizePhoneNumber"
export withoutBlanks from "./Util/withoutBlanks"
export downloadCsv from "./Util/downloadCsv"

console.log("normalizePhoneNumber", normalizePhoneNumber)

export { 
  CurrentUserContext,
  CognitUserContext,
  normalizePhoneNumber
}