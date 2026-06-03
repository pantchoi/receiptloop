import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rykbnumkmnrkhpwdmiui.supabase.co'
const supabaseKey = 'sb_publishable_RWNNqvcoiT8YEkJW2XzjJA_Gg97MrKp'

export const supabase = createClient(supabaseUrl, supabaseKey)  