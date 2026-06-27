document.addEventListener('DOMContentLoaded', () => {
  const tabLists = document.querySelectorAll('[data-tab-list]');

  tabLists.forEach(tabList => {
    const tabs = tabList.querySelectorAll('[role="tab"]');
    const panelContainer = tabList.closest('.tabs');
    if (!panelContainer) {
      return;
    }

    const panels = panelContainer.querySelectorAll('[role="tabpanel"]');

    function activateTab(tab) {
      const targetId = tab.getAttribute('aria-controls');

      tabs.forEach(item => {
        const isActive = item === tab;
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        item.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach(panel => {
        const isActive = panel.id === targetId;
        panel.hidden = !isActive;
      });

      if (history.replaceState) {
        const hash = tab.dataset.tabHash;
        if (hash) {
          history.replaceState(null, '', hash);
        }
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab));

      tab.addEventListener('keydown', (event) => {
        const index = Array.from(tabs).indexOf(tab);
        let nextIndex = index;

        if (event.key === 'ArrowRight') {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft') {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
      });
    });

    const hash = window.location.hash.replace('#', '');
    const hashTab = hash
      ? Array.from(tabs).find(tab => tab.dataset.tabHash === `#${hash}`)
      : null;

    if (hashTab) {
      activateTab(hashTab);
      hashTab.focus({ preventScroll: true });
    }
  });
});
