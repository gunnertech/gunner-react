/* global loadImage */

import React, { useRef, useReducer, useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import Storage from '@aws-amplify/storage';
import uuid from 'uuid-v4'
import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

const getCroppedImg = (image, crop) => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      resolve({blob, data: canvas.toDataURL('image/jpeg')});
    }, 'image/jpeg');
  });
}

const initialState = {uploading: false, photoData: null, photoUrl: null, croppedData: null, croppedBlob: null, rawFile: null};

const reducer = (state, action) => {
  switch (action.type) {
    case 'upload':
      return {
        ...state,
        uploading: true
      };
    case 'read':
      return {
        ...state,
        uploading: false,
        ...action.payload
      };
    case 'crop':
      return {
        ...state,
        uploading: false,
        ...action.payload
      };
    case 'uploaded':
      return {
        ...state,
        uploading: false,
        ...action.payload
      };
    case 'reset':
      return {
        ...initialState
      };
    default:
      throw new Error();
  }
}

const PhotoUpload = ({onUpload, onRead, photoUrl, doPrompt, skipCrop}) => {
  const inputEl = useRef(null);
  const [state, dispatch] = useReducer(reducer, {...initialState, photoUrl});
  const [crop, setCrop] = useState({ unit: '%', x: 0, width: 100, height: 100, y: 0 });
  const [croppingImage, setCroppingImage] = useState(null);
  
  const _handleCrop = () =>
    getCroppedImg(croppingImage, crop)
      .then(cropped => dispatch({type: 'crop', payload: {croppedData: cropped.data, croppedBlob: cropped.blob}}))

  const _handleSelect = evt => 
    Promise.resolve({
      reader: new FileReader(),
      file: evt.target.files[0]
    })
      .then(({reader, file}) => 
        new Promise(resolve => {
          // reader.onload = e => resolve(dispatch({type: 'read', payload: {photoData: r.result}}))
          reader.onload = e => 
            loadImage(
              e.target.result,
              img =>
                img.toBlob((blob) => {
                  const r = new FileReader();
                  r.readAsDataURL(blob); 
                  r.onloadend = () =>
                    resolve(dispatch({type: 'read', payload: {photoData: r.result, rawFile: file}}))
                })
              ,
              {orientation: true}
            );
          reader.readAsDataURL(file);
        }),
      )

    

    

  const _handleUpload = () => [
    dispatch({type: 'upload'}),
    Storage.put(`${1}-${uuid()}`, (state.croppedBlob || state.rawFile), {
      contentType: 'image/jpeg'
    })
      .then(({key}) => Storage.get(key))
      .then(url => dispatch({type: 'uploaded', payload: {photoUrl: url.split("?")[0]}}))
      .catch(console.log)
  ]

  useEffect(() => {
    !!state.photoUrl &&
    state.photoUrl !== photoUrl &&
    onUpload(state.photoUrl)
  }, [state.photoUrl])

  useEffect(() => {
    !!doPrompt &&
    !!inputEl &&
    !state.photoData &&
    inputEl.current.click()
  }, [doPrompt, inputEl])

  return (
    <>
      <input 
        style={{visibility: 'hidden'}} 
        type="file" 
        ref={inputEl} 
        accept=".jpg, .jpeg, .png" 
        onChange={_handleSelect}
      />
      {
        !!state.photoData && 
        !state.croppedData &&
        !skipCrop &&
        <>
          <ReactCrop
            src={state.photoData}
            crop={crop}
            onChange={crop => setCrop(crop)}
            onImageLoaded={setCroppingImage}
          />
          <Button fullWidth variant={'contained'} color="secondary" onClick={_handleCrop}>Crop</Button>
        </>
      }
      {
        (
          !!state.croppedData || (
            !!skipCrop && !!state.photoData
          )
        ) &&
        !state.photoUrl &&
        <>
          <div>
            <img src={state.croppedData || state.photoData} alt="Upload" style={{maxWidth: '100%', height: 'auto'}} />
          </div>
          <Button 
            disabled={!!state.uploading} 
            fullWidth
            variant={'contained'}
            color="secondary" 
            onClick={_handleUpload}>{!!state.uploading ? "Uploading" : "Upload"}</Button>
        </>
      }
      {
        !!state.photoUrl &&
        <>
          <div>
            <img src={state.photoUrl} alt="Uploaded" style={{maxWidth: '100%', height: 'auto'}} />
          </div>
          <Button 
            fullWidth 
            disabled={!!state.uploading} 
            variant="outlined" 
            color="secondary" 
            onClick={() => ([dispatch({type: 'reset'}), inputEl.current.click()])}
          >Change Photo</Button>
        </>
      }
      {
        !state.photoData &&
        !state.photoUrl &&
        <Button 
          fullWidth 
          variant={'contained'} 
          color="secondary" 
          onClick={() => inputEl.current.click()}
        >Select Logo</Button>
      }
      
    </>
  )
}

export default PhotoUpload