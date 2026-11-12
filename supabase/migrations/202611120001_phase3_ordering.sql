create extension if not exists pgcrypto;
create table if not exists public.restaurants(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,currency text not null default 'PKR',is_active boolean not null default true,takeaway_enabled boolean not null default false,created_at timestamptz not null default now());
create table if not exists public.menu_categories(id uuid primary key default gen_random_uuid(),restaurant_id uuid not null references public.restaurants(id) on delete cascade,name text not null,slug text not null,description text,sort_order int not null default 0,is_active boolean not null default true,unique(restaurant_id,slug));
create table if not exists public.menu_items(id uuid primary key default gen_random_uuid(),restaurant_id uuid not null references public.restaurants(id) on delete cascade,category_id uuid not null references public.menu_categories(id),name text not null,description text not null default '',price_pkr int not null check(price_pkr>=0),image_url text,is_featured boolean not null default false,is_available boolean not null default true,dietary_labels text[] not null default '{}',sort_order int not null default 0,created_at timestamptz not null default now());
create table if not exists public.item_media(id uuid primary key default gen_random_uuid(),item_id uuid not null references public.menu_items(id) on delete cascade,media_url text not null,media_type text not null check(media_type in('image','video')),sort_order int not null default 0);
create table if not exists public.item_variants(id uuid primary key default gen_random_uuid(),item_id uuid not null references public.menu_items(id) on delete cascade,name text not null,price_delta_pkr int not null default 0,is_available boolean not null default true);
create table if not exists public.addon_groups(id uuid primary key default gen_random_uuid(),item_id uuid not null references public.menu_items(id) on delete cascade,name text not null,required boolean not null default false,min_select int not null default 0,max_select int not null default 1);
create table if not exists public.addon_options(id uuid primary key default gen_random_uuid(),group_id uuid not null references public.addon_groups(id) on delete cascade,name text not null,price_delta_pkr int not null default 0,is_available boolean not null default true);
create table if not exists public.restaurant_tables(id uuid primary key default gen_random_uuid(),restaurant_id uuid not null references public.restaurants(id) on delete cascade,table_number text not null,is_active boolean not null default true,unique(restaurant_id,table_number),unique(id,restaurant_id));
create table if not exists public.table_qr_tokens(id uuid primary key default gen_random_uuid(),restaurant_id uuid not null,table_id uuid not null,token_hash text not null unique,is_active boolean not null default true,created_at timestamptz not null default now(),foreign key(table_id,restaurant_id) references public.restaurant_tables(id,restaurant_id) on delete cascade);
create table if not exists public.orders(id uuid primary key default gen_random_uuid(),restaurant_id uuid not null references public.restaurants(id),table_id uuid references public.restaurant_tables(id),order_number bigint generated always as identity unique,order_type text not null check(order_type in('dine_in','takeaway')),status text not null default 'pending' check(status in('pending','accepted','preparing','ready','completed','cancelled')),customer_name text,customer_phone text,special_instructions text,subtotal_pkr int not null check(subtotal_pkr>=0),total_pkr int not null check(total_pkr>=0),idempotency_key text not null,created_at timestamptz not null default now(),unique(restaurant_id,idempotency_key));
create table if not exists public.order_items(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id) on delete cascade,menu_item_id uuid references public.menu_items(id),item_name text not null,variant_name text,unit_price_pkr int not null,quantity int not null check(quantity between 1 and 50),special_instructions text);
create table if not exists public.order_item_addons(id uuid primary key default gen_random_uuid(),order_item_id uuid not null references public.order_items(id) on delete cascade,addon_name text not null,unit_price_pkr int not null,quantity int not null default 1);
create table if not exists public.order_status_history(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id) on delete cascade,old_status text,new_status text not null,changed_at timestamptz not null default now());
create index if not exists menu_items_restaurant_category_idx on public.menu_items(restaurant_id,category_id,is_available);
create index if not exists orders_restaurant_created_idx on public.orders(restaurant_id,created_at desc);
alter table public.restaurants enable row level security; alter table public.menu_categories enable row level security; alter table public.menu_items enable row level security; alter table public.item_media enable row level security; alter table public.item_variants enable row level security; alter table public.addon_groups enable row level security; alter table public.addon_options enable row level security; alter table public.restaurant_tables enable row level security; alter table public.table_qr_tokens enable row level security; alter table public.orders enable row level security; alter table public.order_items enable row level security; alter table public.order_item_addons enable row level security; alter table public.order_status_history enable row level security;
create policy "public reads active restaurants" on public.restaurants for select using(is_active);
create policy "public reads active categories" on public.menu_categories for select using(is_active);
create policy "public reads available items" on public.menu_items for select using(is_available);
create policy "public reads active tables" on public.restaurant_tables for select using(is_active);
-- No public policies for orders, QR tokens or order line tables. Server-only service role accesses these.

create or replace function public.create_dine_in_order(p_slug text,p_token text,p_key text,p_items jsonb,p_instructions text default '')
returns jsonb language plpgsql security definer set search_path=public
as $$
declare r restaurants%rowtype; t restaurant_tables%rowtype; q table_qr_tokens%rowtype; x jsonb; dish menu_items%rowtype; qty int; subtotal int:=0; new_order orders%rowtype; line_id uuid;
begin
 select * into r from restaurants where slug=p_slug and is_active=true;
 if not found then raise exception 'Restaurant is unavailable'; end if;
 select * into q from table_qr_tokens where token_hash=encode(digest(p_token,'sha256'),'hex') and restaurant_id=r.id and is_active=true;
 if not found then raise exception 'Table QR code is invalid or inactive'; end if;
 select * into t from restaurant_tables where id=q.table_id and restaurant_id=r.id and is_active=true;
 if not found then raise exception 'Table is inactive'; end if;
 if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)<1 or jsonb_array_length(p_items)>30 then raise exception 'Invalid order items'; end if;
 select * into new_order from orders where restaurant_id=r.id and idempotency_key=p_key;
 if found then return jsonb_build_object('id',new_order.id,'orderNumber',new_order.order_number,'status',new_order.status,'total',new_order.total_pkr,'duplicate',true); end if;
 for x in select * from jsonb_array_elements(p_items) loop
  qty:=(x->>'quantity')::int;
  if qty<1 or qty>50 then raise exception 'Invalid quantity'; end if;
  select * into dish from menu_items where id=(x->>'itemId')::uuid and restaurant_id=r.id and is_available=true;
  if not found then raise exception 'A selected dish is unavailable'; end if;
  subtotal:=subtotal+(dish.price_pkr*qty);
 end loop;
 insert into orders(restaurant_id,table_id,order_type,status,special_instructions,subtotal_pkr,total_pkr,idempotency_key)
 values(r.id,t.id,'dine_in','pending',left(coalesce(p_instructions,''),500),subtotal,subtotal,p_key)
 returning * into new_order;
 for x in select * from jsonb_array_elements(p_items) loop
  qty:=(x->>'quantity')::int;
  select * into dish from menu_items where id=(x->>'itemId')::uuid and restaurant_id=r.id and is_available=true;
  insert into order_items(order_id,menu_item_id,item_name,unit_price_pkr,quantity,special_instructions)
  values(new_order.id,dish.id,dish.name,dish.price_pkr,qty,left(coalesce(x->>'instructions',''),500));
 end loop;
 insert into order_status_history(order_id,new_status) values(new_order.id,'pending');
 return jsonb_build_object('id',new_order.id,'orderNumber',new_order.order_number,'status',new_order.status,'total',new_order.total_pkr,'duplicate',false);
end; $$;
revoke all on function public.create_dine_in_order(text,text,text,jsonb,text) from public,anon,authenticated;
grant execute on function public.create_dine_in_order(text,text,text,jsonb,text) to service_role;
