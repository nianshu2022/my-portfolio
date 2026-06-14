const api = require('../../utils/api');

Page({
  data: {
    comments: [],
    showModal: false,
    replyText: '',
    currentId: null,
    currentNickname: ''
  },

  onShow() {
    this.loadComments();
  },

  async loadComments() {
    try {
      const res = await api.request('/api/admin/comments', 'GET');
      if (res && !res.error) {
        this.setData({ comments: res });
      }
    } catch (e) {
      wx.showToast({ title: '获取留言失败', icon: 'none' });
    }
  },

  showReplyModal(e) {
    const { id, nickname } = e.currentTarget.dataset;
    this.setData({
      showModal: true,
      currentId: id,
      currentNickname: nickname,
      replyText: ''
    });
  },

  hideReplyModal() {
    this.setData({ showModal: false });
  },

  onReplyInput(e) {
    this.setData({ replyText: e.detail.value });
  },

  async submitReply() {
    const { currentId, replyText } = this.data;
    if (!replyText) return;

    try {
      await api.request('/api/admin/comments/reply', 'POST', {
        id: currentId,
        reply_content: replyText
      });
      wx.showToast({ title: '已回复', icon: 'success' });
      this.setData({ showModal: false });
      this.loadComments();
    } catch (e) {
      wx.showToast({ title: '回复失败', icon: 'none' });
    }
  },

  async deleteComment(e) {
    const { id } = e.currentTarget.dataset;
    const { confirm } = await wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定吗？',
      confirmColor: '#f43f5e'
    });

    if (confirm) {
      try {
        await api.request('/api/admin/comments/delete', 'POST', { id });
        wx.showToast({ title: '已删除', icon: 'success' });
        this.loadComments();
      } catch (e) {
        wx.showToast({ title: '删除失败', icon: 'none' });
      }
    }
  },

  onPullDownRefresh() {
    this.loadComments().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
