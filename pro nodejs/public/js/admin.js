const deleteProduct=(btn)=>{
    const proId=btn.parentNode.querySelector("[name=proId]").value
    const price=btn.parentNode.querySelector("[name=proprice]").value

    const deleteElement=btn.closest("article")

    fetch("/admin/product/"+proId,{
        method:"DELETE",   
    }).then(result=>{
       return result.json()
    }).then(data=>{
        if(data.message.toString()==="Succsess"){

            deleteElement.remove()
        }else{
            alert("not Delete")
        }
    })
    .catch(err=>console.log(err))
  
}