import React, { useEffect } from 'react';

import './App.css';
import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.11.0/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

var url_string = window.location.href
var url = new URL(url_string);
var meetingNum = url.searchParams.get("meetingNumber");
var pass = url.searchParams.get("passWord");
var name = url.searchParams.get("userName");
var leaveurl = url.searchParams.get("leaveurl");
console.log(meetingNum, pass, name, leaveurl)
function App() {

  var authEndpoint = 'https://dev.clapingo.com/api/session/zoomSignature'
  var sdkKey = 'lAzXXLSJQyKbYI1xZwqQOw'
  var meetingNumber = meetingNum
  var passWord = pass
  var role = 0
  var userName = name
  var userEmail = ''
  var registrantToken = ''
  var zakToken = ''
  var leaveUrl = leaveurl

  function getSignature() {
    // e.preventDefault();

    fetch(authEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
    .then(response => {
      startMeeting(response.signature)
    }).catch(error => {
      console.error(error)
    })
  }

  function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          sdkKey: sdkKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  useEffect(() => {

    const audioBtn = document.getElementsByClassName("media-preview-icon-mic-off");
    // audioBtn.click();


    setTimeout(() => {
      getSignature();
    }, 2000);
  }, []);

  return <></>
}

export default App;