require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkNews() {
  const now = new Date().toISOString();
  console.log('Current time:', now);
  
  const { data: allNews, error } = await supabase
    .from('news')
    .select('id, title, published_at, category, author');
    
  if (error) {
    console.error('Error fetching news:', error);
    return;
  }
  
  console.log('\n--- All News in Database ---');
  console.log(JSON.stringify(allNews, null, 2));
  
  const reserved = allNews.filter(item => {
    if (!item.published_at) return false;
    return new Date(item.published_at) > new Date();
  });
  
  console.log('\n--- Reserved / Scheduled News ---');
  console.log(JSON.stringify(reserved, null, 2));
}

checkNews();
