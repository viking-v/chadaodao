import { db, Commission, Transaction } from '@/lib/supabase/database'
import { mockTeamStats } from '@/lib/supabase/mock'

// Check if we're in development without Supabase configured
const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo.supabase.co')

export class CommissionService {
  // 处理用户激活时的佣金分配
  async processActivationCommission(userId: string, amount: number = 300) {
    try {
      // 获取用户的上线关系
      const upline = await db.getUserUpline(userId)
      
      // 为每一级上线创建佣金记录
      for (const relation of upline) {
        const commissionAmount = db.calculateCommission(amount, relation.level)
        
        if (commissionAmount > 0) {
          // 创建佣金记录
          await db.createCommission({
            user_id: relation.parent_id,
            source_user_id: userId,
            amount: commissionAmount,
            level: relation.level,
            percentage: this.getPercentageByLevel(relation.level),
            status: 'pending'
          })

          // 创建交易记录
          await db.createTransaction({
            user_id: relation.parent_id,
            type: 'commission',
            amount: commissionAmount,
            status: 'pending'
          })

          // 更新用户总收益
          await db.updateUser(relation.parent_id, {
            total_earned: await this.calculateUserTotalEarnings(relation.parent_id)
          })
        }
      }

      // 创建激活交易记录
      await db.createTransaction({
        user_id: userId,
        type: 'activation',
        amount: amount,
        status: 'completed'
      })

      // 更新用户激活状态
      await db.updateUser(userId, {
        is_active: true,
        activation_amount: amount
      })

      return { success: true, message: '佣金分配成功' }
    } catch (error) {
      console.error('处理激活佣金错误:', error)
      return { success: false, message: '佣金分配失败' }
    }
  }

  // 计算用户总收益
  private async calculateUserTotalEarnings(userId: string): Promise<number> {
    const commissions = await db.getUserCommissions(userId)
    return commissions
      .filter(c => c.status === 'paid')
      .reduce((total, commission) => total + commission.amount, 0)
  }

  // 根据级别获取分润比例
  private getPercentageByLevel(level: number): number {
    const percentages = [20, 15, 12, 10, 8, 6, 5]
    return level >= 1 && level <= 7 ? percentages[level - 1] : 0
  }

  // 批量支付佣金（月度结算）
  async processMonthlyPayouts() {
    try {
      // 获取所有待支付的佣金
      const pendingCommissions = await this.getPendingCommissions()
      
      for (const commission of pendingCommissions) {
        // 更新佣金状态为已支付
        await db.updateCommissionStatus(commission.id, 'paid')
        
        // 更新交易状态
        await this.updateTransactionStatus(commission.user_id, commission.amount, 'completed')
        
        // 更新用户总收益
        await db.updateUser(commission.user_id, {
          total_earned: await this.calculateUserTotalEarnings(commission.user_id)
        })
      }

      return { success: true, message: `成功支付 ${pendingCommissions.length} 笔佣金` }
    } catch (error) {
      console.error('月度结算错误:', error)
      return { success: false, message: '月度结算失败' }
    }
  }

  // 获取待支付佣金（这里需要扩展数据库查询）
  private async getPendingCommissions(): Promise<Commission[]> {
    // 这里应该添加日期过滤，只获取当前结算周期的佣金
    // 暂时返回所有待支付佣金
    const allCommissions: Commission[] = []
    // 实际实现中需要查询数据库获取待支付佣金
    return allCommissions.filter(c => c.status === 'pending')
  }

  // 更新交易状态
  private async updateTransactionStatus(userId: string, amount: number, status: string) {
    const transactions = await db.getUserTransactions(userId)
    const pendingTransaction = transactions.find(t => 
      t.type === 'commission' && 
      t.amount === amount && 
      t.status === 'pending'
    )
    
    if (pendingTransaction) {
      // 这里需要实现更新交易状态的方法
      // 暂时通过数据库直接更新
    }
  }

  // 获取用户团队统计
  async getUserTeamStats(userId: string) {
    try {
      if (isMockMode) {
        return mockTeamStats
      }
      
      const team = await db.getUserTeam(userId)
      const stats = {
        totalTeamMembers: team.length,
        directReferrals: team.filter(t => t.level === 1).length,
        levelStats: {} as Record<number, number>
      }

      // 统计各级别人数
      for (let level = 1; level <= 7; level++) {
        stats.levelStats[level] = team.filter(t => t.level === level).length
      }

      return stats
    } catch (error) {
      console.error('获取团队统计错误:', error)
      return {
        totalTeamMembers: 0,
        directReferrals: 0,
        levelStats: {}
      }
    }
  }

  // 获取用户佣金统计
  async getUserCommissionStats(userId: string) {
    try {
      const commissions = await db.getUserCommissions(userId)
      
      return {
        totalCommissions: commissions.length,
        pendingCommissions: commissions.filter(c => c.status === 'pending').length,
        paidCommissions: commissions.filter(c => c.status === 'paid').length,
        totalEarned: commissions
          .filter(c => c.status === 'paid')
          .reduce((total, c) => total + c.amount, 0),
        pendingAmount: commissions
          .filter(c => c.status === 'pending')
          .reduce((total, c) => total + c.amount, 0)
      }
    } catch (error) {
      console.error('获取佣金统计错误:', error)
      return {
        totalCommissions: 0,
        pendingCommissions: 0,
        paidCommissions: 0,
        totalEarned: 0,
        pendingAmount: 0
      }
    }
  }
}

export const commissionService = new CommissionService()
