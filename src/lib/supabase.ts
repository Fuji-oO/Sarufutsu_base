import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 型定義
export interface Reservation {
  id?: string
  name: string
  email: string
  phone: string
  checkin_date: string
  checkout_date: string
  checkin_time: string
  num_guests: number
  adult_male?: number
  adult_female?: number
  child?: number
  room_type: string
  notes?: string
  status: string
  total_price?: number
  price_detail?: string
  created_at?: string
  updated_at?: string
}

export interface User {
  id?: string
  email: string
  password_hash: string
  name?: string
  role: string
  created_at?: string
  updated_at?: string
  last_login_at?: string
  mfa_enabled?: boolean
} 