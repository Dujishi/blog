let delay = time => new Promise((resolve,reject)=>setTimeout(_=>resolve(),time));

const getData = status => status?'done':'fail';

const getRes = async (data)=>{
  let res = getData(data)
  let t1=  +new Date()
  await delay(2000)
  let t2=  +new Date()

  console.log(t2-t1)

}

getRes(true)