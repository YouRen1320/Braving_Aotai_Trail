<template>
  <view class="status-bar">
    <!-- 左侧：天数与天气 -->
    <view class="info-group">
      <view class="day-indicator">
        <text class="day-text">DAY {{ days }}</text>
      </view>
      <view class="weather-indicator" v-if="weatherInfo">
        <text class="weather-icon">{{ weatherInfo.icon }}</text>
        <text class="weather-name">{{ weatherInfo.name }}</text>
      </view>
    </view>

    <!-- 状态条区域 -->
    <view class="bars-container">
      <!-- 生命值 -->
      <view class="bar-row">
        <text class="icon">♥</text>
        <view class="progress-bg">
          <view class="progress-fill hp-fill" :style="{ width: hp + '%' }"></view>
        </view>
        <text class="value">{{ Math.floor(hp) }}</text>
      </view>

      <!-- 饥饿度 -->
      <view class="bar-row">
        <text class="icon">♨</text>
        <view class="progress-bg">
          <view class="progress-fill hunger-fill" :style="{ width: hunger + '%' }"></view>
        </view>
        <text class="value">{{ Math.floor(hunger) }}</text>
      </view>

      <!-- 理智值 [NEW] -->
      <view class="bar-row">
        <text class="icon">🧠</text>
        <view class="progress-bg">
          <view class="progress-fill sanity-fill" :style="{ width: sanity + '%' }"></view>
        </view>
        <text class="value">{{ Math.floor(sanity) }}</text>
      </view>

      <!-- 进度条 [NEW] -->
      <view class="bar-row">
        <text class="icon">🏔️</text>
        <view class="progress-bg">
          <view class="progress-fill progress-fill-cyan" :style="{ width: progress + '%' }"></view>
        </view>
        <text class="value">{{ progress }}%</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();

const hp = computed(() => gameStore.status.hp);
const hunger = computed(() => gameStore.status.hunger);
const sanity = computed(() => gameStore.status.sanity || 0);
const days = computed(() => gameStore.player.days);
const progress = computed(() => Math.floor(gameStore.progress || 0)); // Fixed: progress is on root state
const weatherInfo = computed(() => gameStore.currentWeatherInfo);
</script>

<style lang="scss" scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 20rpx 10rpx; // Reduced vertical padding further
  padding-top: calc(10rpx + var(--status-bar-height));
  padding-right: 180rpx; // Increased to safe zone (30rpx right + ~120rpx btn width + buffer)
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  pointer-events: none;
  box-sizing: border-box; // [CRITICAL] Restore this so padding constrains width
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
  width: 110rpx; // Slightly reduced
  flex-shrink: 0;
}

.day-indicator {
  .day-text {
    font-size: 32rpx;
    font-weight: 900;
    color: #fff;
    font-family: monospace;
    letter-spacing: 2rpx;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.8);
  }
}

.weather-indicator {
  display: flex;
  align-items: center;
  gap: 8rpx;

  .weather-icon {
    font-size: 26rpx;
  }

  .weather-name {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.8);
  }
}

.bars-container {
  flex: 1;
  margin-left: 10rpx; // Reduced margin
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 12rpx; // Tighter gap
  row-gap: 6rpx;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8rpx;

  .icon {
    font-size: 20rpx;
    color: #eee;
    width: 24rpx;
    text-align: center;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
  }

  .value {
    font-size: 20rpx;
    color: #fff;
    width: 40rpx;
    text-align: right;
    font-weight: bold;
    font-family: monospace;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
  }
}

.progress-bg {
  flex: 1;
  height: 8rpx; // Thinner bars (was 12)
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4rpx;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.progress-fill {
  height: 100%;
  border-radius: 4rpx;
  transition: width 0.3s ease-out;
}

.hp-fill {
  background: linear-gradient(90deg, #ff4d4d, #ff1a1a);
}

.hunger-fill {
  background: linear-gradient(90deg, #ffbf00, #ff9900);
}

.sanity-fill {
  background: linear-gradient(90deg, #b100ff, #7f00ff);
}

.progress-fill-cyan {
  background: linear-gradient(90deg, #00d2ff, #3a7bd5);
}
</style>
