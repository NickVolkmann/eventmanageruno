import { HttpService } from "@mvx/javascript-lib";

const Errormanager = {
install(Vue, backurl) {
    Vue.config.errorHandler = async function(err, vm,  info) {
 
      try{
        const {data} =  await HttpService.post(`${backurl}`, 
          JSON.stringify({"timestamp": new Date(), "err": err.name, "msg": err.message, "info": info}));
        return data;
        }
     
      catch(e){
      console.error("Error message: ", e.message);
        }
          };
  
    
        Vue.onerror = async function(message, source, lineno, colno, error) {
    
          try{
            const {data} =  await HttpService.post(`${backurl}`, 
              JSON.stringify({"timestamp": new Date(), "msg":message, "source": source, "lineno": lineno, "colno": colno, "error": error}));
            return data;
          }
         
        catch(e){
          console.log(e.message);
        } 
      }
    
        Vue.mixin({
          methods: {
            LogEvent(event, msg){
              try {
                if(event){
                  throw new Error(msg)
                }
              } catch(error) {
                const {data} =  HttpService.post(`${backurl}`, 
                JSON.stringify({"timestamp": new Date(),"msg":msg}));
                return data;
              }
            }
          },
      });
 }
};

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(ErrorManager);
}

export default Errormanager;