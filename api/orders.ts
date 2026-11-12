import { json, onlyMethod, supabase } from "./_lib/http";
export default async function handler(req:any,res:any){
 if(!onlyMethod(req,res,"POST"))return;
 const key=String(req.headers["idempotency-key"]||"");
 if(!/^[A-Za-z0-9-]{16,80}$/.test(key))return json(res,400,{error:"A valid idempotency key is required"});
 const body=req.body||{};
 const items=Array.isArray(body.items)?body.items:[];
 if(items.length<1||items.length>30||items.some((x:any)=>typeof x.itemId!=="string"||!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>50))return json(res,400,{error:"Invalid order items or quantities"});
 if(body.type!=="dine_in")return json(res,400,{error:"Only dine-in QR ordering is enabled"});
 const token=String(body.tableToken||"");
 if(!/^[A-Za-z0-9_-]{32,100}$/.test(token))return json(res,400,{error:"Scan a valid table QR code before ordering"});
 try{
  const result=await supabase("rpc/create_dine_in_order",{method:"POST",body:JSON.stringify({p_slug:String(body.restaurant||"dastarkhwan"),p_token:token,p_key:key,p_items:items.map((x:any)=>({itemId:x.itemId,quantity:x.quantity,instructions:String(x.instructions||"").slice(0,500)})),p_instructions:String(body.instructions||"").slice(0,500)})});
  return json(res,201,{order:result,message:"Your order has been received"});
 }catch(e){console.error("order api",e);return json(res,409,{error:e instanceof Error?e.message:"Order could not be placed"});}
}
