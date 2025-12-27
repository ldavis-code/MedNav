// supabase-auth.js

const SUPABASE_URL = 'https://lhvemrazkwlmdaljrcln.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodmVtcmF6a3dsbWRhbGpyY2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MDMyOTIsImV4cCI6MjA4MjE3OTI5Mn0.20dRGKemeN3-5J30cEJhMshkB0nBWSs92GfIylJW7QU';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign up new user
async function signUp(email, password) {
  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    console.error('Signup error:', error.message);
    return { success: false, message: error.message };
  }

  // Create their profile
  await supabaseClient.from('user_profiles').insert({
    id: data.user.id,
    email: email,
    plan: 'free'
  });

  return { success: true, message: 'Check your email for confirmation link', user: data.user };
}

// Log in existing user
async function login(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    console.error('Login error:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true, user: data.user };
}

// Log out
async function logout() {
  const { error } = await supabaseClient.auth.signOut();
  return !error;
}

// Get current user
async function getUser() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

// Ensure user profile exists
async function ensureProfile(user) {
  const { data } = await supabaseClient
    .from('user_profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!data) {
    await supabaseClient.from('user_profiles').insert({
      id: user.id,
      email: user.email,
      plan: 'free'
    });
  }
}

// Save a medication
async function saveMedication(medicationName, brandName, dosage, monthlyCost, renewalDate, renewalType) {
  const user = await getUser();
  if (!user) return { success: false, message: 'Not logged in' };

  // Ensure profile exists before saving medication
  await ensureProfile(user);

  const { data, error } = await supabaseClient
    .from('user_medications')
    .insert({
      user_id: user.id,
      medication_name: medicationName,
      brand_name: brandName,
      dosage: dosage,
      monthly_cost: monthlyCost,
      renewal_date: renewalDate,
      renewal_type: renewalType
    });

  if (error) {
    console.error('Save error:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true };
}

// Get user's saved medications
async function getMyMedications() {
  const user = await getUser();
  if (!user) return [];

  const { data, error } = await supabaseClient
    .from('user_medications')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });

  if (error) {
    console.error('Fetch error:', error.message);
    return [];
  }

  return data;
}

// Delete a medication
async function deleteMedication(medicationId) {
  const { error } = await supabaseClient
    .from('user_medications')
    .delete()
    .eq('id', medicationId);

  return !error;
}
