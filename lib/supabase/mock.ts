// Mock data for development without Supabase
export const mockUser = {
  id: 'test-user-id',
  email: 'test@chadao.com',
  full_name: '测试用户',
  phone: '+86 138 0000 0000',
  wallet_address: 'TRXxxx...',
  is_active: false,
  is_verified: true,
  activation_amount: 0,
  total_earned: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export const mockInviteCodes = [
  {
    id: '1',
    code: 'DEMO1234',
    user_id: 'admin-user-id',
    is_used: false,
    used_by: null,
    used_at: null,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    code: 'DEMO5678',
    user_id: 'admin-user-id',
    is_used: false,
    used_by: null,
    used_at: null,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    code: 'TEST1111',
    user_id: 'test-user-id',
    is_used: false,
    used_by: null,
    used_at: null,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    code: 'TEST2222',
    user_id: 'test-user-id',
    is_used: false,
    used_by: null,
    used_at: null,
    created_at: new Date().toISOString()
  }
]

export const mockCommissions = [
  {
    id: '1',
    user_id: 'test-user-id',
    from_member_id: 'referral-user-id',
    from_member_name: '推荐用户',
    level: 1,
    amount: 60,
    type: 'activation',
    status: 'pending',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'test-user-id',
    from_member_id: 'referral-user-id-2',
    from_member_name: '二级推荐',
    level: 2,
    amount: 45,
    type: 'activation',
    status: 'paid',
    paid_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
]

export const mockTeamStats = {
  totalTeamMembers: 5,
  directReferrals: 2,
  levelStats: {
    1: 2,
    2: 1,
    3: 1,
    4: 1,
    5: 0,
    6: 0,
    7: 0
  }
}
