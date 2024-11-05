const { axios } = require("axios");

function sum(a, b) {
  return a + b;
}

const BackendUrl = "http://localhost:3000";

describe("Authentication", ()=>{
  test("user is able to sign up only once", async()=>{
    const username = `kirat-${Math.random()}`;
    const password = "123456";
    const response = await axios.post(`${BackendUrl}/api/v1/user/signup`,{
      username,
      password
    })
    expect(response.statusCode).toBe(200)
    
    const updatedResponse = await axios.post(`${BackendUrl}/api/v1/user/signup`,{
      username,
      password,
      type:"admin"
    })
    expect(updatedResponse.statusCode).toBe(400)
  })
  
  test("Signup request fails if the username is epmpty", async ()=>{
    const username = `rahul-${Math.random()}` // rahul-13123ad
    const password = "123123"
    
    const response = await axios.post(`${BackendUrl}/api/v1/signup`,{
      password
    })
    
    expect(response.statusCode).toBe(400)
  })

  test("Signin suceeds if the name and password are correct", async ()=>{
    const username = `kirat-${Math.random()}` // rahul-13123ad
    const password = "123123"
    
    await axios.post(`${BackendUrl}/api/v1/signup`,{
      username,
      password
    })
    
    const response = await axios.post(`${BackendUrl}/api/v1/signin`,{
      username,
      password
    })
      
    expect(response.statusCode).toBe(200)
    expect(response.body.token).toBeDefined()
  })
  
  test("When Singin fails if the username and password are incorrect", async()=>{
    const username = `kirat-${Math.random()}` // rahul-13123ad
    const password = "123123"
    
    await axios.post(`${BackendUrl}/api/v1/signup`);
    
    const response = await axios.post(`${BackendUrl}/api/v1/signin`,{
      username:"WorngUserName", 
      password
    })
    
    expect(response.statusCode).toBe(403)
  })
})

describe("User metadata endpoints", ()=>{
  let token = "";
  let avtarId = ""; 
  
  beforeAll(async ()=>{
    const username = `kirat-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BackendUrl}/api/v1/user/signup`,{
      username,
      password,
      type:"admin"
    })

    const response = await axios.post(`${BackendUrl}/api/v1/user/signin`,{
      username,
      password
    })

    token = response.data.token

    const avatarResponse = await axios.get(`${BackendUrl}/api/v1/user/avatar`,{
      "imageUrl":"https://pbs.twimg.com/profile_images/1848053230590177280/54jUe3uZ_400x400.jpg",
      "name":"teddy"
    })

    avtarId = response.data.avatarId
  })

  test("User can update their metadata with a wrong avtar id",()=>{
    const response = await.post(`${BackendUrl}/ap1/v1/user/metadat`,{
      avtarId:"213123"
    },{
      headers:{
        "authorization":`Bearer ${token}` 
      }
    })
    
    expect(response.statusCode).toBe(400)
  })

  test("User can update their metadata with a right avtar id",()=>{
    const response = await.post(`${BackendUrl}/ap1/v1/user/metadat`,{
      avtarId
    },{
      headers:{
        "authorization":`Bearer ${token}` 
      }
    })
    
    expect(response.statusCode).toBe(200)
  })

  test("User is not able to update thier metadata if the auth header is not present",()=>{
    const response = await.post(`${BackendUrl}/ap1/v1/user/metadat`,{
      avtarId
    })
    
    expect(response.statusCode).toBe(200)
  })

  test("Test4",()=>{
    
  })
})

describe("User avatar information", ()=>{
  let avtarId;
  // let token; 
  let userId;

  beforeAll(async ()=>{
    const username = `kirat-${Math.random()}`;
    const password = "123456";

    const signupResponse = await axios.post(`${BackendUrl}/api/v1/user/signup`,{
      username,
      password,
      type:"admin"
    })

    userId = signupResponse.data.userId

    const response = await axios.post(`${BackendUrl}/api/v1/user/signin`,{
      username,
      password
    })

    token = response.data.token

    const avatarResponse = await axios.get(`${BackendUrl}/api/v1/user/avatar`,{
      "imageUrl":"https://pbs.twimg.com/profile_images/1848053230590177280/54jUe3uZ_400x400.jpg",
      "name":"teddy"
    })

    avtarId = response.data.avatarId
  })

  test("Get back avtar informatoin for a user", async()=>{
    const response = await axios.get(`${BackendUrl}/api/v1/user/avatar/[${userId}]`);

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);

  })

  test("Available avatars lists the recently created avatar", async()=>{
    const response = await axios.get(`${BackendUrl}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find(x =>x.id === avtarId);
  })
})