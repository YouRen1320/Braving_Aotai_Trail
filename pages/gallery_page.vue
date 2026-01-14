<template>
    <view class="container">
        <image class="bg-image" src="@/static/images/back_ground.png" mode="aspectFill" />
        <view class="overlay"></view>

        <!-- Header -->
        <view class="header-section">
            <view class="back-btn" @click="goBack">
                <text class="back-icon">←</text>
                <text class="back-text">返回</text>
            </view>
            <text class="page-title">结局图鉴</text>
        </view>

        <!-- Content -->
        <scroll-view class="gallery-scroll" scroll-y>
            <view class="stats-bar">
                <text class="stats-text">已解锁: {{ unlockedCount }} / {{ totalCount }}</text>
            </view>

            <view class="gallery-grid">
                <view v-for="ending in endingsList" :key="ending.id" class="card" :class="{ locked: !ending.unlocked }">
                    <view class="card-inner">
                        <view class="card-icon-wrap">
                            <text class="card-icon">{{
                                ending.unlocked ? ending.icon : "🔒"
                            }}</text>
                        </view>
                        <view class="card-info">
                            <text class="card-title">{{
                                ending.unlocked ? ending.name : "???"
                            }}</text>
                            <text class="card-desc">{{
                                ending.unlocked ? ending.desc : "继续探索以解锁此结局"
                            }}</text>
                        </view>
                        <view v-if="ending.unlocked" class="stamp">CLEARED</view>
                    </view>
                </view>
            </view>

            <!-- Footer Spacer -->
            <view style="height: 100rpx;"></view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useMetaStore } from "@/stores/meta";

const metaStore = useMetaStore();

// Define all Ending Metadata
const allEndings = [
    {
        id: "end_game_cleared",
        name: "征服鳌太",
        desc: "成功完成了大鳌太全线穿越。这是至高无上的荣耀。",
        icon: "🏆",
    },
    {
        id: "end_success",
        name: "平安出山",
        desc: "在文公庙坐缆车下山。虽然未走完全程，但活着就是胜利。",
        icon: "🚠",
    },
    {
        id: "end_retreat",
        name: "明智下撤",
        desc: "山永远都在。知难而退是成熟驴友的表现。",
        icon: "🏳️",
    },
    {
        id: "end_hidden",
        name: "无尽轮回",
        desc: "在这片神性的山脉中，你触碰了时间的禁忌...",
        icon: "⏳",
    },
    {
        id: "dead_cold",
        name: "失温终结",
        desc: "在极端寒冷中失去了生命体征。这是鳌太最常见的杀手。",
        icon: "❄️",
    },
    {
        id: "dead_starve",
        name: "弹尽粮绝",
        desc: "没有了补给，在这个无人区只能等待死亡。",
        icon: "🍞",
    },
    {
        id: "dead_sanity",
        name: "精神崩溃",
        desc: "无尽的风雪击垮了你的意志，从此迷失在群山之中。",
        icon: "🧠",
    },
    {
        id: "dead_001",
        name: "长眠大山",
        desc: "你成为了大山的一部分。",
        icon: "⚰️",
    },
    {
        id: "end_lost_23km",
        name: "迷失23公里",
        desc: "走错了著名的死亡岔路口，永远消失在迷雾中。",
        icon: "🌫️",
    },
    {
        id: "end_caught",
        name: "非法穿越",
        desc: "被巡山队拦截。虽然不光彩，但至少保住了性命。",
        icon: "👮",
    },
    {
        id: "end_rescue",
        name: "九死一生",
        desc: "动用了公共资源才得以获救。这是一个沉重的教训。",
        icon: "🚁",
    },
];

const endingsList = ref([]);
const unlockedCount = ref(0);
const totalCount = ref(allEndings.length);

onMounted(() => {
    metaStore.loadMeta();

    // Map unlocking status
    endingsList.value = allEndings.map((e) => {
        const isUnlocked = metaStore.isEndingUnlocked(e.id);
        return {
            ...e,
            unlocked: isUnlocked,
        };
    });

    unlockedCount.value = endingsList.value.filter((e) => e.unlocked).length;
});

const goBack = () => {
    uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    width: 100%;
    height: 100vh;
    background: #0a0a0a;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    z-index: 0;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 15, 20, 0.8);
    z-index: 1;
}

.header-section {
    position: relative;
    z-index: 10;
    padding: 100rpx 40rpx 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0) 100%);
}

.back-btn {
    position: absolute;
    left: 40rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
    opacity: 0.8;
    padding: 10rpx;

    &:active {
        opacity: 0.5;
    }
}

.back-icon {
    font-size: 36rpx;
    color: #fff;
}

.back-text {
    font-size: 28rpx;
    color: #fff;
}

.page-title {
    font-size: 40rpx;
    font-weight: 700;
    color: #fff;
    letter-spacing: 4rpx;
    text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.5);
}

.gallery-scroll {
    position: relative;
    z-index: 10;
    flex: 1;
    height: 0; // [CRITICAL] Force flex item to respect container height for scrolling
    width: 100%;
}

.stats-bar {
    padding: 20rpx 40rpx;
    display: flex;
    justify-content: flex-end;
}

.stats-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.1);
    padding: 6rpx 20rpx;
    border-radius: 20rpx;
}

.gallery-grid {
    padding: 20rpx 40rpx;
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

.card {
    background: rgba(40, 50, 60, 0.6);
    border: 1rpx solid rgba(255, 255, 255, 0.1);
    border-radius: 16rpx;
    overflow: hidden;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &.locked {
        background: rgba(20, 25, 30, 0.4);
        border-color: rgba(255, 255, 255, 0.05);

        .card-icon {
            opacity: 0.3;
            filter: grayscale(100%);
        }
    }
}

.card-inner {
    padding: 30rpx;
    display: flex;
    align-items: center;
    gap: 30rpx;
    position: relative;
}

.card-icon-wrap {
    width: 80rpx;
    height: 80rpx;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.card-icon {
    font-size: 40rpx;
}

.card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
}

.card-title {
    font-size: 32rpx;
    color: #fff;
    font-weight: 600;
}

.card-desc {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.4;
}

.stamp {
    position: absolute;
    right: 20rpx;
    top: 50%;
    transform: translateY(-50%) rotate(-15deg);
    border: 4rpx solid rgba(255, 215, 0, 0.3);
    color: rgba(255, 215, 0, 0.3);
    font-size: 24rpx;
    font-weight: 800;
    padding: 4rpx 10rpx;
    border-radius: 8rpx;
    letter-spacing: 2rpx;
    pointer-events: none;
}
</style>
