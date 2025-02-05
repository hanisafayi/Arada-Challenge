
async function display(){
    let html=``
     await fetch("http://localhost:3000/users")
      .then(res=>res.json())
      .then(data=>{
          data.forEach(element => {
              html+=`
            
              
              
          <div style="display:flex; flex-direction: column; justify-content:center; align-items:center;  " >

          <div class="bg-[#181A20] shadow-xl m-2 text-white flex flex-col justify-center w-[90vw] h-[100vh]">
          <img class="self-center hover:opacity-70" style="width: 300px; height: 300px;" src="images/Ellipse.png" alt="Your Avatar">

          <div class="bg-[#181A20] " style ="font-size:25px;">


            <div class="flex items-center justify-end gap-2">
            <input form="form${element._id}" class='input shrink w-1/12 text-xl  bg-[#181A20]' type="text" name="points" required disabled value="${element.age}">

            </div>
            
            </div>
        
          <form id="form${element._id}">
          <input class='bg-[#181A20] input ' type="text" name='name' flex-1 "  required disabled value="${element.name}">
          </form>
          
          
          </div>

          <input form="form${element._id}" class='input bg-[#181A20]' type="text" name="location" required disabled value="${element.email}">

          <input form="form${element._id}" class='input bg-[#181A20]' type="text" name="Description" required disabled value="${element.phoneNo}">

          
          

          

            
              <div scope="row" >
              <div class="flex mt-5  justify-between">
              <div class="flex">
            
        </div>

        
    </div>


              </div>

          </div>
          </div>
          
          `  
          });
          
      })
      let body=document.getElementById('body')
      if (body){
        body.innerHTML=html
      }
      
      
      let del = body.querySelectorAll('.delete-btn')
      let update = body.querySelectorAll('.update-btn')
      
      
    if (del){
      del.forEach(btn=>{
      btn.addEventListener('click',deleteRow)
       
      } )
    }
    if (update){
      update.forEach(btn=>{
      btn.addEventListener('click',updateRow)
       
      } )
    }
}
display()
function updateRow(){

    let tableData=this.parentElement.parentElement.querySelectorAll('.input')
    const id =this.parentElement.parentElement.childNodes[1].id
    tableData.forEach(element=>{
        element.disabled=false
    })
    this.parentElement.innerHTML=`<button style = "background-color: aqua; padding: 5px; color:white; font-size:25px;  border-radius:8px" type='submit' form="form${id}" class="save-btn">save</button>`
   
    let save = body.querySelectorAll('.save-btn')
    if (save){
        save.forEach(btn=>{

        btn.addEventListener('click',saveRow)
        
        } )
}

}
// eslint-disable-next-line @typescript-eslint/no-empty-function
function doThis(){

}
async function saveRow(e){
    e.preventDefault()
    const form=this.parentElement.parentElement.querySelector('form')

    const id =this.parentElement.parentElement.childNodes[1].id

    const formData= new FormData(form)

    let data={}
    for (let [key,val] of formData){

        data[key]=val
    }
   
    


    await fetch(`http://localhost:3000/users/${id}`,{
        method:'PATCH',
        body:JSON.stringify(data),
        headers: {
        'Content-Type': 'application/json'
        }

    })
    .then(res=>res.json())
    .then(data=>{

        let tableData=this.parentElement.parentElement.querySelectorAll('.input')
        let dataValue=[]
        for (let key in data){
            dataValue.push(data[key])
        }
        let i=1
        for (; i< dataValue.length-2;i++){
            tableData[i-1].value=dataValue[i]

        }
        this.parentElement.parentElement.querySelector('a').href=dataValue[i]
        tableData.forEach(element=>{
            element.disabled=true
        })
    
    })
    .catch(err=>console.log(err))

    this.parentElement.innerHTML=`<button style = "background-color: #2E8BC0; padding: 5px; color:white; font-size:25px;  border-radius:8px" class="update-btn" class="update-btn">update</button>`

    let update = body.querySelectorAll('.update-btn')
    if (update){
        update.forEach(btn=>{
        btn.addEventListener('click',updateRow)
        
        } )
    }

}
async function deleteRow(){
const id =this.parentElement.id
await fetch(`http://localhost:3000/users/${id}`,{method:'DELETE'})
.then(res=>res.json())
display()

}
const Salon= document.getElementById('form')
Salon.addEventListener('submit',addSalon)
 



async function addSalon(e){
    e.preventDefault()
    const formData=new FormData(Salon)
    let responseFetch;
   try{
        responseFetch=await fetch("http://localhost:3000/users",{
           method:'POST',
           body: formData
      
       })
   
   }catch(e){
       document.querySelector('error').innerHTML=error.message
   }
   if (responseFetch?.ok){
       responseFetch
       .then(res=> res.json())
       .then(data=>console.log("success",data))
   
   }else{
       if (responseFetch?.status==400){
           document.querySelector('.error').textContent=`allowed files are png, jpeg jpg or gif`
       }
   }
   
   }
   
function redirect(){
    window.location.href = '';
  }

