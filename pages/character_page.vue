<template>
    <view class="container">
        <!-- 背景 -->
        <image class="bg-image" src="@/static/images/loc_nav_stand.png" mode="aspectFill" />
        <view class="overlay"></view>
        <view class="Vignette"></view>

        <!-- 标题 -->
        <view class="header">
            <text class="title">身份抉择</text>
            <text class="subtitle">Who are you?</text>
        </view>

        <!-- 角色卡片轮播 -->
        <swiper class="role-swiper" :current="currentIndex" @change="onSwiperChange" previous-margin="50rpx"
            next-margin="50rpx">
            <swiper-item v-for="(role, index) in roles" :key="role.id" class="swiper-item">
                <view class="role-card" :class="{ 'active': index === currentIndex }">
                    <view class="role-header">
                        <view class="avatar-box">
                            <text class="avatar">{{ role.avatar }}</text>
                        </view>
                        <view class="role-info">
                            <text class="role-name">{{ role.name }}</text>
                            <text class="role-title">{{ role.title }}</text>
                        </view>
                    </view>

                    <view class="divider-line"></view>

                    <scroll-view scroll-y class="desc-box">
                        <text class="role-desc">{{ role.description }}</text>
                    </scroll-view>

                    <view class="stats-panel">
                        <view class="stat-row">
                            <text class="label">体能</text>
                            <view class="progress-bg">
                                <view class="progress-fill hp" :style="{ width: (role.stats.maxHp / 150 * 100) + '%' }">
                                </view>
                            </view>
                            <text class="value">{{ role.stats.maxHp }}</text>
                        </view>
                        <view class="stat-row">
                            <text class="label">意志</text>
                            <view class="progress-bg">
                                <view class="progress-fill sanity"
                                    :style="{ width: (role.stats.maxSanity / 150 * 100) + '%' }"></view>
                            </view>
                            <text class="value">{{ role.stats.maxSanity }}</text>
                        </view>
                    </view>

                    <view class="equipment-box">
                        <text class="section-title">初始装备</text>
                        <view class="items-grid">
                            <view v-for="item in getRoleItemNames(role)" :key="item" class="item-chip">
                                <text class="chip-text">{{ item }}</text>
                            </view>
                        </view>
                    </view>

                    <!-- Locked Overlay -->
                    <view class="locked-overlay" v-if="role.locked && !isRoleUnlocked(role.id)">
                        <text class="lock-icon">🔒</text>
                        <text class="lock-text">未解锁</text>
                        <text class="lock-condition">{{ role.unlockCondition }}</text>
                    </view>
                </view>
            </swiper-item>
        </swiper>

        <!-- 确认按钮 -->
        <view class="footer">
            <button class="btn-start" @click="confirmSelection" :disabled="isLocked(currentRole)">
                <text class="btn-text" v-if="!isLocked(currentRole)">踏入荒野</text>
                <text class="btn-text" v-else>无法选择</text>
            </button>
        </view>

        <!-- 全屏转场遮罩 -->
        <view class="transition-overlay" v-if="isTransitioning">
            <text class="transition-text">正在前往登山口...</text>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { roles } from '@/utils/data/roles_data';
import { items } from '@/utils/data/items_data';
import { useGameStore } from '@/stores/game';
import { useMetaStore } from '@/stores/meta'; // Ensure meta store is used for unlocks

const gameStore = useGameStore();
const metaStore = useMetaStore();

const currentIndex = ref(0);
const isTransitioning = ref(false);
const currentRole = computed(() => roles[currentIndex.value]);

onMounted(() => {
    metaStore.loadMeta();
    if (roles.length > 0) {
        // Find first unlocked role or default to 0
        const firstUnlocked = roles.findIndex(r => !r.locked || metaStore.isRoleUnlocked(r.id));
        currentIndex.value = firstUnlocked >= 0 ? firstUnlocked : 0;
    }
});

onShow(() => {
    isTransitioning.value = false;
});

const onSwiperChange = (e) => {
    currentIndex.value = e.detail.current;
};

const getRoleItemNames = (role) => {
    return role.items.map(id => items[id] ? items[id].name : '未知物品');
}

const isRoleUnlocked = (roleId) => {
    // Check if role is inherently locked and if player has unlocked it
    const role = roles.find(r => r.id === roleId);
    if (!role.locked) return true;
    return metaStore.unlockedRoles.includes(roleId);
};

const isLocked = (role) => {
    return role.locked && !isRoleUnlocked(role.id);
};

const confirmSelection = () => {
    if (isTransitioning.value) return;
    if (isLocked(currentRole.value)) {
        uni.showToast({ title: '该角色尚未解锁', icon: 'none' });
        return;
    }

    try {
        const roleId = currentRole.value.id;
        gameStore.initGame(roleId);

        isTransitioning.value = true;

        setTimeout(() => {
            uni.navigateTo({
                url: '/pages/game_page',
                fail: (err) => {
                    console.error('Navigation failed:', err);
                    isTransitioning.value = false;
                }
            });
        }, 1500);
    } catch (e) {
        console.error('Error in confirmSelection:', e);
    }
};
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100vh;
    background: #1a1a1a;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    font-family: sans-serif;
}

.bg-image {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    filter: grayscale(100%);
}

.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, #000 100%);
    pointer-events: none;
}

.Vignette {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.header {
    position: relative;
    z-index: 10;
    padding-top: 140rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20rpx;
}

.title {
    color: #fff;
    font-size: 50rpx;
    font-weight: 700;
    letter-spacing: 4rpx;
    margin-bottom: 8rpx;
    text-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.5);
}

.subtitle {
    font-size: 24rpx;
    color: #aaa;
    letter-spacing: 2rpx;
    text-transform: uppercase;
}

.role-swiper {
    position: relative;
    z-index: 10;
    flex: 1;
    width: 100%;
    padding-top: 20rpx;
    min-height: 0;
}

.swiper-item {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-bottom: 20rpx;
}

.role-card {
    width: 90%;
    height: 100%;
    max-height: 96%;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12rpx;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 30rpx;
    box-sizing: border-box;
    transition: all 0.4s ease;
    transform: scale(0.92);
    opacity: 0.7;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.5);
    color: #333;

    &.active {
        transform: scale(1);
        opacity: 1;
        background: #fff;
        box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.6);
    }
}

.role-header {
    display: flex;
    gap: 24rpx;
    margin-bottom: 20rpx;
    align-items: center;
    flex-shrink: 0;
}

.avatar-box {
    width: 100rpx;
    height: 100rpx;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 10rpx rgba(0, 0, 0, 0.1);
}

.avatar {
    font-size: 50rpx;
}

.role-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.role-name {
    font-size: 36rpx;
    color: #000;
    font-weight: 800;
    margin-bottom: 4rpx;
}

.role-title {
    font-size: 22rpx;
    color: #666;
    font-style: italic;
}

.divider-line {
    width: 100%;
    height: 2rpx;
    background: #e0e0e0;
    margin-bottom: 20rpx;
    flex-shrink: 0;
}

.desc-box {
    flex: 1;
    height: 0;
    margin-bottom: 20rpx;
    background: #fdfdfd;
    padding: 16rpx;
    border-radius: 8rpx;
    border: 1px dashed #ddd;
    box-sizing: border-box;
}

.role-desc {
    font-size: 26rpx;
    color: #444;
    line-height: 1.5;
    font-family: serif;
}

.stats-panel {
    margin-bottom: 20rpx;
    flex-shrink: 0;
}

.stat-row {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
}

.label {
    width: 100rpx;
    font-size: 24rpx;
    color: #666;
    font-weight: 600;
}

.progress-bg {
    flex: 1;
    height: 12rpx;
    background: #eee;
    border-radius: 6rpx;
    overflow: hidden;
    margin: 0 20rpx;
}

.progress-fill {
    height: 100%;
    border-radius: 6rpx;

    &.hp {
        background: #ff6b6b;
    }

    &.sanity {
        background: #4dabf7;
    }
}

.value {
    width: 50rpx;
    font-size: 24rpx;
    color: #333;
    text-align: right;
    font-weight: 700;
}

.equipment-box {}

.section-title {
    font-size: 20rpx;
    color: #888;
    margin-bottom: 12rpx;
    display: block;
    text-transform: uppercase;
    font-weight: 700;
}

.items-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
}

.item-chip {
    background: #f5f5f5;
    padding: 6rpx 16rpx;
    border-radius: 30rpx;
    border: 1px solid #e0e0e0;
}

.chip-text {
    font-size: 22rpx;
    color: #555;
    font-weight: 500;
}

.footer {
    padding: 30rpx 0 60rpx;
    display: flex;
    justify-content: center;
    z-index: 10;
    flex-shrink: 0;
}

.btn-start {
    width: 60%;
    height: 90rpx;
    background: #111;
    color: #fff;
    border-radius: 45rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    font-weight: 700;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
    border: none;
    transition: all 0.2s;

    &:active {
        transform: scale(0.98);
    }

    &[disabled] {
        background: #555;
        opacity: 0.7;
    }
}

.locked-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    border-radius: 12rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 20;
    color: #fff;
}

.lock-icon {
    font-size: 60rpx;
    margin-bottom: 20rpx;
}

.lock-text {
    font-size: 32rpx;
    font-weight: 700;
    margin-bottom: 10rpx;
}

.lock-condition {
    font-size: 24rpx;
    color: #ccc;
    background: rgba(255, 255, 255, 0.1);
    padding: 8rpx 20rpx;
    border-radius: 30rpx;
}

.transition-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.5s ease-out;
}

.transition-text {
    color: #fff;
    font-size: 32rpx;
    letter-spacing: 4rpx;
    opacity: 0.8;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
