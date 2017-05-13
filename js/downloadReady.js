function dReady() {
var window = remote.getCurrentWindow();
  try {
    $("#Down").click(function() {

      window.webContents.session.on('will-download', (event, item, webContents) => {

          item.on('updated', (event, state) => {

          if (state === 'interrupted') {
           item.cancel()
          } else if (state === 'progressing') {
            if (item.isPaused()) {
              item.cancel()
            } else {

              percentage = `${Math.floor((item.getReceivedBytes()/item.getTotalBytes())*100)}`;
              $("#loader").css({"width":"" + percentage + "%","transition":"0.2s","background-color":"rgba(155, 89, 182,0.5)"});

            }
          }
        })

        var songName = item.getFilename();

        item.once('done', (event, state) => {
          if (state === 'completed') {
            window.notifier.notify({
              title: 'Download completed',
              message: 'The song ' + songName + 'has been downloaded sucessfully',
              sound: true, // Only Notification Center or Windows Toasters
              wait: false // Wait with callback, until user action is taken against notification
            }, function (err, response) {
              // Response is response from notification
            });

            $("#loader").css("background-color", "rgba(26, 188, 156,0.5)");
            playAudio('done');

            setTimeout(function(){$("#loader").css({"background-color":"rgba(0, 0, 0,0)","transition":"1s"});}, 2000);

          } else {
            playAudio('error');
            item.cancel()
          }
        })
      })
    });
  }
  catch(err) {
      alert("Error, Please restart the application");
  }




}
