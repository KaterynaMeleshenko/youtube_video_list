async function getVideos() {

  document.body.insertAdjacentHTML('beforeend', `<div id='videos'></div>`);
  const mainInfo = document.getElementById('videos');
      
    try {
      const result = await axios.get(`http://localhost:3000/api/v1/video-list`);
      const videosData = result.data;
      let number = 1;

      videosData.forEach(video => {
        const title = video.title; 
        const date = video.date;   

        mainInfo.insertAdjacentHTML('beforeend', `<div class="video">Video #${number}. <b>
          ${title}</b> (${date})</div><br>`)
  
        number += 1
      })
    } catch (err) {
      console.log('error', err);
    }
}
  
getVideos();