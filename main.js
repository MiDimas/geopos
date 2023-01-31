(function (){
    let width = 480;
    let height = 0;

    let streaming = false;

    let video = null;
    let canvas = null;
    let photo = null;
    let getPhoto = null;
    let logBlock = null;
    let latitude = null;
    let longitude = null;

    function startup() {
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        photo = document.getElementById("photo");
        getPhoto = document.getElementById("getPhoto");
        logBlock = document.getElementById('log');


        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {exact: 'enviroment'}
            },
            audio: false
        })
            .then(stream=>{
                video.srcObject = stream;
                video.play()
            })
            .catch(err=>{
                err.name == "OverconstrainedError"
                    ? navigator.mediaDevices.getUserMedia(
                        {video: true, audio: false}
                    )
                        .then(stream=>{
                            video.srcObject = stream;
                            video.play()
                        })
                        .catch(e=>{
                            console.log("Произошла ошибка" + e)
                        })
                    : console.log("Произошла ошибка" + err)

            })
        video.addEventListener('canplay', () => {
            if (!streaming){
                height = video.videoHeight / (video.videoWidth/width);

                if (isNaN(height)) {
                    height = width / (4/3);
                }
                video.setAttribute('width', width);
                video.setAttribute('height', height);

                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(position => {
                            latitude = position.coords.latitude;
                            longitude = position.coords.longitude;
                            console.log("Ваши координаты", latitude, longitude)

                        },
                        positionError => {
                            console.log("Произошла ошибка" + positionError)
                        })
                }
                else{
                    alert("У вас нет геолокации")
                }

            }
        });

        getPhoto.addEventListener('click', ev => {
            takePicture();
            ev.preventDefault();
        })
        clearPhoto();
    }

    const clearPhoto = () => {
        let context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);

    }

    const takePicture = () => {
        let context = canvas.getContext('2d');
        if(width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);


            context.beginPath();
            context.font = "22px Verdana";
            context.fillStyle = "white";
            context.fillText(`Широта: ${latitude}`, 5, canvas.height - 50)
            context.fillText(`Долгота: ${longitude}`, 5,  canvas.height - 10)
            context.closePath();

            let data = canvas.toDataURL('image/png');
            photo.setAttribute("src", data);


        }
        else {
            clearPhoto();
        }
    }

   window.addEventListener('load', startup)
})();