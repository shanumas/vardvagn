export class HomePanel {


  generalMode(){
    console.log('General mode chosen')
    var allSelectedItems=document.getElementsByClassName('selected-mode') as HTMLCollection
    for(var count=0; count<allSelectedItems.length; count++){
      var otherItem = allSelectedItems[count]
      otherItem.classList.toggle('selected-mode')
    }
    var element = document.getElementById('general-mode') as unknown as HTMLDivElement
    element.classList.toggle('selected-mode')       
  }

  stethMode(){
    console.log('Steth mode chosen')
    
    var allSelectedItems=document.getElementsByClassName('selected-mode') as HTMLCollection
    for(var count=0; count<allSelectedItems.length; count++){
      var otherItem = allSelectedItems[count]
      otherItem.classList.toggle('selected-mode')
    }
    var element = document.getElementById('steth-mode') as unknown as HTMLDivElement
    element.classList.toggle('selected-mode')
  }

  ecgMode(){
    console.log('ECG mode chosen')
    var allSelectedItems=document.getElementsByClassName('selected-mode') as HTMLCollection
    for(var count=0; count<allSelectedItems.length; count++){
      var otherItem = allSelectedItems[count]
      otherItem.classList.toggle('selected-mode')
    }
    var element = document.getElementById('ecg-mode') as unknown as HTMLDivElement
    element.classList.toggle('selected-mode')
  }

  cameraMode(){
    console.log('Camera mode chosen')
    var allSelectedItems=document.getElementsByClassName('selected-mode') as HTMLCollection
    for(var count=0; count<allSelectedItems.length; count++){
      var otherItem = allSelectedItems[count]
      otherItem.classList.toggle('selected-mode')
    }
    var element = document.getElementById('camera-mode') as unknown as HTMLDivElement
    element.classList.toggle('selected-mode')
  }

  public attached() {
    console.log('constructor')
    // Grab elements, create settings, etc.
    var video = document.getElementById('video') as HTMLVideoElement

    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
      });
    }
  }

}
