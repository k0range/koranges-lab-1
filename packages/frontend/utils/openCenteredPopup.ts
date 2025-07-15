export function openCenteredPopup(
  url: string,
  title = 'Popup',
  width = 600,
  height = 600
): void {
  // 画面の左上からのオフセットを計算（スクリーンの中央にウィンドウを表示）
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const screenWidth = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
  const screenHeight = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;

  const left = dualScreenLeft + (screenWidth - width) / 2;
  const top = dualScreenTop + (screenHeight - height) / 2;

  const features = `width=${width},height=${height},top=${top},left=${left},` +
    `resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no`;

  window.open(url, title, features);
}