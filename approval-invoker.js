const axios =require('axios');

(async () => {
    const url = "http://localhost:3000/approval/fail"
    const response = await axios.get(url)
    console.log(JSON.stringify(JSON.parse(response.data.env),null,2))
})()