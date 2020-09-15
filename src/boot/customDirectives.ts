import { boot } from 'quasar/wrappers';

function touchImages(el: HTMLElement): void {
  if (window.navigator.userAgent.includes('Edge/')) {
    //
    // Microsoft Edge Bug fix: go and "jiggle" all of the q-img spacer divs in
    // order to make edge re-evaluate their size and properly position the
    // image.
    //
    setTimeout(() => {
      const els = el.querySelectorAll('.q-img div:first-child');
      // For each q-img element
      els.forEach((x: any) => {
        console.log('"touching a" q-img elements to fix Edge rendering bug"');
        // Add one hundredth of a percent to the padding to cause re-evaluation
        x.style.paddingBottom =
          parseFloat(x.style.paddingBottom.replace('%', '')) + 0.1 + '%';
      });
    }, 100);
  }
}

export default boot(({ Vue }) => {
  Vue.directive('fixQImgOnEdge', {
    componentUpdated: touchImages,
    bind: touchImages
  });
});
