function selectTab(page, index) {
  if (!page || typeof page.getTabBar !== 'function') return;

  const tabBar = page.getTabBar();
  if (tabBar && typeof tabBar.setData === 'function') {
    if (tabBar.data && tabBar.data.selected === index) return;
    tabBar.setData({ selected: index });
  }
}

module.exports = {
  selectTab
};
