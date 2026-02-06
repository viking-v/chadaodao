import { createClient } from './client'
import { mockUser, mockInviteCodes, mockCommissions, mockTeamStats } from './mock'

// Check if we're in development without Supabase configured
const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo.supabase.co')

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  wallet_address?: string
  is_active: boolean
  is_verified: boolean
  activation_amount: number
  total_earned: number
  created_at: string
  updated_at: string
}

export interface InviteCode {
  id: string
  code: string
  user_id: string
  is_used: boolean
  used_by?: string
  created_at: string
  used_at?: string
}

export interface TeamRelation {
  id: string
  parent_id: string
  child_id: string
  level: number
  created_at: string
}

export interface Commission {
  id: string
  user_id: string
  source_user_id: string
  amount: number
  level: number
  percentage: number
  status: 'pending' | 'approved' | 'paid'
  created_at: string
  paid_at?: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'activation' | 'commission' | 'withdrawal'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  tx_hash?: string
  created_at: string
  completed_at?: string
}

export interface Withdrawal {
  id: string
  user_id: string
  amount: number
  wallet_address: string
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  created_at: string
  processed_at?: string
}

// 数据库操作函数
export class DatabaseService {
  private supabase = createClient()

  // 用户相关操作
  async createUser(userData: Partial<User>) {
    if (isMockMode) {
      return { ...mockUser, ...userData }
    }
    
    const supabase = this.supabase
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getUserById(id: string): Promise<User | null> {
    if (isMockMode) {
      return id === mockUser.id ? mockUser : null
    }
    
    const supabase = this.supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (isMockMode) {
      return email === mockUser.email ? mockUser : null
    }
    
    const supabase = this.supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) return null
    return data
  }

  async updateUser(id: string, updates: Partial<User>) {
    if (isMockMode) {
      return { ...mockUser, ...updates }
    }
    
    const supabase = this.supabase
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // 邀请码相关操作
  async generateInviteCodes(userId: string, count: number = 5): Promise<InviteCode[]> {
    if (isMockMode) {
      return mockInviteCodes
    }
    
    const codes = []
    for (let i = 0; i < count; i++) {
      const code = this.generateInviteCode()
      codes.push({
        code,
        user_id: userId,
        is_used: false
      })
    }

    const { data, error } = await this.supabase
      .from('invite_codes')
      .insert(codes)
      .select()
    
    if (error) throw error
    return data || []
  }

  async getInviteCode(code: string): Promise<InviteCode | null> {
    if (isMockMode) {
      return mockInviteCodes.find(c => c.code === code && !c.is_used) || null
    }
    
    const { data, error } = await this.supabase
      .from('invite_codes')
      .select('*')
      .eq('code', code)
      .eq('is_used', false)
      .single()
    
    if (error) return null
    return data
  }

  async useInviteCode(code: string, usedBy: string) {
    if (isMockMode) {
      const inviteCode = mockInviteCodes.find(c => c.code === code)
      return { ...inviteCode!, is_used: true, used_by: usedBy }
    }
    
    const { data, error } = await this.supabase
      .from('invite_codes')
      .update({
        is_used: true,
        used_by: usedBy,
        used_at: new Date().toISOString()
      })
      .eq('code', code)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getUserInviteCodes(userId: string): Promise<InviteCode[]> {
    if (isMockMode) {
      return mockInviteCodes.filter(code => code.user_id === userId)
    }
    
    const { data, error } = await this.supabase
      .from('invite_codes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // 团队关系相关操作
  async createTeamRelation(parentId: string, childId: string, level: number) {
    if (isMockMode) {
      return { id: 'mock-relation', parent_id: parentId, child_id: childId, level, created_at: new Date().toISOString() }
    }
    
    const { data, error } = await this.supabase
      .from('team_relations')
      .insert({
        parent_id: parentId,
        child_id: childId,
        level
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getUserTeam(userId: string, level?: number): Promise<TeamRelation[]> {
    if (isMockMode) {
      return []
    }
    
    let query = this.supabase
      .from('team_relations')
      .select('*')
      .eq('parent_id', userId)
    
    if (level) {
      query = query.eq('level', level)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getUserUpline(userId: string): Promise<TeamRelation[]> {
    if (isMockMode) {
      return []
    }
    
    const { data, error } = await this.supabase
      .from('team_relations')
      .select('*')
      .eq('child_id', userId)
      .order('level', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  // 佣金相关操作
  async createCommission(commissionData: Partial<Commission>) {
    if (isMockMode) {
      return { ...mockCommissions[0], ...commissionData }
    }
    
    const { data, error } = await this.supabase
      .from('commissions')
      .insert(commissionData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getUserCommissions(userId: string): Promise<Commission[]> {
    if (isMockMode) {
      return mockCommissions.filter(c => c.user_id === userId)
    }
    
    const { data, error } = await this.supabase
      .from('commissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async updateCommissionStatus(id: string, status: Commission['status']) {
    if (isMockMode) {
      return { ...mockCommissions[0], id, status }
    }
    
    const updates: Partial<Commission> = { status }
    if (status === 'paid') {
      updates.paid_at = new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('commissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // 交易相关操作
  async createTransaction(transactionData: Partial<Transaction>) {
    if (isMockMode) {
      return { id: 'mock-transaction', ...transactionData, created_at: new Date().toISOString() }
    }
    
    const { data, error } = await this.supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    if (isMockMode) {
      return []
    }
    
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // 提现相关操作
  async createWithdrawal(withdrawalData: Partial<Withdrawal>) {
    if (isMockMode) {
      return { id: 'mock-withdrawal', ...withdrawalData, created_at: new Date().toISOString() }
    }
    
    const { data, error } = await this.supabase
      .from('withdrawals')
      .insert(withdrawalData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getUserWithdrawals(userId: string): Promise<Withdrawal[]> {
    if (isMockMode) {
      return []
    }
    
    const { data, error } = await this.supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // 工具函数
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // 计算佣金
  calculateCommission(amount: number, level: number): number {
    const percentages = [20, 15, 12, 10, 8, 6, 5] // 七级分润比例
    if (level < 1 || level > 7) return 0
    return amount * (percentages[level - 1] / 100)
  }
}

export const db = new DatabaseService()
