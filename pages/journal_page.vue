<template>
    <view class="journal-container">
        <view class="header">
            <text class="title">探险手记</text>
            <text class="subtitle">Aotai Archives</text>
        </view>

        <!-- 统计数据 -->
        <view class="stats-card">
            <view class="stat-item">
                <text class="label">尝试次数</text>
                <text class="value">{{ runCount }}</text>
            </view>
            <view class="stat-item">
                <text class="label">解锁结局</text>
                <text class="value">{{ unlockedCount }} / {{ endings.length }}</text>
            </view>
        </view>

        <!-- 结局墙 -->
        <text class="section-title">结局图鉴</text>
        <view class="endings-grid">
            <view v-for="(end, index) in endings" :key="index" class="ending-card"
                :class="{ unlocked: isUnlocked(end.id) }">
                <view class="icon">{{ isUnlocked(end.id) ? end.icon : '🔒' }}</view>
                <text class="name">{{ isUnlocked(end.id) ? end.name : '???' }}</text>
                <text class="desc" v-if="isUnlocked(end.id)">{{ end.desc }}</text>
            </view>
        </view>

        <!-- 最近探险 [NEW] -->
        <text class="section-title">最近探险</text>
        <view class="history-list">
            <view v-if="runHistory.length === 0" class="empty-tip">暂无探险记录</view>
            <view v-for="(run, idx) in runHistory" :key="idx" class="history-item">
                <text class="date">{{ formatDate(run.date) }}</text>
                <view class="details">
                    <text class="role">{{ run.roleName }}</text>
                    <text class="days">生存 {{ run.days }} 天</text>
                </view>
                <text class="result">{{ run.endName }}</text>
            </view>
        </view>

        <button class="back-btn" @click="goBack">返回首页</button>
    </view>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useMetaStore } from '@/stores/meta';

const metaStore = useMetaStore();

onMounted(() => {
    metaStore.loadMeta();
});

const runCount = computed(() => metaStore.runCount);
const unlockedCount = computed(() => metaStore.totalEndingsUnlocked);
const runHistory = computed(() => metaStore.runHistory); // [NEW]

const isUnlocked = (id) => metaStore.isEndingUnlocked(id);

const formatDate = (isoStr) => {
    if (!isoStr) return "-";
    const date = new Date(isoStr);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const goBack = () => {
    uni.navigateBack();
};

// Define all possible endings
const endings = [
    { id: 'end_success', name: '穿越成功', icon: '🏆', desc: '成功抵达鹦鸽镇，完成了鳌太穿越。' },
    { id: 'end_game_cleared', name: '大鳌太全程', icon: '🌟', desc: '完成了真正的大鳌太穿越，这是强者的勋章。' },
    { id: 'end_retreat', name: '知难而退', icon: '🏡', desc: '明智地选择了下撤，生命高于一切。' },
    { id: 'end_caught', name: '非法穿越', icon: '👮', desc: '被巡山队拦截并处罚。' },
    { id: 'end_rescue', name: '获救', icon: '🚁', desc: '虽然获救了，但也付出了代价。' },
    { id: 'end_lost_23km', name: '迷失23公里', icon: '🌫️', desc: '走错了路，消失在茫茫迷雾中。' },
    { id: 'dead_cold', name: '失温终结', icon: '❄️', desc: '在严寒中逐渐失去了意识。' },
    { id: 'dead_starve', name: '饥寒交迫', icon: '🍖', desc: '体力耗尽，倒在了路上。' },
    { id: 'dead_sanity', name: '精神崩溃', icon: '😵', desc: '在极度恐惧中分不清现实与幻觉。' },
    { id: 'dead_001', name: '长眠大山', icon: '⚰️', desc: '你成为了秦岭的一部分。' },
];
</script>

<style lang="scss" scoped>
.journal-container {
    min-height: 100vh;
    background: #1a1a1a;
    padding: 40rpx;
    color: #fff;
    box-sizing: border-box;
    padding-bottom: 80rpx;
}

.header {
    margin-bottom: 40rpx;
    text-align: center;

    .title {
        font-size: 48rpx;
        font-weight: bold;
        display: block;
    }

    .subtitle {
        font-size: 24rpx;
        color: #666;
        letter-spacing: 4rpx;
    }
}

.stats-card {
    background: #333;
    border-radius: 16rpx;
    padding: 30rpx;
    display: flex;
    justify-content: space-around;
    margin-bottom: 60rpx;

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .label {
            font-size: 24rpx;
            color: #aaa;
        }

        .value {
            font-size: 40rpx;
            font-weight: bold;
            color: #ffcc00;
        }
    }
}

.section-title {
    font-size: 32rpx;
    margin-bottom: 20rpx;
    display: block;
    border-left: 8rpx solid #ffcc00;
    padding-left: 20rpx;
    margin-top: 40rpx;
}

.endings-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    margin-bottom: 40rpx;
}

.ending-card {
    background: #2a2a2a;
    border-radius: 12rpx;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: 1rpx solid #444;
    transition: all 0.3s;

    &.unlocked {
        background: #3a3a3a;
        border-color: #ffcc00;

        .icon {
            filter: grayscale(0);
        }
    }

    .icon {
        font-size: 60rpx;
        margin-bottom: 10rpx;
        filter: grayscale(1);
    }

    .name {
        font-size: 28rpx;
        font-weight: bold;
        margin-bottom: 8rpx;
    }

    .desc {
        font-size: 20rpx;
        color: #aaa;
    }
}

/* [NEW] History Styles */
.history-list {
    background: #2a2a2a;
    border-radius: 12rpx;
    padding: 20rpx;

    .empty-tip {
        text-align: center;
        color: #666;
        padding: 20rpx;
        font-size: 24rpx;
    }

    .history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #444;

        &:last-child {
            border-bottom: none;
        }

        .date {
            font-size: 22rpx;
            color: #888;
            width: 140rpx;
        }

        .details {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin: 0 20rpx;

            .role {
                font-size: 28rpx;
                color: #fff;
                margin-bottom: 4rpx;
            }

            .days {
                font-size: 22rpx;
                color: #aaa;
            }
        }

        .result {
            font-size: 24rpx;
            color: #ffcc00;
            text-align: right;
            max-width: 200rpx;
        }
    }
}

.back-btn {
    margin-top: 40rpx;
    background: transparent;
    border: 1rpx solid #666;
    color: #fff;
}
</style>
