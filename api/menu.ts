import { createHash } from "node:crypto";
import { json, onlyMethod, supabase } from "./_lib/http";
export default async function handler(req:any,res:any){
 if(!onlyMethod(req,res,"GET"))return;
 try{
  const slug=String(req.query.restaurant||"dastarkhwan").toLowerCase();
  const rows=await supabase("restaurants?slug=eq."+encodeURIComponent(slug)+"&is_active=eq.true&select=id,name,slug,currency,takeaway_enabled&limit=1");
  const restaurant=rows?.[0]; if(!restaurant)return json(res,404,{error:"Restaurant menu not found"});
  const [categories,items]=await Promise.all([
   supabase("menu_categories?restaurant_id=eq."+restaurant.id+"&is_active=eq.true&select=id,name,slug,description,sort_order&order=sort_order.asc"),
   supabase("menu_items?restaurant_id=eq."+restaurant.id+"&is_available=eq.true&select=id,category_id,name,description,price_pkr,image_url,is_featured,dietary_labels,sort_order&order=sort_order.asc")
  ]);
  let table=null; const token=typeof req.query.table==="string"?req.query.table:"";
  if(token){
   if(!/^[A-Za-z0-9_-]{32,100}$/.test(token))return json(res,400,{error:"Invalid table QR code"});
   const hash=createHash("sha256").update(token).digest("hex");
   const qr=await supabase("table_qr_tokens?token_hash=eq."+hash+"&restaurant_id=eq."+restaurant.id+"&is_active=eq.true&select=table_id,restaurant_tables(table_number,is_active)&limit=1");
   if(!qr[0]||!qr[0].restaurant_tables?.is_active)return json(res,404,{error:"This table QR code is inactive or invalid"});
   table={id:qr[0].table_id,number:qr[0].restaurant_tables.table_number};
  }
  return json(res,200,{restaurant,categories,items,table});
 }catch(e){console.error("menu api",e);return json(res,500,{error:"Menu is temporarily unavailable"});}
}
