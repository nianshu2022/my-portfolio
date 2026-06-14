Component({
  properties: {
    tone: {
      type: String,
      value: 'default'
    },
    title: {
      type: String,
      value: '这里暂时空着'
    },
    desc: {
      type: String,
      value: '先去别处逛逛，灵感会慢慢长出来。'
    },
    actionText: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: ''
    }
  },

  methods: {
    onAction() {
      this.triggerEvent('action');
    }
  }
});
