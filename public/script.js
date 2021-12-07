const socket=io('/');
const videoGrid=document.getElementById('video-grid');

const myVideo=document.createElement('video');
myVideo.muted=true;

var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3000'
}); 

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
    })

    socket.on('user-connected',(userId)=>{
        setTimeout(function(){
            newUserConnected(userId,stream);
        },5000)
        
        
    })
})

console.log(ROOM_ID);

peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})


const newUserConnected= (userId,stream) => {
    const call=peer.call(userId,stream)
    const video=document.createElement('video')
    call.on(stream,userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
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
    $('ul').append('<li class="message"><b>User</b><br/>${message}</li>')
})