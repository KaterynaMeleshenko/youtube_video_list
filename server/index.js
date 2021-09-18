const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const axios = require("axios");
const path = require('path');

const apiKey = 'AIzaSyBjdYyvNvSYSFxTul2zXxRx_X72fRtR67w';
let pageToken = '';
const appropriateWord = 'javascript';
const englishTitleOnly = /^[a-zA-Z0-9@\$!%\*\?&#\|^_\-\. \+]+$/;
const inappropriateWord = 'basics';
const earliestDate = '2020-10-09';


app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/api/v1/video-list', async (req, res) => {
  try {
	const response = await axios({
	  url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${appropriateWord}&type=video&regionCode=UK&maxResults=50&order=date&key=${apiKey}&pageToken=${pageToken}`,
	  method: 'get',
	});
	const videos = response.data.items;
	let i = 0;

	const dataForClient = videos.reduce((prevItems, item) => {
	  const videoTitle = item.snippet.title;
	  const videoTime = item.snippet.publishedAt;

	  if ( i < 15 && 
		videoTime > earliestDate && 
		!videoTitle.match(inappropriateWord) && 
		videoTitle.match(englishTitleOnly) ) {
				 
		  const title = videoTitle;
		  const date = videoTime.replace("T", " ").replace("Z", "").split(' ').join(' ');
		  
		  prevItems.push({title, date});
		  i += 1;	
	  }
	  
	  return prevItems;
    }, []);

    dataForClient.sort((a, b) => a.date > b.date ? 1 : -1);
      
	res.status(200).json(dataForClient);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.listen(port, () => {
  console.log(`Youtube video list at http://localhost:${port}`)
})
