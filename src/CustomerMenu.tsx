import { useEffect, useMemo, useState } from "react";

type Restaurant={id:string;name:string;slug:string;currency:string;takeaway_enabled:boolean};
type Category={id:string;name:string;slug:string;description?:string;sort_order:number};
type Item={id:string;category_id:string;name:string;description:string;price_pkr:number;image_url?:string|null;is_featured:boolean;dietary_labels:string[]};
type MenuResponse={restaurant:Restaurant;categories:Category[];items:Item[];table:{id:string;number:string}|null};
type CartLine={item:Item;quantity:number;instructions:string};

const money=(value:number)=>new Intl.NumberFormat("en-PK",{style:"currency",currency:"PKR",maximumFractionDigits:0}).format(value);
export default function CustomerMenu(){
 const params=new URLSearchParams(window.location.search);
 const tableToken=params.get("table")||"";
 const [data,setData]=useState<MenuResponse|null>(null);
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(true);
 const [category,setCategory]=useState("all");
 const [search,setSearch]=useState("");
 const [cart,setCart]=useState<CartLine[]>([]);
 const [instructions,setInstructions]=useState("");
 const [busy,setBusy]=useState(false);
 const [confirmation,setConfirmation]=useState<{orderNumber:number;total:number}|null>(null);
 useEffect(()=>{fetch("/api/menu?restaurant=dastarkhwan"+(tableToken?"&table="+encodeURIComponent(tableToken):"")).then(async r=>{const j=await r.json();if(!r.ok)throw new Error(j.error||"Menu unavailable");return j as MenuResponse;}).then(setData).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[tableToken]);
 const visible=useMemo(()=>data?.items.filter(i=>(category==="all"||i.category_id===category)&&i.name.toLowerCase().includes(search.toLowerCase()))||[],[data,category,search]);
 const total=cart.reduce((sum,line)=>sum+line.item.price_pkr*line.quantity,0);
 const add=(item:Item)=>setCart(old=>{const found=old.find(x=>x.item.id===item.id);return found?old.map(x=>x.item.id===item.id?{...x,quantity:Math.min(50,x.quantity+1)}:x):[...old,{item,quantity:1,instructions:""}];});
 const change=(id:string,delta:number)=>setCart(old=>old.map(x=>x.item.id===id?{...x,quantity:x.quantity+delta}:x).filter(x=>x.quantity>0));
 async function submit(){
  if(!data?.table||!cart.length)return;
  setBusy(true);
  try{
   const key=crypto.randomUUID();
   const response=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":key},body:JSON.stringify({restaurant:"dastarkhwan",type:"dine_in",tableToken,items:cart.map(x=>({itemId:x.item.id,quantity:x.quantity,instructions:x.instructions})),instructions})});
   const result=await response.json();if(!response.ok)throw new Error(result.error||"Order could not be submitted");
   setConfirmation({orderNumber:Number(result.order.orderNumber),total:Number(result.order.total)});setCart([]);
  }catch(e){setError(e instanceof Error?e.message:"Order failed");}finally{setBusy(false);}
 }
 if(loading)return <main className="min-h-screen bg-[#f7f4ec] p-8 text-center text-[#174b39]">Loading menu…</main>;
 if(error||!data)return <main className="min-h-screen bg-[#f7f4ec] p-8 text-center"><h1 className="font-serif text-3xl text-[#174b39]">Menu unavailable</h1><p className="mt-3 text-stone-600">{error}</p></main>;
 if(!data.table)return <main className="min-h-screen bg-[#f7f4ec] p-8 text-center"><h1 className="font-serif text-3xl text-[#174b39]">Scan your table QR</h1><p className="mt-3 text-stone-600">Dine-in ordering is available through the QR code placed at your table.</p></main>;
 return <main className="min-h-screen bg-[#f7f4ec] pb-36 text-[#183f32]">
  <header className="bg-[#0b3d2e] px-5 py-8 text-center text-white"><p className="text-xs tracking-[.35em] text-[#d4af37]">GOOD FOOD. GREAT MOMENTS.</p><h1 className="mt-2 font-serif text-4xl">{data.restaurant.name}</h1><p className="mt-2 text-sm text-white/75">Table {data.table.number} · Digital Menu</p></header>
  <section className="mx-auto max-w-3xl px-4 py-6">
   <input aria-label="Search menu" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dishes…" className="w-full rounded-xl border border-[#d9d2c3] bg-white px-4 py-3 outline-none focus:border-[#b99736]"/>
   <div className="mt-4 flex gap-2 overflow-x-auto pb-2"><button onClick={()=>setCategory("all")} className={category==="all"?"rounded-full bg-[#0b3d2e] px-4 py-2 text-sm text-white":"rounded-full border border-[#c8c0ae] px-4 py-2 text-sm"}>All</button>{data.categories.map(c=><button key={c.id} onClick={()=>setCategory(c.id)} className={category===c.id?"whitespace-nowrap rounded-full bg-[#0b3d2e] px-4 py-2 text-sm text-white":"whitespace-nowrap rounded-full border border-[#c8c0ae] px-4 py-2 text-sm"}>{c.name}</button>)}</div>
   <div className="mt-5 space-y-4">{visible.map(item=><article key={item.id} className="flex gap-4 rounded-2xl border border-[#e7e0d3] bg-white p-3 shadow-sm">{item.image_url&&<img src={item.image_url} alt={item.name} loading="lazy" className="h-24 w-24 rounded-xl object-cover"/>}<div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><h2 className="font-serif text-xl">{item.name}</h2><strong className="whitespace-nowrap text-sm">{money(item.price_pkr)}</strong></div><p className="mt-1 text-sm text-stone-600">{item.description}</p>{item.dietary_labels.length>0&&<p className="mt-2 text-xs text-[#567b62]">{item.dietary_labels.join(" · ")}</p>}<button onClick={()=>add(item)} className="mt-3 rounded-full border border-[#b99736] px-4 py-1.5 text-sm text-[#174b39]">Add to order +</button></div></article>)}</div>
   {visible.length===0&&<p className="py-12 text-center text-stone-500">No dishes match your search.</p>}
  </section>
  {cart.length>0&&<aside className="fixed inset-x-0 bottom-0 z-20 border-t border-[#d9d2c3] bg-white/95 p-4 shadow-2xl backdrop-blur"><div className="mx-auto max-w-3xl"><div className="mb-2 flex items-center justify-between"><strong>Your order · {cart.reduce((n,x)=>n+x.quantity,0)} items</strong><strong>{money(total)}</strong></div><div className="max-h-32 space-y-2 overflow-auto">{cart.map(line=><div key={line.item.id} className="flex items-center justify-between text-sm"><span>{line.item.name}</span><span className="flex items-center gap-3"><button aria-label={"Remove one "+line.item.name} onClick={()=>change(line.item.id,-1)}>−</button>{line.quantity}<button aria-label={"Add one "+line.item.name} onClick={()=>change(line.item.id,1)}>+</button></span></div>)}</div><textarea value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="Order instructions (optional)" className="mt-3 w-full rounded-lg border border-stone-200 p-2 text-sm"/><button disabled={busy} onClick={submit} className="mt-3 w-full rounded-xl bg-[#0b3d2e] py-3 font-semibold text-white disabled:opacity-60">{busy?"Submitting…":"Place dine-in order · "+money(total)}</button></div></aside>}
  {confirmation&&<div className="fixed inset-0 z-30 grid place-items-center bg-black/50 p-5"><div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center"><h2 className="font-serif text-3xl text-[#174b39]">Order received</h2><p className="mt-3 text-stone-600">Your order number is <strong>#{confirmation.orderNumber}</strong>.</p><p className="mt-2 text-lg font-semibold">{money(confirmation.total)}</p><p className="mt-2 text-xs text-stone-500">The restaurant has received your order. It is not confirmed as accepted until staff review it.</p><button onClick={()=>setConfirmation(null)} className="mt-5 rounded-xl bg-[#0b3d2e] px-6 py-3 text-white">Continue browsing</button></div></div>}
 </main>;
}
