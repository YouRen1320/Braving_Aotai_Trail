<template>
    <view class="game-over-overlay" v-if="visible">
        <view class="panel" :style="theme.panelStyle">
            <view class="header">
                <text class="title" :style="theme.titleStyle">{{ theme.title }}</text>
            </view>

            <view class="content">
                <text class="days-label">存活天数</text>
                <text class="days-value">{{ days }}</text>

                <view class="divider" :style="theme.dividerStyle"></view>

                <text class="reason-label">最终结局</text>
                <text class="reason-value">{{ deathReason }}</text>

                <view class="rank-badge" :style="theme.badgeStyle">
                    <text class="rank-text">称号: {{ evaluationTitle }}</text>
                </view>
            </view>

            <button class="restart-btn" hover-class="btn-hover" @click="onRestart" :style="theme.btnStyle">
                返回主页
            </button>
        </view>
    </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();

const visible = ref(false);
const days = computed(() => gameStore.player.days);

// Watch game state to trigger modal with delay
watch(() => gameStore.gameState, (newVal) => {
    if (newVal === 'ended') {
        setTimeout(() => {
            visible.value = true;
        }, 1500); // Reduce wait time slightly
    } else {
        visible.value = false;
    }
}, { immediate: true });

const endingId = computed(() => {
    const history = gameStore.history;
    if (history.length > 0) {
        const last = history[history.length - 1];
        if (last.startsWith('结局:')) return last.split(':')[1].trim();
        if (last.startsWith('死因:')) return last.split(':')[1].trim();
    }
    return '';
});

// Determine Ending Type
const endingType = computed(() => {
    const eid = endingId.value;
    if (eid.startsWith('dead_')) return 'death';
    if (eid === 'end_lost_23km' || eid === 'end_caught') return 'fail';
    if (eid === 'end_retreat') return 'retreat'; // Special Neutral
    if (eid === 'end_success' || eid === 'end_game_cleared' || eid === 'end_hidden') return 'victory';
    return 'death'; // Default
});

// Dynamic Theme Configuration
const theme = computed(() => {
    const type = endingType.value;

    if (type === 'victory') {
        return {
            title: '挑战成功',
            panelStyle: 'background: linear-gradient(180deg, #0f2e0f 0%, #1a1a1a 100%); border-color: #2e8b57;', // Green
            titleStyle: 'color: #00ff7f; text-shadow: 0 0 20rpx rgba(0, 255, 127, 0.5);',
            dividerStyle: 'background: #2e8b57;',
            badgeStyle: 'background: #ffd700; color: #000;', // Gold
            btnStyle: 'background: #2e8b57; color: #fff;'
        };
    }

    if (type === 'retreat') {
        return {
            title: '明智撤离',
            panelStyle: 'background: linear-gradient(180deg, #1a2a3a 0%, #1a1a1a 100%); border-color: #4da6ff;', // Blue
            titleStyle: 'color: #4da6ff; text-shadow: 0 0 20rpx rgba(77, 166, 255, 0.5);',
            dividerStyle: 'background: #4da6ff;',
            badgeStyle: 'background: #b0c4de; color: #000;',
            btnStyle: 'background: #4da6ff; color: #fff;'
        };
    }

    if (type === 'fail') {
        return {
            title: '挑战失败',
            panelStyle: 'background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%); border-color: #888;', // Grey
            titleStyle: 'color: #ccc; text-shadow: none;',
            dividerStyle: 'background: #666;',
            badgeStyle: 'background: #888; color: #fff;',
            btnStyle: 'background: #666; color: #fff;'
        };
    }

    // Default Death
    return {
        title: '生命终结',
        panelStyle: 'background: linear-gradient(180deg, #2a0e0e 0%, #1a1a1a 100%); border-color: #5a1e1e;', // Red
        titleStyle: 'color: #ff4d4d; text-shadow: 0 0 20rpx rgba(255, 77, 77, 0.5);',
        dividerStyle: 'background: #444;',
        badgeStyle: 'background: #ffd700; color: #000;',
        btnStyle: 'background: #ff4d4d; color: #fff;'
    };
});

const deathReason = computed(() => {
    const eid = endingId.value;
    if (!eid) return '在这片荒野中永远沉睡...';
    const map = {
        'dead_001': '长眠于秦岭深处',
        'dead_starve': '倒在了寻找食物的路上',
        'dead_cold': '失温，在幻觉中睡去',
        'dead_sanity': '精神崩溃，迷失在风雪中',
        'end_lost_23km': '走进跑道，不知所踪',
        'end_caught': '非法穿越被劝返',
        'end_rescue': '体力不支获救',
        'end_retreat': '山就在那里，活着才有希望', // Updated text
        'end_success': '虽未走完全程，但已足够精彩',
        'end_game_cleared': '征服了中华龙脊',
        'end_hidden': '跨越了时间的维度' // [NEW]
    };
    return map[eid] || '旅途终结';
});

const evaluationTitle = computed(() => {
    const eid = endingId.value;
    const d = days.value;
    if (eid === 'end_game_cleared') return '鳌太征服者';
    if (eid === 'end_success') return '雪线行者';
    if (eid === 'end_retreat') return '明智的生存者';
    if (eid === 'end_hidden') return '轮回之人'; // [NEW]
    if (eid === 'end_caught') return '受训斥的驴友';
    if (eid === 'end_rescue') return '幸存者';
    if (eid === 'end_lost_23km') return '失落的灵魂';
    if (d < 2) return '初涉险阻';
    if (d < 4) return '莽撞的行者';
    if (d < 6) return '风雪归人';
    return '秦岭之魂';
});

const onRestart = () => {
    uni.reLaunch({ url: '/pages/home_page' });
};
</script>

<style lang="scss" scoped>
.game-over-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.panel {
    width: 600rpx;
    border: 2rpx solid; // Color set by JS
    border-radius: 20rpx;
    padding: 50rpx 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 60rpx rgba(0, 0, 0, 0.5);
    transition: all 0.5s ease;
}

.header {
    margin-bottom: 40rpx;
}

.title {
    font-size: 56rpx; // Larger
    font-weight: 900;
    letter-spacing: 4rpx;
}

.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;
}

.days-label {
    color: #888;
    font-size: 24rpx;
    margin-bottom: 10rpx;
    text-transform: uppercase;
}

.days-value {
    color: #fff;
    font-size: 90rpx; // Larger
    font-weight: 700;
    font-family: monospace;
    line-height: 1;
}

.divider {
    width: 120rpx;
    height: 4rpx;
    margin: 40rpx 0;
    opacity: 0.6;
}

.reason-label {
    color: #888;
    font-size: 24rpx;
    margin-bottom: 16rpx;
}

.reason-value {
    color: #ddd;
    font-size: 32rpx;
    text-align: center;
    line-height: 1.5;
    max-width: 90%;
    font-weight: 500;
}

.rank-badge {
    margin-top: 50rpx;
    padding: 10rpx 24rpx;
    border-radius: 12rpx;

    .rank-text {
        font-weight: 800;
        font-size: 28rpx;
    }
}

.restart-btn {
    width: 80%;
    height: 96rpx;
    line-height: 96rpx;
    font-size: 34rpx;
    font-weight: 600;
    border-radius: 48rpx;
    transition: transform 0.1s;

    &.btn-hover {
        transform: scale(0.98);
        opacity: 0.9;
    }
}
</style>
