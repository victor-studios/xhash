const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const env = envLocal.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

async function fixSlots() {
  console.log('Fetching mining plans...');
  const { data: plans, error: plansError } = await supabase.from('mining_plans').select('*');
  if (plansError) return console.error('Error fetching plans:', plansError);

  console.log('Fetching orders...');
  const { data: orders, error: ordersError } = await supabase.from('orders').select('*').eq('status', 'active');
  if (ordersError) return console.error('Error fetching orders:', ordersError);

  const purchasedSlots = {};
  for (const order of orders) {
    // Assuming 1 order = 1 slot (or if amount/price implies quantity, we just count orders if each order is 1 quantity, 
    // wait, the RPC inserts multiple rows for quantity! `FOR i IN 1..p_quantity LOOP INSERT INTO orders...`)
    if (!purchasedSlots[order.package_id]) purchasedSlots[order.package_id] = 0;
    purchasedSlots[order.package_id]++;
  }

  console.log('Updating plans...');
  for (const plan of plans) {
    const purchased = purchasedSlots[plan.slug] || 0;
    const correctAvailable = plan.slots_total - purchased;
    if (plan.slots_available !== correctAvailable) {
      console.log(`Updating ${plan.slug}: ${plan.slots_available} -> ${correctAvailable}`);
      await supabase.from('mining_plans').update({ slots_available: correctAvailable }).eq('slug', plan.slug);
    }
  }
  
  console.log('Done!');
}

fixSlots();
