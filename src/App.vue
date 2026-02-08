<template>
  <div class="confession-page">

    <!-- 菜单/图片网格 -->
    <div class="right-image-grid">
      <div class="grid-item">
        <img src="/src/assets/menu1.png" alt="menu1" class="grid-img" @click="showSteam">
      </div>
      <div class="grid-item">
        <img src="/src/assets/menu2.png" alt="menu2" class="grid-img" @click="showPhotos">
      </div>
<!--      <div class="grid-item">-->
<!--        <img src="/src/assets/menu3.png" alt="menu3" class="grid-img" @click="playVideo">-->
<!--      </div>-->
<!--      <div class="grid-item">-->
<!--        <img src="/src/assets/menu4.png" alt="menu4" class="grid-img" @click="playVideo">-->
<!--      </div>-->
    </div>

    <!-- 左上角音乐按钮 -->
    <div
        class="music-button"
        @click="toggleMusic"
        @contextmenu.prevent="switchSong"
    >
    <!-- 播放时显示musicOn.mp4，暂停时显示musicOff.png -->
    <div v-if="isMusicPlaying" class="music-video-container">
      <video
          ref="musicVideoRef"
          class="music-icon"
          autoplay
          loop
          muted
          playsinline
      >
        <source src="/src/assets/musicOn.mp4" type="video/mp4">
      </video>
    </div>
    <img
        v-else
        src="/src/assets/musicOff.png"
        alt="music-off"
        class="music-icon"
    >
  </div>




    <!-- 背景漂浮花瓣 -->
    <div class="petal" v-for="(petal, index) in petals" :key="index"
         :style="{
           left: petal.left + 'px',
           top: petal.top + 'px',
           animationDuration: petal.duration + 's',
           animationDelay: petal.delay + 's',
           transform: `rotate(${petal.rotate}deg) scale(${petal.scale})`
         }">
    </div>

    <!-- 顶部可爱标题 -->
    <header class="page-header">
      <div class="cute-title">
        <span class="heart-icon">❤️</span>
        To小佳 <span class="heart-icon">❤️</span>
      </div>
      <div class="sub-title">💖 试试点一下下面的腻 💖</div>
    </header>

    <!-- 主体内容区 -->


    <main class="main-content">
      <!-- 可爱头像框 -->
      <div class="avatar-box">
        <div class="avatar-frame" @click="playVideo">
          <img
              src="/src/assets/jiajia1.png"
              alt="严荣佳"
              class="avatar-img"
              :class="{ 'avatar-hover': !showVideo }"
          >
          <!-- 视频元素：默认隐藏，播放时显示 -->
          <video
              ref="videoRef"
              v-if="showVideo"
              class="avatar-video"
              autoplay
              muted
              :loop="false"
              @ended="onVideoEnd"
          >
            <source src="/src/assets/jiajia1.mp4" type="video/mp4">
            你的浏览器不支持视频播放
            /* ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 */
          </video>
          <div class="avatar-decoration_2">❤️</div>
          <div class="avatar-decoration_3">🧡</div>
          <div class="avatar-decoration_4">💛</div>
          <div class="avatar-decoration_5">💚</div>
          <div class="avatar-decoration_6">💙</div>
          <div class="avatar-decoration_7">💜</div>
          <div class="avatar-decoration_9">🤍</div>
          <div class="avatar-decoration_11">💗</div>
        </div>

      </div>

      <!-- 手写卡片 -->
      <div class="love-card">
        <div class="card-header">
          <span class="card-icon">💌</span> 致佳佳 <span class="card-icon">💌</span>
        </div>
        <div class="card-content">
          <p>见信如晤，展信舒颜：</p>
          <p>我一直觉得，认识你是一件很特别的事</p>
          <p>不管怎么样，我都很高兴认识你</p>
          <p>  </p>

          <p class="signature">小卓 💘</p>
        </div>
        <div class="card-footer"></div>
      </div>

<!--      &lt;!&ndash; 互动按钮区 &ndash;&gt;-->
<!--      <div class="button-group">-->
<!--        <button class="cute-btn love-btn" @click="showLove">-->
<!--          <span>点击接收我的爱 💓</span>-->
<!--        </button>-->
<!--        <button class="cute-btn hug-btn" @click="showHug">-->
<!--          <span>求抱抱 🫂</span>-->
<!--        </button>-->
<!--        <button class="cute-btn kiss-btn" @click="showKiss">-->
<!--          <span>亲亲 😘</span>-->
<!--        </button>-->
<!--      </div>-->

      <!-- 动态爱心特效 -->
      <div class="heart-container" ref="heartContainer"></div>

      <!-- 可爱语录 -->
      <div class="quote-box">
        <div class="quote-content">
          {{ currentQuote }}
        </div>
        <button class="change-quote-btn" @click="changeQuote">
          我想对你说
        </button>
      </div>
    </main>

    <!-- 底部音乐播放器 -->
    <footer class="page-footer">
      <div class="music-player">
        <audio ref="audioPlayer" loop controls class="audio-control">
          <source src="https://music.163.com/song/media/outer/url?id=186016.mp3" type="audio/mpeg">
          你的浏览器不支持音频播放
        </audio>
        <div class="music-text">🎵       🎵             🎵      🎵            🎵</div>
      </div>
      <div class="copyright">
        © xxx ❤ xx
      </div>
    </footer>

    <!-- 弹窗提示 -->
    <div class="popup" v-if="showPopup">
      <div class="popup-content">
        <div class="popup-icon">{{ popupIcon }}</div>
        <div class="popup-text">{{ popupText }}</div>
        <button class="popup-close" @click="showPopup = false">
          确定 ✨
        </button>
      </div>
    </div>
  </div>



  <!-- Steam截图集弹窗 -->
  <div v-if="showSteamModal" class="steam-modal">
    <!-- 图片展示区域 -->
    <div class="steam-img-container">
      <!-- 自定义边框（kuang.png） -->
      <div class="steam-img-frame">
        <img :src="currentSteamImg" alt="steam截图" class="steam-img">
        <!-- 边框背景图 -->
        <img v-if="showFrameImg" src="./assets/kuang.png" alt="边框" class="steam-frame-img">
      </div>

      <!-- 操作按钮 -->
      <div class="steam-btn-group">
        <!-- 上一张 -->
        <button class="steam-btn prev-btn" @click="prevSteamImg">← 上一张</button>
        <!-- 下一张 -->
        <button class="steam-btn next-btn" @click="nextSteamImg">下一张 →</button>
        <!-- 返回 -->
        <button class="steam-btn back-btn" @click="closeSteamModal">返回</button>
      </div>
    </div>
  </div>

  <!-- 桌宠容器 -->
  <div class="pet-container"
       ref="petRef"
       :style="{ top: petTop + 'px', left: petLeft + 'px' }"
       @mousedown="startDrag"
  >
    <img
        :src="currentPetImg"
        alt="桌宠"
        class="pet-img"
    >
  </div>



  <!-- 右下角固定广告容器（顶层） -->
  <div class="ad-float" ref="adContainerRef">
    <!-- 广告主体：图片/视频切换 -->
    <img
        v-if="!showAdVideo"
        src="/src/assets/ad.png"
        alt="广告"
        class="ad-main"
    >
    <video
        v-else
        ref="adVideoRef"
        class="ad-main"
        autoplay
        loop
        muted
        playsinline
    >
      <source src="/src/assets/ad-video.mp4" type="video/mp4">
    </video>

    <!-- 右上角小叉图（可点击/禁用） -->
    <img
        src="/src/assets/close-icon.png"
        alt="关闭"
        class="ad-close-icon"
        @click="openConfirmModal"
        :style="{ pointerEvents: isCloseIconDisabled ? 'none' : 'auto', opacity: isCloseIconDisabled ? 0.5 : 1 }"
    >
  </div>

  <!-- 确认弹窗：你真的要叉掉小卓卓吗 -->
  <div class="confirm-modal" v-show="showConfirmModal" @click.self="closeConfirmModal">
    <div class="confirm-modal-box">
      <p class="confirm-text">你真的要叉掉小卓卓吗</p>
      <div class="confirm-btn-group">
        <button class="confirm-btn no-btn" @click="closeConfirmModal">No</button>
        <button class="confirm-btn yes-btn" @click="handleYesClick">Yes</button>
      </div>
    </div>
  </div>



</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';


// 音乐相关
const isMusicPlaying = ref(false);
const audioPlayer = ref(null);
const musicVideoRef = ref(null); // 音乐视频引用
// 多首歌曲列表（替换成你的真实歌曲链接）
const songList = ref([
  {name: '淋雨一直走', url: new URL('./assets/linyuyizhizou.mp3', import.meta.url).href},
  {name: '想摘下星星给你', url: new URL('./assets/zhaixiaxingxing.mp3', import.meta.url).href},
  {name: '暖暖', url: new URL('./assets/nuannuan.mp3', import.meta.url).href},
  {name: '说爱你', url: new URL('./assets/shuoaini.mp3', import.meta.url).href},
  {name: '冲动', url: new URL('./assets/chongdong.mp3', import.meta.url).href},
  {name: '爱的双重魔力', url: new URL('./assets/shaungchongmoli.mp3', import.meta.url).href},
  {name: '坠', url: new URL('./assets/zhui.mp3', import.meta.url).href},
  {name: '晚风', url: new URL('./assets/wanfeng.mp3', import.meta.url).href},
  {name: '心墙', url: new URL('./assets/xinqiang.mp3', import.meta.url).href},
  {name: '我们的明天', url: new URL('./assets/womendemingtian.mp3', import.meta.url).href},

]);
const currentSongIndex = ref(0); // 当前播放歌曲索引


// 漂浮花瓣数据
const petals = ref([]);
// 爱心容器
const heartContainer = ref(null);
// 弹窗相关
const showPopup = ref(false);
const popupIcon = ref('');
const popupText = ref('');
// 可爱语录
const quotes = [
  "寄给你全宇宙的爱和自太古至永劫的思念",
  "每想你一次，天上飘落一粒沙，从此就有了撒哈拉 --三毛",
  "只是想着有那么一天，我只是坐在你身边静静地看着你，我就觉得值得期待",
  "对你的回忆是我遭受痛苦时候的温柔乡",
  "真的好想见你一面啊",
  "人生短暂，青春易逝，希望我们都更热烈，勇敢一些，成为我们想成为的人",
  "右键唱片可以换歌啊"
];

const currentQuote = ref(quotes[0]);
// 视频播放相关
const showVideo = ref(false); // 控制视频是否显示
const videoRef = ref(null);   // 视频元素引用




// ========== Steam截图集相关 ==========
const showSteamModal = ref(false); // Steam弹窗显示状态
const steamImgList = ref([]);      // Steam图片列表
const photosImgList = ref([]);      // Photos图片列表
const isShowingPhotos = ref(false); // 标记当前弹窗显示的是Steam还是Photos图片
const showFrameImg = ref(false); // 控制是否显示kuang.png边框
const currentSteamIndex = ref(0);  // 当前显示图片索引
const currentPhotosIndex = ref(0);
const currentSteamImg = ref('');   // 当前显示图片路径
// 相机翻页音效相关
const cameraSound = ref(null);
// 创建音频对象（替换为你的音效路径）
cameraSound.value = new Audio(new URL('./assets/audio/camera_turn.mp3', import.meta.url).href);
// 设置音效音量（0-1，可调整）
cameraSound.value.volume = 0.7;

// 初始化Steam图片列表（重置Steam索引）
const initSteamImgList = () => {
  const steamImgModules = import.meta.glob('./assets/steam/*.{png,jpg,jpeg,webp}', {
    eager: true,
    import: 'default'
  });
  steamImgList.value = Object.values(steamImgModules).map(imgUrl => new URL(imgUrl, import.meta.url).href);

  // 🔥 重置Steam索引为0，随机显示第一张（或保留随机逻辑）
  currentSteamIndex.value = 0; // 固定显示第一张，如需随机则用：Math.floor(Math.random() * steamImgList.value.length)
  if (steamImgList.value.length > 0) {
    currentSteamImg.value = steamImgList.value[currentSteamIndex.value];
  } else {
    console.warn('Steam图片目录下未找到任何图片');
    currentSteamImg.value = '';
  }
};

// 初始化Photos图片列表（重置Photos索引）
const initPhotosImgList = () => {
  const photosImgModules = import.meta.glob('./assets/photos/*.{png,jpeg,jpg,webp}', {
    eager: true,
    import: 'default'
  });
  photosImgList.value = Object.values(photosImgModules).map(imgUrl => new URL(imgUrl, import.meta.url).href);

  // 🔥 重置Photos索引为0，随机显示第一张
  currentPhotosIndex.value = 0; // 固定显示第一张，如需随机则用：Math.floor(Math.random() * photosImgList.value.length)
  if (photosImgList.value.length > 0) {
    currentSteamImg.value = photosImgList.value[currentPhotosIndex.value];
  } else {
    console.warn('Photos图片目录下未找到任何图片');
    currentSteamImg.value = '';
  }
};

// 展示Steam截图集
const showSteam = () => {
  if (steamImgList.value.length === 0) {
    initSteamImgList();
  } else {
    // 🔥 非首次打开时，重置Steam索引为0
    const randomIndex = Math.floor(Math.random() * steamImgList.value.length);
    currentSteamIndex.value = randomIndex;
    currentSteamImg.value = steamImgList.value[currentSteamIndex.value];
  }
  isShowingPhotos.value = false;
  showFrameImg.value = true;
  showSteamModal.value = true;
};

// 展示Photos相册集
const showPhotos = () => {
  if (photosImgList.value.length === 0) {
    initPhotosImgList();
  } else {
    // 🔥 非首次打开时，重置Photos索引
    const randomIndex = Math.floor(Math.random() * steamImgList.value.length);
    currentPhotosIndex.value = randomIndex;
    currentSteamImg.value = photosImgList.value[currentPhotosIndex.value];
  }
  isShowingPhotos.value = true;
  showFrameImg.value = false;
  showSteamModal.value = true;
};



// 上一张（区分Steam/Photos索引）
const prevSteamImg = () => {
  if (isShowingPhotos.value) {
    // Photos逻辑：使用currentPhotosIndex
    currentPhotosIndex.value = (currentPhotosIndex.value - 1 + photosImgList.value.length) % photosImgList.value.length;
    currentSteamImg.value = photosImgList.value[currentPhotosIndex.value];
  } else {
    // Steam逻辑：使用currentSteamIndex
    currentSteamIndex.value = (currentSteamIndex.value - 1 + steamImgList.value.length) % steamImgList.value.length;
    currentSteamImg.value = steamImgList.value[currentSteamIndex.value];
  }
  // 音效逻辑保留
  if (cameraSound.value) {
    cameraSound.value.currentTime = 0;
    cameraSound.value.play().catch(err => console.log('音效播放失败:', err));
  }
};

// 下一张（区分Steam/Photos索引）
const nextSteamImg = () => {
  if (isShowingPhotos.value) {
    // Photos逻辑：使用currentPhotosIndex
    currentPhotosIndex.value = (currentPhotosIndex.value + 1) % photosImgList.value.length;
    currentSteamImg.value = photosImgList.value[currentPhotosIndex.value];
  } else {
    // Steam逻辑：使用currentSteamIndex
    currentSteamIndex.value = (currentSteamIndex.value + 1) % steamImgList.value.length;
    currentSteamImg.value = steamImgList.value[currentSteamIndex.value];
  }
  // 音效逻辑保留
  if (cameraSound.value) {
    cameraSound.value.currentTime = 0;
    cameraSound.value.play().catch(err => console.log('音效播放失败:', err));
  }
};


// 关闭Steam弹窗
const closeSteamModal = () => {
  showSteamModal.value = false;
  isShowingPhotos.value = false; // 重置标记
};



// 1. 左键单击：播放/暂停音乐 + 切换视频/图片
const toggleMusic = () => {
  // 如果音频播放器不存在，返回
  if (!audioPlayer.value) return;

  // 如果音乐正在播放
  if (isMusicPlaying.value) {
    // 暂停音乐 + 停止视频播放
    audioPlayer.value.pause();
    // 如果播放音乐的视频存在
    if (musicVideoRef.value) {
      // 暂停这个视频
      musicVideoRef.value.pause();
    }
    popupIcon.value = '🔇';
    popupText.value = '音乐已暂停～';
  } else {
    // 播放音乐 + 启动视频播放
    audioPlayer.value.play().catch(err => {
      console.log('播放失败:', err);
      popupIcon.value = '⚠️';
      popupText.value = '需要先点击页面任意位置激活播放哦～';
    });
    if (musicVideoRef.value) {
      musicVideoRef.value.play();
    }
    popupIcon.value = '🔊';
    popupText.value = `正在播放：${songList.value[currentSongIndex.value].name}`;
  }
  isMusicPlaying.value = !isMusicPlaying.value;
  //showPopup.value = true;
};

// 2. 右键单击：切换歌曲
const switchSong = () => {
  // 切换到下一首，循环播放
  currentSongIndex.value = (currentSongIndex.value + 1) % songList.value.length;
  const currentSong = songList.value[currentSongIndex.value];

  // 更新音频源并播放
  if (audioPlayer.value) {
    audioPlayer.value.src = currentSong.url;
    if (isMusicPlaying.value) {
      audioPlayer.value.play();
    }
  }

  // 提示切换结果
  popupIcon.value = '🎵';
  popupText.value = `已切换歌曲：${currentSong.name}`;
  //showPopup.value = true;
};



// 生成漂浮花瓣
const generatePetals = () => {
  const petalList = [];
  for (let i = 0; i < 50; i++) {
    petalList.push({
      left: Math.random() * 100,
      top: -50 - Math.random() * 500,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      rotate: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8
    });
  }
  petals.value = petalList;
};

const createHeart = (text) => {
  if (!heartContainer.value) {
    console.error('heartContainer not found!');
    return;
  }

  const fireworkContainer = document.createElement('div');
  fireworkContainer.className = 'firework-container';

  const particleCount = 20 + Math.floor(Math.random() * 10);
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle';
    particle.innerText = text;

    const colors = ['#ff6b9e', '#ff85a2', '#ffc2d1', '#ff9eb1', '#ff5e8f', '#ffffff'];
    particle.style.color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.fontSize = `${12 + Math.random() * 8}px`;

    // ✅ 关键：使用 CSS 变量而非内联 transform
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;

    particle.style.setProperty('--tx', `${translateX}px`);
    particle.style.setProperty('--ty', `${translateY}px`);

    const duration = 1.2 + Math.random() * 0.8;
    particle.style.animationDuration = `${duration}s`;

    fireworkContainer.appendChild(particle);
  }

  heartContainer.value.appendChild(fireworkContainer);

  setTimeout(() => {
    if (fireworkContainer.parentNode) {
      fireworkContainer.remove();
    }
  }, 3000);
};

// 显示爱心弹窗
const showLove = () => {
  popupIcon.value = '💓';
  popupText.value = '荣佳宝贝～我超超超喜欢你！😘';
  showPopup.value = true;
  // 生成爱心动画
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createHeart('❤️');
    }, i * 100);
  }
};

// 显示抱抱弹窗
const showHug = () => {
  popupIcon.value = '🫂';
  popupText.value = '给荣佳一个超大的熊抱～要把你抱紧紧！🥰';
  showPopup.value = true;
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      createHeart('🫂');
    }, i * 100);
  }
};

// 显示亲亲弹窗
const showKiss = () => {
  popupIcon.value = '😘';
  popupText.value = 'mua～亲一口荣佳的小脸蛋～软软糯糯的～😚';
  showPopup.value = true;
  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      createHeart('😘');
    }, i * 80);
  }
};

// 切换可爱语录
const changeQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  currentQuote.value = quotes[randomIndex];
};

// 播放视频
const playVideo = () => {
  showVideo.value = true;
  // 确保视频播放
  if (videoRef.value) {
    videoRef.value.play().catch(err => console.log('视频播放失败:', err));
  }
};



// 视频播放结束后隐藏视频，显示图片
const onVideoEnd = () => {
  showVideo.value = false;
};


// 桌宠容器引用
const petRef = ref(null);
// 当前显示的桌宠图片（默认jiajia_0）
const currentPetImg = ref(new URL('./assets/zhuochong/jiajia_0.png', import.meta.url).href);
// 桌宠图片列表（预加载所有素材）
const petImgList = ref([
  // 索引0: 默认图, 1-12: 对应不同方向
  new URL('./assets/zhuochong/jiajia_0.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_1.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_2.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_3.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_4.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_5.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_6.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_7.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_8.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_9.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_10.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_11.png', import.meta.url).href,
  new URL('./assets/zhuochong/jiajia_12.png', import.meta.url).href,
]);

// 计算鼠标与桌宠的角度（调整坐标系：0°=正左方，顺时针增加，更贴合你的需求）
const calculateAngle = (petRect, mouseX, mouseY) => {
  // 桌宠中心坐标
  const petCenterX = petRect.left + petRect.width / 2;
  const petCenterY = petRect.top + petRect.height / 2;

  // 计算鼠标与桌宠中心的偏移量
  const dx = mouseX - petCenterX;
  const dy = mouseY - petCenterY;

  // 计算角度（弧度转角度）
  // 调整坐标系：以正左方（180°）为0°，顺时针旋转
  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  // 转换为以正左方为0°的坐标系（核心调整）
  angle = (angle - 180) % 360;
  if (angle < 0) angle += 360;

  return angle;
};

// 根据角度切换桌宠图片（顺时针每30°一张，共12张）
const switchPetByAngle = (angle) => {
  // 核心规则：正左方（0°±15°）=jiajia_1，顺时针每30°切换一张，直到jiajia_12
  // 每个区间30°（±15°），对应imgIndex 1-12
  const directions = [
    { min: 345, max: 15, imgIndex: 1 },   // 正左方（0°±15°）→ jiajia_1
    { min: 15, max: 45, imgIndex: 2 },    // 左上方（30°±15°）→ jiajia_2
    { min: 45, max: 75, imgIndex: 3 },    // 左上偏上（60°±15°）→ jiajia_3
    { min: 75, max: 105, imgIndex: 4 },   // 正上方（90°±15°）→ jiajia_4
    { min: 105, max: 135, imgIndex: 5 },  // 右上偏上（120°±15°）→ jiajia_5
    { min: 135, max: 165, imgIndex: 6 },  // 右上方（150°±15°）→ jiajia_6
    { min: 165, max: 195, imgIndex: 7 },  // 正右方（180°±15°）→ jiajia_7
    { min: 195, max: 225, imgIndex: 8 },  // 右下偏右（210°±15°）→ jiajia_8
    { min: 225, max: 255, imgIndex: 9 },  // 右下方（240°±15°）→ jiajia_9
    { min: 255, max: 285, imgIndex: 10 }, // 右下偏下（270°±15°）→ jiajia_10
    { min: 285, max: 315, imgIndex: 11 }, // 正下方（300°±15°）→ jiajia_11
    { min: 315, max: 345, imgIndex: 12 }, // 左下偏下（330°±15°）→ jiajia_12
  ];

  // 匹配角度（兼容跨360°的区间）
  const match = directions.find(dir => {
    if (dir.min > dir.max) {
      // 跨360°的情况（如345-15°）
      return angle >= dir.min || angle <= dir.max;
    } else {
      // 普通区间
      return angle >= dir.min && angle <= dir.max;
    }
  });

  // 切换图片（匹配到则用对应索引，否则用默认图0）
  currentPetImg.value = match ? petImgList.value[match.imgIndex] : petImgList.value[0];
};



// 鼠标移动监听函数
const handleMouseMove = (e) => {
  if (!petRef.value) return;
  // 获取桌宠的位置和尺寸
  const petRect = petRef.value.getBoundingClientRect();
  // 计算角度
  const angle = calculateAngle(petRect, e.clientX, e.clientY);
  // 根据角度切换图片
  switchPetByAngle(angle);
};



// 桌宠拖拽相关变量
const isDragging = ref(false); // 是否正在拖拽
const startX = ref(0); // 拖拽起始X坐标
const startY = ref(0); // 拖拽起始Y坐标
const petTop = ref(500); // 桌宠初始top位置（可自定义）
const petLeft = ref(window.innerWidth - 220); // 桌宠初始left位置（右侧）

// 开始拖拽（鼠标按下）
const startDrag = (e) => {
  // 阻止事件冒泡，避免影响其他功能
  e.preventDefault();
  e.stopPropagation();

  isDragging.value = true;
  // 获取桌宠当前位置
  const petRect = petRef.value.getBoundingClientRect();
  // 记录鼠标相对于桌宠的偏移量（避免拖拽时桌宠跳变）
  startX.value = e.clientX - petRect.left;
  startY.value = e.clientY - petRect.top;

  // 修改鼠标样式
  petRef.value.style.cursor = 'move';
  // 监听鼠标移动和松开事件（绑定到document，避免鼠标移出桌宠后停止拖拽）
  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', endDrag);
};

// 拖拽中（鼠标移动）
const dragMove = (e) => {
  if (!isDragging.value || !petRef.value) return;

  // 计算桌宠新的位置（减去鼠标相对于桌宠的偏移量）
  petLeft.value = e.clientX - startX.value;
  petTop.value = e.clientY - startY.value;

  // 可选：限制桌宠不超出屏幕边界
  const maxLeft = window.innerWidth - petRef.value.offsetWidth;
  const maxTop = window.innerHeight - petRef.value.offsetHeight;
  petLeft.value = Math.max(0, Math.min(petLeft.value, maxLeft));
  petTop.value = Math.max(0, Math.min(petTop.value, maxTop));
};

// 结束拖拽（鼠标松开）
const endDrag = () => {
  isDragging.value = false;
  // 恢复鼠标样式
  if (petRef.value) {
    petRef.value.style.cursor = 'default';
  }
  // 移除事件监听（避免内存泄漏）
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', endDrag);
};


// 广告相关核心变量
const adContainerRef = ref(null);
const adVideoRef = ref(null);
const showAdVideo = ref(false); // 是否显示视频（默认显示图片）
const showConfirmModal = ref(false); // 确认弹窗显示状态
const isCloseIconDisabled = ref(false); // 叉图是否禁用

// 打开确认弹窗
const openConfirmModal = () => {
  showConfirmModal.value = true;
};

// 关闭确认弹窗（No按钮/点击遮罩）
const  closeConfirmModal = () => {
  showConfirmModal.value = false;
};

// 点击Yes按钮的逻辑：显示视频 + 禁用叉图
const handleYesClick = () => {
  showConfirmModal.value = false; // 关闭确认弹窗
  showAdVideo.value = true; // 切换为视频
  isCloseIconDisabled.value = true; // 禁用叉图（无法点击+半透明）

  // 确保视频自动播放
  if (adVideoRef.value) {
    adVideoRef.value.play().catch(err => console.log('视频播放失败:', err));
  }
};




// 页面挂载时
onMounted(() => {
  // 生成花瓣
  generatePetals();
  // 定时生成花瓣
  setInterval(() => {
    generatePetals();
  }, 30000);

  // 初始化花瓣（原有逻辑）
  generatePetals();

  // 如果音频播放器存在，设置初始歌曲
  if (audioPlayer.value) {
    audioPlayer.value.src = songList.value[currentSongIndex.value].url;
    if (isMusicPlaying.value) {
    }
  }


  setInterval(() => generatePetals(), 30000);
  document.addEventListener('mousemove', handleMouseMove);
});


onUnmounted(() => {
  petals.value = [];
  document.removeEventListener('mousemove', handleMouseMove);
});


</script>

<style scoped>
/* 全局样式 */
.confession-page {
  min-height: 100vh;
  width: 100vw;              /* 强制宽度 = 屏幕宽度 */
  background: linear-gradient(135deg, #ffe6f2 0%, #fff0f8 50%, #ffd9ec 100%);
  font-family: "Comic Sans MS", "幼圆", "微软雅黑", sans-serif;
  overflow-x: hidden;
  position: relative;
  padding: 20px 0;
  margin: 0;                  /* 去掉浏览器默认外边距 */
  /* 新增：确保背景覆盖到最左侧 */
  left: 0;
  top: 0;
}

/* 音乐按钮样式 */
.music-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 30;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: 4px solid #ff9eb1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(255, 107, 158, 0.2);
  transition: all 0.3s ease;
}

.music-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(255, 107, 158, 0.3);
}

/* 视频/图片统一尺寸 */
.music-icon {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
}

/* 视频容器：确保视频不溢出按钮 */
.music-video-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}

/* 菜单/图片网格 */
.right-image-grid {
  position: absolute;
  left: 1400px;
  top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;  /* 4列，每列宽度均等 */
  grid-template-rows: 1fr;                 /* 仅1行 */
  gap: 10px;
  z-index: 20;
}

.grid-item {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(255, 107, 158, 0.2);
}

.grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.grid-img:hover {
  transform: scale(1.05);
}

/* 漂浮花瓣 */
.petal {
  position: absolute;
  width: 15px;
  height: 15px;
  background: pink;
  border-radius: 50% 0;
  opacity: 0.7;
  z-index: 1;
  animation: petalFloat linear infinite;
}

@keyframes petalFloat {
  0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

/* ====================== 核心布局：全部内容从屏幕 1/4 处开始 ====================== */
.page-header {
  text-align: center;
  margin-bottom: 40px;
  z-index: 10;
  position: relative;
  margin: 0 55vw 40px 0vw;
}

.main-content {
  width: 800px;          /* 内容固定宽度 */
  margin: 0 50vw 40px 0vw;
  padding: 0 20px;
  z-index: 10;
  position: relative;
}

.page-footer {
  width: 800px;
  margin: 0 50vw 40px 0vw;
  padding: 0 20px;
  text-align: center;
  z-index: 10;
  position: relative;
}
/* ============================================================================== */

.cute-title {
  font-size: 2.5rem;
  color: #ff6b9e;
  text-shadow: 2px 2px 4px #ffb6c1;
  margin-bottom: 10px;
  animation: titleBounce 2s ease-in-out infinite;
}

.heart-icon {
  animation: heartBeat 1.5s ease-in-out infinite;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes titleBounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.sub-title {
  font-size: 1.2rem;
  color: #ff85a2;
  margin-top: 0;
}

/* 头像框 */
.avatar-box {
  text-align: center;
  margin-bottom: 40px;
}

.avatar-frame {
  display: inline-block;
  position: relative;
}

.avatar-img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 8px solid #ffc2d1;
  box-shadow: 0 0 20px #ff9eb1;
  object-fit: cover;
}

.avatar-hover {
  transition: all 0.3s ease;
}
.avatar-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 107, 158, 0.8);
  border-color: #ff85a2;
}



.avatar-decoration_2 {
  position: absolute;
  top: -10px;
  right: 190px;
  font-size: 2rem;
  animation: rotateStar 3s linear infinite;
}

.avatar-decoration_3 {
  position: absolute;
  top: 180px;
  right: -10px;
  font-size: 2rem;
  animation: rotateStar 3s linear infinite;
}

.avatar-decoration_4 {
  position: absolute;
  top: 180px;
  right: 190px;
  font-size: 2rem;
  animation: rotateStar 3s linear infinite;
}

.avatar-decoration_5 {
  position: absolute;
  top: 90px;
  right: -40px;
  font-size: 2rem;
  animation: rotateStar 3s linear infinite;
}

.avatar-decoration_6 {
  position: absolute;
  top: 90px;
  right: 210px;
  font-size: 2rem;
  animation: rotateStar 3s linear infinite;
}

.avatar-decoration_7 {
  position: absolute;
  top: -40px;
  right: 90px;
  font-size: 2rem;
  animation: rotateStar 3s linear infinite;
}


.avatar-decoration_9 {
  position: absolute;
  top: 210px;
  right: 90px;
  font-size: 2rem;
  animation: rotateStar 3s linear infinite;
}


.avatar-decoration_11 {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 2rem;
  animation: rotateStar 3s linear infinite;
}



.avatar-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 8px solid #ffc2d1;
  box-shadow: 0 0 20px #ff9eb1;
  object-fit: cover;
  z-index: 1;
}

@keyframes rotateStar {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


/* 爱心卡片 */
.love-card {
  width: 400px;
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  margin: 0 0 40px 10vw;
  box-shadow: 0 10px 30px rgba(255, 107, 158, 0.2);
  border: 5px solid #ffc2d1;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

}

.love-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffc2d1' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.3;
  z-index: 0;
}

.card-header {
  text-align: center;
  font-size: 1.5rem;
  color: #ff6b9e;
  margin-bottom: 15px;
  margin-top: -10px;
  z-index: 10;
  position: relative;
}

.card-content {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #333;
  z-index: 1;
  position: relative;
}

.card-content p {
  margin: 10px 0;
}

.signature {
  text-align: right;
  margin-top: 30px;
  color: #ff6b9e;
  font-weight: bold;
}

.card-footer {
  text-align: center;
  color: #ff85a2;
  margin-top: 1px;
  font-size: 1rem;
  z-index: 1;
  position: relative;
}

/* 按钮组 */
.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.cute-btn {
  background: linear-gradient(135deg, #ff9eb1 0%, #ff6b9e 100%);
  border: none;
  border-radius: 50px;
  padding: 15px 30px;
  font-size: 1.2rem;
  color: white;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(255, 107, 158, 0.3);
  transition: all 0.3s ease;
  font-family: "Comic Sans MS", "幼圆", sans-serif;
}

.cute-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 8px 20px rgba(255, 107, 158, 0.5);
}

.love-btn {
  background: linear-gradient(135deg, #ff85a2 0%, #ff5e8f 100%);
}

.hug-btn {
  background: linear-gradient(135deg, #ff85a2 0%, #ff5e8f 100%);
}

.kiss-btn {
  background: linear-gradient(135deg, #ff85a2 0%, #ff5e8f 100%);
}

/* 爱心动画容器 */
.heart-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999; /* 提高到最顶层 */
  overflow: hidden; /* 防止溢出 */
}

.flying-heart {
  position: absolute;
  font-size: 1.5rem;
  animation: flyHeart 3s ease-in-out forwards;
  opacity: 0;
}

@keyframes flyHeart {
  0% { transform: translateY(0) scale(0); opacity: 1; }
  50% { transform: translateY(-50vh) scale(1.2); opacity: 1; }
  100% { transform: translateY(-100vh) scale(0); opacity: 0; }
}

/* 可爱语录 */
.quote-box {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin: 0 9vw 20px 8vw;
  box-shadow: 0 8px 25px rgba(255, 107, 158, 0.15);
  border: 3px solid #ffc2d1;
  text-align: center;
}

.quote-content {
  font-size: 1.3rem;
  color: #ff6b9e;
  margin-bottom: 20px;
  min-height: 40px;
}

.change-quote-btn {
  background: #fff0f8;
  border: 2px solid #ff9eb1;
  border-radius: 30px;
  padding: 10px 20px;
  color: #ff6b9e;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Comic Sans MS", "幼圆", sans-serif;
}

.change-quote-btn:hover {
  background: #ff9eb1;
  color: white;
  transform: scale(1.05);
}

/* 底部音乐播放器 */
.music-player {
  margin-bottom: 20px;
}

.audio-control {
  width: 100%;
  margin-bottom: 10px;
  background: white;
  border-radius: 30px;
  padding: 5px;
}

.music-text {
  color: #ff85a2;
  font-size: 1rem;
}

.copyright {
  color: #ff9eb1;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

/* 弹窗样式 */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(5px);
}

.popup-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  border: 8px solid #ffc2d1;
  box-shadow: 0 10px 30px rgba(255, 107, 158, 0.3);
  animation: popupScale 0.5s ease-in-out;
}

@keyframes popupScale {
  0% { transform: scale(0); }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.popup-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.popup-text {
  font-size: 1.5rem;
  color: #ff6b9e;
  margin-bottom: 30px;
  line-height: 1.5;
}

.popup-close {
  background: linear-gradient(135deg, #ff9eb1 0%, #ff6b9e 100%);
  border: none;
  border-radius: 30px;
  padding: 10px 30px;
  font-size: 1.2rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Comic Sans MS", "幼圆", sans-serif;
}

.popup-close:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 107, 158, 0.3);
}

/* 响应式 */
@media (max-width: 768px) {
  .right-image-grid {
    right: 10px;
    gap: 5px;
  }
  .grid-item {
    width: 80px;
    height: 80px;
  }
  .avatar-img, .avatar-video {
    width: 150px;
    height: 150px;
  }
  .love-card {
    padding: 20px;
  }
  .card-content {
    font-size: 1rem;
  }
  .button-group {
    flex-direction: column;
    gap: 15px;
  }
  .cute-btn {
    width: 100%;
  }
}

/* Steam截图集弹窗 */
.steam-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* 层级高于所有元素 */
}

/* 图片容器 */
.steam-img-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* 带边框的图片区域 */
.steam-img-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 边框图片的尺寸（根据你的kuang.png调整） */
  width: 800px;
  height: 600px;
}

/* Steam图片（自适应边框） */
.steam-img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  z-index: 2; /* 图片在边框上层 */
}

/* 自定义边框（kuang.png） */
.steam-frame-img {
  position: fixed; /* 改为fixed，基于视口定位，缩放时跟随屏幕 */
  top: 50%;       /* 垂直居中基准 */
  left: 50%;      /* 水平居中基准 */
  /* 核心：用transform替代固定top/left，基于自身中心偏移，缩放时比例不变 */
  transform: translate(-50%, -50%);
  /* 保留你满意的尺寸比例，用vw/vh适配缩放（110vw/100vh不变） */
  width: 125vw;
  height: 130vh;
  object-fit: cover; /* 保持你满意的覆盖效果 */
  z-index: 1;
  pointer-events: none;
  /* 强制居中，不受object-fit影响 */
  object-position: center center;
  /* 可选：防止缩放时变形 aspect-ratio: 11/10 */
}

/* 按钮组 */
.steam-btn-group {
  display: flex;
  gap: 15px;
}

/* 按钮样式 */
.steam-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #ff9eb1 0%, #ff6b9e 100%);
  color: white;
  font-family: "Comic Sans MS", "幼圆", sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.steam-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(255, 107, 158, 0.4);
}

/* 桌宠容器 - 改为可拖拽的绝对定位 */
.pet-container {
  position: fixed; /* 固定定位，基于视口 */
  z-index: 999;   /* 确保在最上层 */
  width: 200px;   /* 桌宠宽度，可调整 */
  height: 200px;  /* 桌宠高度，可调整 */
  cursor: default; /* 默认鼠标样式 */
  pointer-events: auto; /* 开启点击事件，支持拖拽 */
  /* 移除原来的right/bottom，改为动态绑定top/left */
  transition: none; /* 拖拽时取消过渡动画，更流畅 */
}

/* 桌宠图片 */
.pet-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持图片比例 */
  transition: all 0.2s ease; /* 切换图片时的过渡动画 */
  user-select: none; /* 禁止选中图片，提升拖拽体验 */
}




/* 右下角广告容器（相对定位，用于放右上角叉图） */
.ad-float {
  position: fixed;
  right: 30px;
  bottom: 20px;
  z-index: 99999; /* 最顶层 */
  cursor: default; /* 取消整体点击手型 */
}

.ad-float img {
  object-fit: cover;
  border-radius: 8px;
}

/* 广告主体（图片/视频统一样式） */
.ad-main {
  width: 155px;
  height: 204px;
  object-fit: cover;
  border-radius: 8px;
}

/* 右上角小叉图样式 */
.ad-close-icon {
  position: absolute;
  top: -40px;
  right: -30px;

  width: 45px;
  height: 45px;

  cursor: pointer;
  z-index: 1; /* 叉图在广告主体上层 */
  transition: opacity 0.2s ease;
}

/* 确认弹窗遮罩 */
.confirm-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  backdrop-filter: blur(3px);
}

/* 确认弹窗内容 */
.confirm-modal-box {
  background: #fff;
  padding: 30px 20px;
  border-radius: 16px;
  border: 5px solid #ffc2d1;
  text-align: center;
  min-width: 280px;
}

/* 弹窗文字 */
.confirm-text {
  font-size: 1.2rem;
  color: #ff6b9e;
  margin-bottom: 20px;
  font-family: "Comic Sans MS", "幼圆", sans-serif;
}

/* 弹窗按钮组 */
.confirm-btn-group {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* 弹窗按钮样式 */
.confirm-btn {
  padding: 8px 25px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  font-family: "Comic Sans MS", "幼圆", sans-serif;
  transition: all 0.2s ease;
}

/* No按钮样式 */
.no-btn {
  background: #ffeff5;
  color: #ff6b9e;
  border: 2px solid #ff9eb1;
}
.no-btn:hover {
  background: #ff9eb1;
  color: #fff;
}

/* Yes按钮样式 */
.yes-btn {
  background: linear-gradient(135deg, #ff9eb1 0%, #ff6b9e 100%);
  color: #fff;
}
.yes-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 107, 158, 0.3);
}




@keyframes fireworkBurst {
  0% {
    transform: translate(0, 0) scale(0); /* 初始在中心，缩放0 */
    opacity: 1;
  }
  50% {
    transform: scale(1.2); /* 只缩放，translate值已在粒子样式中固定 */
    opacity: 1;
  }
  100% {
    transform: scale(0); /* 最终缩小消失 */
    opacity: 0;
  }
}

/* Photos弹窗无边框时，调整图片容器尺寸 */
.steam-modal:not(.show-frame) .steam-img-frame {
  width: 90vw;   /* 占屏幕90%宽度 */
  height: 90vh;  /* 占屏幕80%高度 */
  max-width: 1000px; /* 最大宽度限制 */
}


</style>