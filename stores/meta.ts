import { defineStore } from "pinia";

declare const uni: any;

interface RunRecord {
  date: string;
  roleName: string;
  days: number;
  endingId: string;
  endName: string;
}

interface MetaState {
  runCount: number;
  unlockedEndings: string[]; // List of ending IDs
  unlockedRoles: string[]; // List of unlocked role IDs
  runHistory: RunRecord[]; // Keep track of last 10 runs
  tutorialFlags: {
    hasSeenNightTip: boolean;
    hasSeenOverloadTip: boolean;
  };
}

export const useMetaStore = defineStore("meta", {
  state: (): MetaState => ({
    runCount: 0,
    unlockedEndings: [],
    unlockedRoles: [],
    runHistory: [],
    tutorialFlags: {
      hasSeenNightTip: false,
      hasSeenOverloadTip: false,
    },
  }),

  getters: {
    isEndingUnlocked: (state: MetaState) => (endingId: string) => {
      return state.unlockedEndings.includes(endingId);
    },
    isRoleUnlocked: (state: MetaState) => (roleId: string) => {
      return state.unlockedRoles.includes(roleId);
    },
    totalEndingsUnlocked: (state: MetaState) => state.unlockedEndings.length,
  },

  actions: {
    // Load from storage on app launch (or store init)
    loadMeta(this: any) {
      try {
        const data = uni.getStorageSync("braving_aotai_meta_v1");
        if (data) {
          this.runCount = data.runCount || 0;
          this.unlockedEndings = data.unlockedEndings || [];
          this.unlockedRoles = data.unlockedRoles || [];
          this.runHistory = data.runHistory || [];
          this.tutorialFlags = data.tutorialFlags || {
            hasSeenNightTip: false,
            hasSeenOverloadTip: false,
          };
        }
      } catch (e) {
        console.error("Failed to load meta", e);
      }
    },

    saveMeta(this: any) {
      try {
        const data = {
          runCount: this.runCount,
          unlockedEndings: this.unlockedEndings,
          unlockedRoles: this.unlockedRoles,
          runHistory: this.runHistory,
          tutorialFlags: this.tutorialFlags,
        };
        uni.setStorageSync("braving_aotai_meta_v1", data);
      } catch (e) {
        console.error("Failed to save meta", e);
      }
    },

    // [NEW] Tutorial Flags
    markTutorialSeen(this: any, key: keyof MetaState["tutorialFlags"]) {
      if (!this.tutorialFlags[key]) {
        this.tutorialFlags[key] = true;
        this.saveMeta();
      }
    },

    incrementRun(this: any) {
      this.runCount++;
      this.saveMeta();
    },

    unlockEnding(this: any, endingId: string) {
      if (!endingId) return;
      if (!this.unlockedEndings.includes(endingId)) {
        this.unlockedEndings.push(endingId);
        this.saveMeta();
        uni.showToast({ title: "解锁新结局！", icon: "success" });
      }

      // Check for role unlocks whenever an ending is unlocked (or reached)
      this.checkRefUnlock(endingId);
    },

    unlockRole(this: any, roleId: string) {
      if (!this.unlockedRoles.includes(roleId)) {
        this.unlockedRoles.push(roleId);
        this.saveMeta();
        // Show a special toast or modal for role unlock
        setTimeout(() => {
          uni.showToast({ title: `解锁新角色！`, icon: "none" });
        }, 1500);
      }
    },

    checkRefUnlock(this: any, endingId: string) {
      // 1. Veteran Unlock: Any ending
      if (endingId) {
        this.unlockRole("veteran");
      }

      // 2. Porter Unlock: Success ending only
      if (endingId.startsWith("end_success")) {
        this.unlockRole("porter");
      }
    },

    // Add a run record
    addRun(this: any, record: RunRecord) {
      if (!record) return;
      this.runHistory.unshift(record); // Add to top
      if (this.runHistory.length > 10) {
        this.runHistory.pop(); // Keep max 10
      }
      this.saveMeta();
      console.log("Run added:", record);
    },

    // For testing
    resetMeta(this: any) {
      this.runCount = 0;
      this.unlockedEndings = [];
      this.unlockedRoles = [];
      this.runHistory = [];
      this.tutorialFlags = {
        hasSeenNightTip: false,
        hasSeenOverloadTip: false,
      };
      this.saveMeta();
    },
  },
});
