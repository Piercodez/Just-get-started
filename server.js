const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Replace this with the origin of your frontend
}));

// Supabase connection
const supabaseUrl = 'https://uavcqheraaauwzfmdpyq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhdmNxaGVyYWFhdXd6Zm1kcHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMzg2MDEsImV4cCI6MjAzODcxNDYwMX0.P0oMoNPIik2CuLO3AE5gy4lL9Qx8itsbWNvEwmp2uso';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Routes
app.get('/ideas', async (req, res) => {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .order('votes', { ascending: false });
  if (error) {
    res.status(500).send(error.message);
  } else {
    res.json(data);
  }
});

app.post('/ideas', async (req, res) => {
  const { text, user_name } = req.body;
  const { data, error } = await supabase
    .from('ideas')
    .insert([{ text, user_name, votes: 0 }])
    .single();
  if (error) {
    res.status(500).send(error.message);
  } else {
    res.json(data);
  }
});

app.put('/ideas/:id/upvote', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('ideas')
    .update({ votes: supabase.rpc('increment', { x: 1 }) })
    .eq('id', id)
    .single();
  if (error) {
    res.status(500).send(error.message);
  } else {
    res.json(data);
  }
});

app.put('/ideas/:id/downvote', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('ideas')
    .update({ votes: supabase.rpc('increment', { x: -1 }) })
    .eq('id', id)
    .single();
  if (error) {
    res.status(500).send(error.message);
  } else {
    res.json(data);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
