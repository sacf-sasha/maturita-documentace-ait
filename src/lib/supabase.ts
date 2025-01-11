import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vbuvdzvmkeczdrfnyjkl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZidXZkenZta2VjemRyZm55amtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNDQ0MTksImV4cCI6MjA1MTgyMDQxOX0.-Fdtyh0OJ7goBQGSkUBRqsvW4Rg4Fg9LZ0LjMafZLmc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
