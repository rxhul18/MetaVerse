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

describe("User Information endpoints",()=>{
  
})