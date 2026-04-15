/**
 * lib/storage.ts
 *
 * Next.js-compatible storage layer. Implements all required CRUD methods using
 * Drizzle ORM and the shared db client. Does NOT import express-session,
 * connect-pg-simple, or any other Express/Node server-only packages so that
 * this file is safe to import from Next.js App Router route handlers and
 * Server Components.
 */

import { db } from "@/lib/db";
import {
  users,
  type User,
  type InsertUser,
  categories,
  type Category,
  type InsertCategory,
  menuItems,
  type MenuItem,
  type InsertMenuItem,
  orders,
  type Order,
  type InsertOrder,
  orderItems,
  type OrderItem,
  type InsertOrderItem,
  rewards,
  type Reward,
  type InsertReward,
  userRewards,
  type UserReward,
  type InsertUserReward,
  promoCodes,
  type PromoCode,
  type InsertPromoCode,
  userPoints,
  type UserPoints,
  type InsertUserPoints,
  pointsTransactions,
  type PointsTransaction,
  type InsertPointsTransaction,
  pointsRewards,
  type PointsReward,
  type InsertPointsReward,
  userPointsRedemptions,
  type UserPointsRedemption,
  type InsertUserPointsRedemption,
  vacationMode,
  type VacationMode,
  type InsertVacationMode,
  storeHours,
  type StoreHours,
  type InsertStoreHours,
  restaurantSettings,
  type RestaurantSettings,
  type InsertRestaurantSettings,
  choiceGroups,
  type ChoiceGroup,
  type InsertChoiceGroup,
  choiceItems,
  type ChoiceItem,
  type InsertChoiceItem,
  menuItemChoiceGroups,
  type MenuItemChoiceGroup,
  type InsertMenuItemChoiceGroup,
  categoryChoiceGroups,
  type CategoryChoiceGroup,
  type InsertCategoryChoiceGroup,
  taxCategories,
  type TaxCategory,
  type InsertTaxCategory,
  taxSettings,
  type TaxSettings,
  type InsertTaxSettings,
  pauseServices,
  type PauseService,
  type InsertPauseService,
  printerConfig,
  type PrinterConfig,
  type InsertPrinterConfig,
  deliveryZones,
  type DeliveryZone,
  type InsertDeliveryZone,
  deliverySettings,
  type DeliverySettings,
  type InsertDeliverySettings,
} from "@shared/schema";

import { eq, and, or, ne, isNull, sql, asc, desc } from "drizzle-orm";

// ---------------------------------------------------------------------------
// DatabaseStorage
// ---------------------------------------------------------------------------

class DatabaseStorage {
  // -------------------------------------------------------------------------
  // User operations
  // -------------------------------------------------------------------------

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId));
    return user;
  }

  async getUserBySupabaseId(supabaseId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.supabaseUserId, supabaseId));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        isAdmin: insertUser.isAdmin || false,
        rewards: 0,
        stripeCustomerId: null,
        phone: insertUser.phone ?? null,
        address: insertUser.address ?? null,
        city: insertUser.city ?? null,
        state: insertUser.state ?? null,
        zipCode: insertUser.zipCode ?? null,
        marketingOptIn:
          insertUser.marketingOptIn !== undefined
            ? insertUser.marketingOptIn
            : true,
      })
      .returning();
    return user;
  }

  async updateUser(
    id: number,
    userData: Partial<InsertUser>
  ): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // Category operations
  // -------------------------------------------------------------------------

  async getAllCategories(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .orderBy(asc(categories.order));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(
    id: number,
    category: Partial<InsertCategory>
  ): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // Menu Item operations
  // -------------------------------------------------------------------------

  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id));
    return menuItem;
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.category, category));
  }

  async getFeaturedMenuItems(): Promise<MenuItem[]> {
    // First try to get items marked as popular or best seller
    const featuredItems = await db
      .select()
      .from(menuItems)
      .where(
        or(eq(menuItems.isPopular, true), eq(menuItems.isBestSeller, true))
      )
      .limit(3);

    if (featuredItems.length >= 3) {
      return featuredItems;
    }

    // If not enough featured items, fill the remainder with other available items
    const remainingCount = 3 - featuredItems.length;
    const additionalItems = await db
      .select()
      .from(menuItems)
      .where(
        and(eq(menuItems.isPopular, false), eq(menuItems.isBestSeller, false))
      )
      .limit(remainingCount);

    return [...featuredItems, ...additionalItems];
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const [newMenuItem] = await db
      .insert(menuItems)
      .values({
        ...menuItem,
        options: menuItem.options ?? null,
        imageUrl: menuItem.imageUrl ?? null,
        isPopular: menuItem.isPopular ?? false,
        isNew: menuItem.isNew ?? false,
        isBestSeller: menuItem.isBestSeller ?? false,
        isAvailable: menuItem.isAvailable ?? true,
      })
      .returning();
    return newMenuItem;
  }

  async updateMenuItem(
    id: number,
    menuItemData: Partial<InsertMenuItem>
  ): Promise<MenuItem | undefined> {
    const [updatedMenuItem] = await db
      .update(menuItems)
      .set({ ...menuItemData })
      .where(eq(menuItems.id, id))
      .returning();
    return updatedMenuItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning({ id: menuItems.id });
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // Order operations
  // -------------------------------------------------------------------------

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    return order;
  }

  async getOrderWithItems(
    id: number
  ): Promise<Order & { items: OrderItem[] }> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
    return { ...order, items };
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));
  }

  async getActiveOrders(): Promise<(Order & { items: OrderItem[] })[]> {
    const activeOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          ne(orders.status, "completed"),
          ne(orders.status, "cancelled")
        )
      );

    return Promise.all(
      activeOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        return { ...order, items };
      })
    );
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values({
        ...order,
        status: order.status ?? "pending",
        userId: order.userId ?? null,
        address: order.address ?? null,
        deliveryFee: order.deliveryFee ?? "0",
        tip: order.tip ?? "0",
        paymentStatus: order.paymentStatus ?? "pending",
        paymentIntentId: order.paymentIntentId ?? null,
        specialInstructions: order.specialInstructions ?? null,
        processedAt: null,
        completedAt: null,
      })
      .returning();
    return newOrder;
  }

  async updateOrderStatus(
    id: number,
    status: string
  ): Promise<Order | undefined> {
    const updateData: Record<string, unknown> = { status };

    // Update timestamps based on status
    if (status === "processing") {
      updateData.processedAt = new Date();
    } else if (status === "completed") {
      updateData.completedAt = new Date();
    }

    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async updateOrderPaymentStatus(
    id: number,
    status: string
  ): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ paymentStatus: status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async updateOrderPaymentIntent(
    id: number,
    paymentIntentId: string
  ): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ paymentIntentId })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async updateOrderTotal(
    id: number,
    total: number
  ): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ total: total.toString() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async updateOrderRefund(
    id: number,
    refundData: {
      refundId: string;
      refundAmount: number;
      refundReason: string;
      refundedBy: number;
      refundedAt: Date;
    }
  ): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({
        refundId: refundData.refundId,
        refundAmount: refundData.refundAmount.toString(),
        refundReason: refundData.refundReason,
        refundedBy: refundData.refundedBy,
        refundedAt: refundData.refundedAt,
      })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async updateOrder(
    id: number,
    updates: Partial<InsertOrder>
  ): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set(updates)
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    try {
      // Delete associated order items first to satisfy the foreign-key constraint
      await db.delete(orderItems).where(eq(orderItems.orderId, id));
      await db.delete(orders).where(eq(orders.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      return false;
    }
  }

  // -------------------------------------------------------------------------
  // Order Item operations
  // -------------------------------------------------------------------------

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  async getAllOrderItems(): Promise<OrderItem[]> {
    return await db.select().from(orderItems);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db
      .insert(orderItems)
      .values({
        ...orderItem,
        options: orderItem.options ?? {},
        specialInstructions: orderItem.specialInstructions ?? null,
        isFreeItem: orderItem.isFreeItem ?? false,
      })
      .returning();
    return newOrderItem;
  }

  // -------------------------------------------------------------------------
  // Reward operations
  // -------------------------------------------------------------------------

  async getAllRewards(): Promise<Reward[]> {
    return await db.select().from(rewards);
  }

  async getActiveRewards(): Promise<Reward[]> {
    return await db
      .select()
      .from(rewards)
      .where(eq(rewards.active, true));
  }

  async getReward(id: number): Promise<Reward | undefined> {
    const [reward] = await db
      .select()
      .from(rewards)
      .where(eq(rewards.id, id));
    return reward;
  }

  async getRewardsByUserId(
    userId: number
  ): Promise<(UserReward & { reward: Reward })[]> {
    const userRewardsList = await db
      .select()
      .from(userRewards)
      .where(
        and(eq(userRewards.userId, userId), eq(userRewards.isUsed, false))
      );

    return Promise.all(
      userRewardsList.map(async (userReward) => {
        const [reward] = await db
          .select()
          .from(rewards)
          .where(eq(rewards.id, userReward.rewardId));
        if (!reward) {
          throw new Error(`Reward with id ${userReward.rewardId} not found`);
        }
        return { ...userReward, reward };
      })
    );
  }

  async createReward(reward: InsertReward): Promise<Reward> {
    const [newReward] = await db
      .insert(rewards)
      .values({
        ...reward,
        discount: reward.discount ?? null,
        discountType: reward.discountType ?? null,
        minOrderAmount: reward.minOrderAmount ?? null,
        expiresAt: reward.expiresAt ?? null,
      })
      .returning();
    return newReward;
  }

  async updateReward(
    id: number,
    reward: Partial<InsertReward>
  ): Promise<Reward | undefined> {
    const [updatedReward] = await db
      .update(rewards)
      .set(reward)
      .where(eq(rewards.id, id))
      .returning();
    return updatedReward;
  }

  async deleteReward(id: number): Promise<boolean> {
    const result = await db
      .delete(rewards)
      .where(eq(rewards.id, id))
      .returning({ id: rewards.id });
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // User Points operations
  // -------------------------------------------------------------------------

  async getUserPoints(userId: number): Promise<UserPoints | undefined> {
    const [userPointsData] = await db
      .select()
      .from(userPoints)
      .where(eq(userPoints.userId, userId));
    return userPointsData;
  }

  async updateUserPoints(
    userId: number,
    points: number,
    totalEarned?: number,
    totalRedeemed?: number
  ): Promise<UserPoints | undefined> {
    const existing = await this.getUserPoints(userId);

    if (existing) {
      const [updatedUserPoints] = await db
        .update(userPoints)
        .set({
          points,
          totalEarned:
            totalEarned !== undefined ? totalEarned : existing.totalEarned,
          totalRedeemed:
            totalRedeemed !== undefined
              ? totalRedeemed
              : existing.totalRedeemed,
          lastEarnedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userPoints.userId, userId))
        .returning();
      return updatedUserPoints;
    } else {
      const [newUserPoints] = await db
        .insert(userPoints)
        .values({
          userId,
          points,
          totalEarned: totalEarned || 0,
          totalRedeemed: totalRedeemed || 0,
          lastEarnedAt: new Date(),
        })
        .returning();
      return newUserPoints;
    }
  }

  async createPointsTransaction(
    transaction: InsertPointsTransaction
  ): Promise<PointsTransaction> {
    const [newTransaction] = await db
      .insert(pointsTransactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async awardPointsForOrder(
    userId: number,
    orderId: number,
    orderAmount: number
  ): Promise<void> {
    // 1 point per dollar
    const pointsEarned = Math.floor(orderAmount);

    let userPointsRecord = await this.getUserPoints(userId);

    if (!userPointsRecord) {
      await this.updateUserPoints(userId, pointsEarned, pointsEarned, 0);
    } else {
      await this.updateUserPoints(
        userId,
        userPointsRecord.points + pointsEarned,
        userPointsRecord.totalEarned + pointsEarned,
        userPointsRecord.totalRedeemed
      );
    }

    await this.createPointsTransaction({
      userId,
      orderId,
      type: "earned",
      points: pointsEarned,
      description: `Points earned from order #${orderId}`,
      orderAmount: orderAmount.toString(),
    });
  }

  async getPointsTransactions(
    userId: number,
    limit = 20
  ): Promise<PointsTransaction[]> {
    return await db
      .select()
      .from(pointsTransactions)
      .where(eq(pointsTransactions.userId, userId))
      .orderBy(sql`${pointsTransactions.createdAt} DESC`)
      .limit(limit);
  }

  // -------------------------------------------------------------------------
  // Points Rewards operations
  // -------------------------------------------------------------------------

  async getAllPointsRewards(): Promise<PointsReward[]> {
    return await db
      .select()
      .from(pointsRewards)
      .orderBy(asc(pointsRewards.pointsRequired));
  }

  async getActivePointsRewards(): Promise<PointsReward[]> {
    return await db
      .select()
      .from(pointsRewards)
      .where(eq(pointsRewards.isActive, true))
      .orderBy(asc(pointsRewards.pointsRequired));
  }

  async getPointsReward(id: number): Promise<PointsReward | undefined> {
    const [reward] = await db
      .select()
      .from(pointsRewards)
      .where(eq(pointsRewards.id, id));
    return reward;
  }

  async createPointsReward(
    reward: InsertPointsReward
  ): Promise<PointsReward> {
    const [newReward] = await db
      .insert(pointsRewards)
      .values(reward)
      .returning();
    return newReward;
  }

  async updatePointsReward(
    id: number,
    reward: Partial<InsertPointsReward>
  ): Promise<PointsReward | undefined> {
    const [updatedReward] = await db
      .update(pointsRewards)
      .set({ ...reward, updatedAt: new Date() })
      .where(eq(pointsRewards.id, id))
      .returning();
    return updatedReward;
  }

  async deletePointsReward(id: number): Promise<boolean> {
    const result = await db
      .delete(pointsRewards)
      .where(eq(pointsRewards.id, id))
      .returning();
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // Reward Redemption operations
  // -------------------------------------------------------------------------

  async redeemPointsReward(
    userId: number,
    rewardId: number,
    orderId?: number
  ): Promise<UserPointsRedemption> {
    const reward = await this.getPointsReward(rewardId);
    if (!reward) {
      throw new Error("Reward not found");
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const [redemption] = await db
      .insert(userPointsRedemptions)
      .values({
        userId,
        pointsRewardId: rewardId,
        orderId: orderId || null,
        pointsSpent: reward.pointsRequired,
        expiresAt,
      })
      .returning();

    return redemption;
  }

  async getUserPointsRedemptions(
    userId: number
  ): Promise<(UserPointsRedemption & { reward: PointsReward })[]> {
    const redemptions = await db
      .select({
        id: userPointsRedemptions.id,
        userId: userPointsRedemptions.userId,
        pointsRewardId: userPointsRedemptions.pointsRewardId,
        orderId: userPointsRedemptions.orderId,
        pointsSpent: userPointsRedemptions.pointsSpent,
        isUsed: userPointsRedemptions.isUsed,
        usedAt: userPointsRedemptions.usedAt,
        expiresAt: userPointsRedemptions.expiresAt,
        createdAt: userPointsRedemptions.createdAt,
        reward: {
          id: pointsRewards.id,
          name: pointsRewards.name,
          description: pointsRewards.description,
          pointsRequired: pointsRewards.pointsRequired,
          rewardType: pointsRewards.rewardType,
          rewardValue: pointsRewards.rewardValue,
          rewardDescription: pointsRewards.rewardDescription,
          isActive: pointsRewards.isActive,
          maxRedemptions: pointsRewards.maxRedemptions,
          currentRedemptions: pointsRewards.currentRedemptions,
          createdAt: pointsRewards.createdAt,
          updatedAt: pointsRewards.updatedAt,
        },
      })
      .from(userPointsRedemptions)
      .innerJoin(
        pointsRewards,
        eq(userPointsRedemptions.pointsRewardId, pointsRewards.id)
      )
      .where(eq(userPointsRedemptions.userId, userId))
      .orderBy(sql`${userPointsRedemptions.createdAt} DESC`);

    return redemptions.map((r) => ({
      ...r,
      reward: r.reward as PointsReward,
    }));
  }

  async validatePointsRedemption(
    userId: number,
    rewardId: number
  ): Promise<{ valid: boolean; error?: string }> {
    const reward = await this.getPointsReward(rewardId);
    if (!reward) {
      return { valid: false, error: "Reward not found" };
    }
    if (!reward.isActive) {
      return { valid: false, error: "Reward is not active" };
    }
    if (
      reward.maxRedemptions &&
      reward.currentRedemptions >= reward.maxRedemptions
    ) {
      return { valid: false, error: "Reward redemption limit reached" };
    }

    const userPointsData = await this.getUserPoints(userId);
    if (!userPointsData) {
      return { valid: false, error: "User points record not found" };
    }
    if (userPointsData.points < reward.pointsRequired) {
      return {
        valid: false,
        error: `Insufficient points. Need ${reward.pointsRequired}, have ${userPointsData.points}`,
      };
    }

    return { valid: true };
  }

  // -------------------------------------------------------------------------
  // User Reward operations
  // -------------------------------------------------------------------------

  async getUserReward(id: number): Promise<UserReward | undefined> {
    const [userReward] = await db
      .select()
      .from(userRewards)
      .where(eq(userRewards.id, id));
    return userReward;
  }

  async createUserReward(userReward: InsertUserReward): Promise<UserReward> {
    const [newUserReward] = await db
      .insert(userRewards)
      .values({
        ...userReward,
        isUsed: false,
        usedAt: null,
        expiresAt: userReward.expiresAt ?? null,
      })
      .returning();
    return newUserReward;
  }

  async useUserReward(id: number): Promise<UserReward | undefined> {
    const [updatedUserReward] = await db
      .update(userRewards)
      .set({ isUsed: true, usedAt: new Date() })
      .where(eq(userRewards.id, id))
      .returning();
    return updatedUserReward;
  }

  // -------------------------------------------------------------------------
  // Promo Code operations
  // -------------------------------------------------------------------------

  async getAllPromoCodes(): Promise<PromoCode[]> {
    return await db.select().from(promoCodes);
  }

  async getPromoCode(id: number): Promise<PromoCode | undefined> {
    const [promoCode] = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.id, id));
    return promoCode;
  }

  async getPromoCodeByCode(code: string): Promise<PromoCode | undefined> {
    const [promoCode] = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.code, code.toUpperCase()));
    return promoCode;
  }

  async createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode> {
    const [newPromoCode] = await db
      .insert(promoCodes)
      .values({
        ...promoCode,
        currentUses: promoCode.currentUses || 0,
        isActive:
          promoCode.isActive !== undefined ? promoCode.isActive : true,
      })
      .returning();
    return newPromoCode;
  }

  async updatePromoCode(
    id: number,
    promoCode: Partial<InsertPromoCode>
  ): Promise<PromoCode | undefined> {
    const [updatedPromoCode] = await db
      .update(promoCodes)
      .set({ ...promoCode, updatedAt: new Date() })
      .where(eq(promoCodes.id, id))
      .returning();
    return updatedPromoCode;
  }

  async deletePromoCode(id: number): Promise<boolean> {
    try {
      await db.delete(promoCodes).where(eq(promoCodes.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting promo code:", error);
      return false;
    }
  }

  async incrementPromoCodeUsage(id: number): Promise<boolean> {
    try {
      await db
        .update(promoCodes)
        .set({
          currentUses: sql`${promoCodes.currentUses} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(promoCodes.id, id));
      return true;
    } catch (error) {
      console.error("Error incrementing promo code usage:", error);
      return false;
    }
  }

  // -------------------------------------------------------------------------
  // Vacation Mode operations
  // -------------------------------------------------------------------------

  async getVacationMode(): Promise<VacationMode | undefined> {
    const [vacationModeData] = await db
      .select()
      .from(vacationMode)
      .limit(1);
    return vacationModeData;
  }

  async updateVacationMode(
    vacationModeData: Partial<InsertVacationMode>
  ): Promise<VacationMode | undefined> {
    const existing = await this.getVacationMode();

    if (existing) {
      const [updatedVacationMode] = await db
        .update(vacationMode)
        .set({ ...vacationModeData, updatedAt: new Date() })
        .where(eq(vacationMode.id, existing.id))
        .returning();
      return updatedVacationMode;
    } else {
      const [newVacationMode] = await db
        .insert(vacationMode)
        .values({
          ...vacationModeData,
          isEnabled: vacationModeData.isEnabled || false,
          message:
            vacationModeData.message ||
            "We are currently on vacation and will be back soon. Thank you for your patience!",
        })
        .returning();
      return newVacationMode;
    }
  }

  // -------------------------------------------------------------------------
  // Store Hours operations
  // -------------------------------------------------------------------------

  async getAllStoreHours(): Promise<StoreHours[]> {
    return await db
      .select()
      .from(storeHours)
      .orderBy(storeHours.dayOfWeek);
  }

  async getStoreHoursByDay(
    dayOfWeek: number
  ): Promise<StoreHours | undefined> {
    const [storeHoursData] = await db
      .select()
      .from(storeHours)
      .where(eq(storeHours.dayOfWeek, dayOfWeek));
    return storeHoursData;
  }

  async updateStoreHours(
    dayOfWeek: number,
    storeHoursData: Partial<InsertStoreHours>
  ): Promise<StoreHours | undefined> {
    const existing = await this.getStoreHoursByDay(dayOfWeek);

    if (existing) {
      const [updatedStoreHours] = await db
        .update(storeHours)
        .set({ ...storeHoursData, updatedAt: new Date() })
        .where(eq(storeHours.dayOfWeek, dayOfWeek))
        .returning();
      return updatedStoreHours;
    } else {
      const [newStoreHours] = await db
        .insert(storeHours)
        .values({
          ...storeHoursData,
          dayOfWeek,
          isOpen:
            storeHoursData.isOpen !== undefined ? storeHoursData.isOpen : true,
        } as InsertStoreHours)
        .returning();
      return newStoreHours;
    }
  }

  // -------------------------------------------------------------------------
  // Restaurant Settings operations
  // -------------------------------------------------------------------------

  async getRestaurantSettings(): Promise<RestaurantSettings | undefined> {
    const [settings] = await db
      .select()
      .from(restaurantSettings)
      .limit(1);
    return settings;
  }

  async updateRestaurantSettings(
    settingsData: Partial<InsertRestaurantSettings>
  ): Promise<RestaurantSettings | undefined> {
    const existing = await this.getRestaurantSettings();

    if (existing) {
      const [updatedSettings] = await db
        .update(restaurantSettings)
        .set({ ...settingsData, updatedAt: new Date() })
        .where(eq(restaurantSettings.id, existing.id))
        .returning();
      return updatedSettings;
    } else {
      const [newSettings] = await db
        .insert(restaurantSettings)
        .values({
          restaurantName: settingsData.restaurantName || "Francesco's",
          address:
            settingsData.address || "123 Main Street, New York, NY 10001",
          phone: settingsData.phone || "(555) 123-4567",
          email: settingsData.email || "info@francescos.com",
          website: settingsData.website || "https://francescos.com",
          currency: settingsData.currency || "USD",
          timezone: settingsData.timezone || "America/New_York",
          deliveryFee: settingsData.deliveryFee || "3.99",
          minimumOrder: settingsData.minimumOrder || "15.00",
          autoAcceptOrders:
            settingsData.autoAcceptOrders !== undefined
              ? settingsData.autoAcceptOrders
              : true,
          sendOrderNotifications:
            settingsData.sendOrderNotifications !== undefined
              ? settingsData.sendOrderNotifications
              : true,
          sendCustomerNotifications:
            settingsData.sendCustomerNotifications !== undefined
              ? settingsData.sendCustomerNotifications
              : true,
          outOfStockEnabled:
            settingsData.outOfStockEnabled !== undefined
              ? settingsData.outOfStockEnabled
              : false,
          deliveryEnabled:
            settingsData.deliveryEnabled !== undefined
              ? settingsData.deliveryEnabled
              : true,
          pickupEnabled:
            settingsData.pickupEnabled !== undefined
              ? settingsData.pickupEnabled
              : true,
          orderSchedulingEnabled:
            settingsData.orderSchedulingEnabled !== undefined
              ? settingsData.orderSchedulingEnabled
              : false,
          maxAdvanceOrderHours: settingsData.maxAdvanceOrderHours || 24,
          ...settingsData,
        })
        .returning();
      return newSettings;
    }
  }

  // -------------------------------------------------------------------------
  // Choice Group operations
  // -------------------------------------------------------------------------

  async getAllChoiceGroups(): Promise<ChoiceGroup[]> {
    return await db.select().from(choiceGroups);
  }

  async getChoiceGroup(id: number): Promise<ChoiceGroup | undefined> {
    const [choiceGroup] = await db
      .select()
      .from(choiceGroups)
      .where(eq(choiceGroups.id, id));
    return choiceGroup;
  }

  async createChoiceGroup(
    choiceGroup: InsertChoiceGroup
  ): Promise<ChoiceGroup> {
    const [newChoiceGroup] = await db
      .insert(choiceGroups)
      .values({ ...choiceGroup, updatedAt: new Date() })
      .returning();
    return newChoiceGroup;
  }

  async updateChoiceGroup(
    id: number,
    choiceGroupData: Partial<InsertChoiceGroup>
  ): Promise<ChoiceGroup | undefined> {
    const [updatedChoiceGroup] = await db
      .update(choiceGroups)
      .set({ ...choiceGroupData, updatedAt: new Date() })
      .where(eq(choiceGroups.id, id))
      .returning();
    return updatedChoiceGroup;
  }

  async deleteChoiceGroup(id: number): Promise<boolean> {
    const result = await db
      .delete(choiceGroups)
      .where(eq(choiceGroups.id, id))
      .returning({ id: choiceGroups.id });
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // Choice Item operations
  // -------------------------------------------------------------------------

  async getAllChoiceItems(): Promise<ChoiceItem[]> {
    return await db.select().from(choiceItems);
  }

  async getChoiceItem(id: number): Promise<ChoiceItem | undefined> {
    const [choiceItem] = await db
      .select()
      .from(choiceItems)
      .where(eq(choiceItems.id, id));
    return choiceItem;
  }

  async createChoiceItem(choiceItem: InsertChoiceItem): Promise<ChoiceItem> {
    const [newChoiceItem] = await db
      .insert(choiceItems)
      .values({ ...choiceItem, updatedAt: new Date() })
      .returning();
    return newChoiceItem;
  }

  async updateChoiceItem(
    id: number,
    choiceItemData: Partial<InsertChoiceItem>
  ): Promise<ChoiceItem | undefined> {
    const [updatedChoiceItem] = await db
      .update(choiceItems)
      .set({ ...choiceItemData, updatedAt: new Date() })
      .where(eq(choiceItems.id, id))
      .returning();
    return updatedChoiceItem;
  }

  async deleteChoiceItem(id: number): Promise<boolean> {
    const result = await db
      .delete(choiceItems)
      .where(eq(choiceItems.id, id))
      .returning({ id: choiceItems.id });
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // Menu Item Choice Group operations
  // -------------------------------------------------------------------------

  async getAllMenuItemChoiceGroups(): Promise<MenuItemChoiceGroup[]> {
    return await db.select().from(menuItemChoiceGroups);
  }

  async getMenuItemChoiceGroup(
    id: number
  ): Promise<MenuItemChoiceGroup | undefined> {
    const [menuItemChoiceGroup] = await db
      .select()
      .from(menuItemChoiceGroups)
      .where(eq(menuItemChoiceGroups.id, id));
    return menuItemChoiceGroup;
  }

  async createMenuItemChoiceGroup(
    menuItemChoiceGroup: InsertMenuItemChoiceGroup
  ): Promise<MenuItemChoiceGroup> {
    const [newMenuItemChoiceGroup] = await db
      .insert(menuItemChoiceGroups)
      .values(menuItemChoiceGroup)
      .returning();
    return newMenuItemChoiceGroup;
  }

  async updateMenuItemChoiceGroup(
    id: number,
    menuItemChoiceGroupData: Partial<InsertMenuItemChoiceGroup>
  ): Promise<MenuItemChoiceGroup | undefined> {
    const [updatedMenuItemChoiceGroup] = await db
      .update(menuItemChoiceGroups)
      .set(menuItemChoiceGroupData)
      .where(eq(menuItemChoiceGroups.id, id))
      .returning();
    return updatedMenuItemChoiceGroup;
  }

  async deleteMenuItemChoiceGroup(id: number): Promise<boolean> {
    const result = await db
      .delete(menuItemChoiceGroups)
      .where(eq(menuItemChoiceGroups.id, id))
      .returning({ id: menuItemChoiceGroups.id });
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // Category Choice Group operations
  // -------------------------------------------------------------------------

  async getAllCategoryChoiceGroups(): Promise<CategoryChoiceGroup[]> {
    return await db.select().from(categoryChoiceGroups);
  }

  async getCategoryChoiceGroup(
    id: number
  ): Promise<CategoryChoiceGroup | undefined> {
    const [categoryChoiceGroup] = await db
      .select()
      .from(categoryChoiceGroups)
      .where(eq(categoryChoiceGroups.id, id));
    return categoryChoiceGroup;
  }

  async createCategoryChoiceGroup(
    categoryChoiceGroup: InsertCategoryChoiceGroup
  ): Promise<CategoryChoiceGroup> {
    const [newCategoryChoiceGroup] = await db
      .insert(categoryChoiceGroups)
      .values(categoryChoiceGroup)
      .returning();
    return newCategoryChoiceGroup;
  }

  async updateCategoryChoiceGroup(
    id: number,
    categoryChoiceGroupData: Partial<InsertCategoryChoiceGroup>
  ): Promise<CategoryChoiceGroup | undefined> {
    const [updatedCategoryChoiceGroup] = await db
      .update(categoryChoiceGroups)
      .set(categoryChoiceGroupData)
      .where(eq(categoryChoiceGroups.id, id))
      .returning();
    return updatedCategoryChoiceGroup;
  }

  async deleteCategoryChoiceGroup(id: number): Promise<boolean> {
    const result = await db
      .delete(categoryChoiceGroups)
      .where(eq(categoryChoiceGroups.id, id))
      .returning({ id: categoryChoiceGroups.id });
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // Tax Category operations
  // -------------------------------------------------------------------------

  async getAllTaxCategories(): Promise<TaxCategory[]> {
    return await db.select().from(taxCategories);
  }

  async getTaxCategory(id: number): Promise<TaxCategory | undefined> {
    const [taxCategory] = await db
      .select()
      .from(taxCategories)
      .where(eq(taxCategories.id, id));
    return taxCategory;
  }

  async createTaxCategory(
    taxCategory: InsertTaxCategory
  ): Promise<TaxCategory> {
    const [newTaxCategory] = await db
      .insert(taxCategories)
      .values({ ...taxCategory, updatedAt: new Date() })
      .returning();
    return newTaxCategory;
  }

  async updateTaxCategory(
    id: number,
    taxCategoryData: Partial<InsertTaxCategory>
  ): Promise<TaxCategory | undefined> {
    const [updatedTaxCategory] = await db
      .update(taxCategories)
      .set({ ...taxCategoryData, updatedAt: new Date() })
      .where(eq(taxCategories.id, id))
      .returning();
    return updatedTaxCategory;
  }

  async deleteTaxCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(taxCategories)
      .where(eq(taxCategories.id, id))
      .returning({ id: taxCategories.id });
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // Tax Settings operations
  // -------------------------------------------------------------------------

  async getTaxSettings(): Promise<TaxSettings | undefined> {
    const [settings] = await db.select().from(taxSettings).limit(1);
    return settings;
  }

  async updateTaxSettings(
    settingsData: Partial<InsertTaxSettings>
  ): Promise<TaxSettings | undefined> {
    const existing = await this.getTaxSettings();

    if (existing) {
      const [updatedSettings] = await db
        .update(taxSettings)
        .set({ ...settingsData, updatedAt: new Date() })
        .where(eq(taxSettings.id, existing.id))
        .returning();
      return updatedSettings;
    } else {
      const [newSettings] = await db
        .insert(taxSettings)
        .values({
          ...settingsData,
          taxApplication: settingsData.taxApplication || "on_top",
          taxName: settingsData.taxName || "Sales Tax",
          currency: settingsData.currency || "USD",
          currencySymbol: settingsData.currencySymbol || "$",
          currencyPosition: settingsData.currencyPosition || "before",
          decimalPlaces: settingsData.decimalPlaces ?? 2,
          deliveryFeeTaxRate: settingsData.deliveryFeeTaxRate || "0",
          tipsTaxRate: settingsData.tipsTaxRate || "0",
          serviceFeeTaxRate: settingsData.serviceFeeTaxRate || "0",
        })
        .returning();
      return newSettings;
    }
  }

  // -------------------------------------------------------------------------
  // Pause Services operations
  // -------------------------------------------------------------------------

  async getAllPauseServices(): Promise<PauseService[]> {
    return await db.select().from(pauseServices);
  }

  async getPauseService(id: number): Promise<PauseService | undefined> {
    const [pauseService] = await db
      .select()
      .from(pauseServices)
      .where(eq(pauseServices.id, id));
    return pauseService;
  }

  async createPauseService(
    pauseService: InsertPauseService
  ): Promise<PauseService> {
    const startTime = new Date();
    const endTime = pauseService.pauseUntilEndOfDay
      ? new Date(
          startTime.getFullYear(),
          startTime.getMonth(),
          startTime.getDate(),
          23,
          59,
          59
        )
      : new Date(
          startTime.getTime() + pauseService.pauseDuration * 60 * 1000
        );

    const [newPauseService] = await db
      .insert(pauseServices)
      .values({
        ...pauseService,
        startTime,
        endTime,
        updatedAt: new Date(),
      })
      .returning();
    return newPauseService;
  }

  async updatePauseService(
    id: number,
    pauseServiceData: Partial<InsertPauseService>
  ): Promise<PauseService | undefined> {
    const [updatedPauseService] = await db
      .update(pauseServices)
      .set({ ...pauseServiceData, updatedAt: new Date() })
      .where(eq(pauseServices.id, id))
      .returning();
    return updatedPauseService;
  }

  async deletePauseService(id: number): Promise<boolean> {
    const result = await db
      .delete(pauseServices)
      .where(eq(pauseServices.id, id))
      .returning({ id: pauseServices.id });
    return result.length > 0;
  }

  async getActivePauseServices(): Promise<PauseService[]> {
    const now = new Date();
    return await db
      .select()
      .from(pauseServices)
      .where(
        and(
          eq(pauseServices.isActive, true),
          sql`${pauseServices.endTime} > ${now}`
        )
      );
  }

  // -------------------------------------------------------------------------
  // Delivery Settings operations
  // -------------------------------------------------------------------------

  async getDeliverySettings(): Promise<DeliverySettings | undefined> {
    const [settings] = await db.select().from(deliverySettings).limit(1);
    return settings;
  }

  async updateDeliverySettings(
    data: Partial<InsertDeliverySettings>
  ): Promise<DeliverySettings | undefined> {
    const existing = await this.getDeliverySettings();

    if (existing) {
      const [updatedSettings] = await db
        .update(deliverySettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(deliverySettings.id, existing.id))
        .returning();
      return updatedSettings;
    } else {
      const [newSettings] = await db
        .insert(deliverySettings)
        .values({
          restaurantAddress: data.restaurantAddress ?? "",
          restaurantLat: data.restaurantLat ?? null,
          restaurantLng: data.restaurantLng ?? null,
          googleMapsApiKey: data.googleMapsApiKey ?? null,
          maxDeliveryRadius: data.maxDeliveryRadius ?? "10",
          distanceUnit: data.distanceUnit ?? "miles",
          isGoogleMapsEnabled: data.isGoogleMapsEnabled ?? false,
          fallbackDeliveryFee: data.fallbackDeliveryFee ?? "5.00",
          ...data,
        })
        .returning();
      return newSettings;
    }
  }

  // -------------------------------------------------------------------------
  // Delivery Zone operations
  // -------------------------------------------------------------------------

  async getDeliveryZones(): Promise<DeliveryZone[]> {
    return await db
      .select()
      .from(deliveryZones)
      .orderBy(deliveryZones.sortOrder);
  }

  async getActiveDeliveryZones(): Promise<DeliveryZone[]> {
    return await db
      .select()
      .from(deliveryZones)
      .where(eq(deliveryZones.isActive, true))
      .orderBy(deliveryZones.sortOrder);
  }

  async createDeliveryZone(
    zone: InsertDeliveryZone
  ): Promise<DeliveryZone> {
    const [newZone] = await db
      .insert(deliveryZones)
      .values({
        name: zone.name,
        maxRadius: zone.maxRadius,
        deliveryFee: zone.deliveryFee,
        isActive: zone.isActive !== undefined ? zone.isActive : true,
        sortOrder: zone.sortOrder || 0,
      })
      .returning();
    return newZone;
  }

  async updateDeliveryZone(
    id: number,
    zone: Partial<InsertDeliveryZone>
  ): Promise<DeliveryZone | undefined> {
    const [updatedZone] = await db
      .update(deliveryZones)
      .set({ ...zone, updatedAt: new Date() })
      .where(eq(deliveryZones.id, id))
      .returning();
    return updatedZone;
  }

  async deleteDeliveryZone(id: number): Promise<boolean> {
    const result = await db
      .delete(deliveryZones)
      .where(eq(deliveryZones.id, id))
      .returning({ id: deliveryZones.id });
    return result.length > 0;
  }

  // -------------------------------------------------------------------------
  // Distance calculation (uses Google Maps Distance Matrix API)
  // -------------------------------------------------------------------------

  async calculateDistance(
    origin: string,
    destination: string
  ): Promise<number> {
    const settings = await this.getDeliverySettings();
    if (!settings?.googleMapsApiKey) {
      throw new Error("Google Maps API key not configured");
    }

    const url =
      `https://maps.googleapis.com/maps/api/distancematrix/json` +
      `?origins=${encodeURIComponent(origin)}` +
      `&destinations=${encodeURIComponent(destination)}` +
      `&units=imperial` +
      `&key=${settings.googleMapsApiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Google Maps API error: ${data.status}`);
    }

    const element = data.rows[0]?.elements[0];
    if (!element || element.status !== "OK") {
      throw new Error(
        `Distance calculation failed: ${element?.status || "Unknown error"}`
      );
    }

    // Convert meters to miles (1 meter = 0.000621371 miles)
    return element.distance.value * 0.000621371;
  }

  // -------------------------------------------------------------------------
  // Printer Configuration operations
  // -------------------------------------------------------------------------

  async getAllPrinterConfigs(): Promise<PrinterConfig[]> {
    try {
      return await db
        .select()
        .from(printerConfig)
        .orderBy(asc(printerConfig.isPrimary), asc(printerConfig.name));
    } catch (error) {
      console.error("Error getting all printer configurations:", error);
      return [];
    }
  }

  async getPrinterConfig(id: number): Promise<PrinterConfig | undefined> {
    try {
      const [result] = await db
        .select()
        .from(printerConfig)
        .where(eq(printerConfig.id, id));
      return result;
    } catch (error) {
      console.error("Error getting printer configuration:", error);
      return undefined;
    }
  }

  async getPrimaryPrinterConfig(): Promise<PrinterConfig | undefined> {
    try {
      const [result] = await db
        .select()
        .from(printerConfig)
        .where(
          and(
            eq(printerConfig.isPrimary, true),
            eq(printerConfig.isActive, true)
          )
        )
        .limit(1);
      return result;
    } catch (error) {
      console.error("Error getting primary printer configuration:", error);
      return undefined;
    }
  }

  async createPrinterConfig(
    config: InsertPrinterConfig
  ): Promise<PrinterConfig> {
    const [result] = await db
      .insert(printerConfig)
      .values(config)
      .returning();
    return result;
  }

  async updatePrinterConfig(
    id: number,
    config: Partial<InsertPrinterConfig>
  ): Promise<PrinterConfig | undefined> {
    try {
      const [result] = await db
        .update(printerConfig)
        .set({ ...config, updatedAt: new Date() })
        .where(eq(printerConfig.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error("Error updating printer configuration:", error);
      return undefined;
    }
  }

  async deletePrinterConfig(id: number): Promise<boolean> {
    try {
      const printerToDelete = await this.getPrinterConfig(id);
      if (printerToDelete?.isPrimary) {
        throw new Error("Cannot delete primary printer configuration");
      }
      const result = await db
        .delete(printerConfig)
        .where(eq(printerConfig.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting printer configuration:", error);
      return false;
    }
  }

  async setPrimaryPrinter(id: number): Promise<boolean> {
    try {
      await db.transaction(async (tx) => {
        await tx
          .update(printerConfig)
          .set({ isPrimary: false, updatedAt: new Date() })
          .where(eq(printerConfig.isPrimary, true));
        await tx
          .update(printerConfig)
          .set({ isPrimary: true, isActive: true, updatedAt: new Date() })
          .where(eq(printerConfig.id, id));
      });
      return true;
    } catch (error) {
      console.error("Error setting primary printer:", error);
      return false;
    }
  }

  async updatePrinterConnectionStatus(
    id: number,
    status: "connected" | "disconnected" | "error" | "unknown",
    error?: string
  ): Promise<PrinterConfig | undefined> {
    try {
      const updateData: Record<string, unknown> = {
        connectionStatus: status,
        updatedAt: new Date(),
      };

      if (status === "connected") {
        updateData.lastConnected = new Date();
        updateData.lastError = null;
      } else if (status === "error" && error) {
        updateData.lastError = error;
      }

      const [result] = await db
        .update(printerConfig)
        .set(updateData)
        .where(eq(printerConfig.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error("Error updating printer connection status:", error);
      return undefined;
    }
  }

  // -------------------------------------------------------------------------
  // Database reset operations
  // -------------------------------------------------------------------------

  async resetAllOrders(): Promise<boolean> {
    try {
      await db.delete(orderItems);
      await db.delete(orders);
      return true;
    } catch (error) {
      console.error("Error resetting orders:", error);
      return false;
    }
  }

  async resetAllCustomerPoints(): Promise<boolean> {
    try {
      await db.delete(userPointsRedemptions);
      await db.delete(pointsTransactions);
      await db
        .update(userPoints)
        .set({ points: 0, totalEarned: 0, totalRedeemed: 0, updatedAt: new Date() });
      return true;
    } catch (error) {
      console.error("Error resetting customer points:", error);
      return false;
    }
  }

  async resetAllData(): Promise<boolean> {
    try {
      const ordersReset = await this.resetAllOrders();
      const pointsReset = await this.resetAllCustomerPoints();
      return ordersReset && pointsReset;
    } catch (error) {
      console.error("Error resetting all data:", error);
      return false;
    }
  }
}

// Export a singleton instance that Next.js API routes can import directly.
export const storage = new DatabaseStorage();
