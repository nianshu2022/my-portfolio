const api = require('../../utils/api');
const markdown = require('../../utils/markdown');
const readingStore = require('../../store/reading');

Page({
  data: {
    loading: true,
    error: '',
    collection: '',
    slug: '',
    post: null,
    contentNodes: [],
    favorited: false,
    liked: false,
    nextItem: null,
    comments: [],
    sheetVisible: false,
    nickname: '',
    commentContent: '',
    canSubmit: false
  },

  onLoad(options) {
    this.setData({
      collection: options.collection || 'posts',
      slug: options.slug || ''
    });
    this.loadData();
    this.loadComments();
  },

  async loadComments() {
    try {
      const comments = await api.getComments(this.data.slug);
      this.setData({ comments });
    } catch (err) {
      console.error('Load comments failed', err);
    }
  },

  showCommentSheet() {
    this.setData({ sheetVisible: true });
  },

  hideCommentSheet() {
    this.setData({ sheetVisible: false });
  },

  onNicknameInput(e) {
    const nickname = e.detail.value;
    this.setData({ 
      nickname,
      canSubmit: nickname.trim() && this.data.commentContent.trim()
    });
  },

  onContentInput(e) {
    const commentContent = e.detail.value;
    this.setData({ 
      commentContent,
      canSubmit: commentContent.trim() && this.data.nickname.trim()
    });
  },

  async submitComment() {
    if (!this.data.canSubmit) return;

    wx.showLoading({ title: '正在发送...' });
    try {
      await api.postComment(this.data.slug, {
        nickname: this.data.nickname,
        content: this.data.commentContent
      });
      wx.hideLoading();
      wx.showToast({ title: '留言成功' });
      
      this.setData({ 
        sheetVisible: false,
        commentContent: '',
        canSubmit: false
      });
      this.loadComments();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '发送失败', icon: 'none' });
    }
  },

  async loadData() {
    const { collection, slug } = this.data;

    if (!slug) {
      this.setData({ loading: false, error: '缺少内容标识。' });
      return;
    }

    this.setData({ loading: true, error: '' });

    try {
      const [detail, garden] = await Promise.all([
        api.getDetail(collection, slug),
        api.getGarden().catch(() => [])
      ]);
      const post = api.normalizeItem(detail);
      const parsed = markdown.parseMarkdown(post.content);
      const gardenItems = garden.map(api.normalizeItem);
      const nextItem = this.findNext(gardenItems, post);

      wx.setNavigationBarTitle({ title: post.typeLabel });
      const history = readingStore.addHistory(post);
      if (history.length === 3) {
        wx.showToast({ title: '今日漫游徽章已点亮', icon: 'none' });
      }

      this.setData({
        post,
        contentNodes: parsed.nodes,
        favorited: readingStore.isFavorite(post),
        liked: readingStore.isLiked(post),
        nextItem,
        loading: false
      });
    } catch (error) {
      this.setData({
        loading: false,
        error: error.message || '内容加载失败，请稍后再试。'
      });
    }
  },

  findNext(items, post) {
    const currentKey = readingStore.itemKey(post);
    const index = items.findIndex((item) => readingStore.itemKey(item) === currentKey);
    if (index < 0) return null;

    return items[index + 1] || items[0] || null;
  },

  async toggleFavorite() {
    if (!this.data.post) return;

    const result = readingStore.toggleFavorite(this.data.post);
    this.setData({ favorited: result.favorited });

    // 同步到云端
    try {
      await api.request('/api/favorites/toggle', 'POST', {
        slug: this.data.slug,
        favorite: result.favorited
      });
    } catch (err) {
      console.error('Cloud favorite sync failed', err);
    }

    wx.showToast({
      title: result.favorited ? '收好了，随时回来' : '已取消收藏',
      icon: 'none'
    });
  },

  async toggleLike() {
    if (!this.data.post) return;

    // 1. 本地状态即时反馈
    const result = readingStore.toggleLike(this.data.post);
    this.setData({ liked: result.liked });

    // 2. 如果是点赞操作，同步到云端
    if (result.liked) {
      try {
        await api.request(`/api/posts/${this.data.slug}/like`, 'POST');
        // 重新获取一下最新的统计数据
        const stats = await api.getDetail(this.data.collection, this.data.slug);
        this.setData({
          'post.views': stats.views,
          'post.likes': stats.likes
        });
      } catch (err) {
        console.error('Sync like failed', err);
      }
    }

    wx.showToast({
      title: result.liked ? '收到你的喜欢' : '已取消喜欢',
      icon: 'none'
    });
  },

  copyLink() {
    if (!this.data.post?.url) return;

    wx.setClipboardData({
      data: this.data.post.url,
      success() {
        wx.showToast({ title: '已复制链接', icon: 'success' });
      }
    });
  },

  openTag(event) {
    const tag = encodeURIComponent(event.currentTarget.dataset.tag || '');
    wx.navigateTo({
      url: `/pages/tags/tags?tag=${tag}`
    });
  },

  openRelated(event) {
    const { collection, slug } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?collection=${collection}&slug=${slug}`
    });
  },

  openNext() {
    const item = this.data.nextItem;
    if (!item) return;

    wx.redirectTo({
      url: `/pages/detail/detail?collection=${item.detailCollection}&slug=${item.slug}`
    });
  },

  previewCover() {
    const image = this.data.post?.cover || this.data.post?.award;
    if (!image) return;

    wx.previewImage({ urls: [image], current: image });
  },

  onShareAppMessage() {
    const post = this.data.post;
    return {
      title: post?.title || 'Nianshu 的空间',
      path: `/pages/detail/detail?collection=${this.data.collection}&slug=${this.data.slug}`
    };
  }
});
