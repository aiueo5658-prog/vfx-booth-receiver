// PC側・スマホ側で共有: アイコン / CRC32 / QR分割(バイナリ)
const VFX = (() => {
  const ICONS = {
    camera: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
    phone: 'M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm0 18H7V5h10v14z',
    download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    replay: 'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z',
    pick: 'M20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12a1 1 0 0 0 .01-1.42zM6.92 19 5 17.08l8.06-8.06 1.92 1.92L6.92 19z',
    check: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    movie: 'M18 4l2 3h-3l-2-3h-2l2 3h-3l-2-3H8l2 3H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z',
    play: 'M8 5v14l11-7z',
    pause: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
    back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    next: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
    image: 'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
    share: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 1 0-3-3c0 .24.04.47.09.7L8.04 9.81A2.99 2.99 0 0 0 6 9a3 3 0 1 0 0 6c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65a2.92 2.92 0 1 0 2.92-2.92z',
    help: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8a4 4 0 0 1 8 0c0 .88-.36 1.68-.93 2.25z',
    tune: 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    lock: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
    timer: 'M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.96 8.96 0 0 0 12 4a9 9 0 1 0 9 9c0-2.12-.74-4.07-1.97-5.61zM12 20a7 7 0 1 1 0-14 7 7 0 0 1 0 14z',
    layers: 'M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z',
    wifi_off: 'M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z',
  };
  function icon(n) { return `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`; }
  function hydrateIcons(root = document) {
    root.querySelectorAll('i[data-ic]').forEach(e => { e.outerHTML = icon(e.dataset.ic); });
  }

  const T = new Uint32Array(256);
  for (let i = 0; i < 256; i++) { let c = i; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; T[i] = c >>> 0; }
  function crc32(u) { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = T[(c ^ u[i]) & 255] ^ (c >>> 8); return ((c ^ 0xFFFFFFFF) >>> 0); }

  // 1チャンク = 12バイトのヘッダ + 画像データ(バイナリのまま)
  // ヘッダ: 'V','2', セッション(2) 番号(2) 総数(2) 全体CRC32(4)
  const HEAD = 12;
  function makeChunks(bytes, size = 600) {
    const sess = Math.floor(Math.random() * 65536), tot = Math.ceil(bytes.length / size), crc = crc32(bytes), out = [];
    for (let i = 0; i < tot; i++) {
      const d = bytes.subarray(i * size, (i + 1) * size), u = new Uint8Array(HEAD + d.length);
      u.set([0x56, 0x32, sess >> 8, sess & 255, i >> 8, i & 255, tot >> 8, tot & 255, crc >>> 24, (crc >>> 16) & 255, (crc >>> 8) & 255, crc & 255]);
      u.set(d, HEAD); out.push(u);
    }
    return out;
  }
  function parseChunk(b) {
    if (!b || b.length <= HEAD || b[0] !== 0x56 || b[1] !== 0x32) return null;
    const tot = (b[6] << 8) | b[7], idx = (b[4] << 8) | b[5];
    if (!(tot > 0 && idx < tot)) return null;
    return { sess: (b[2] << 8) | b[3], idx, tot, crc: ((b[8] << 24) | (b[9] << 16) | (b[10] << 8) | b[11]) >>> 0, data: Uint8Array.from(b.slice ? b.slice(HEAD) : Array.prototype.slice.call(b, HEAD)) };
  }
  function assemble(map, tot) {
    let n = 0; for (let i = 0; i < tot; i++) n += map.get(i).length;
    const out = new Uint8Array(n); let o = 0; for (let i = 0; i < tot; i++) { out.set(map.get(i), o); o += map.get(i).length; }
    return out;
  }
  function sniffMime(u) { return u[0] === 0xFF && u[1] === 0xD8 ? 'image/jpeg' : (u[0] === 0x52 && u[1] === 0x49 ? 'image/webp' : 'image/png'); }

  // text(string)でもバイト列でも描ける。ECC=L(枚数を減らすため)
  function drawQR(canvas, data, px = 760) {
    let str = data;
    if (typeof data !== 'string') { str = ''; for (let i = 0; i < data.length; i += 4096) str += String.fromCharCode.apply(null, data.subarray(i, i + 4096)); }
    const qr = qrcode(0, 'L'); qr.addData(str, 'Byte'); qr.make();
    const n = qr.getModuleCount(), q = 3, cell = Math.max(3, Math.floor(px / (n + q * 2))), size = cell * (n + q * 2);
    canvas.width = canvas.height = size;
    const c = canvas.getContext('2d');
    c.fillStyle = '#fff'; c.fillRect(0, 0, size, size); c.fillStyle = '#000';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) c.fillRect((x + q) * cell, (y + q) * cell, cell, cell);
    return n;
  }

  return { icon, hydrateIcons, crc32, makeChunks, parseChunk, assemble, sniffMime, drawQR, HEAD };
})();
