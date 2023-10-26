let express =require('express');
let app=express();
app.use(express.json());
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-with, Content-Type,Accept'
    );
    next();
});
// const port=2410;
var port = process.env.PORT || 2410;
app.listen(port, ()=>console.log(`Node app listening on port ${port}!`));
let {customersData}=require('./customersData.js')
app.get('/svr/test',function(req,res){
    res.send('Test Response customerData');
});

app.get('/customers',function(req,res){
    let arr1=customersData;
    let city=req.query.city;
    let gender=req.query.gender;
    let payment=req.query.payment;
    let sortBy=req.query.sortBy;
    if(city){
        arr1=arr1.filter((f1)=>f1.city==city);
    };
    if(gender){
        arr1=arr1.filter((f1)=>f1.gender==gender)
    }
    if(payment){
        arr1=arr1.filter((f1)=>f1.payment===payment)
    }
    if(sortBy){
        if (sortBy === 'city') {
            // Use the correct property for sorting, assuming city is a property of your customer object
            arr1 = arr1.sort((a, b) => a.city.localeCompare(b.city));
        }
        if (sortBy === 'age') {
            arr1 = arr1.sort((a, b) => {
                // Assuming 'age' is a property in your customer objects
                return a.age - b.age;
            });
        }
        if(sortBy==='payment'){
            arr1 = arr1.sort((a, b) => a.payment.localeCompare(b.payment));

        }
        if(sortBy==='gender'){
            arr1 = arr1.sort((a, b) => a.gender.localeCompare(b.gender));
        }
    }
    res.send(arr1);
})
app.get('/customer/:id',function(req,res){
     let id=req.params.id;
     let customer=customersData.find((a)=>(a.id===id));
     if(customer){
        res.send(customer)
     }
     else{
        res.status(404).send('that id not parsent')
     }
})
function generateUniqueId(data) {
    const ids = data.map(customer => customer.id);
    let newId;
    do {
        newId = Math.floor(Math.random() * 10000).toString();
    } while (ids.includes(newId));
    return newId;
}

app.post('/customers',function(req,res){
    let body=req.body
    let newid=generateUniqueId(customersData)
    let updataData={id:newid,...body}
    customersData.push(updataData)
    res.send(updataData);
})
app.put('/customers/:id', function (req, res) {
    let body = req.body;
    let id = req.params.id; // Remove the + operator
        // Check if id is a valid number
        console.log(id)
        let ind = customersData.findIndex((st) => st.id == id);
        if (ind >= 0) {
            let updatedData = { id: id, ...body };
            customersData[ind] = updatedData;
            res.send(updatedData);
        } else {
            res.status(404).send('No data with the specified id found');
        }
});
app.delete('/customers/:id',function(req,res){
    let id=req.params.id;
    let ind=customersData.findIndex((st)=>st.id===id);
    if(ind>=0){
    let deletedata=customersData.splice(ind,1);
        res.send(deletedata)
    }
    
})