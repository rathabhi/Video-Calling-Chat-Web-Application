const socket=io('/');
const videoGrid=document.getElementById('video-grid');
const peer = new Peer(undefined,{
  path:'/peerjs',
  host:'/',
  port:'443'
}); 
const myVideo=document.createElement('video');
myVideo.muted=true;
const peers = {}


let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream)
    
    peer.on('call',call=>{
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    
    call.on("close", () => {
      video.remove();
    })
    peers[call.peer] = call;
  })

    socket.on('user-connected',(userId)=>{
      setTimeout(() => {
        newUserConnected(userId, stream)
      }, 3000) 
    })
})

//console.log(ROOM_ID);

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})


const newUserConnected= (userId,stream) => {
    const call=peer.call(userId,stream)
    const video=document.createElement('video')
    call.on(stream,userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
    call.on('close',()=>{
      video.remove()
    })
    peers[userId] = call
}

const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener("loadmetadata",()=>{
        video.play();
       
    });
    videoGrid.append(video);
    
};

let msg=$('input');

$('html').keydown((e)=>{
    if(e.which==13&&msg.val()!==0){
        socket.emit('message',msg.val());
        msg.val('');
    }
});

socket.on('createMessage',message=>{
    let li=document.createElement('li');
    li.innerHTML="<b>User</b>"+"<br/>"+message;
    $('ul').append(li);
    scrollToBottom();
})

const scrollToBottom = () => {
    let scrollObject=$('chat-window');
    scrollObject.scrollTop=scrollObject.scrollHeight - scrollObject.clientHeight;
  }

  const muteUnmute = () => {
    
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }

  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
      
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }

  const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__play_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__play_button').innerHTML = html;
  }

 